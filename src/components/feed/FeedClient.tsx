"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FeedItem } from "@/lib/feed";
import { FeedCard } from "./FeedCard";
import { FeedSkeleton } from "./FeedSkeleton";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "foryou" | "following";

interface Props {
  initialItems: FeedItem[];
  viewerId: string | null;
}

export function FeedClient({ initialItems, viewerId }: Props) {
  const [mode, setMode] = useState<Mode>("foryou");
  const [items, setItems] = useState<FeedItem[]>(initialItems);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);

  // Intersection observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActiveIdx(idx);
          }
        }
      },
      { root: container, threshold: [0.6] }
    );

    container.querySelectorAll("[data-idx]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  // Switch modes → fresh fetch
  const switchMode = useCallback(
    async (next: Mode) => {
      if (next === mode) return;
      setMode(next);
      setLoading(true);
      setActiveIdx(0);
      try {
        const res = await fetch(`/api/feed?mode=${next}&limit=20`);
        const data: { items: FeedItem[] } = await res.json();
        setItems(data.items);
        containerRef.current?.scrollTo({ top: 0 });
      } finally {
        setLoading(false);
      }
    },
    [mode]
  );

  // Infinite scroll
  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    try {
      const res = await fetch(`/api/feed?mode=${mode}&limit=20`);
      const data: { items: FeedItem[] } = await res.json();
      setItems((cur) => [...cur, ...data.items]);
    } finally {
      loadingMoreRef.current = false;
    }
  }, [mode]);

  useEffect(() => {
    if (items.length - activeIdx < 4) loadMore();
  }, [activeIdx, items.length, loadMore]);

  const scrollTo = useCallback((idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(`[data-idx="${idx}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        scrollTo(Math.min(activeIdx + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        scrollTo(Math.max(activeIdx - 1, 0));
      } else if (e.key === " ") {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("feed-toggle-play"));
      } else if (e.key === "m") {
        document.dispatchEvent(new CustomEvent("feed-toggle-mute"));
      } else if (e.key === "l") {
        document.dispatchEvent(new CustomEvent("feed-like-active"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, items.length, scrollTo]);

  return (
    <>
      {/* ── Top tabs overlay ─────────────────────────────────── */}
      <div className="fixed md:top-20 top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-8 text-[13px] font-bold tracking-tight select-none">
        {(["foryou", "following"] as const).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={cn(
              "relative py-1 transition-colors",
              mode === m
                ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                : "text-white/60 hover:text-white/90"
            )}
          >
            {m === "foryou" ? "For You" : "Following"}
            {mode === m && (
              <motion.span
                layoutId="feed-tab-indicator"
                className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 h-0.5 w-6 rounded-full bg-[color:var(--amber-400)]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="fixed inset-0 overflow-y-auto snap-y snap-mandatory bg-black md:pt-16 pb-20 md:pb-0"
        style={{ scrollBehavior: "smooth" }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-[100dvh] flex items-center justify-center"
            >
              <FeedSkeleton />
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-[100dvh] flex items-center justify-center text-center px-6"
            >
              <div className="max-w-sm space-y-4">
                <p className="text-5xl">💤</p>
                <h2 className="text-xl font-bold text-white">
                  {mode === "following" ? "Follow some traders" : "No posts yet"}
                </h2>
                <p className="text-white/60 text-sm">
                  {mode === "following"
                    ? "Tap Discover to find traders to follow — their posts will show up here."
                    : "Be the first to post — share your mail days, pack openings, or wants."}
                </p>
                <div className="flex items-center justify-center gap-2">
                  {mode === "following" ? (
                    <a
                      href="/discover"
                      className="inline-flex rounded-full bg-yellow-400 text-black px-5 py-2.5 text-sm font-bold"
                    >
                      Find people
                    </a>
                  ) : viewerId ? (
                    <a
                      href="/post/new"
                      className="inline-flex rounded-full bg-yellow-400 text-black px-5 py-2.5 text-sm font-bold"
                    >
                      Create a post
                    </a>
                  ) : (
                    <a
                      href="/auth/sign-in"
                      className="inline-flex rounded-full bg-yellow-400 text-black px-5 py-2.5 text-sm font-bold"
                    >
                      Sign in to post
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {items.map((item, idx) => (
                <div
                  key={`${mode}-${item.kind}-${item.id}-${idx}`}
                  data-idx={idx}
                  className="snap-start h-[calc(100dvh-5rem)] md:h-[calc(100dvh-4rem)] w-full"
                >
                  <FeedCard
                    item={item}
                    isActive={idx === activeIdx}
                    viewerId={viewerId}
                  />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop up/down arrows */}
      {items.length > 0 && !loading && (
        <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-2">
          <button
            onClick={() => scrollTo(Math.max(activeIdx - 1, 0))}
            disabled={activeIdx === 0}
            className="h-11 w-11 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollTo(Math.min(activeIdx + 1, items.length - 1))}
            className="h-11 w-11 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Keyboard hint */}
      <div className="hidden md:block fixed bottom-6 left-6 z-30 text-xs text-white/40 pointer-events-none font-mono">
        ↑↓ navigate · space pause · m mute · l like
      </div>
    </>
  );
}
