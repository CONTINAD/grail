"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  AmberBurst,
  ChaliceMark,
  EngravedRule,
  GrailCrest,
  HoloCard,
  LotCrest,
  MemberMedallion,
  Sparkline,
  Wordmark,
} from "@/components/brand/graphics";
import { AtmosphereField } from "@/components/brand/graphics/AtmosphereField";
import { HeroDeck } from "@/components/hero/HeroDeck";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { AdCreative } from "@/components/ads/AdCreative";
import { GrailTicker } from "./GrailTicker";
import { LiveLedger } from "./LiveLedger";
import {
  COLLECTOR_VOICES,
  DISPATCHES,
  FEATURED_GRAILS,
  HEADLINE_STATS,
  INDEX_MOVERS,
} from "@/lib/landingData";

export function Landing() {
  return (
    <div className="relative bg-[color:var(--ink-950)]">
      {/* ════════════════════════════════════════════════════════════
         01 · COVER — magazine-spread hero
         ════════════════════════════════════════════════════════════ */}
      <Cover />

      {/* Tiny print under the cover, like a contents strip */}
      <ContentsStrip />

      {/* Full-bleed live ticker */}
      <GrailTicker />

      {/* ════════════════════════════════════════════════════════════
         02 · THE LEDGER — the index, table-of-record
         ════════════════════════════════════════════════════════════ */}
      <TheLedger />

      {/* ════════════════════════════════════════════════════════════
         03 · LOT 01 — single huge editorial spread
         ════════════════════════════════════════════════════════════ */}
      <LotOneSpread />

      {/* ════════════════════════════════════════════════════════════
         04 · ALSO IN THE ROOM — sub-features
         ════════════════════════════════════════════════════════════ */}
      <AlsoInTheRoom />

      {/* ════════════════════════════════════════════════════════════
         05 · DISPATCHES — editorial column
         ════════════════════════════════════════════════════════════ */}
      <Dispatches />

      {/* ════════════════════════════════════════════════════════════
         06 · VOICES — collector pullquotes (zine-y)
         ════════════════════════════════════════════════════════════ */}
      <Voices />

      {/* ════════════════════════════════════════════════════════════
         07 · ADVERTISERS — quiet, deliberate placement
         ════════════════════════════════════════════════════════════ */}
      <AdvertisersInsert />

      {/* ════════════════════════════════════════════════════════════
         08 · CLOSING — a stamp, not a slide
         ════════════════════════════════════════════════════════════ */}
      <Colophon />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 01 · COVER
// ════════════════════════════════════════════════════════════════════

function Cover() {
  // Flank cards beside the hero Charizard. Tasteful: two on each side
  // pulled from the existing FEATURED_GRAILS plus two trending modern alts.
  const deck = [
    {
      src: "https://images.pokemontcg.io/swsh7/215_hires.png",
      alt: "Umbreon VMAX Alt Art",
      tag: "Lot 02 · PSA 10",
    },
    {
      src: "https://images.pokemontcg.io/neo1/9_hires.png",
      alt: "Lugia Neo Genesis 1st Ed",
      tag: "Lot 03 · BGS 9.5",
    },
    {
      src: "https://images.pokemontcg.io/base1/4_hires.png",
      alt: "Charizard Base 1st Edition",
      tag: "Lot 01 · PSA 10",
      price: "$32,400",
    },
    {
      src: "https://images.pokemontcg.io/base1/2_hires.png",
      alt: "Blastoise Base Shadowless",
      tag: "Floor · $3,900",
    },
    {
      src: "https://images.pokemontcg.io/base1/3_hires.png",
      alt: "Chansey Base 1st Edition",
      tag: "Floor · $1,420",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Cinematic background stack: deep paper, drifting motes, amber sun */}
      <div className="absolute inset-0 pointer-events-none">
        <AtmosphereField className="absolute inset-0 opacity-90" density={1.2} />
      </div>
      <div className="absolute inset-0 dotgrid opacity-30 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(85% 55% at 50% -10%, rgba(247,201,72,0.20) 0%, transparent 55%)",
        }}
      />
      {/* Bottom-edge fade so the section blends into the next */}
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-b from-transparent to-[color:var(--ink-950)]" />

      <div className="relative mx-auto max-w-[1380px] px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-24">
        {/* Masthead — full crest centered, dateline rules either side */}
        <Reveal delay={0}>
          <div className="flex items-center justify-between mb-12 md:mb-16 gap-6">
            <div className="flex-1 flex items-center gap-4 min-w-0">
              <span
                aria-hidden
                className="hidden md:block flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(247,201,72,0.5))",
                }}
              />
              <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.32em] uppercase text-zinc-400 whitespace-nowrap">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--amber-400)] opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--amber-400)]" />
                </span>
                <span>Vol. I · No. 1</span>
                <span className="text-zinc-700">·</span>
                <span className="hidden md:inline">May 2026</span>
              </div>
            </div>

            <Link href="/" className="shrink-0 group" aria-label="Grail">
              <GrailCrest size={88} variant="full" tone="amber" ordinal="I" />
            </Link>

            <div className="flex-1 flex items-center gap-4 min-w-0 justify-end">
              <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.32em] uppercase text-zinc-400 whitespace-nowrap">
                <span className="hidden md:inline">A private trading room</span>
                <span className="text-zinc-700">·</span>
                <span>$0 / issue</span>
              </div>
              <span
                aria-hidden
                className="hidden md:block flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(247,201,72,0.5), transparent)",
                }}
              />
            </div>
          </div>
        </Reveal>

        {/* The cinematic deck — center stage */}
        <Reveal delay={0.05}>
          <div className="relative mx-auto max-w-[1100px]">
            <HeroDeck cards={deck} />
          </div>
        </Reveal>

        {/* Editorial headline beneath the deck */}
        <div className="mt-28 md:mt-36 grid grid-cols-12 gap-x-6 md:gap-x-10 gap-y-10 items-end">
          <div className="col-span-12 md:col-span-7 relative">
            <Reveal delay={0.5}>
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-zinc-500 mb-6">
                <span className="text-[color:var(--amber-400)]">¶</span>&nbsp;&nbsp;Cover story · Pasadena, CA
              </p>
            </Reveal>

            <h1 className="font-display font-bold text-[44px] sm:text-[60px] md:text-[88px] lg:text-[112px] leading-[0.86] tracking-[-0.045em]">
              <Reveal delay={0.6}>
                <span className="block">The Charizard</span>
              </Reveal>
              <Reveal delay={0.78}>
                <span className="block">hasn&rsquo;t moved</span>
              </Reveal>
              <Reveal delay={0.96}>
                <span className="block font-italic-display italic font-normal text-[color:var(--amber-400)]">
                  in twenty-six&nbsp;years.
                </span>
              </Reveal>
            </h1>

            <Reveal delay={1.2}>
              <div className="mt-10 max-w-[60ch] grid grid-cols-[auto,1fr] gap-x-5">
                <span
                  className="font-display text-[64px] leading-[0.7] text-[color:var(--amber-400)] -mt-1"
                  aria-hidden
                >
                  &ldquo;
                </span>
                <p className="text-base md:text-[17px] leading-[1.55] text-zinc-300 font-light">
                  Marcus bought four packs at a Toys-R-Us in February 1999. Three are
                  gone. The fourth he never opened. We did, on camera, with him in
                  the room.
                  <br /> <br />
                  <span className="text-zinc-500">
                    His son turned seven last week. Marcus posted the card to Grail
                    on Monday. We&rsquo;re taking offers.
                  </span>
                </p>
              </div>
            </Reveal>

            <Reveal delay={1.35}>
              <div className="mt-10 flex items-center gap-5 flex-wrap">
                <Link
                  href="/auth/sign-in"
                  className="btn-amber inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"
                >
                  See the room
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border border-[color:var(--line)] hover:border-[color:var(--amber-400)]/60 transition-colors group"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--amber-400)] opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--amber-400)]" />
                  </span>
                  Watch the 40-second film
                </Link>
                <Link
                  href="/discover"
                  className="text-sm font-medium text-zinc-300 hover:text-white underline decoration-[color:var(--amber-400)] decoration-2 underline-offset-[6px]"
                >
                  Or just look around →
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Live counters — quiet but always moving */}
          <div className="col-span-12 md:col-span-5">
            <Reveal delay={0.8}>
              <div className="border-t border-[color:var(--line)] pt-6 grid grid-cols-2 gap-x-8 gap-y-7">
                <CoverStat
                  label="On the floor · 24h"
                  value={3402100}
                  format={(n) => "$" + (Math.round(n / 1000)).toLocaleString() + "k"}
                  hint="across 1,488 closed trades"
                  trend={[2.61, 2.74, 2.68, 2.92, 3.03, 2.97, 3.18, 3.27, 3.21, 3.34, 3.4]}
                  delta={12.4}
                />
                <CoverStat
                  label="Active members"
                  value={28140}
                  format={(n) => n.toLocaleString()}
                  hint="14 new in the last hour"
                  trend={[24.1, 24.6, 25.0, 25.4, 26.1, 26.5, 26.9, 27.2, 27.6, 27.9, 28.1]}
                  delta={4.8}
                />
                <CoverStat
                  label="Avg close time"
                  value={37}
                  format={(n) => n + " min"}
                  hint="from match to handshake"
                  trend={[52, 49, 47, 46, 44, 43, 42, 40, 39, 38, 37]}
                  delta={-8.2}
                  invert
                />
                <CoverStat
                  label="Flat fee · per side"
                  value={6}
                  format={(n) => "$1–" + n}
                  hint="no percentage skim"
                  trend={[6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]}
                  steady
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* The "deck" — three sub-claims at the bottom of the cover */}
        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-px bg-[color:var(--line)] border border-[color:var(--line)] rounded-lg overflow-hidden">
          {[
            {
              q: "Why does this exist?",
              a: "Because eBay treats $32,000 cards the same as $32 sneakers. We don't.",
            },
            {
              q: "Why do collectors trust it?",
              a: "Every card photographed, fingerprinted, and held in Grail's safe until both sides ship.",
            },
            {
              q: "Why is it different from other floors?",
              a: "We don't take a percentage. We charge $1–6 a side and stay out of the way.",
            },
          ].map((x, i) => (
            <div key={i} className="relative bg-[color:var(--ink-900)] p-6 md:p-7 group hover:bg-[color:var(--ink-850)] transition-colors">
              <span
                aria-hidden
                className="absolute left-0 top-6 bottom-6 w-px bg-[color:var(--amber-400)] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"
              />
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[color:var(--amber-400)] mb-2">
                Q · 0{i + 1}
              </p>
              <h3 className="font-display text-xl md:text-2xl leading-tight tracking-[-0.02em] mb-2 text-white">
                {x.q}
              </h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed">{x.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoverStat({
  label,
  value,
  format,
  hint,
  trend,
  delta,
  invert,
  steady,
}: {
  label: string;
  value: number;
  format: (n: number) => string;
  hint: string;
  trend: number[];
  delta?: number;
  invert?: boolean;
  steady?: boolean;
}) {
  // `invert`: a falling number is the good thing (e.g. close time).
  const isPositive = steady
    ? null
    : invert
      ? (delta ?? 0) < 0
      : (delta ?? 0) > 0;
  const trendColor = steady
    ? "#a1a1aa"
    : isPositive
      ? "#5ae5a0"
      : "#f87171";
  const deltaColor = steady
    ? "text-zinc-500"
    : isPositive
      ? "text-[color:var(--jade,#5ae5a0)]"
      : "text-rose-300";

  return (
    <div className="group relative">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500">
          {label}
        </p>
        {!steady && typeof delta === "number" && (
          <span
            className={`font-mono text-[10px] tabular-nums tracking-wider ${deltaColor}`}
          >
            <span aria-hidden>{isPositive ? "▲" : "▼"}</span>{" "}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        {steady && (
          <span className="font-mono text-[10px] tracking-wider text-zinc-500">
            FLAT
          </span>
        )}
      </div>
      <p className="font-display font-bold text-[34px] md:text-[40px] leading-none tracking-[-0.025em] mt-2 text-white tabular-nums">
        <Counter value={value} duration={1.6} format={format} />
      </p>
      <div className="mt-3 -mx-1 opacity-80 group-hover:opacity-100 transition-opacity">
        <Sparkline
          values={trend}
          stroke={trendColor}
          width={200}
          height={28}
          className="w-full h-7"
        />
      </div>
      <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{hint}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// CONTENTS STRIP — tiny "what's inside" bar
// ════════════════════════════════════════════════════════════════════

function ContentsStrip() {
  const items = [
    { n: "II",  l: "The Ledger",       hint: "the floor's table-of-record" },
    { n: "III", l: "Lot 01",           hint: "Marcus's Charizard" },
    { n: "IV",  l: "Also in the room", hint: "Umbreon · Lugia" },
    { n: "V",   l: "Dispatches",       hint: "field notes" },
    { n: "VI",  l: "Voices",           hint: "what the floor sounds like" },
  ];
  return (
    <div className="border-y border-[color:var(--line)] bg-[color:var(--ink-900)]">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-4 grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-3">
        {items.map((x) => (
          <div key={x.n} className="flex items-baseline gap-2.5 text-[11px]">
            <span className="font-mono font-bold tracking-[0.22em] uppercase text-[color:var(--amber-400)]">
              {x.n}
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm text-white tracking-tight truncate">
                {x.l}
              </p>
              <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-zinc-600 truncate">
                {x.hint}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 02 · THE LEDGER
// ════════════════════════════════════════════════════════════════════

function TheLedger() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-24 md:py-32">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-10 gap-y-12">
          {/* LEFT: editorial intro that runs only 4 cols */}
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-start gap-5 mb-6">
              <LotCrest numeral="II" ribbon="THE LEDGER" size={64} />
              <div className="pt-2">
                <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-[color:var(--amber-400)]">
                  Section
                </p>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500 mt-1">
                  Table of record
                </p>
              </div>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl leading-[0.92] tracking-[-0.035em]">
              A market that reads
              <span className="font-italic-display italic font-normal text-[color:var(--amber-400)]">
                {" "}like a balance sheet,{" "}
              </span>
              not a marketplace.
            </h2>
            <p className="mt-6 text-[15px] leading-[1.65] text-zinc-400">
              Every closed trade on Grail feeds the Ledger — a weighted moving
              average of what cards actually change hands for. No asking
              prices. No fantasy comps. Just the floor, with the receipts
              attached.
            </p>
            <div className="mt-8 flex items-center gap-4 text-[11px] font-mono tracking-[0.18em] uppercase text-zinc-500">
              <span className="text-[color:var(--jade-400)]">▲ MOVERS</span>
              <span className="text-[color:var(--rose-500)]">▼ COOLERS</span>
              <span className="text-zinc-700">·</span>
              <span>updated minute-to-minute</span>
            </div>
          </div>

          {/* RIGHT: the table, 8 cols, big and quiet */}
          <div className="col-span-12 md:col-span-8">
            <LedgerTable />
            <p className="mt-6 text-xs text-zinc-500 italic">
              See the full 240-card index after sign-in.
            </p>
          </div>
        </div>

        {/* Floor → live ledger row */}
        <div className="mt-20 md:mt-28 grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-px bg-[color:var(--line)] border border-[color:var(--line)] rounded-xl overflow-hidden">
            {HEADLINE_STATS.map((s) => (
              <div key={s.label} className="bg-[color:var(--ink-900)] p-5 md:p-6">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500">
                  {s.label}
                </p>
                <p className="font-display font-bold text-[34px] md:text-[44px] leading-none tracking-[-0.02em] mt-2">
                  {s.value}
                </p>
                <p className="text-[11px] text-zinc-500 mt-2 leading-snug">
                  {s.hint}
                </p>
              </div>
            ))}
          </div>
          <div className="col-span-12 md:col-span-5">
            <LiveLedger />
          </div>
        </div>
      </div>
    </section>
  );
}

function LedgerTable() {
  return (
    <div className="border border-[color:var(--line)] rounded-xl overflow-hidden">
      <div className="grid grid-cols-[36px,1fr,1fr,90px,110px] px-5 py-3 border-b border-[color:var(--line)] bg-[color:var(--ink-900)] font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500">
        <span>№</span>
        <span>Lot</span>
        <span className="hidden md:block">Note</span>
        <span className="text-right">Avg</span>
        <span className="text-right">30d</span>
      </div>
      {INDEX_MOVERS.map((m) => {
        const isUp = m.pct >= 0;
        return (
          <Link
            key={m.name}
            href="/discover"
            className="grid grid-cols-[36px,1fr,1fr,90px,110px] items-center px-5 py-4 border-b border-[color:var(--line)] last:border-b-0 hover:bg-[color:var(--ink-850)] transition-colors group"
          >
            <span className="font-mono text-[12px] text-zinc-600 tabular-nums">
              {String(m.rank).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg md:text-xl text-white tracking-tight leading-none group-hover:text-[color:var(--amber-400)] transition-colors">
                {m.name}
              </p>
              <p className="font-mono text-[10px] tracking-[0.04em] text-zinc-500 mt-1 truncate">
                {m.set}
              </p>
            </div>
            <p className="hidden md:block text-[12px] text-zinc-400 italic font-light pr-3 leading-snug">
              &mdash; {m.note}
            </p>
            <span className="font-mono text-sm font-bold tabular-nums text-white text-right">
              ${m.price >= 10000 ? Math.round(m.price / 1000) + "k" : m.price.toLocaleString()}
            </span>
            <div className="flex items-center justify-end gap-2">
              <Sparkline
                values={m.series}
                width={56}
                height={20}
                stroke={isUp ? "#5ae5a0" : "#ff4d6d"}
                fill={false}
              />
              <span
                className="font-mono text-[12px] font-bold tabular-nums w-12 text-right"
                style={{ color: isUp ? "var(--jade-400)" : "var(--rose-500)" }}
              >
                {isUp ? "+" : ""}{m.pct.toFixed(1)}%
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// 03 · LOT 01 — long editorial spread for the cover card
// ════════════════════════════════════════════════════════════════════

function LotOneSpread() {
  const g = FEATURED_GRAILS[0];
  return (
    <section className="relative border-t border-[color:var(--line)] bg-[color:var(--ink-900)]">
      <div className="absolute inset-0 dotgrid opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10 py-24 md:py-32">
        <EngravedRule className="mb-12 max-w-[640px]" ornament="chalice" />

        <div className="flex items-center gap-6 mb-10">
          <LotCrest numeral="III" ribbon="PSA 10" size={72} />
          <div>
            <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-[color:var(--amber-400)]">
              Cover lot
            </p>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-zinc-500 mt-1">
              A long look
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6 md:gap-x-10 gap-y-10">
          {/* The serif drop-cap intro that breaks the column */}
          <div className="col-span-12 md:col-span-7">
            <h2 className="font-display font-bold text-[44px] md:text-6xl leading-[0.95] tracking-[-0.035em] max-w-[18ch]">
              On a Charizard, a receipt, and what twenty-six years of silence looks like.
            </h2>
            <p className="mt-8 text-[11px] font-mono tracking-[0.22em] uppercase text-zinc-500">
              By the Grail Desk · May 8, 2026
            </p>
          </div>

          {/* The card on the right — holographic studio plate */}
          <div className="col-span-12 md:col-span-5">
            <HoloCard
              src={g.image}
              alt={g.title}
              ratio={4 / 5}
              stamp={{ line1: "GRAIL", line2: "LOT 01", line3: g.grade }}
              caption={{
                fig: "Fig. 02 — Photographed in studio. May 6, 2026.",
              }}
            />
          </div>

          {/* The body — two-column magazine flow */}
          <div className="col-span-12 md:col-span-7 md:col-start-1">
            <div className="columns-1 md:columns-2 gap-x-10 text-[15px] leading-[1.7] text-zinc-300 font-light [&_p]:mb-5">
              <p>
                <span className="float-left font-display font-bold text-[80px] leading-[0.78] mr-2 mt-1 text-[color:var(--amber-400)]">
                  M
                </span>
                arcus is fifty-one. He grew up in Pasadena. His son
                Henry just turned seven, which means it's been
                exactly fifteen years since he stopped buying packs and
                eight months since he started thinking about selling one.
              </p>
              <p>
                There&rsquo;s a four-pack of base set he bought in February
                of 1999 at a Toys-R-Us that doesn&rsquo;t exist anymore.
                Three of the packs he opened in the parking lot. The
                fourth he tucked into a Trapper Keeper and never touched.
                For twenty-six years it sat in a cardboard box in his
                mother&rsquo;s attic in a binder his teenage self had
                labeled, in Sharpie, &ldquo;THE GOOD ONES.&rdquo;
              </p>
              <p>
                Last Tuesday he drove the binder to our studio. We opened
                the pack on camera. The pull was a shadowless Charizard,
                first edition, in a condition our authenticator described as
                &ldquo;impossible.&rdquo; The original receipt was folded
                inside the wrapper.
              </p>
              <p>
                It&rsquo;s a PSA 10 now. It&rsquo;s on the floor at $32,400.
                Marcus is taking offers in cash, trade, or both. He says he
                wants to put Henry through college without ever telling him
                the card existed. We&rsquo;re inclined to help.
              </p>
            </div>
          </div>

          {/* The right column — meta panel */}
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <div className="border border-[color:var(--line)] rounded-xl p-6 md:p-7 sticky top-24">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[color:var(--amber-400)] mb-4">
                Lot details
              </p>
              <dl className="text-[13px] space-y-3.5">
                {[
                  ["Lot",         "01 · Cover"],
                  ["Card",        "Charizard"],
                  ["Set",         "Base · 1st Ed · Shadowless"],
                  ["Grade",       "PSA 10"],
                  ["Provenance",  "Single owner · Pasadena, CA"],
                  ["Comps (30d)", "2 sold · avg $30,800"],
                  ["Listed",      "$32,400"],
                  ["Open to",     "Cash + trade"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-[110px,1fr] gap-3 items-baseline pb-3 border-b border-[color:var(--line)] last:border-b-0 last:pb-0"
                  >
                    <dt className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500">
                      {k}
                    </dt>
                    <dd className="text-white">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/auth/sign-in"
                className="btn-amber mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm"
              >
                Place an offer
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-[11px] text-zinc-500 mt-4 italic leading-snug">
                Offers reviewed by Marcus and the Grail Desk. No bots, no resellers — we
                read every one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// 04 · ALSO IN THE ROOM — Lots 02 and 03 in a tighter rhythm
// ════════════════════════════════════════════════════════════════════

function AlsoInTheRoom() {
  return (
    <section className="relative border-t border-[color:var(--line)]">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-24 md:py-32">
        <EngravedRule className="mb-12 max-w-[640px]" ornament="diamond" />
        <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
          <div className="max-w-xl">
            <div className="flex items-center gap-5 mb-5">
              <LotCrest numeral="IV" ribbon="ALSO" size={56} />
              <div>
                <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-[color:var(--amber-400)]">
                  Section
                </p>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500 mt-1">
                  In the room
                </p>
              </div>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl leading-[0.95] tracking-[-0.03em]">
              Two more lots
              <span className="font-italic-display italic font-normal text-[color:var(--amber-400)]"> we wouldn&rsquo;t mind</span> keeping for ourselves.
            </h2>
          </div>
          <Link
            href="/discover"
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-zinc-400 hover:text-[color:var(--amber-400)] inline-flex items-center gap-2"
          >
            All 1,488 active lots
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {FEATURED_GRAILS.slice(1).map((g) => (
            <article
              key={g.lot}
              className="group grid grid-cols-1 md:grid-cols-[1fr,1.2fr] gap-6 items-start"
            >
              <div className="relative">
                <p className="absolute -left-2 top-0 watermark text-[180px] leading-none z-10">
                  {g.lot}
                </p>
                <div className="relative aspect-[3/4] bg-[color:var(--ink-850)] rounded-md overflow-hidden border border-[color:var(--line)] card-lift">
                  <div
                    className="absolute inset-0 pointer-events-none opacity-50"
                    style={{
                      background:
                        "radial-gradient(65% 50% at 50% 30%, rgba(247,201,72,0.15) 0%, transparent 70%)",
                    }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.image}
                    alt={g.title}
                    className="absolute inset-0 h-full w-full object-contain p-7 transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="md:pt-2">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[color:var(--amber-400)]">
                  Lot {g.lot} · {g.grade}
                </p>
                <h3 className="font-display font-bold text-3xl md:text-4xl mt-3 leading-[1] tracking-[-0.03em]">
                  {g.title}
                </h3>
                <p className="mt-1 font-mono text-[12px] tracking-[0.04em] text-zinc-500">
                  {g.subtitle}
                </p>

                <p className="mt-5 text-[14px] leading-[1.65] text-zinc-400 italic font-light max-w-[42ch]">
                  &ldquo;{g.story}&rdquo;
                </p>

                <div className="mt-6 flex items-end justify-between gap-4 border-t border-[color:var(--line)] pt-5">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500">
                      Provenance
                    </p>
                    <p className="text-[13px] text-zinc-300 mt-1 max-w-[28ch]">
                      {g.provenance}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500">
                      Listed
                    </p>
                    <p className="font-display font-bold text-3xl tabular-nums mt-1 text-white">
                      ${g.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// 05 · DISPATCHES — short editorial pieces
// ════════════════════════════════════════════════════════════════════

function Dispatches() {
  return (
    <section className="relative border-t border-[color:var(--line)] bg-[color:var(--ink-900)]">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-24 md:py-32">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-10 gap-y-10">
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-start gap-5 mb-6">
              <LotCrest numeral="V" ribbon="DISPATCH" size={64} />
              <div className="pt-2">
                <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-[color:var(--amber-400)]">
                  Section
                </p>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500 mt-1">
                  Field notes
                </p>
              </div>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl leading-[0.95] tracking-[-0.035em]">
              Field notes from <span className="font-italic-display italic font-normal text-[color:var(--amber-400)]">the floor.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-[1.65] text-zinc-400 max-w-[40ch]">
              The newsletter we send members every Wednesday. Specific cards,
              specific weeks, no &ldquo;the market is up.&rdquo;
            </p>
          </div>

          <div className="col-span-12 md:col-span-8 grid grid-cols-1 gap-6">
            {DISPATCHES.map((d, i) => (
              <article
                key={d.title}
                className="group grid grid-cols-[80px,1fr] md:grid-cols-[120px,1fr] gap-5 md:gap-8 pb-6 border-b border-[color:var(--line)] last:border-b-0"
              >
                <div>
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[color:var(--amber-400)]">
                    {d.date}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-zinc-500 mt-1">
                    {d.byline}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-700 mt-2">
                    Nº&nbsp;0{i + 1}
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl md:text-[28px] leading-[1.05] tracking-[-0.025em] group-hover:text-[color:var(--amber-400)] transition-colors max-w-[28ch]">
                    {d.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.65] text-zinc-400 max-w-[58ch]">
                    {d.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// 06 · VOICES — zine-y collector pull-quotes
// ════════════════════════════════════════════════════════════════════

function Voices() {
  const tones = ["amber", "jade", "violet"] as const;
  return (
    <section className="relative border-t border-[color:var(--line)]">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-24 md:py-32">
        <div className="flex items-center gap-5 mb-8">
          <LotCrest numeral="VI" ribbon="VOICES" size={64} />
          <div>
            <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-[color:var(--amber-400)]">
              Section
            </p>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500 mt-1">
              From the floor
            </p>
          </div>
        </div>
        <h2 className="font-display font-bold text-4xl md:text-6xl leading-[0.9] tracking-[-0.04em] max-w-[14ch]">
          The room, in <span className="font-italic-display italic font-normal text-[color:var(--amber-400)]">other people&rsquo;s</span> words.
        </h2>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-y-24 gap-x-10">
          {COLLECTOR_VOICES.map((v, i) => (
            <figure
              key={v.handle}
              className={[
                "col-span-12 md:col-span-7",
                i === 1 ? "md:col-start-6" : "",
                i === 2 ? "md:col-start-1" : "",
              ].join(" ")}
            >
              <span
                className="font-display text-[160px] md:text-[220px] leading-[0.6] text-[color:var(--amber-400)] -mb-6 block"
                aria-hidden
              >
                &ldquo;
              </span>
              <blockquote className="font-display font-medium text-2xl md:text-[34px] leading-[1.18] tracking-[-0.02em] text-white max-w-[28ch]">
                {v.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <MemberMedallion
                  initial={v.pic}
                  size={64}
                  tone={tones[i % tones.length]}
                  ringTop={`★  ${v.handle.toUpperCase().replace("@", "")}  ★`}
                  ringBottom={`${v.city.toUpperCase()}  ·  ${v.trades} TRADES`}
                  className="shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">{v.name}</p>
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-zinc-500">
                    {v.handle} · {v.city} · {v.trades} trades · {v.signoff}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// 07 · ADVERTISERS — quiet feature
// ════════════════════════════════════════════════════════════════════

function AdvertisersInsert() {
  return (
    <section className="relative border-t border-[color:var(--line)] bg-[color:var(--ink-900)]">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-24 md:py-32">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-10 gap-y-10 items-center">
          <div className="col-span-12 md:col-span-7">
            <div className="flex items-center gap-5 mb-5">
              <LotCrest numeral="VII" ribbon="ADVERT" size={56} />
              <div>
                <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-[color:var(--amber-400)]">
                  Section
                </p>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500 mt-1">
                  For advertisers
                </p>
              </div>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl leading-[1] tracking-[-0.03em] max-w-[18ch]">
              Run an ad that looks like the magazine, not <span className="font-italic-display italic font-normal text-[color:var(--amber-400)]">a billboard inside it.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.65] text-zinc-400 max-w-[58ch]">
              Pick a template. Type a headline. Watch the preview render in
              the Grail house style. No video files, no agencies, no Sponsored
              banner that ruins the spread. Lives in the feed wrapped in the
              same care we put on a Charizard.
            </p>

            <div className="mt-8 flex items-center gap-6 flex-wrap">
              <Link
                href="/ads/new"
                className="btn-amber inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
              >
                Try the designer
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/design"
                className="text-[13px] font-medium text-zinc-300 hover:text-white underline decoration-[color:var(--amber-400)] decoration-2 underline-offset-[6px]"
              >
                Or read the design system
              </Link>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 md:col-start-8 relative">
            <div className="absolute -inset-10 bg-[color:var(--amber-400)]/8 blur-3xl rounded-full pointer-events-none" />
            <div className="relative aspect-[9/16] rounded-[22px] overflow-hidden ring-1 ring-[color:var(--line)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] float-y max-w-[340px] mx-auto">
              <AdCreative
                spec={{
                  template: "editorial",
                  accent: "amber",
                  kicker: "MARKET REPORT · ISSUE 03",
                  headline: "The Umbreon hasn't quit.",
                  subhead: "Three years in, the alt-art is still the index.",
                  ctaLabel: "Read the report",
                  cardName: "Umbreon VMAX · Alt Art",
                  price: 1820,
                  priceChangePct: 22.1,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// 08 · COLOPHON — closing stamp
// ════════════════════════════════════════════════════════════════════

function Colophon() {
  return (
    <section className="relative border-t border-[color:var(--line)] overflow-hidden">
      <div className="absolute inset-0 dotgrid opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10 py-28 md:py-40">
        <div className="grid grid-cols-12 gap-10 items-end">
          <div className="col-span-12 md:col-span-8">
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-zinc-500 mb-6">
              Colophon · End of issue
            </p>
            <h2 className="font-display font-bold text-5xl md:text-[88px] leading-[0.88] tracking-[-0.04em] max-w-[14ch]">
              The room is open. <span className="font-italic-display italic font-normal text-[color:var(--amber-400)]">Twenty-four hours.</span>
            </h2>
            <p className="mt-8 text-[15px] leading-[1.65] text-zinc-400 max-w-[52ch]">
              Membership is free. Listing is free. We make money when trades
              close — $1 to $6 a side, flat, no percentage. The next issue is
              Wednesday.
            </p>

            <div className="mt-10 flex items-center gap-4 flex-wrap">
              <Link
                href="/auth/sign-in"
                className="btn-amber inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base"
              >
                Open my account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/discover"
                className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                Browse first
              </Link>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="relative flex flex-col items-start md:items-end gap-6">
              {/* Sunburst halo behind the full crest */}
              <div className="relative">
                <div className="absolute inset-0 -m-16 flex items-center justify-center pointer-events-none drift">
                  <AmberBurst size={360} intensity="bold" />
                </div>
                <div className="relative">
                  <GrailCrest size={180} variant="full" tone="amber" ordinal="I" />
                </div>
              </div>
              <Wordmark
                size={56}
                variant="plate"
                eyebrow="EST · MMXXVI · TRADING FLOOR"
                className="md:items-end"
              />
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-600 md:text-right">
                Issue 01 · Set in Fraunces &amp; Instrument Serif.
                <br />
                Numerals in JetBrains Mono.
                <br />
                Printed nowhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
