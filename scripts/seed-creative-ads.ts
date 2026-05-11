/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Seed a handful of creative ads (using the new in-product designer
 * format) so the feed shows them between organic posts. Re-runnable —
 * removes prior demo creative ads first.
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { encodeCreativeSpec, type CreativeSpec } from "../src/lib/ads/creativeSpec";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

const SPECS: { title: string; ctaUrl: string; targetTags: string[]; spec: CreativeSpec }[] = [
  {
    title: "Editorial · Umbreon Index",
    ctaUrl: "https://example.com/grail/umbreon",
    targetTags: ["pokemon", "vintage", "alt-art"],
    spec: {
      template: "editorial",
      accent: "amber",
      kicker: "MARKET REPORT · ISSUE 03",
      headline: "Grade 10 Umbreons keep outpacing the index.",
      subhead:
        "Thirty-day data from Grail's verified ledger. Written by collectors, for collectors.",
      ctaLabel: "Read the report",
      cardImage: "https://images.pokemontcg.io/swsh7/215_hires.png",
      cardName: "Umbreon VMAX · Alt Art",
      price: 1820,
      priceChangePct: 22.1,
    },
  },
  {
    title: "Spotlight · Shadowless Charizard",
    ctaUrl: "https://example.com/grail/charizard",
    targetTags: ["pokemon", "vintage", "psa10"],
    spec: {
      template: "spotlight",
      accent: "amber",
      kicker: "GRAIL OF THE WEEK",
      headline: "The shadowless is moving.",
      subhead: "Verified-only lots. Flat $1–6 fees. Trades that actually close.",
      ctaLabel: "Step on the floor",
      cardImage: "https://images.pokemontcg.io/base1/4_hires.png",
      cardName: "Charizard · Base Shadowless",
      price: 32400,
      priceChangePct: 18.3,
    },
  },
  {
    title: "Ticker · Pikachu Illustrator",
    ctaUrl: "https://example.com/grail/illustrator",
    targetTags: ["pokemon", "promo", "rare"],
    spec: {
      template: "ticker",
      accent: "jade",
      kicker: "LIVE · SPIKE ALERT",
      headline: "Pikachu Illustrator ticked again.",
      subhead: "Only 39 copies exist. Three sold on Grail this quarter.",
      ctaLabel: "See comparables",
      cardImage: "https://images.pokemontcg.io/basep/48.png",
      cardName: "Pikachu Illustrator",
      price: 412000,
      priceChangePct: 7.2,
    },
  },
  {
    title: "Ribbon · Neo Genesis Lugia",
    ctaUrl: "https://example.com/grail/lugia",
    targetTags: ["pokemon", "neo-genesis", "vintage"],
    spec: {
      template: "ribbon",
      accent: "violet",
      kicker: "JUST LANDED",
      ribbonLabel: "GRAIL · 1ST EDITION",
      headline: "Neo Genesis Lugia, 1st Edition.",
      subhead: "BGS 9.5 · Single owner since 2000. Posted yesterday in Osaka.",
      ctaLabel: "View lot",
      cardImage: "https://images.pokemontcg.io/neo1/9_hires.png",
      cardName: "Lugia · Neo Genesis 1st Ed.",
      price: 6400,
    },
  },
];

async function main() {
  const anyAdvertiser =
    (await prisma.user.findFirst({ where: { username: "grail_house" } })) ??
    (await prisma.user.findFirst());

  if (!anyAdvertiser) {
    console.error("No users in DB — run `npm run seed` first.");
    process.exit(1);
  }
  const advertiserId = anyAdvertiser.id;
  console.log(`Using advertiser: @${anyAdvertiser.username ?? anyAdvertiser.id}`);

  // Wipe prior demo creative ads (anything with our title prefix)
  const removed = await prisma.ad.deleteMany({
    where: {
      OR: SPECS.map((s) => ({ title: s.title })),
    },
  });
  console.log(`Removed ${removed.count} prior demo creative ads`);

  let created = 0;
  for (const s of SPECS) {
    await prisma.ad.create({
      data: {
        advertiserId,
        title: s.title,
        caption: s.spec.subhead,
        mediaUrl: encodeCreativeSpec(s.spec),
        mediaType: "image",
        ctaLabel: s.spec.ctaLabel,
        ctaUrl: s.ctaUrl,
        targetTags: s.targetTags,
        dailyBudgetUsd: 50,
        cpmUsd: 4.5,
        status: "ACTIVE",
      },
    });
    created++;
    console.log(`  ✓ ${s.title}`);
  }
  console.log(`\nCreated ${created} creative ads.`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
