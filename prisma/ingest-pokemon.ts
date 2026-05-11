/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Bulk-ingest Pokémon cards from pokemontcg.io into our PokemonCard table.
 *
 * Pulls a curated list of popular/iconic sets. Free tier allows 1000 req/day,
 * 250 cards per page — so we hit ~10-20 requests total.
 *
 * Run: npm run ingest:pokemon
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

const BASE = "https://api.pokemontcg.io/v2";

// Optional: restrict to a specific subset via env. Empty → fetch ALL sets.
// Run: npm run ingest:pokemon -- [setIds…] to pass specific sets.
const ARG_SETS = process.argv.slice(2).filter(Boolean);

interface TCGCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  number: string;
  artist?: string;
  rarity?: string;
  images: { small: string; large: string };
  set: { id: string; name: string; series: string; total: number };
  tcgplayer?: { prices?: Record<string, { market?: number | null } | null> };
  cardmarket?: { prices?: { trendPrice?: number | null; averageSellPrice?: number | null } };
}

function extractPrice(card: TCGCard): number | null {
  const tcp = card.tcgplayer?.prices;
  if (tcp) {
    const order = [
      "1stEditionHolofoil",
      "holofoil",
      "unlimitedHolofoil",
      "normal",
      "reverseHolofoil",
      "1stEditionNormal",
    ];
    for (const k of order) {
      const p = tcp[k]?.market;
      if (p != null && p > 0) return Number(p.toFixed(2));
    }
  }
  const cm = card.cardmarket?.prices;
  if (cm?.trendPrice && cm.trendPrice > 0) return Number((cm.trendPrice * 1.1).toFixed(2));
  if (cm?.averageSellPrice && cm.averageSellPrice > 0)
    return Number((cm.averageSellPrice * 1.1).toFixed(2));
  return null;
}

async function fetchSet(setId: string): Promise<TCGCard[]> {
  const headers: Record<string, string> = {};
  if (process.env.POKEMONTCG_API_KEY) {
    headers["X-Api-Key"] = process.env.POKEMONTCG_API_KEY;
  }
  const q = `set.id:${setId}`;
  const all: TCGCard[] = [];
  let page = 1;
  while (true) {
    const params = new URLSearchParams({
      q,
      page: String(page),
      pageSize: "250",
      orderBy: "number",
      select: "id,name,supertype,subtypes,hp,types,number,artist,rarity,images,set,tcgplayer,cardmarket",
    });
    const res = await fetch(`${BASE}/cards?${params}`, { headers });
    if (!res.ok) {
      console.error(`  ✗ ${setId} page ${page}: HTTP ${res.status}`);
      break;
    }
    const data: { data: TCGCard[]; totalCount: number } = await res.json();
    all.push(...(data.data ?? []));
    if (!data.data || data.data.length < 250) break;
    page++;
  }
  return all;
}

async function upsertBatch(cards: TCGCard[]) {
  // Sequential upserts — simple, within a single set it's usually <300 cards.
  let ok = 0;
  for (const c of cards) {
    try {
      await prisma.pokemonCard.upsert({
        where: { id: c.id },
        update: {
          marketPrice: extractPrice(c),
          marketUpdated: new Date(),
          rarity: c.rarity ?? null,
          imageSmall: c.images.small,
          imageLarge: c.images.large,
        },
        create: {
          id: c.id,
          name: c.name,
          supertype: c.supertype ?? "Pokémon",
          subtypes: c.subtypes ?? [],
          hp: c.hp ?? null,
          types: c.types ?? [],
          number: c.number,
          artist: c.artist ?? null,
          rarity: c.rarity ?? null,
          imageSmall: c.images.small,
          imageLarge: c.images.large,
          setId: c.set.id,
          setName: c.set.name,
          setSeries: c.set.series,
          setTotal: c.set.total,
          marketPrice: extractPrice(c),
          marketUpdated: new Date(),
        },
      });
      ok++;
    } catch (e) {
      console.error(`  ✗ ${c.id}: ${(e as Error).message}`);
    }
  }
  return ok;
}

async function listAllSets(): Promise<string[]> {
  const headers: Record<string, string> = {};
  if (process.env.POKEMONTCG_API_KEY) headers["X-Api-Key"] = process.env.POKEMONTCG_API_KEY;
  const res = await fetch(`${BASE}/sets?pageSize=250&orderBy=-releaseDate`, { headers });
  if (!res.ok) throw new Error(`sets list HTTP ${res.status}`);
  const data: { data: { id: string; name: string; releaseDate: string }[] } = await res.json();
  return data.data.map((s) => s.id);
}

async function main() {
  const targets = ARG_SETS.length > 0 ? ARG_SETS : await listAllSets();
  console.log(`🃏 ingesting ${targets.length} sets from pokemontcg.io…`);
  let totalOk = 0;
  let idx = 0;
  for (const setId of targets) {
    idx++;
    process.stdout.write(`  [${String(idx).padStart(3)}/${targets.length}] ${setId.padEnd(12)} … `);
    try {
      const cards = await fetchSet(setId);
      if (cards.length === 0) {
        console.log("0 cards (skip)");
        continue;
      }
      const ok = await upsertBatch(cards);
      totalOk += ok;
      console.log(`${ok}/${cards.length} cards`);
    } catch (e) {
      console.log(`FAIL (${(e as Error).message})`);
    }
  }
  const count = await prisma.pokemonCard.count();
  console.log(`✅ ingested. PokemonCard table now has ${count} rows (${totalOk} added/updated)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
