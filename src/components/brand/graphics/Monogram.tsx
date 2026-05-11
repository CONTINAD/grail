import { useId } from "react";

interface Props {
  size?: number;
  className?: string;
  tone?: "amber" | "ghost";
}

/**
 * Large editorial "G." monogram — for hero corners, ad watermarks,
 * and places where the full chalice feels too fussy.
 */
export function Monogram({ size = 120, className, tone = "amber" }: Props) {
  const uid = useId().replace(/:/g, "");
  const isAmber = tone === "amber";

  return (
    <svg
      viewBox="0 0 140 160"
      width={size}
      height={(size * 160) / 140}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`mono-${uid}`} x1="0" y1="0" x2="140" y2="160">
          <stop offset="0" stopColor={isAmber ? "#FFE8A0" : "#e8e8ec"} />
          <stop offset="0.6" stopColor={isAmber ? "#F7C948" : "#9898a5"} />
          <stop offset="1" stopColor={isAmber ? "#8a5e06" : "#3d3d4a"} />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="128"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="700"
        fontSize="160"
        letterSpacing="-0.06em"
        fill={`url(#mono-${uid})`}
      >
        G
      </text>
      <circle
        cx="118"
        cy="128"
        r="10"
        fill={isAmber ? "#F7C948" : "#9898a5"}
      />
    </svg>
  );
}
