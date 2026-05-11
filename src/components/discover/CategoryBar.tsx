"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function CategoryBar({ active = "pokemon" }: { active?: string }) {
  return (
    <div className="relative -mx-5 md:-mx-10">
      <div className="flex gap-3 overflow-x-auto px-5 md:px-10 pb-2 scrollbar-none [mask-image:linear-gradient(90deg,transparent,black_32px,black_calc(100%-32px),transparent)]">
        {CATEGORIES.map((c) => {
          const isActive = c.id === active;
          return (
            <Link
              key={c.id}
              href={c.live ? `/discover?cat=${c.id}` : "#"}
              className={cn(
                "group relative shrink-0 rounded-2xl px-5 py-3 border transition-all min-w-[180px]",
                isActive
                  ? "border-[color:var(--amber-400)]/40 bg-[color:var(--amber-400)]/10"
                  : "border-[color:var(--line)] bg-[color:var(--ink-900)] hover:border-[color:var(--ink-500)]"
              )}
              aria-disabled={!c.live}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "font-bold text-[14px] tracking-tight",
                        isActive ? "text-[color:var(--amber-400)]" : "text-zinc-100"
                      )}
                    >
                      {c.name}
                    </p>
                    {!c.live && (
                      <span className="kicker-mute text-[9px] tracking-widest rounded-full border border-[color:var(--line)] px-1.5 py-0.5">
                        SOON
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1 max-w-[180px]">
                    {c.tagline}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
