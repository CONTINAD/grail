"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Search, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/components/ui/Toaster";
import { GradeBadge } from "@/components/cards/GradeBadge";

const KINDS = [
  { value: "SHOWCASE", label: "Showcase", emoji: "✨" },
  { value: "WANT", label: "Looking for", emoji: "🔎" },
  { value: "PACK_OPEN", label: "Pack open", emoji: "📦" },
  { value: "TRADE_STORY", label: "Trade story", emoji: "🤝" },
];

interface SelectedCard {
  id: string;
  name: string;
  imageSmall: string;
  setName: string;
  marketPrice: number | null;
}

export function PostCreateClient() {
  const router = useRouter();
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"video" | "image">("video");
  const [caption, setCaption] = useState("");
  const [kind, setKind] = useState("SHOWCASE");
  const [tags, setTags] = useState("");
  const [askingPrice, setAskingPrice] = useState("");
  const [card, setCard] = useState<SelectedCard | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [graded, setGraded] = useState(false);
  const [gradeCompany, setGradeCompany] = useState<"PSA" | "BGS" | "CGC" | "SGC">("PSA");
  const [gradeScore, setGradeScore] = useState("10");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaUrl,
          mediaType,
          caption: caption || undefined,
          kind,
          featuredCardId: card?.id,
          featuredCardName: card?.name,
          featuredCardImage: card?.imageSmall,
          featuredGradeCompany: card && graded ? gradeCompany : undefined,
          featuredGradeScore: card && graded ? Number(gradeScore) : undefined,
          askingPrice: askingPrice ? Number(askingPrice) : undefined,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to post");
      }
      toast("Post published", "success");
      router.push("/");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100 mb-6">New post</h1>

      <form onSubmit={submit} className="space-y-6">
        {/* ── Media ─────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <Upload className="h-3.5 w-3.5" />
            Media
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["video", "image"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMediaType(t)}
                className={`rounded-xl py-2.5 text-sm font-semibold border transition-colors ${
                  mediaType === t
                    ? "bg-yellow-400 border-yellow-400 text-black"
                    : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                {t === "video" ? "🎥 Video" : "🖼️ Image"}
              </button>
            ))}
          </div>
          <Input
            required
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://…"
          />
          {mediaUrl && (
            <div className="relative aspect-[9/14] max-h-96 w-full rounded-xl overflow-hidden bg-black">
              {mediaType === "video" ? (
                <video
                  src={mediaUrl}
                  className="h-full w-full object-contain"
                  muted
                  playsInline
                  loop
                  autoPlay
                />
              ) : (
                <img src={mediaUrl} alt="" className="h-full w-full object-contain" />
              )}
            </div>
          )}
        </section>

        {/* ── Caption + kind ────────────────────────────────────── */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            maxLength={2200}
            placeholder="Tell the story…"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {KINDS.map((k) => (
              <button
                type="button"
                key={k.value}
                onClick={() => setKind(k.value)}
                className={`rounded-xl py-2.5 text-xs font-semibold border transition-colors ${
                  kind === k.value
                    ? "bg-yellow-400 border-yellow-400 text-black"
                    : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <span className="mr-1">{k.emoji}</span>
                {k.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Featured card ─────────────────────────────────────── */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Featured card (optional)
          </div>
          {card ? (
            <div className="flex items-center gap-3 rounded-xl bg-zinc-800 p-3">
              <div className="relative h-14 w-10 rounded-md overflow-hidden shrink-0 bg-black">
                <Image
                  src={card.imageSmall}
                  alt={card.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-100 truncate">{card.name}</p>
                <p className="text-xs text-zinc-500 truncate">
                  {card.setName}
                  {card.marketPrice != null && ` · $${card.marketPrice.toFixed(2)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCard(null)}
                className="text-zinc-500 hover:text-zinc-300"
                aria-label="Remove card"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="w-full rounded-xl border-2 border-dashed border-zinc-700 hover:border-yellow-400/40 bg-transparent py-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              + Link a card from the database
            </button>
          )}

          {card && (
            <div className="space-y-3">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                placeholder={`Asking price (default $${card.marketPrice?.toFixed(2) ?? "—"})`}
              />

              {/* Grading */}
              <div className="panel-inset p-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={graded}
                    onChange={(e) => setGraded(e.target.checked)}
                    className="h-4 w-4 rounded border-[color:var(--line)] accent-[color:var(--amber-400)]"
                  />
                  <span className="text-sm font-semibold">This card is graded</span>
                  {graded && (
                    <GradeBadge
                      company={gradeCompany}
                      score={Number(gradeScore) || 0}
                      size="md"
                      className="ml-auto"
                    />
                  )}
                </label>
                {graded && (
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <div className="flex gap-1">
                      {(["PSA", "BGS", "CGC", "SGC"] as const).map((c) => (
                        <button
                          type="button"
                          key={c}
                          onClick={() => setGradeCompany(c)}
                          className={`flex-1 rounded-lg py-2 text-xs font-bold border transition-colors ${
                            gradeCompany === c
                              ? "bg-[color:var(--amber-400)] border-[color:var(--amber-400)] text-black"
                              : "border-[color:var(--line)] text-zinc-300 hover:bg-zinc-800"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      step="0.5"
                      value={gradeScore}
                      onChange={(e) => setGradeScore(e.target.value)}
                      className="w-20 text-center"
                      placeholder="10"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── Tags ──────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags, comma separated (pokemon, mailday, vintage)"
          />
        </section>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting || !mediaUrl}
        >
          {submitting ? "Posting…" : "Publish"}
        </Button>
      </form>

      {pickerOpen && (
        <CardPicker
          onSelect={(c) => {
            setCard(c);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

function CardPicker({
  onSelect,
  onClose,
}: {
  onSelect: (c: SelectedCard) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const debounced = useDebounce(q, 250);
  const [items, setItems] = useState<SelectedCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debounced.length < 2) {
      setItems([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`)
      .then((r) => r.json())
      .then((d) => setItems(d.cards ?? []))
      .finally(() => setLoading(false));
  }, [debounced]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-t-3xl md:rounded-2xl w-full md:w-[500px] max-h-[70dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cards…"
              className="w-full bg-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          {loading && <p className="text-zinc-500 text-sm p-4 text-center">Searching…</p>}
          {!loading && debounced.length >= 2 && items.length === 0 && (
            <p className="text-zinc-500 text-sm p-4 text-center">No matches.</p>
          )}
          {items.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-800 transition-colors text-left"
            >
              <div className="relative h-12 w-9 rounded-md overflow-hidden bg-black shrink-0">
                <Image src={c.imageSmall} alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-100 truncate">{c.name}</p>
                <p className="text-xs text-zinc-500 truncate">
                  {c.setName}
                  {c.marketPrice != null && ` · $${c.marketPrice.toFixed(2)}`}
                </p>
              </div>
              <Check className="h-4 w-4 text-zinc-600" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
