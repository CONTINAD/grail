"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdCreativeBuilder } from "@/components/ads/AdCreativeBuilder";
import {
  encodeCreativeSpec,
  type CreativeSpec,
} from "@/lib/ads/creativeSpec";
import { cn } from "@/lib/utils";

type Mode = "design" | "upload";

const DEFAULT_SPEC: CreativeSpec = {
  template: "spotlight",
  accent: "amber",
  kicker: "SPONSORED",
  headline: "Find your grail this week.",
  subhead: "Curated lots, flat fees, and real trades — only on Grail.",
  ctaLabel: "Shop now",
  cardName: "Featured Charizard",
  price: 2400,
  priceChangePct: 18.3,
};

export function AdCreateClient() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("design");
  const [spec, setSpec] = useState<CreativeSpec>(DEFAULT_SPEC);

  const [upload, setUpload] = useState({
    mediaUrl: "",
    mediaType: "video" as "video" | "image",
  });
  const [form, setForm] = useState({
    title: "",
    caption: "",
    ctaLabel: "Learn More",
    ctaUrl: "",
    targetTags: "",
    dailyBudgetUsd: "10",
    cpmUsd: "2.50",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const isDesign = mode === "design";

      if (isDesign && !spec.headline.trim()) {
        throw new Error("Creative needs a headline");
      }
      if (isDesign && !spec.ctaLabel.trim()) {
        throw new Error("Creative needs a CTA label");
      }
      if (!isDesign && !upload.mediaUrl) {
        throw new Error("Media URL is required");
      }
      if (!form.ctaUrl) {
        throw new Error("CTA destination URL is required");
      }

      const body = {
        title: form.title,
        caption: isDesign ? spec.subhead : form.caption || undefined,
        mediaUrl: isDesign ? encodeCreativeSpec(spec) : upload.mediaUrl,
        mediaType: isDesign ? "image" : upload.mediaType,
        ctaLabel: isDesign ? spec.ctaLabel : form.ctaLabel,
        ctaUrl: form.ctaUrl,
        targetTags: form.targetTags
          ? form.targetTags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        dailyBudgetUsd: Number(form.dailyBudgetUsd),
        cpmUsd: Number(form.cpmUsd),
      };
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to create ad");
      }
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 md:px-8 py-8 md:py-14 space-y-10">
      <div>
        <div className="kicker">Advertisers</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 leading-tight">
          Run an ad
        </h1>
        <p className="text-sm text-zinc-400 mt-3 max-w-md">
          Design a creative inside Grail or plug in your own video/image. Ads
          slot between organic posts with a Sponsored badge, deep tag
          targeting, and a tappable CTA.
        </p>
      </div>

      {/* ── Mode toggle ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-1.5 grid grid-cols-2 gap-1">
        <ModeButton
          active={mode === "design"}
          onClick={() => setMode("design")}
          title="Design in-app"
          hint="Template + copy → finished ad"
        />
        <ModeButton
          active={mode === "upload"}
          onClick={() => setMode("upload")}
          title="Upload media"
          hint="Bring your own video or image"
        />
      </div>

      <form onSubmit={submit} className="space-y-7">
        <L label="Campaign title" required>
          <Input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Spring Shadowless push"
          />
        </L>

        {/* ── Creative source ──────────────────────────────────── */}
        {mode === "design" ? (
          <section className="space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Design your creative
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Changes update the preview live. No uploads, always crisp.
              </p>
            </div>
            <AdCreativeBuilder value={spec} onChange={setSpec} />
          </section>
        ) : (
          <section className="space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold">Your media</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Paste a direct URL to your video or image.
              </p>
            </div>

            <div className="flex gap-2">
              {(["video", "image"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setUpload((u) => ({ ...u, mediaType: t }))}
                  className={cn(
                    "flex-1 rounded-xl py-2 text-sm font-semibold border transition-colors",
                    upload.mediaType === t
                      ? "bg-yellow-400 border-yellow-400 text-black"
                      : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  )}
                >
                  {t === "video" ? "Video" : "Image"}
                </button>
              ))}
            </div>

            <L label="Media URL" required>
              <Input
                required
                value={upload.mediaUrl}
                onChange={(e) =>
                  setUpload((u) => ({ ...u, mediaUrl: e.target.value }))
                }
                placeholder="https://…"
              />
            </L>

            <L label="Caption">
              <textarea
                value={form.caption}
                onChange={(e) => update("caption", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-[color:var(--amber-400)] focus:outline-none"
              />
            </L>

            <L label="CTA label">
              <Input
                value={form.ctaLabel}
                onChange={(e) => update("ctaLabel", e.target.value)}
              />
            </L>
          </section>
        )}

        {/* ── Shared: destination + targeting + budget ─────────── */}
        <section className="space-y-5 border-t border-zinc-800 pt-7">
          <h2 className="font-display text-2xl font-bold">
            Destination &amp; delivery
          </h2>

          <L label="CTA destination URL" required>
            <Input
              required
              value={form.ctaUrl}
              onChange={(e) => update("ctaUrl", e.target.value)}
              placeholder="https://…"
            />
          </L>

          <L label="Target tags (comma separated)">
            <Input
              value={form.targetTags}
              onChange={(e) => update("targetTags", e.target.value)}
              placeholder="pokemon, vintage, psa10"
            />
          </L>

          <div className="grid grid-cols-2 gap-3">
            <L label="Daily budget (USD)">
              <Input
                type="number"
                min="1"
                step="1"
                value={form.dailyBudgetUsd}
                onChange={(e) => update("dailyBudgetUsd", e.target.value)}
              />
            </L>
            <L label="CPM (USD)">
              <Input
                type="number"
                min="0.1"
                step="0.1"
                value={form.cpmUsd}
                onChange={(e) => update("cpmUsd", e.target.value)}
              />
            </L>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/5 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Creating…" : "Launch ad"}
        </Button>
      </form>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  title,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl px-4 py-3 text-left transition-all",
        active
          ? "bg-[color:var(--amber-400)] text-black shadow-[0_6px_20px_-8px_rgba(247,201,72,0.6)]"
          : "text-zinc-300 hover:bg-zinc-900"
      )}
    >
      <div className="text-sm font-bold">{title}</div>
      <div className={cn("text-[11px] mt-0.5", active ? "text-black/70" : "text-zinc-500")}>
        {hint}
      </div>
    </button>
  );
}

function L({
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
