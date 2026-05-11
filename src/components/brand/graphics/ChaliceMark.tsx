import { useId } from "react";

interface Props {
  size?: number;
  tone?: "amber" | "ink" | "ghost";
  className?: string;
  withPeriod?: boolean;
}

/**
 * The chalice glyph, extracted from Logo so it can be composed inside
 * graphics, ad creatives, and anywhere a flat mark is needed. The tile
 * background lives in the parent — this component renders only the cup.
 */
export function ChaliceMark({
  size = 28,
  tone = "ink",
  className,
  withPeriod = true,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const inkStart = tone === "amber" ? "#6b4200" : "#2a1a00";
  const inkEnd = tone === "amber" ? "#3d2500" : "#0a0700";
  const periodColor = tone === "ghost" ? "#F7C948" : "#1a0f00";
  const strokeColor = tone === "ghost" ? "#F7C948" : "transparent";
  const fill = tone === "ghost" ? "transparent" : `url(#ink-${uid})`;

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`ink-${uid}`} x1="20" y1="4" x2="20" y2="36">
          <stop offset="0" stopColor={inkStart} />
          <stop offset="1" stopColor={inkEnd} />
        </linearGradient>
      </defs>
      <path
        d="M12 6.5 L28 6.5 Q28 7 27.8 7.6 Q27.2 15.5 22 19 L22 27 L27 27 Q27.5 27 27.5 28 L27.5 30.5 Q27.5 31.5 26.5 31.5 L13.5 31.5 Q12.5 31.5 12.5 30.5 L12.5 28 Q12.5 27 13 27 L18 27 L18 19 Q12.8 15.5 12.2 7.6 Q12 7 12 6.5 Z"
        fill={fill}
        stroke={strokeColor}
        strokeWidth={tone === "ghost" ? 1.4 : 0}
      />
      {withPeriod && (
        <circle cx="32.5" cy="32.5" r="2" fill={periodColor} />
      )}
    </svg>
  );
}
