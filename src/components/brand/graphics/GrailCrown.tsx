import { useId } from "react";

interface Props {
  size?: number;
  className?: string;
}

/**
 * Stylised crown used for "grail-tier" badges in creatives. Five
 * merlons, centre gem, soft inner shadow, amber gradient.
 */
export function GrailCrown({ size = 64, className }: Props) {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 64 48"
      width={size}
      height={(size * 48) / 64}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`c-${uid}`} x1="0" y1="0" x2="0" y2="48">
          <stop offset="0" stopColor="#FFE8A0" />
          <stop offset="0.55" stopColor="#F7C948" />
          <stop offset="1" stopColor="#8a5e06" />
        </linearGradient>
      </defs>
      <path
        d="
          M4 40
          L6 14
          L18 26
          L24 8
          L32 22
          L40 8
          L46 26
          L58 14
          L60 40
          Z
        "
        fill={`url(#c-${uid})`}
        stroke="#8a5e06"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <rect x="4" y="38" width="56" height="6" rx="2" fill="#8a5e06" />
      <rect x="4" y="38" width="56" height="2" fill="white" fillOpacity="0.3" />
      {/* Centre gem */}
      <circle cx="32" cy="34" r="3.2" fill="#ff4d6d" />
      <circle cx="32" cy="33" r="1.4" fill="white" fillOpacity="0.7" />
      {/* Side pearls */}
      <circle cx="14" cy="34" r="2" fill="#FFE8A0" />
      <circle cx="50" cy="34" r="2" fill="#FFE8A0" />
      {/* Peak highlight */}
      <path
        d="M24 10 L25 18 M40 10 L39 18"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
