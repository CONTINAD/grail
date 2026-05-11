"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ArrowLeftRight, TrendingUp } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { TradeMatch } from "@/lib/matching";

interface MatchCardProps {
  match: TradeMatch;
  className?: string;
}

export function MatchCard({ match, className }: MatchCardProps) {
  const score = match.matchScore;
  const scoreTier =
    score >= 85
      ? { label: "Elite", color: "text-[color:var(--jade-400)]", ring: "ring-[color:var(--jade-400)]/40" }
      : score >= 70
      ? { label: "Strong", color: "text-[color:var(--amber-400)]", ring: "ring-[color:var(--amber-400)]/40" }
      : score >= 50
      ? { label: "Solid", color: "text-[color:var(--violet-400)]", ring: "ring-[color:var(--violet-400)]/40" }
      : { label: "Starter", color: "text-zinc-400", ring: "ring-zinc-700" };

  const cashLabel =
    match.suggestedCashAmount === 0
      ? "Even trade"
      : match.suggestedCashAmount > 0
      ? `They add ${formatCurrency(match.suggestedCashAmount)}`
      : `You add ${formatCurrency(Math.abs(match.suggestedCashAmount))}`;

  return (
    <div className={cn("panel overflow-hidden hover:border-[color:var(--ink-500)] transition-colors", className)}>
      {/* ── Score strip ──────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--line)] bg-[color:var(--ink-850)]">
        <div className="flex items-center gap-3">
          <div className={cn("relative h-10 w-10 rounded-full overflow-hidden bg-zinc-800 ring-2", scoreTier.ring)}>
            {match.image ? (
              <Image src={match.image} alt="" fill className="object-cover" sizes="40px" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-[color:var(--amber-400)] text-black font-bold">
                {(match.username ?? "?")[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Link href={`/u/${match.userId}`} className="font-bold text-zinc-100 text-sm hover:text-[color:var(--amber-400)]">
              @{match.username ?? "anonymous"}
            </Link>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <Star className="h-3 w-3 fill-[color:var(--amber-400)] text-[color:var(--amber-400)]" />
              <span>{match.averageRating.toFixed(1)}</span>
              <span>·</span>
              <span>{match.completedTrades} trades</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className={cn("font-display text-3xl font-bold tabular-nums leading-none", scoreTier.color)}>
            {score}
          </p>
          <p className="kicker-mute">{scoreTier.label}</p>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="panel-inset px-3 py-3 text-center">
            <p className="font-display text-2xl font-bold text-[color:var(--amber-400)] leading-none">
              {match.theyHaveForYou.length}
            </p>
            <p className="kicker-mute mt-1.5">for you</p>
          </div>
          <ArrowLeftRight className="h-4 w-4 text-zinc-600 shrink-0" />
          <div className="panel-inset px-3 py-3 text-center">
            <p className="font-display text-2xl font-bold text-[color:var(--violet-400)] leading-none">
              {match.youHaveForThem.length}
            </p>
            <p className="kicker-mute mt-1.5">for them</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{cashLabel}</span>
          </div>
          <span className="kicker-mute">
            ${match.estimatedYourValue.toFixed(0)} · ${match.estimatedTheirValue.toFixed(0)}
          </span>
        </div>

        <Link
          href={`/trades/new?with=${match.userId}`}
          className="btn-amber inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[13px]"
        >
          <ArrowLeftRight className="h-4 w-4" />
          Propose trade
        </Link>
      </div>
    </div>
  );
}
