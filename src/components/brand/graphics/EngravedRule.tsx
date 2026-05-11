interface Props {
  /** Pixel width — defaults to 100% via CSS, but can be capped */
  width?: number | string;
  /** Center ornament style */
  ornament?: "diamond" | "chalice" | "dot" | "star";
  className?: string;
}

/**
 * EngravedRule — a horizontal divider with a centered ornament.
 *
 *   ─────────────────  ◆  ─────────────────
 *
 * The rule itself is a hairline that fades at the ends, doubled with a
 * thinner amber rule beneath. Used between sections to give the page
 * the feel of a leatherbound book of lots rather than a SaaS landing.
 */
export function EngravedRule({ width = "100%", ornament = "diamond", className }: Props) {
  return (
    <div
      className={`flex items-center gap-4 mx-auto ${className ?? ""}`}
      style={{ width }}
      aria-hidden
    >
      <span className="flex-1 h-px relative">
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(247,201,72,0.45) 30%, rgba(247,201,72,0.65) 100%)",
          }}
        />
        <span
          className="absolute inset-x-0 top-1.5 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(247,201,72,0.18) 50%, rgba(247,201,72,0.32) 100%)",
          }}
        />
      </span>
      <Ornament kind={ornament} />
      <span className="flex-1 h-px relative">
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(247,201,72,0.65) 0%, rgba(247,201,72,0.45) 70%, transparent 100%)",
          }}
        />
        <span
          className="absolute inset-x-0 top-1.5 h-px"
          style={{
            background:
              "linear-gradient(90deg, rgba(247,201,72,0.32) 0%, rgba(247,201,72,0.18) 50%, transparent 100%)",
          }}
        />
      </span>
    </div>
  );
}

function Ornament({ kind }: { kind: NonNullable<Props["ornament"]> }) {
  if (kind === "chalice") {
    return (
      <svg viewBox="0 0 40 40" width={26} height={26} fill="none" aria-hidden>
        <path
          d="M12 6.5 L28 6.5 Q28 7 27.8 7.6 Q27.2 15.5 22 19 L22 27 L27 27 Q27.5 27 27.5 28 L27.5 30.5 Q27.5 31.5 26.5 31.5 L13.5 31.5 Q12.5 31.5 12.5 30.5 L12.5 28 Q12.5 27 13 27 L18 27 L18 19 Q12.8 15.5 12.2 7.6 Q12 7 12 6.5 Z"
          fill="#F7C948"
        />
      </svg>
    );
  }
  if (kind === "star") {
    return (
      <svg viewBox="0 0 24 24" width={18} height={18} fill="none" aria-hidden>
        <path
          d="M12 2 L13.6 9.5 L21 11 L13.6 12.5 L12 22 L10.4 12.5 L3 11 L10.4 9.5 Z"
          fill="#F7C948"
        />
      </svg>
    );
  }
  if (kind === "dot") {
    return (
      <span className="flex items-center gap-1.5">
        <span className="h-1 w-1 rounded-full bg-[color:var(--amber-400)]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--amber-400)]" />
        <span className="h-1 w-1 rounded-full bg-[color:var(--amber-400)]" />
      </span>
    );
  }
  // diamond: a rotated square, with two satellite dots
  return (
    <span className="flex items-center gap-2.5">
      <span className="h-1 w-1 rounded-full bg-[color:var(--amber-400)] opacity-70" />
      <span
        className="block h-2.5 w-2.5 rotate-45 bg-[color:var(--amber-400)]"
        style={{ boxShadow: "0 0 12px rgba(247,201,72,0.6)" }}
      />
      <span className="h-1 w-1 rounded-full bg-[color:var(--amber-400)] opacity-70" />
    </span>
  );
}
