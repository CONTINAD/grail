interface Props {
  size?: number;
  /** "plate" gives the wordmark a struck-nameplate frame; "naked" is just type */
  variant?: "plate" | "naked";
  /** Eyebrow line beneath the name */
  eyebrow?: string;
  className?: string;
}

/**
 * Wordmark — "Grail." set in editorial serif with an italic amber period
 * and an optional engraved-nameplate frame (thin gold rules above and
 * below, plus a centered ornament).
 *
 * Use `variant="plate"` for hero / colophon. Use `variant="naked"` for
 * inline chrome where space is tight.
 */
export function Wordmark({
  size = 72,
  variant = "plate",
  eyebrow = "EST · MMXXVI · TRADING FLOOR",
  className,
}: Props) {
  const isPlate = variant === "plate";
  return (
    <span className={`inline-flex flex-col items-center ${className ?? ""}`} aria-label="Grail">
      {isPlate && (
        <span
          aria-hidden
          className="flex items-center gap-3 mb-2"
          style={{ width: size * 4 }}
        >
          <span
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(247,201,72,0.6) 70%, rgba(247,201,72,0.85))",
            }}
          />
          <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden>
            <path d="M6 0 L8 4 L12 6 L8 8 L6 12 L4 8 L0 6 L4 4 Z" fill="#F7C948" />
          </svg>
          <span
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(247,201,72,0.85), rgba(247,201,72,0.6) 30%, transparent)",
            }}
          />
        </span>
      )}

      <span
        className="font-display font-bold leading-none tracking-[-0.04em] inline-flex items-baseline"
        style={{ fontSize: size }}
      >
        <span
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #f5f5f5 55%, #b3b3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 1px 0 rgba(0,0,0,0.4)",
          }}
        >
          Grail
        </span>
        <span
          className="font-italic-display italic"
          style={{
            background:
              "linear-gradient(135deg, #FFE8A0 0%, #F7C948 50%, #B07C0B 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            marginLeft: -size * 0.04,
          }}
        >
          .
        </span>
      </span>

      {isPlate && (
        <>
          <span
            aria-hidden
            className="h-px mt-2.5"
            style={{
              width: size * 4,
              background:
                "linear-gradient(90deg, transparent, rgba(247,201,72,0.55) 50%, transparent)",
            }}
          />
          {eyebrow && (
            <span
              className="font-mono mt-2.5 text-[color:var(--amber-400)]"
              style={{
                fontSize: Math.max(8, size * 0.13),
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {eyebrow}
            </span>
          )}
        </>
      )}
    </span>
  );
}
