import { INDEX_MOVERS } from "@/lib/landingData";

/**
 * Edge-to-edge marquee of market movers — set against a dark band,
 * monospaced numerals, jade/rose for direction. Doubled track for a
 * seamless loop.
 */
export function GrailTicker() {
  const items = [...INDEX_MOVERS, ...INDEX_MOVERS, ...INDEX_MOVERS];
  return (
    <div className="relative overflow-hidden border-y border-[color:var(--line)] bg-[color:var(--ink-900)]">
      <div className="absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[color:var(--ink-900)] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[color:var(--ink-900)] to-transparent pointer-events-none" />

      {/* Leading badge */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-5 pr-4 bg-[color:var(--amber-400)] text-black">
        <span className="font-mono text-[10px] font-bold tracking-[0.28em] uppercase">
          ● LIVE · THE GRAIL INDEX
        </span>
      </div>

      <div className="flex ticker-track py-3.5 pl-[240px]">
        {items.map((m, i) => {
          const isUp = m.pct >= 0;
          return (
            <div
              key={`${m.name}-${i}`}
              className="flex items-center gap-3 px-6 whitespace-nowrap"
            >
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500">
                {String(i % INDEX_MOVERS.length + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-sm text-white tracking-tight">
                {m.name}
              </span>
              <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
                ${m.price.toLocaleString()}
              </span>
              <span
                className="font-mono text-[11px] font-bold tabular-nums"
                style={{
                  color: isUp ? "var(--jade-400)" : "var(--rose-500)",
                }}
              >
                {isUp ? "▲" : "▼"} {Math.abs(m.pct).toFixed(1)}%
              </span>
              <span className="text-zinc-700">·</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
