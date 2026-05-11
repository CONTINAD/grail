import { useId } from "react";

interface Props {
  /** Lot number — usually a roman numeral (I, II, III...) */
  numeral: string;
  /** Grade or short tag rendered in the ribbon */
  ribbon?: string;
  size?: number;
  className?: string;
}

/**
 * LotCrest — a tiny heraldic shield used to title a section.
 *
 *   ╱─────╲          ← crowned top
 *   │  I  │          ← Roman numeral lot number
 *   ╲─────╱          ← shield foot
 *      ▼              ← banner ribbon with grade
 *
 * Used as section tags on the editorial spread (replaces the bare
 * "I · The Cover" eyebrows) and on individual lot cards.
 */
export function LotCrest({ numeral, ribbon, size = 80, className }: Props) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 100 130"
      width={size}
      height={size * 1.3}
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`shield-${uid}`} x1="50" y1="6" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE8A0" />
          <stop offset="0.5" stopColor="#F7C948" />
          <stop offset="1" stopColor="#7a4d00" />
        </linearGradient>
        <linearGradient id={`field-${uid}`} x1="50" y1="14" x2="50" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1a1208" />
          <stop offset="1" stopColor="#0b0b0d" />
        </linearGradient>
        <linearGradient id={`ribbon-${uid}`} x1="0" y1="0" x2="0" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3a2300" />
          <stop offset="1" stopColor="#1a0f00" />
        </linearGradient>
      </defs>

      {/* Shield body */}
      <path
        d="M 12 10 L 88 10 L 88 60 Q 88 88 50 100 Q 12 88 12 60 Z"
        fill={`url(#shield-${uid})`}
        stroke="#7a4d00"
        strokeWidth="0.8"
      />

      {/* Inner field */}
      <path
        d="M 18 16 L 82 16 L 82 60 Q 82 84 50 94 Q 18 84 18 60 Z"
        fill={`url(#field-${uid})`}
        stroke="#7a4d00"
        strokeWidth="0.5"
      />

      {/* Top edge highlight */}
      <path
        d="M 18 17 L 82 17"
        stroke="#FFE8A0"
        strokeWidth="0.6"
        opacity="0.6"
      />

      {/* Numeral */}
      <text
        x="50"
        y="62"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="38"
        textAnchor="middle"
        fill="#F7C948"
      >
        {numeral}
      </text>

      {/* Decorative dots flanking */}
      <circle cx="28" cy="80" r="1.2" fill="#F7C948" opacity="0.6" />
      <circle cx="72" cy="80" r="1.2" fill="#F7C948" opacity="0.6" />

      {/* Ribbon */}
      {ribbon && (
        <g>
          <path
            d="M 14 102 L 86 102 L 80 116 L 86 130 L 14 130 L 20 116 Z"
            fill={`url(#ribbon-${uid})`}
            stroke="#7a4d00"
            strokeWidth="0.6"
          />
          {/* Ribbon notches (back-fold) */}
          <path
            d="M 14 102 L 8 110 L 14 116 Z"
            fill="#1a0f00"
            opacity="0.85"
          />
          <path
            d="M 86 102 L 92 110 L 86 116 Z"
            fill="#1a0f00"
            opacity="0.85"
          />
          <text
            x="50"
            y="120"
            fontFamily="JetBrains Mono, ui-monospace, monospace"
            fontWeight="700"
            fontSize="8"
            textAnchor="middle"
            fill="#F7C948"
            letterSpacing="1.5"
          >
            {ribbon}
          </text>
        </g>
      )}
    </svg>
  );
}
