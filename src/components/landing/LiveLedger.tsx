import { ArrowRight } from "lucide-react";
import { RECENT_TRADES } from "@/lib/landingData";

/**
 * Vertical "the floor right now" ledger — feels like watching a
 * trading bell. Doubled for seamless vertical loop.
 */
export function LiveLedger() {
  const items = [...RECENT_TRADES, ...RECENT_TRADES];

  return (
    <div className="relative h-[420px] overflow-hidden rounded-2xl panel-inset">
      <div className="absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[color:var(--ink-850)] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[color:var(--ink-850)] to-transparent pointer-events-none" />

      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--jade-400)] opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--jade-400)]" />
        </span>
        <span className="font-mono text-[10px] font-bold tracking-[0.28em] uppercase text-[color:var(--jade-400)]">
          THE FLOOR · NOW
        </span>
      </div>

      <div className="ledger-track flex flex-col pt-12">
        {items.map((t, i) => (
          <div
            key={`${t.card}-${i}`}
            className="grid grid-cols-[auto,1fr,auto] items-center gap-3 px-4 py-3.5 border-b border-white/[0.04]"
          >
            <span className="font-mono text-[10px] text-zinc-500 tabular-nums">
              {t.minutesAgo.toString().padStart(2, "0")}m
            </span>
            <div className="min-w-0 text-sm">
              <p className="text-white/90 leading-tight truncate font-medium">
                {t.card}
              </p>
              <p className="text-[11px] text-zinc-500 leading-tight mt-0.5 flex items-center gap-1.5">
                <span>{t.fromUser}</span>
                <ArrowRight className="h-3 w-3 text-[color:var(--amber-400)]" />
                <span>{t.toUser}</span>
              </p>
            </div>
            <span className="font-mono text-[12px] font-bold tabular-nums text-[color:var(--amber-400)]">
              ${t.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
