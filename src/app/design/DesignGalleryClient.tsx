"use client";

import Link from "next/link";
import {
  AmberBurst,
  CardStackIcon,
  ChaliceMark,
  GradeSealIcon,
  GrailCrown,
  Monogram,
  Sparkline,
  TrophyRibbon,
} from "@/components/brand/graphics";
import { Logo } from "@/components/brand/Logo";
import { AdCreative } from "@/components/ads/AdCreative";
import type { CreativeSpec } from "@/lib/ads/creativeSpec";

const SAMPLE_SPECS: CreativeSpec[] = [
  {
    template: "spotlight",
    accent: "amber",
    kicker: "SPONSORED · THIS WEEK",
    headline: "The shadowless is moving.",
    subhead: "Verified-only lots, flat $1–6 fees, trades that actually close.",
    ctaLabel: "Start trading",
    cardName: "Charizard · Base Shadowless",
    price: 2400,
    priceChangePct: 18.3,
  },
  {
    template: "editorial",
    accent: "violet",
    kicker: "MARKET REPORT · VOL. 01",
    headline: "Grade 10 Umbreons keep outperforming the index.",
    subhead:
      "Thirty-day trend data from Grail's verified trade ledger. Written by collectors, for collectors.",
    ctaLabel: "Read the report",
    cardName: "Umbreon VMAX · Alternate Art",
    price: 1820,
    priceChangePct: 22.1,
  },
  {
    template: "ticker",
    accent: "jade",
    kicker: "LIVE · SPIKE ALERT",
    headline: "Pikachu Illustrator ticked again.",
    subhead: "Only 39 copies exist. Three sold on Grail this quarter.",
    ctaLabel: "See comparables",
    cardName: "Pikachu Illustrator",
    price: 412000,
    priceChangePct: 7.2,
  },
  {
    template: "ribbon",
    accent: "amber",
    kicker: "GRAIL MOMENT",
    ribbonLabel: "GRAIL · 1999",
    headline: "First-edition, pulled yesterday.",
    subhead: "A new listing from a verified seller in Kyoto.",
    ctaLabel: "View listing",
    cardName: "Blastoise · 1st Ed. Base",
    price: 3900,
  },
];

export function DesignGalleryClient() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[color:var(--line)]">
        <div className="absolute inset-x-0 top-[-40%] flex justify-center pointer-events-none">
          <AmberBurst size={900} intensity="soft" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 md:px-10 py-16 md:py-24">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/"
              className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 hover:text-white"
            >
              ← Back to Grail
            </Link>
          </div>
          <div className="kicker">Design system · 2026</div>
          <h1 className="font-display font-bold text-5xl md:text-7xl mt-3 leading-[0.95] tracking-[-0.035em]">
            The house style,
            <br />
            <span
              className="italic"
              style={{
                background:
                  "linear-gradient(135deg, #FFE8A0 0%, #F7C948 45%, #CB8A08 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              written down.
            </span>
          </h1>
          <p className="mt-6 text-lg text-zinc-300 max-w-[52ch] leading-relaxed">
            Every piece of Grail — the chalice mark, the amber burst behind
            hero cards, the editorial serif pulling collectors in — lives in
            this file. Use these pieces; don&rsquo;t reinvent them. Don&rsquo;t
            reach for emoji when a two-line SVG will do.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ads/new"
              className="btn-amber inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
            >
              Try the ad designer →
            </Link>
            <a
              href="#creatives"
              className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Jump to ad templates
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 md:px-10 py-16 space-y-24">
        {/* ── Colour + type primers ────────────────────────────── */}
        <Section
          kicker="01 · FOUNDATIONS"
          title="Colour is a signal, not decoration."
          lede="Amber means action. Violet means rarity. Jade means market up, rose means market down. Ink is the stage everything else stands on — never a flat grey."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Swatch name="Amber 400" hex="#F7C948" role="Primary · CTA" />
            <Swatch name="Violet 400" hex="#b79dff" role="Rarity · Grade" />
            <Swatch name="Jade 400" hex="#5ae5a0" role="Market up · Prices" />
            <Swatch name="Rose 500" hex="#ff4d6d" role="Market down · Alerts" />
            <Swatch name="Ink 950" hex="#050506" role="Stage · Background" />
            <Swatch name="Ink 800" hex="#16161b" role="Panel" />
            <Swatch name="Ink 400" hex="#6a6a78" role="Meta · Kickers" />
            <Swatch name="Ink 100" hex="#e8e8ec" role="Body copy" />
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="panel p-6">
              <div className="kicker-mute">DISPLAY · FRAUNCES</div>
              <p className="font-display font-bold text-5xl mt-3 leading-none tracking-[-0.035em]">
                Grail<span className="italic text-[color:var(--amber-400)]">.</span>
              </p>
              <p className="mt-4 font-display italic text-2xl text-zinc-400 leading-tight">
                &ldquo;Editorial weight. Used sparingly for big moments.&rdquo;
              </p>
            </div>
            <div className="panel p-6">
              <div className="kicker-mute">INTERFACE · GEIST</div>
              <p className="font-semibold text-3xl mt-3 leading-tight">
                The working font.
              </p>
              <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                All body copy, buttons, metadata, and captions use Geist Sans.
                Tight tracking, generous leading. Let the type do its job.
              </p>
            </div>
          </div>
        </Section>

        {/* ── Logo lockups ─────────────────────────────────────── */}
        <Section
          kicker="02 · MARK"
          title="One chalice. Four ways to use it."
          lede="The chalice is our single brand atom. It carries the amber tile in hero contexts, sits flat inside dark panels, and drops to a ghost outline when space is tight."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card label="Lockup · 40px">
              <Logo size={40} />
            </Card>
            <Card label="Large · 64px">
              <Logo size={64} showEyebrow />
            </Card>
            <Card label="Ink on ink · flat">
              <div className="flex items-center gap-4">
                <ChaliceMark size={42} tone="ink" />
                <ChaliceMark size={42} tone="amber" />
                <ChaliceMark size={42} tone="ghost" />
              </div>
            </Card>
            <Card label="Monogram — editorial corners">
              <Monogram size={90} tone="amber" />
            </Card>
          </div>
        </Section>

        {/* ── Graphic primitives ───────────────────────────────── */}
        <Section
          kicker="03 · PRIMITIVES"
          title="Eight pieces you'll reuse forever."
          lede="When something needs graphic weight, reach for these before inventing. Mix and match — the amber burst behind a grade seal is the Grail look in one image."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <PrimitiveCard name="AmberBurst">
              <div className="h-28 flex items-center justify-center">
                <AmberBurst size={110} />
              </div>
            </PrimitiveCard>
            <PrimitiveCard name="CardStackIcon">
              <div className="h-28 flex items-center justify-center">
                <CardStackIcon size={90} />
              </div>
            </PrimitiveCard>
            <PrimitiveCard name="GradeSealIcon">
              <div className="h-28 flex items-center justify-center">
                <GradeSealIcon size={70} />
              </div>
            </PrimitiveCard>
            <PrimitiveCard name="GrailCrown">
              <div className="h-28 flex items-center justify-center">
                <GrailCrown size={70} />
              </div>
            </PrimitiveCard>
            <PrimitiveCard name="TrophyRibbon" span={2}>
              <div className="h-28 flex items-center justify-center">
                <TrophyRibbon width={280} />
              </div>
            </PrimitiveCard>
            <PrimitiveCard name="Sparkline">
              <div className="h-28 flex items-end px-3">
                <Sparkline
                  values={[100, 102, 99, 104, 108, 112, 109, 114, 120, 118, 125, 132]}
                  width={160}
                  height={72}
                />
              </div>
            </PrimitiveCard>
            <PrimitiveCard name="ChaliceMark">
              <div className="h-28 flex items-center justify-center gap-3">
                <ChaliceMark size={36} tone="amber" />
                <ChaliceMark size={36} tone="ink" />
                <ChaliceMark size={36} tone="ghost" />
              </div>
            </PrimitiveCard>
          </div>
        </Section>

        {/* ── Ad creative templates ────────────────────────────── */}
        <Section
          kicker="04 · AD CREATIVES"
          title="Four ways to say one thing."
          lede="Every ad template below is pure SVG + React. No image uploads, no export-and-upload loop — change a field and the ad re-renders. Paint once, ship everywhere."
          anchor="creatives"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SAMPLE_SPECS.map((s) => (
              <div key={s.template} className="space-y-2">
                <div className="kicker-mute">{s.template}</div>
                <div className="relative aspect-[9/16] overflow-hidden rounded-2xl ring-1 ring-zinc-800">
                  <AdCreative spec={s} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 panel p-6 md:p-8">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="flex-1 min-w-[260px]">
                <div className="kicker">Design the ad you want to see</div>
                <h3 className="font-display font-bold text-3xl mt-2 leading-tight">
                  Pick a template, type a headline,
                  <br className="hidden md:inline" /> launch the ad.
                </h3>
                <p className="mt-3 text-sm text-zinc-400 max-w-[48ch] leading-relaxed">
                  The ad builder renders a live preview as you type. No video
                  file. No placeholder emoji. Just your copy on the Grail
                  canvas.
                </p>
              </div>
              <Link
                href="/ads/new"
                className="btn-amber inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"
              >
                Open the designer →
              </Link>
            </div>
          </div>
        </Section>

        {/* ── Rules ────────────────────────────────────────────── */}
        <Section
          kicker="05 · HOUSE RULES"
          title="Five things we always do."
          lede="These are non-negotiable. They're why the product feels like itself and not a template."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Rule
              n="01"
              title="No emoji, ever"
              body="If an icon is called for, it's either a lucide-react glyph or a custom SVG. Emoji render differently on every OS — they break the look instantly."
            />
            <Rule
              n="02"
              title="Amber is earned"
              body="Reserve amber for the highest-value action on a surface. Two amber things means you haven't picked yet."
            />
            <Rule
              n="03"
              title="Serif says 'collector'"
              body="Display serif for moments where the collector feels seen. Never for nav, labels, or buttons."
            />
            <Rule
              n="04"
              title="Tabular nums for money"
              body="Every price, every percent, uses tabular-nums. Columns should align across rows."
            />
            <Rule
              n="05"
              title="Ink is a stage"
              body="Never flat #000. Always the subtle radial wash behind everything. It's 5% of the work and 40% of why it looks expensive."
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────

function Section({
  kicker,
  title,
  lede,
  children,
  anchor,
}: {
  kicker: string;
  title: string;
  lede: string;
  children: React.ReactNode;
  anchor?: string;
}) {
  return (
    <section id={anchor} className="scroll-mt-12">
      <div className="kicker">{kicker}</div>
      <h2 className="font-display font-bold text-3xl md:text-4xl mt-2 leading-tight tracking-[-0.025em] max-w-[28ch]">
        {title}
      </h2>
      <p className="mt-3 text-zinc-400 max-w-[62ch] leading-relaxed">{lede}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Swatch({ name, hex, role }: { name: string; hex: string; role: string }) {
  const isDark = parseInt(hex.slice(1), 16) < 0x888888;
  return (
    <div className="space-y-2">
      <div
        className="aspect-[4/3] rounded-xl ring-1 ring-white/10 relative overflow-hidden"
        style={{ background: hex }}
      >
        <div
          className="absolute bottom-1.5 right-2 text-[10px] font-bold tracking-[0.2em] uppercase"
          style={{ color: isDark ? "#fff" : "#050506" }}
        >
          {hex}
        </div>
      </div>
      <div>
        <div className="text-xs font-bold text-white">{name}</div>
        <div className="text-[11px] text-zinc-500">{role}</div>
      </div>
    </div>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="panel p-6 flex flex-col gap-4 items-start">
      <div className="kicker-mute">{label}</div>
      <div className="w-full flex items-center justify-center py-6">
        {children}
      </div>
    </div>
  );
}

function PrimitiveCard({
  name,
  children,
  span,
}: {
  name: string;
  children: React.ReactNode;
  span?: 1 | 2;
}) {
  return (
    <div
      className={`panel-inset p-3 ${span === 2 ? "col-span-2" : ""}`}
    >
      {children}
      <div className="mt-2 border-t border-white/5 pt-2 text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500">
        {name}
      </div>
    </div>
  );
}

function Rule({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="panel p-6 relative overflow-hidden">
      <div
        className="absolute -top-4 -right-2 font-display font-bold text-[90px] leading-none tracking-tighter text-white/[0.04] pointer-events-none select-none"
        aria-hidden
      >
        {n}
      </div>
      <div className="relative">
        <div className="kicker">Rule {n}</div>
        <h3 className="font-display font-bold text-xl mt-1 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
