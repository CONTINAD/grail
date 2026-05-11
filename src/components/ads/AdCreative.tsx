"use client";

import { cn } from "@/lib/utils";
import {
  AmberBurst,
  ChaliceMark,
  GradeSealIcon,
  GrailCrown,
  Monogram,
  Sparkline,
  TrophyRibbon,
} from "@/components/brand/graphics";
import type { CreativeAccent, CreativeSpec } from "@/lib/ads/creativeSpec";

interface Props {
  spec: CreativeSpec;
  className?: string;
  /** In-feed creatives fill their parent. Standalone previews set their own size. */
  fill?: boolean;
}

/**
 * Renders a CreativeSpec as a vertical (9:16) ad unit. Built entirely
 * from brand primitives + HTML — no bitmap rendering, no upload
 * pipeline, always crisp, and themable by accent.
 */
export function AdCreative({ spec, className, fill = true }: Props) {
  const shell = cn(
    "relative overflow-hidden select-none text-white",
    fill ? "h-full w-full" : "aspect-[9/16] w-full",
    className
  );

  switch (spec.template) {
    case "spotlight":
      return <SpotlightCreative spec={spec} className={shell} />;
    case "editorial":
      return <EditorialCreative spec={spec} className={shell} />;
    case "ticker":
      return <TickerCreative spec={spec} className={shell} />;
    case "ribbon":
      return <RibbonCreative spec={spec} className={shell} />;
  }
}

// ───────────────────────────────────────────────────────────────
// shared
// ───────────────────────────────────────────────────────────────

const ACCENT_VAR: Record<CreativeAccent, string> = {
  amber: "var(--amber-400)",
  violet: "var(--violet-400)",
  jade: "var(--jade-400)",
  rose: "var(--rose-500)",
};

function FineWatermark({ accent }: { accent: CreativeAccent }) {
  return (
    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 opacity-70">
      <ChaliceMark size={16} tone={accent === "amber" ? "amber" : "ghost"} withPeriod={false} />
      <span
        className="text-[9px] font-bold tracking-[0.32em] uppercase"
        style={{ color: ACCENT_VAR[accent] }}
      >
        Grail
      </span>
    </div>
  );
}

function CtaButton({
  label,
  accent,
  className,
}: {
  label: string;
  accent: CreativeAccent;
  className?: string;
}) {
  if (accent === "amber") {
    return (
      <div
        className={cn(
          "btn-amber inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm",
          className
        )}
      >
        {label}
        <span aria-hidden className="text-base leading-none">→</span>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold",
        className
      )}
      style={{
        background: ACCENT_VAR[accent],
        color: "#0b0b0d",
      }}
    >
      {label}
      <span aria-hidden className="text-base leading-none">→</span>
    </div>
  );
}

function Kicker({ text, accent }: { text?: string; accent: CreativeAccent }) {
  if (!text) return null;
  return (
    <div
      className="text-[11px] font-bold tracking-[0.28em] uppercase"
      style={{ color: ACCENT_VAR[accent] }}
    >
      {text}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Template: SPOTLIGHT — card on pedestal with burst backdrop
// ───────────────────────────────────────────────────────────────

function SpotlightCreative({ spec, className }: { spec: CreativeSpec; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background:
          "radial-gradient(120% 80% at 50% 22%, #1a1208 0%, #0b0b0d 55%, #050506 100%)",
      }}
    >
      {/* Burst backdrop */}
      <div className="absolute inset-x-0 top-[-12%] flex justify-center pointer-events-none">
        <AmberBurst size={700} intensity="bold" accent={spec.accent} />
      </div>

      <div className="relative z-10 flex h-full flex-col px-6 py-8 md:px-10 md:py-12">
        <div className="flex items-center justify-between">
          <Kicker text={spec.kicker ?? "SPONSORED"} accent={spec.accent} />
          <ChaliceMark size={22} tone="amber" />
        </div>

        {/* Card pedestal */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Drop shadow plate */}
            <div
              className="absolute -bottom-4 left-1/2 h-8 w-48 -translate-x-1/2 rounded-[50%] blur-xl"
              style={{ background: "rgba(0,0,0,0.6)" }}
            />
            <div
              className="absolute -inset-3 rounded-[28px] blur-2xl opacity-60"
              style={{ background: ACCENT_VAR[spec.accent] }}
            />
            {spec.cardImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={spec.cardImage}
                alt={spec.cardName ?? ""}
                className="relative w-56 rounded-[18px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
                draggable={false}
              />
            ) : (
              <PlaceholderCard accent={spec.accent} />
            )}
            {spec.priceChangePct != null && (
              <div
                className="absolute -top-3 -right-3 rounded-full px-3 py-1 text-[11px] font-black tabular-nums shadow-lg"
                style={{
                  background: spec.priceChangePct >= 0 ? "var(--jade-400)" : "var(--rose-500)",
                  color: "#0b0b0d",
                }}
              >
                {spec.priceChangePct >= 0 ? "▲" : "▼"} {Math.abs(spec.priceChangePct).toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {spec.cardName && (
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60">
              {spec.cardName}
            </p>
          )}
          <h1 className="font-display font-bold text-[40px] leading-[0.95] tracking-[-0.03em] text-white">
            {spec.headline}
          </h1>
          {spec.subhead && (
            <p className="text-[15px] leading-snug text-white/75 max-w-[28ch]">
              {spec.subhead}
            </p>
          )}
          <div className="flex items-center gap-3 pt-2">
            <CtaButton label={spec.ctaLabel} accent={spec.accent} />
            {spec.price != null && (
              <span className="text-sm font-bold tabular-nums text-white/80">
                from ${spec.price.toFixed(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      <FineWatermark accent={spec.accent} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Template: EDITORIAL — magazine split layout
// ───────────────────────────────────────────────────────────────

function EditorialCreative({ spec, className }: { spec: CreativeSpec; className?: string }) {
  return (
    <div className={className} style={{ background: "#050506" }}>
      {/* Ambient accent flood, top-left */}
      <div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-35"
        style={{ background: ACCENT_VAR[spec.accent] }}
      />
      <Monogram
        size={360}
        tone={spec.accent === "amber" ? "amber" : "ghost"}
        className="absolute -right-10 -bottom-6 opacity-[0.08] pointer-events-none"
      />

      <div className="relative z-10 flex h-full flex-col px-7 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChaliceMark size={20} tone="amber" />
            <span
              className="font-display font-bold text-[18px] tracking-[-0.03em]"
              style={{ color: "var(--ink-100)" }}
            >
              Grail
              <span style={{ color: ACCENT_VAR[spec.accent] }}>.</span>
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/50">
            Sponsored · Vol. 01
          </span>
        </div>

        <div className="mt-8 space-y-5">
          <Kicker text={spec.kicker ?? "MARKET REPORT"} accent={spec.accent} />
          <h1 className="font-display font-bold text-[44px] leading-[0.92] tracking-[-0.035em] text-white">
            &ldquo;{spec.headline}&rdquo;
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-px w-10" style={{ background: ACCENT_VAR[spec.accent] }} />
            <p className="text-[12px] tracking-[0.22em] uppercase text-white/60 font-semibold">
              {spec.cardName ?? "Featured lot"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[1fr,auto] gap-4 items-end flex-1">
          <p className="text-[14px] leading-[1.55] text-white/75 font-light max-w-[32ch] self-end">
            {spec.subhead ??
              "A considered essay on the cards, sneakers, and relics moving the market this week."}
          </p>
          {spec.cardImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={spec.cardImage}
              alt={spec.cardName ?? ""}
              className="h-52 w-36 rounded-lg object-cover ring-1 ring-white/20 shadow-xl"
              draggable={false}
            />
          ) : (
            <div className="h-52 w-36">
              <PlaceholderCard accent={spec.accent} rounded={6} />
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <div>
            {spec.price != null && (
              <p className="font-display font-bold text-[28px] tabular-nums leading-none">
                ${spec.price.toLocaleString()}
              </p>
            )}
            {spec.priceChangePct != null && (
              <p
                className="mt-1 text-[11px] font-bold tracking-[0.2em] uppercase"
                style={{
                  color: spec.priceChangePct >= 0 ? "var(--jade-400)" : "var(--rose-500)",
                }}
              >
                {spec.priceChangePct >= 0 ? "▲" : "▼"} {Math.abs(spec.priceChangePct).toFixed(1)}%
                &nbsp;/ 30d
              </p>
            )}
          </div>
          <CtaButton label={spec.ctaLabel} accent={spec.accent} />
        </div>
      </div>

      <FineWatermark accent={spec.accent} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Template: TICKER — big tabular price + sparkline
// ───────────────────────────────────────────────────────────────

function TickerCreative({ spec, className }: { spec: CreativeSpec; className?: string }) {
  const accent = ACCENT_VAR[spec.accent];
  const values =
    spec.sparklineValues && spec.sparklineValues.length > 1
      ? spec.sparklineValues
      : fakeMomentum(spec.priceChangePct ?? 18);
  const isUp = (spec.priceChangePct ?? 0) >= 0;
  const trendColor = isUp ? "var(--jade-400)" : "var(--rose-500)";

  return (
    <div
      className={className}
      style={{
        background:
          "linear-gradient(180deg, #0b0b0d 0%, #050506 60%, #050506 100%)",
      }}
    >
      {/* Grid lines */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-[0.08] pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 0 L0 40 M0 0 L40 0" stroke="#F7C948" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="relative z-10 flex h-full flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <Kicker text={spec.kicker ?? "LIVE MARKET"} accent={spec.accent} />
          <span
            className="text-[10px] font-bold tracking-[0.28em] uppercase"
            style={{ color: trendColor }}
          >
            ●&nbsp;&nbsp;{isUp ? "TRENDING UP" : "COOLING OFF"}
          </span>
        </div>

        <div className="mt-3 flex items-start gap-3">
          {spec.cardImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={spec.cardImage}
              alt=""
              className="h-20 w-14 rounded-md object-cover ring-1 ring-white/20"
              draggable={false}
            />
          ) : (
            <div className="h-20 w-14">
              <PlaceholderCard accent={spec.accent} rounded={4} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            {spec.cardName && (
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-white/55">
                {spec.cardName}
              </p>
            )}
            <h1 className="font-display font-bold text-[28px] leading-[1] tracking-[-0.02em] mt-1 text-white">
              {spec.headline}
            </h1>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-white/50">
            Market avg
          </p>
          <div className="flex items-baseline gap-3 mt-1">
            <p
              className="font-display font-bold text-[72px] leading-none tabular-nums"
              style={{ color: "#F5F5F7" }}
            >
              ${spec.price != null ? spec.price.toLocaleString() : "—"}
            </p>
            {spec.priceChangePct != null && (
              <span
                className="text-[20px] font-black tabular-nums"
                style={{ color: trendColor }}
              >
                {isUp ? "▲" : "▼"} {Math.abs(spec.priceChangePct).toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 flex-1 flex items-end">
          <Sparkline
            values={values}
            width={360}
            height={160}
            stroke={isUp ? "#5ae5a0" : "#ff4d6d"}
            className="w-full"
          />
        </div>

        <div className="mt-4 space-y-3">
          {spec.subhead && (
            <p className="text-[14px] leading-snug text-white/75 max-w-[30ch]">
              {spec.subhead}
            </p>
          )}
          <div className="flex items-center justify-between">
            <CtaButton label={spec.ctaLabel} accent={spec.accent} />
            <div className="flex gap-1 opacity-60">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1 rounded-full"
                  style={{ width: 14, background: accent, opacity: 1 - i * 0.3 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <FineWatermark accent={spec.accent} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Template: RIBBON — grail-moment
// ───────────────────────────────────────────────────────────────

function RibbonCreative({ spec, className }: { spec: CreativeSpec; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background:
          "radial-gradient(90% 70% at 50% 30%, #26170a 0%, #0b0b0d 70%, #050506 100%)",
      }}
    >
      <Monogram
        size={520}
        tone="amber"
        className="absolute -top-24 -left-20 opacity-[0.07] pointer-events-none"
      />

      <div className="relative z-10 flex h-full flex-col items-center px-6 py-10">
        <div className="flex items-center gap-2">
          <ChaliceMark size={22} tone="amber" />
          <span className="font-display font-bold text-[18px] tracking-[-0.03em]">
            Grail<span style={{ color: ACCENT_VAR[spec.accent] }}>.</span>
          </span>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <GrailCrown size={64} />
          <div className="mt-3">
            <TrophyRibbon
              label={spec.ribbonLabel ?? "GRAIL MOMENT"}
              width={280}
              tone={spec.accent === "amber" ? "amber" : spec.accent === "jade" ? "jade" : "violet"}
            />
          </div>
        </div>

        {/* Card hero */}
        <div className="mt-4 relative">
          <div
            className="absolute -inset-4 rounded-[22px] blur-2xl opacity-45"
            style={{ background: ACCENT_VAR[spec.accent] }}
          />
          {spec.cardImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={spec.cardImage}
              alt={spec.cardName ?? ""}
              className="relative h-48 w-32 md:h-56 md:w-40 rounded-lg object-cover ring-1 ring-white/15 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)]"
              draggable={false}
            />
          ) : (
            <div className="h-48 w-32 md:h-56 md:w-40">
              <PlaceholderCard accent={spec.accent} />
            </div>
          )}
        </div>

        <div className="mt-5 text-center space-y-3 max-w-[30ch]">
          {spec.cardName && (
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-white/60">
              {spec.cardName}
            </p>
          )}
          <h1 className="font-display font-bold text-[30px] leading-[1] tracking-[-0.025em]">
            {spec.headline}
          </h1>
          {spec.subhead && (
            <p className="text-[14px] leading-snug text-white/75">{spec.subhead}</p>
          )}
          {spec.price != null && (
            <p className="font-display font-bold text-[22px] tabular-nums">
              ${spec.price.toLocaleString()}
            </p>
          )}
        </div>

        <div className="mt-auto pt-6">
          <CtaButton label={spec.ctaLabel} accent={spec.accent} />
        </div>
      </div>

      <FineWatermark accent={spec.accent} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Placeholder + helpers
// ───────────────────────────────────────────────────────────────

function PlaceholderCard({
  accent,
  rounded = 18,
}: {
  accent: CreativeAccent;
  rounded?: number;
}) {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        borderRadius: rounded,
        background:
          "linear-gradient(155deg, #1a0f00 0%, #050506 60%, #050506 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex flex-col items-center gap-2 opacity-80">
        <GradeSealIcon size={60} />
        <span
          className="text-[9px] font-bold tracking-[0.22em] uppercase"
          style={{ color: ACCENT_VAR[accent] }}
        >
          Featured lot
        </span>
      </div>
    </div>
  );
}

function fakeMomentum(targetPct: number): number[] {
  // Deterministic-ish 24pt momentum curve ending on the right side
  const n = 24;
  const start = 100;
  const end = start * (1 + targetPct / 100);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const base = start + (end - start) * t;
    const wiggle = Math.sin(i * 1.6) * (Math.abs(end - start) * 0.08);
    out.push(base + wiggle);
  }
  return out;
}
