import { useId } from "react";

interface Props {
  label?: string;
  width?: number;
  className?: string;
  tone?: "amber" | "violet" | "jade";
}

const TONES = {
  amber: { top: "#FFE8A0", base: "#F7C948", shadow: "#8a5e06" },
  violet: { top: "#d8ccff", base: "#8b6dff", shadow: "#4b2e9a" },
  jade: { top: "#a7f3d0", base: "#17c77f", shadow: "#0a5a37" },
};

/**
 * A waving banner / trophy ribbon used in hero placements and ad
 * creatives. Decorative serrated ends, gentle fabric curve, gradient
 * fill with underside-shadow on the tails.
 */
export function TrophyRibbon({
  label = "GRAIL MOMENT",
  width = 320,
  className,
  tone = "amber",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const { top, base, shadow } = TONES[tone];
  const h = (width * 72) / 320;

  return (
    <svg
      viewBox="0 0 320 72"
      width={width}
      height={h}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`rib-${uid}`} x1="0" y1="0" x2="0" y2="72">
          <stop offset="0" stopColor={top} />
          <stop offset="0.45" stopColor={base} />
          <stop offset="1" stopColor={shadow} />
        </linearGradient>
      </defs>
      {/* Left tail (under) */}
      <path
        d="M4 56 L0 68 L28 68 L36 58 Z"
        fill={shadow}
        opacity="0.85"
      />
      {/* Right tail (under) */}
      <path
        d="M316 56 L320 68 L292 68 L284 58 Z"
        fill={shadow}
        opacity="0.85"
      />
      {/* Main banner with serrated end */}
      <path
        d="M28 12 Q24 32 28 52 L292 52 Q296 32 292 12 Q160 4 28 12 Z"
        fill={`url(#rib-${uid})`}
      />
      {/* Top highlight */}
      <path
        d="M28 12 Q160 4 292 12 Q160 16 28 20 Z"
        fill="white"
        fillOpacity="0.35"
      />
      {/* Inner stitched line */}
      <path
        d="M34 16 Q160 9 286 16 M34 48 Q160 55 286 48"
        fill="none"
        stroke={shadow}
        strokeOpacity="0.4"
        strokeWidth="0.6"
        strokeDasharray="2 3"
      />
      <text
        x="160"
        y="36"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="14"
        letterSpacing="0.28em"
        fill="#1a0f00"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {label}
      </text>
    </svg>
  );
}
