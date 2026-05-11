/**
 * Pokemon card data layer
 *
 * Card data + images + pricing → pokemontcg.io (api.pokemontcg.io/v2)
 *   - Free without API key: 1,000 req/day, max 250/page
 *   - Set POKEMONTCG_API_KEY in .env to lift rate limits
 *
 * Docs: https://docs.pokemontcg.io
 */

const BASE = "https://api.pokemontcg.io/v2";

function apiHeaders(): HeadersInit {
  const key = process.env.POKEMONTCG_API_KEY;
  return key ? { "X-Api-Key": key } : {};
}

// ── Wire types ────────────────────────────────────────────────────────────────

export interface PokemonTCGCard {
  id: string;       // "base1-4"
  name: string;
  number: string;   // "4"
  supertype: string;         // "Pokémon" | "Trainer" | "Energy"
  subtypes?: string[];       // ["Basic"] | ["Stage 2"] etc.
  hp?: string;               // "60"
  types?: string[];
  rarity?: string;
  artist?: string;
  images: {
    small: string;  // full URL
    large: string;
  };
  set: {
    id: string;
    name: string;
    series: string;
    total: number;
    printedTotal?: number;
  };
  tcgplayer?: {
    prices?: {
      holofoil?: { market?: number | null };
      normal?: { market?: number | null };
      reverseHolofoil?: { market?: number | null };
      "1stEditionHolofoil"?: { market?: number | null };
      unlimitedHolofoil?: { market?: number | null };
    };
  } | null;
  cardmarket?: {
    prices?: {
      trendPrice?: number | null;
      averageSellPrice?: number | null;
      avg1?: number | null;
    };
  } | null;
}

// Backwards-compat alias used by a few callers
export type TCGdexCardBrief = {
  id: string;
  localId: string;
  name: string;
  image?: string;
};

// ── Price extraction ──────────────────────────────────────────────────────────

export function extractPrice(card: PokemonTCGCard): number | null {
  // Prefer TCGPlayer USD
  const tcp = card.tcgplayer?.prices;
  if (tcp) {
    const usd = [
      tcp["1stEditionHolofoil"]?.market,
      tcp.holofoil?.market,
      tcp.unlimitedHolofoil?.market,
      tcp.normal?.market,
      tcp.reverseHolofoil?.market,
    ].find((p) => p != null && p > 0);
    if (usd) return Number(usd.toFixed(2));
  }

  // Fall back to Cardmarket trend × 1.1 (rough USD proxy)
  const cm = card.cardmarket?.prices;
  if (cm?.trendPrice && cm.trendPrice > 0) return Number((cm.trendPrice * 1.1).toFixed(2));
  if (cm?.averageSellPrice && cm.averageSellPrice > 0)
    return Number((cm.averageSellPrice * 1.1).toFixed(2));

  return null;
}

// ── Image helpers (kept for any code that uses them) ─────────────────────────

export function cardImageUrl(
  urlOrBase: string | undefined | null,
  _size: "high" | "low" = "high"
): string {
  return urlOrBase ?? "/placeholder-card.webp";
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface CardSearchResult {
  id: string;
  name: string;
  number: string;
  setId: string;
  setName: string;
  imageSmall: string;
  imageLarge: string;
  rarity?: string | null;
  marketPrice?: number | null;
}

export interface CardSearchResponse {
  cards: CardSearchResult[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * Search cards by name. Returns results including images, pricing, and pagination info.
 */
export async function searchCards(
  query: string,
  page = 1,
  pageSize = 60
): Promise<CardSearchResponse> {
  // pokemontcg.io uses Lucene-style query syntax: name:*pikachu*
  const q = `name:*${query.replace(/[*?"\\]/g, "")}*`;
  const params = new URLSearchParams({
    q,
    page: String(page),
    pageSize: String(pageSize),
    orderBy: "name",
    select: "id,name,number,set,images,rarity,tcgplayer,cardmarket",
  });

  const res = await fetch(`${BASE}/cards?${params}`, {
    headers: apiHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error(`PokéTCG search ${res.status} for "${query}"`);
    return { cards: [], totalCount: 0, page, pageSize };
  }

  const data: { data: PokemonTCGCard[]; totalCount: number; page: number; pageSize: number } =
    await res.json();
  const raw = Array.isArray(data.data) ? data.data : [];

  return {
    cards: raw.map((c) => ({
      id: c.id,
      name: c.name,
      number: c.number,
      setId: c.set.id,
      setName: c.set.name,
      imageSmall: c.images.small,
      imageLarge: c.images.large,
      rarity: c.rarity ?? null,
      marketPrice: extractPrice(c),
    })),
    totalCount: data.totalCount ?? 0,
    page: data.page ?? page,
    pageSize: data.pageSize ?? pageSize,
  };
}

// ── Full card fetch ───────────────────────────────────────────────────────────

export async function getFullCard(id: string): Promise<PokemonTCGCard | null> {
  try {
    const res = await fetch(`${BASE}/cards/${id}`, {
      headers: apiHeaders(),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data: { data: PokemonTCGCard } = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

// ── Map to Prisma upsert shape ────────────────────────────────────────────────

export async function mapToPrismaCard(card: PokemonTCGCard) {
  return {
    id: card.id,
    name: card.name,
    supertype: card.supertype ?? "Pokémon",
    subtypes: card.subtypes ?? [],
    hp: card.hp ?? null,
    types: card.types ?? [],
    number: card.number,
    artist: card.artist ?? null,
    rarity: card.rarity ?? null,
    imageSmall: card.images.small,
    imageLarge: card.images.large,
    setId: card.set.id,
    setName: card.set.name,
    setSeries: card.set.series,
    setTotal: card.set.total,
    marketPrice: extractPrice(card),
    marketUpdated: new Date(),
  };
}

/**
 * Ensure a card exists in our DB with full detail.
 * Call this when a user adds a card to their collection or wishlist.
 */
export async function upsertCard(cardId: string) {
  const { prisma } = await import("@/lib/db");

  const existing = await prisma.pokemonCard.findUnique({ where: { id: cardId } });
  const stalePrice =
    !existing?.marketUpdated ||
    Date.now() - existing.marketUpdated.getTime() > 1000 * 60 * 60 * 24;

  if (existing && !stalePrice) return existing;

  const card = await getFullCard(cardId);
  if (!card) return existing ?? null;

  const data = await mapToPrismaCard(card);
  return prisma.pokemonCard.upsert({
    where: { id: cardId },
    create: data,
    update: {
      marketPrice: data.marketPrice,
      marketUpdated: data.marketUpdated,
      rarity: data.rarity,
      setTotal: data.setTotal,
      setSeries: data.setSeries,
    },
  });
}
