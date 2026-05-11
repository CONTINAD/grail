import { useId } from "react";

interface Props {
  size?: number;
  className?: string;
  accent?: "amber" | "violet" | "jade";
}

const ACCENTS = {
  amber: { base: "#F7C948", edge: "#CB8A08" },
  violet: { base: "#8b6dff", edge: "#5a42b8" },
  jade: { base: "#17c77f", edge: "#0a8954" },
};

/**
 * Three stacked trading cards on a ⅜ tilt — the silhouette reads at
 * small sizes and picks up the brand amber via accent.
 */
export function CardStackIcon({
  size = 64,
  className,
  accent = "amber",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const { base, edge } = ACCENTS[accent];

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`card-${uid}`} x1="0" y1="0" x2="64" y2="64">
          <stop offset="0" stopColor="#2a2a34" />
          <stop offset="1" stopColor="#101014" />
        </linearGradient>
        <linearGradient id={`accent-${uid}`} x1="0" y1="0" x2="0" y2="64">
          <stop offset="0" stopColor={base} />
          <stop offset="1" stopColor={edge} />
        </linearGradient>
      </defs>

      {/* Back card (faded) */}
      <g transform="translate(8 12) rotate(-10 20 28)">
        <rect width="28" height="40" rx="3" fill="#3d3d4a" opacity="0.55" />
      </g>
      {/* Mid card */}
      <g transform="translate(14 10) rotate(-3 20 28)">
        <rect width="30" height="42" rx="3.5" fill={`url(#card-${uid})`} />
        <rect x="2" y="3" width="26" height="20" rx="2" fill="#1f1f26" />
      </g>
      {/* Front card (amber badge) */}
      <g transform="translate(22 8) rotate(6 20 28)">
        <rect width="32" height="46" rx="4" fill={`url(#card-${uid})`} stroke={base} strokeOpacity="0.4" />
        <rect x="2" y="3" width="28" height="22" rx="2.5" fill={`url(#accent-${uid})`} />
        <circle cx="16" cy="14" r="4" fill="#1a0f00" opacity="0.85" />
        <rect x="4" y="30" width="24" height="2" rx="1" fill="#3d3d4a" />
        <rect x="4" y="35" width="16" height="2" rx="1" fill="#3d3d4a" />
      </g>
    </svg>
  );
}
