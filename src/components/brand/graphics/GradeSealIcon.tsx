import { useId } from "react";

interface Props {
  size?: number;
  company?: "PSA" | "BGS" | "CGC" | "SGC";
  score?: number;
  className?: string;
}

/**
 * A graded slab silhouette — the universal collectible signal. Used
 * as an eyebrow graphic in ads that feature graded cards.
 */
export function GradeSealIcon({
  size = 96,
  company = "PSA",
  score = 10,
  className,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const isGem = score >= 9.5;

  return (
    <svg
      viewBox="0 0 80 120"
      width={size}
      height={(size * 120) / 80}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`slab-${uid}`} x1="0" y1="0" x2="80" y2="120">
          <stop offset="0" stopColor="#F5F5F7" stopOpacity="0.95" />
          <stop offset="1" stopColor="#c8c8d0" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id={`label-${uid}`} x1="0" y1="0" x2="0" y2="30">
          <stop offset="0" stopColor={isGem ? "#F7C948" : "#2a2a34"} />
          <stop offset="1" stopColor={isGem ? "#CB8A08" : "#0b0b0d"} />
        </linearGradient>
      </defs>
      {/* Slab body */}
      <rect
        x="2"
        y="2"
        width="76"
        height="116"
        rx="6"
        fill={`url(#slab-${uid})`}
        stroke="#FFFFFF"
        strokeOpacity="0.6"
      />
      {/* Label */}
      <rect x="6" y="6" width="68" height="22" rx="3" fill={`url(#label-${uid})`} />
      <text
        x="40"
        y="17"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="8"
        letterSpacing="0.22em"
        fill={isGem ? "#1a0f00" : "#F7C948"}
        textAnchor="middle"
      >
        {company}
      </text>
      <text
        x="40"
        y="25"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="700"
        fontSize="6"
        letterSpacing="0.12em"
        fill={isGem ? "#1a0f00" : "#c8c8d0"}
        textAnchor="middle"
        opacity="0.8"
      >
        CERTIFIED
      </text>
      {/* Window (card visible inside) */}
      <rect x="10" y="34" width="60" height="72" rx="3" fill="#0b0b0d" />
      <rect
        x="13"
        y="37"
        width="54"
        height="66"
        rx="2"
        fill="none"
        stroke="#F7C948"
        strokeOpacity="0.25"
      />
      {/* Big score */}
      <text
        x="40"
        y="80"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="700"
        fontSize="36"
        fill="#F7C948"
        textAnchor="middle"
        letterSpacing="-0.03em"
      >
        {score}
      </text>
      {/* Glass reflection */}
      <path
        d="M2 8 L78 8 L78 22 Q50 32 2 22 Z"
        fill="white"
        fillOpacity="0.08"
      />
    </svg>
  );
}
