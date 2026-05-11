"use client";

import { useMemo, useState } from "react";
import { AdCreative } from "./AdCreative";
import {
  CreativeAccents,
  CreativeTemplates,
  type CreativeAccent,
  type CreativeSpec,
  type CreativeTemplate,
} from "@/lib/ads/creativeSpec";
import { cn } from "@/lib/utils";

interface Props {
  value: CreativeSpec;
  onChange: (next: CreativeSpec) => void;
}

const TEMPLATE_BLURBS: Record<CreativeTemplate, { label: string; hint: string }> = {
  spotlight: { label: "Spotlight", hint: "Hero card on an amber burst" },
  editorial: { label: "Editorial", hint: "Magazine-style split layout" },
  ticker: { label: "Ticker", hint: "Live price with sparkline" },
  ribbon: { label: "Grail moment", hint: "Crown, ribbon, pedestal shot" },
};

const ACCENT_SWATCH: Record<CreativeAccent, string> = {
  amber: "#F7C948",
  violet: "#8b6dff",
  jade: "#17c77f",
  rose: "#ff4d6d",
};

export function AdCreativeBuilder({ value, onChange }: Props) {
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const update = <K extends keyof CreativeSpec>(k: K, v: CreativeSpec[K]) =>
    onChange({ ...value, [k]: v });

  const pctNum = useMemo(
    () => (value.priceChangePct == null ? "" : String(value.priceChangePct)),
    [value.priceChangePct]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
      {/* ── Form column ─────────────────────────────────────────── */}
      <div className="space-y-6 min-w-0">
        {/* Templates */}
        <Fieldset label="Template">
          <div className="grid grid-cols-2 gap-2">
            {CreativeTemplates.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update("template", t)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border px-3 py-3 text-left transition-all",
                  value.template === t
                    ? "border-[color:var(--amber-400)] bg-[color:var(--amber-400)]/5"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-600"
                )}
              >
                <div className="text-sm font-bold text-white">
                  {TEMPLATE_BLURBS[t].label}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                  {TEMPLATE_BLURBS[t].hint}
                </div>
                {value.template === t && (
                  <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[color:var(--amber-400)]" />
                )}
              </button>
            ))}
          </div>
        </Fieldset>

        {/* Accent */}
        <Fieldset label="Accent">
          <div className="flex gap-2">
            {CreativeAccents.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => update("accent", a)}
                className={cn(
                  "h-9 w-9 rounded-full ring-offset-2 ring-offset-black transition-all",
                  value.accent === a ? "ring-2 ring-white scale-110" : "ring-1 ring-zinc-700"
                )}
                style={{ background: ACCENT_SWATCH[a] }}
                aria-label={a}
              />
            ))}
          </div>
        </Fieldset>

        {/* Copy */}
        <Fieldset label="Kicker (overline)">
          <Field
            value={value.kicker ?? ""}
            onChange={(v) => update("kicker", v || undefined)}
            placeholder="SPONSORED · MARKET REPORT"
            maxLength={32}
          />
        </Fieldset>

        <Fieldset label="Headline" required>
          <Field
            value={value.headline}
            onChange={(v) => update("headline", v)}
            placeholder="The 1999 shadowless is moving."
            maxLength={80}
          />
        </Fieldset>

        <Fieldset label="Subhead">
          <Field
            as="textarea"
            rows={2}
            value={value.subhead ?? ""}
            onChange={(v) => update("subhead", v || undefined)}
            placeholder="A short, honest sentence about the offer."
            maxLength={120}
          />
        </Fieldset>

        <Fieldset label="CTA button">
          <Field
            value={value.ctaLabel}
            onChange={(v) => update("ctaLabel", v)}
            placeholder="Shop now"
            maxLength={24}
          />
        </Fieldset>

        {/* Featured card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Fieldset label="Card image URL">
            <Field
              value={value.cardImage ?? ""}
              onChange={(v) => update("cardImage", v || undefined)}
              placeholder="https://…"
            />
          </Fieldset>

          <Fieldset label="Card name">
            <Field
              value={value.cardName ?? ""}
              onChange={(v) => update("cardName", v || undefined)}
              placeholder="Charizard — Base Set Shadowless"
              maxLength={60}
            />
          </Fieldset>
        </div>

        {/* Numbers */}
        <div className="grid grid-cols-2 gap-4">
          <Fieldset label="Price (USD)">
            <Field
              type="number"
              min="0"
              step="1"
              value={value.price != null ? String(value.price) : ""}
              onChange={(v) => update("price", v === "" ? undefined : Number(v))}
              placeholder="2400"
            />
          </Fieldset>
          <Fieldset label="30d change (%)">
            <Field
              type="number"
              step="0.1"
              value={pctNum}
              onChange={(v) =>
                update("priceChangePct", v === "" ? undefined : Number(v))
              }
              placeholder="18.3"
            />
          </Fieldset>
        </div>

        {value.template === "ribbon" && (
          <Fieldset label="Ribbon label">
            <Field
              value={value.ribbonLabel ?? ""}
              onChange={(v) => update("ribbonLabel", v || undefined)}
              placeholder="GRAIL MOMENT"
              maxLength={24}
            />
          </Fieldset>
        )}

        {/* Mobile-only preview toggle */}
        <button
          type="button"
          onClick={() => setMobilePreviewOpen(true)}
          className="lg:hidden w-full rounded-full border border-zinc-700 bg-zinc-900 py-3 text-sm font-semibold text-white"
        >
          Preview creative
        </button>
      </div>

      {/* ── Preview column ─────────────────────────────────────── */}
      <div className="hidden lg:block">
        <div className="sticky top-6 space-y-3">
          <div className="kicker-mute">LIVE PREVIEW</div>
          <div className="relative w-full max-w-[300px] aspect-[9/16] overflow-hidden rounded-[28px] ring-1 ring-zinc-700 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
            <AdCreative spec={value} />
          </div>
          <p className="text-[11px] text-zinc-500 leading-snug">
            Rendered inline — no media upload, always crisp at any screen size.
          </p>
        </div>
      </div>

      {/* Mobile preview sheet */}
      {mobilePreviewOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setMobilePreviewOpen(false)}
        >
          <div
            className="relative w-full max-w-[320px] aspect-[9/16] overflow-hidden rounded-[28px] ring-1 ring-zinc-700"
            onClick={(e) => e.stopPropagation()}
          >
            <AdCreative spec={value} />
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="absolute top-3 right-3 rounded-full bg-black/60 text-white px-3 py-1 text-xs font-bold z-20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Tiny form primitives
// ───────────────────────────────────────────────────────────────

function Fieldset({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.16em]">
        {label}
        {required && <span className="text-[color:var(--amber-400)] ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}

interface FieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  type?: string;
  min?: string | number;
  step?: string | number;
  as?: "input" | "textarea";
  rows?: number;
}

function Field({
  value,
  onChange,
  placeholder,
  maxLength,
  type = "text",
  min,
  step,
  as = "input",
  rows = 3,
}: FieldProps) {
  const className =
    "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-[color:var(--amber-400)] focus:outline-none transition-colors";
  if (as === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className={className}
      />
    );
  }
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      min={min}
      step={step}
      className={className}
    />
  );
}
