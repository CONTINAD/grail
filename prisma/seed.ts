/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

// Curated Pexels videos (CORS-friendly, hotlinkable) — real card collectors and handlers
const VIDEOS = [
  // ── Top tier: actual album/collection handling (closest match to TCG vibe) ──
  {
    url: "https://videos.pexels.com/video-files/6651455/6651455-uhd_2732_1440_25fps.mp4",
    thumb: "https://images.pexels.com/videos/6651455/pexels-photo-6651455.jpeg",
    title: "putting cards in a collector album",
  },
  {
    url: "https://videos.pexels.com/video-files/6651460/6651460-uhd_2732_1440_25fps.mp4",
    thumb: "https://images.pexels.com/videos/6651460/pexels-photo-6651460.jpeg",
    title: "flipping through collection album",
  },
  {
    url: "https://videos.pexels.com/video-files/6651458/6651458-uhd_1440_2732_25fps.mp4",
    thumb: "https://images.pexels.com/videos/6651458/pexels-photo-6651458.jpeg",
    title: "organizing collection (vertical 9:16)",
  },
  // ── Card reveals & close-ups ──
  {
    url: "https://videos.pexels.com/video-files/12632523/12632523-hd_1080_1920_30fps.mp4",
    thumb: "https://images.pexels.com/videos/12632523/pexels-photo-12632523.jpeg",
    title: "card reveal vertical",
  },
  {
    url: "https://videos.pexels.com/video-files/13079425/13079425-hd_1920_1080_25fps.mp4",
    thumb: "https://images.pexels.com/videos/13079425/pexels-photo-13079425.jpeg",
    title: "cards fanned close-up",
  },
  {
    url: "https://videos.pexels.com/video-files/16539294/16539294-uhd_2560_1440_24fps.mp4",
    thumb: "https://images.pexels.com/videos/16539294/pexels-photo-16539294.jpeg",
    title: "cinematic deck hold",
  },
  {
    url: "https://videos.pexels.com/video-files/7689266/7689266-uhd_2560_1440_25fps.mp4",
    thumb: "https://images.pexels.com/videos/7689266/pexels-photo-7689266.jpeg",
    title: "card flip reveal",
  },
  {
    url: "https://videos.pexels.com/video-files/855403/855403-uhd_2560_1440_25fps.mp4",
    thumb: "https://images.pexels.com/videos/855403/pexels-photo-855403.jpeg",
    title: "card peek",
  },
  // ── Holo / gold / premium feel ──
  {
    url: "https://videos.pexels.com/video-files/6798786/6798786-hd_1920_1080_24fps.mp4",
    thumb: "https://images.pexels.com/videos/6798786/pexels-photo-6798786.jpeg",
    title: "holo-gold card face",
  },
  // ── Card handling (sets & decks) ──
  {
    url: "https://videos.pexels.com/video-files/8765329/8765329-uhd_2560_1440_30fps.mp4",
    thumb: "https://images.pexels.com/videos/8765329/pexels-photo-8765329.jpeg",
    title: "macro cards laid",
  },
  {
    url: "https://videos.pexels.com/video-files/35356475/14979992_2560_1440_50fps.mp4",
    thumb: "https://images.pexels.com/videos/35356475/pexels-photo-35356475.jpeg",
    title: "cinematic shuffle",
  },
  {
    url: "https://videos.pexels.com/video-files/6254906/6254906-uhd_1440_2560_25fps.mp4",
    thumb: "https://images.pexels.com/videos/6254906/pexels-photo-6254906.jpeg",
    title: "deck play vertical",
  },
  {
    url: "https://videos.pexels.com/video-files/6259144/6259144-uhd_2560_1440_25fps.mp4",
    thumb: "https://images.pexels.com/videos/6259144/pexels-photo-6259144.jpeg",
    title: "holding a card",
  },
];

const TAGS_POOL = [
  ["pokemon", "vintage", "base-set"],
  ["mailday", "psa10", "grails"],
  ["packopen", "hits", "pulls"],
  ["charizard", "chase", "shiny"],
  ["trade", "ISO", "offers"],
  ["japanese", "collectors", "holos"],
  ["alt-art", "v", "vmax"],
  ["151", "modern", "sv"],
  ["evolving-skies", "umbreon", "trainer-gallery"],
];

function capFor(kind: string, cardName?: string): string {
  const pool: Record<string, string[]> = {
    SHOWCASE: [
      `Just pulled ${cardName ?? "this"} 🔥 can't believe my luck`,
      `Adding ${cardName ?? "a new piece"} to the PC today`,
      `Rate the condition on ${cardName ?? "this one"} — NM? LP?`,
      `${cardName ?? "This"} is my favorite pickup of the year`,
      `Mail day! ${cardName ?? "Beauty"} finally arrived`,
    ],
    WANT: [
      `ISO ${cardName ?? "this card"} — name your price or offer trade`,
      `Been hunting ${cardName ?? "this"} for years. Any leads?`,
      `Will trade moderns for ${cardName ?? "this"}. DM me`,
      `LF: ${cardName ?? "this grail"}. Cash + trade offers open`,
    ],
    PACK_OPEN: [
      "Cracking a box — what do you think the hit will be?",
      "Unboxing! Let's see if we hit the chase 🤞",
      "5 packs left, need something special 👀",
      "Second-to-last pack... come on!",
    ],
    TRADE_STORY: [
      `Traded 3 moderns for ${cardName ?? "this vintage"} — w or l?`,
      `Completed my 10th trade this month. Grail's matching is 🔥`,
      `Finally closed this deal after 2 weeks of haggling`,
      "Cross-country trade, safely delivered. That's what it's about.",
    ],
  };
  const arr = pool[kind] ?? pool.SHOWCASE;
  return arr[Math.floor(Math.random() * arr.length)];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("🌱 seeding…");

  // ── Demo users ──────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("demo1234", 10);
  const usersData = [
    { email: "demo@demo.com",    name: "Demo",    username: "demo" },
    { email: "ash@demo.com",     name: "Ash",     username: "ash_trainer" },
    { email: "misty@demo.com",   name: "Misty",   username: "mistywaters" },
    { email: "brock@demo.com",   name: "Brock",   username: "rockbrock" },
    { email: "giovanni@demo.com",name: "Giovanni",username: "g_boss" },
    { email: "sabrina@demo.com", name: "Sabrina", username: "psychic_s" },
    { email: "tcgshop@demo.com", name: "TCG Shop",username: "tcgshop_official" },
    { email: "cynthia@demo.com", name: "Cynthia", username: "champ_cynth" },
    { email: "leon@demo.com",    name: "Leon",    username: "leonard_galar" },
  ];

  const users = [];
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        passwordHash,
        bio: "Cards, trades, good vibes.",
        image: `https://api.dicebear.com/9.x/thumbs/png?seed=${u.username}`,
        completedTrades: Math.floor(Math.random() * 50),
        averageRating: 4 + Math.random(),
        totalRatings: Math.floor(Math.random() * 80),
      },
    });
    users.push(user);
  }

  // ── Pool of real cards from the DB (populated by ingest-pokemon) ─
  const allCards = await prisma.pokemonCard.findMany({
    select: {
      id: true,
      name: true,
      imageLarge: true,
      imageSmall: true,
      marketPrice: true,
      rarity: true,
    },
    take: 2000,
  });

  // Prioritize cards with prices and higher rarities for the "featured" slot
  const pricedCards = allCards.filter((c) => (c.marketPrice ?? 0) > 1);
  const cardPool = pricedCards.length > 50 ? pricedCards : allCards;

  if (cardPool.length === 0) {
    console.log("⚠️  No cards in DB. Run: npm run ingest:pokemon");
    return;
  }
  console.log(`   (using ${cardPool.length} real cards as content)`);

  const demo = users.find((u) => u.email === "demo@demo.com")!;

  // ── Collection: seed graded cards across users ──────────────────
  await prisma.collectionCard.deleteMany({});
  const GRADE_COMPANIES = ["PSA", "BGS", "CGC", "SGC"] as const;
  const CONDITIONS = ["MINT", "NEAR_MINT", "LIGHTLY_PLAYED", "MODERATELY_PLAYED"] as const;

  // Demo user's collection: mostly graded, so their collection has trade leverage
  const demoCards = [...cardPool].sort(() => Math.random() - 0.5).slice(0, 16);
  for (const c of demoCards) {
    const isGraded = Math.random() < 0.55;
    try {
      await prisma.collectionCard.create({
        data: {
          userId: demo.id,
          cardId: c.id,
          condition: isGraded ? "MINT" : pick([...CONDITIONS]),
          isGraded,
          gradeCompany: isGraded ? pick([...GRADE_COMPANIES]) : null,
          gradeScore: isGraded ? pick([10, 10, 9.5, 9, 9, 8.5]) : null,
          forTrade: true,
        },
      });
    } catch { /* dup */ }
  }

  // Other users: 12-20 cards each, ~35% graded
  const partnerCards = new Map<string, Array<typeof cardPool[number]>>();
  for (const u of users) {
    if (u.id === demo.id) continue;
    const count = 12 + Math.floor(Math.random() * 9);
    const picks = [...cardPool].sort(() => Math.random() - 0.5).slice(0, count);
    partnerCards.set(u.id, picks);
    for (const c of picks) {
      const isGraded = Math.random() < 0.35;
      try {
        await prisma.collectionCard.create({
          data: {
            userId: u.id,
            cardId: c.id,
            condition: isGraded ? "MINT" : pick([...CONDITIONS]),
            isGraded,
            gradeCompany: isGraded ? pick([...GRADE_COMPANIES]) : null,
            gradeScore: isGraded ? pick([10, 10, 10, 9.5, 9, 9, 8.5, 8, 7]) : null,
            forTrade: Math.random() > 0.15,
          },
        });
      } catch { /* dup */ }
    }
  }

  // ── Wishlist: demo wants cards that several other users actually have,
  //    so the /matches page shows real matches ──────────────────
  const allPartnerCardIds = [...partnerCards.values()].flat().map((c) => c.id);
  // Count overlap — pick the cards held by the most partners
  const freq = new Map<string, number>();
  for (const id of allPartnerCardIds) freq.set(id, (freq.get(id) ?? 0) + 1);
  const popularOwnedByOthers = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id]) => id);

  // Also wishlist a few exclusive grails (even if nobody has them)
  const grailWishes = cardPool
    .filter((c) => (c.marketPrice ?? 0) > 50 && !popularOwnedByOthers.includes(c.id))
    .slice(0, 4);

  for (const id of popularOwnedByOthers) {
    try {
      await prisma.wishlistCard.create({
        data: { userId: demo.id, cardId: id, priority: 3 },
      });
    } catch { /* dup */ }
  }
  for (const c of grailWishes) {
    try {
      await prisma.wishlistCard.create({
        data: { userId: demo.id, cardId: c.id, priority: 2 },
      });
    } catch { /* dup */ }
  }

  // Other users also get a small wishlist overlapping demo's collection
  // (so demo shows up as a partner to them too, and 2-way matches render)
  const demoCollectionIds = demoCards.map((c) => c.id);
  for (const u of users) {
    if (u.id === demo.id) continue;
    const wish = [...demoCollectionIds]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + Math.floor(Math.random() * 3));
    for (const id of wish) {
      try {
        await prisma.wishlistCard.create({
          data: { userId: u.id, cardId: id, priority: 2 + Math.floor(Math.random() * 2) },
        });
      } catch { /* dup */ }
    }
  }

  // ── Posts ───────────────────────────────────────────────────────
  await prisma.post.deleteMany({});

  const POST_COUNT = 60;
  const KINDS = ["SHOWCASE", "WANT", "PACK_OPEN", "TRADE_STORY"] as const;

  for (let i = 0; i < POST_COUNT; i++) {
    const poster = pick(users.filter((u) => u.email !== "tcgshop@demo.com"));
    const kind = pick([...KINDS]);
    const tags = pick(TAGS_POOL);
    const ageH = Math.random() * 24 * 14; // within 14 days

    // 30% videos, 70% image posts (real card image — looks great in vertical feed)
    const useVideo = Math.random() < 0.3;
    const card = pick(cardPool);

    const media = useVideo
      ? (() => {
          const v = pick(VIDEOS);
          return {
            mediaUrl: v.url,
            mediaType: "video" as const,
            thumbUrl: v.thumb,
          };
        })()
      : {
          // Image post = the card itself, large art
          mediaUrl: card.imageLarge,
          mediaType: "image" as const,
          thumbUrl: card.imageSmall,
        };

    // 25% of posts that feature a card show it as graded
    const isGraded = Math.random() < 0.25;
    const gradeCompany = isGraded ? pick(["PSA", "BGS", "CGC", "SGC"] as const) : null;
    const gradeScore = isGraded ? pick([10, 10, 10, 9.5, 9, 9, 8.5, 8]) : null;

    await prisma.post.create({
      data: {
        userId: poster.id,
        kind,
        ...media,
        caption: capFor(kind, card.name),
        featuredCardId: card.id,
        featuredCardName: card.name,
        featuredCardImage: card.imageSmall,
        featuredGradeCompany: gradeCompany,
        featuredGradeScore: gradeScore,
        askingPrice:
          card.marketPrice != null
            ? Number((card.marketPrice * (isGraded ? 2 + Math.random() * 2 : 0.9 + Math.random() * 0.3)).toFixed(2))
            : undefined,
        openToTrade: true,
        tags,
        likeCount: Math.floor(Math.random() * 3500),
        commentCount: Math.floor(Math.random() * 200),
        viewCount: Math.floor(Math.random() * 30000),
        shareCount: Math.floor(Math.random() * 120),
        createdAt: new Date(Date.now() - ageH * 3600 * 1000),
      },
    });
  }

  // ── Ads ─────────────────────────────────────────────────────────
  await prisma.ad.deleteMany({});
  const advertiser = users.find((u) => u.email === "tcgshop@demo.com")!;
  const ads = [
    {
      title: "TCG Shop — 15% off sealed product",
      caption: "Base Set, Jungle, Fossil boxes in stock. Use code POKE15.",
      mediaUrl: VIDEOS[1].url,
      thumbUrl: VIDEOS[1].thumb,
      ctaLabel: "Shop Now",
      ctaUrl: "https://example.com/shop",
      targetTags: ["pokemon", "vintage"],
      dailyBudgetUsd: 50,
      cpmUsd: 3,
    },
    {
      title: "Grade with PSA",
      caption: "Turnaround in 10 days on bulk grading.",
      mediaUrl: VIDEOS[6].url,
      thumbUrl: VIDEOS[6].thumb,
      ctaLabel: "Start Grading",
      ctaUrl: "https://example.com/psa",
      targetTags: ["psa10", "grading"],
      dailyBudgetUsd: 100,
      cpmUsd: 4,
    },
    {
      title: "Card sleeves & top loaders — free shipping $50+",
      caption: "Ultra Pro, Dragon Shield, KMC. Protect your pulls.",
      mediaUrl: VIDEOS[5].url,
      thumbUrl: VIDEOS[5].thumb,
      ctaLabel: "Browse Supplies",
      ctaUrl: "https://example.com/supplies",
      targetTags: ["supplies", "pokemon"],
      dailyBudgetUsd: 30,
      cpmUsd: 2.5,
    },
  ];
  for (const ad of ads) {
    await prisma.ad.create({
      data: {
        advertiserId: advertiser.id,
        mediaType: "video",
        status: "ACTIVE",
        ...ad,
      },
    });
  }

  // ── A couple of follows ─────────────────────────────────────────
  await prisma.follow.deleteMany({ where: { followerId: demo.id } });
  for (const u of users.slice(1, 5)) {
    await prisma.follow.create({
      data: { followerId: demo.id, followedId: u.id },
    });
  }

  const wishlistTotal = await prisma.wishlistCard.count();
  const collectionTotal = await prisma.collectionCard.count();
  console.log(
    `✅ seeded ${users.length} users, ${POST_COUNT} posts, ${ads.length} ads, ${collectionTotal} collection items, ${wishlistTotal} wishlist items`
  );
  console.log("   login: demo@demo.com / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
