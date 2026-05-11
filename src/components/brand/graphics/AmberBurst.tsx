import { useId } from "react";

interface Props {
  size?: number;
  intensity?: "soft" | "bold";
  accent?: "amber" | "violet" | "jade" | "rose";
  className?: string;
}

const ACCENT_COLORS: Record<NonNullable<Props["accent"]>, [string, string]> = {
  amber: ["#FFE8A0", "#E8A317"],
  violet: ["#d8ccff", "#8b6dff"],
  jade: ["#a7f3d0", "#17c77f"],
  rose: ["#ffc8d4", "#ff4d6d"],
};

/**
 * Radial sunburst with concentric rings and a soft halo. Sits behind
 * product shots in hero/ad placements to focus the eye without the
 * banding you get from pure radial gradients.
 */
export function AmberBurst({
  size = 400,
  intensity = "soft",
  accent = "amber",
  className,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const [light, deep] = ACCENT_COLORS[accent];
  const rayAlpha = intensity === "bold" ? 0.32 : 0.18;
  const haloAlpha = intensity === "bold" ? 0.55 : 0.35;

  const rays = Array.from({ length: 24 }, (_, i) => (i * 360) / 24);

  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id={`halo-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={light} stopOpacity={haloAlpha} />
          <stop offset="55%" stopColor={deep} stopOpacity={haloAlpha * 0.35} />
          <stop offset="100%" stopColor={deep} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`ray-${uid}`} x1="200" y1="200" x2="200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={light} stopOpacity="0" />
          <stop offset="0.5" stopColor={light} stopOpacity={rayAlpha * 0.6} />
          <stop offset="1" stopColor={light} stopOpacity={rayAlpha} />
        </linearGradient>
        <mask id={`mask-${uid}`}>
          <circle cx="200" cy="200" r="200" fill="white" />
        </mask>
      </defs>
      <circle cx="200" cy="200" r="200" fill={`url(#halo-${uid})`} />
      <g mask={`url(#mask-${uid})`} opacity={intensity === "bold" ? 0.9 : 0.7}>
        {rays.map((deg, i) => (
          <path
            key={i}
            d="M200 200 L196 -20 L204 -20 Z"
            fill={`url(#ray-${uid})`}
            transform={`rotate(${deg} 200 200)`}
          />
        ))}
      </g>
      {/* thin ring */}
      <circle
        cx="200"
        cy="200"
        r="150"
        fill="none"
        stroke={deep}
        strokeOpacity="0.25"
        strokeDasharray="2 6"
      />
      <circle
        cx="200"
        cy="200"
        r="82"
        fill="none"
        stroke={light}
        strokeOpacity="0.35"
      />
    </svg>
  );
}
