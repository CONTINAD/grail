import { useId } from "react";

interface Props {
  /** Single character / short monogram */
  initial: string;
  size?: number;
  /** Tones available */
  tone?: "amber" | "jade" | "violet" | "rose" | "ink";
  /** Optional ring text — handle or city, struck around the rim */
  ringTop?: string;
  ringBottom?: string;
  className?: string;
}

const TONES: Record<NonNullable<Props["tone"]>, [string, string, string]> = {
  amber:  ["#FFE8A0", "#F7C948", "#7a4d00"],
  jade:   ["#bfffe0", "#5ae5a0", "#0a6e44"],
  violet: ["#e7defe", "#b79dff", "#3f2a8a"],
  rose:   ["#ffd6df", "#ff7e94", "#7a1e30"],
  ink:    ["#cccccc", "#5a5a64", "#0a0a0c"],
};

/**
 * MemberMedallion — a struck-coin avatar.
 *
 *   Outer dotted bezel  ·  engraved ring text  ·  inset field with monogram.
 *
 * Used wherever a person needs a sigil — voices, leaderboard rows, trade
 * partner cards, profile chips. Replaces the old flat letter-on-color
 * circle, which read as a placeholder.
 */
export function MemberMedallion({
  initial,
  size = 64,
  tone = "amber",
  ringTop,
  ringBottom,
  className,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const [light, mid, deep] = TONES[tone];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <defs>
        {/* Coin face */}
        <radialGradient id={`face-${uid}`} cx="32%" cy="22%" r="78%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.45" stopColor={mid} />
          <stop offset="1" stopColor={deep} />
        </radialGradient>
        <radialGradient id={`field-${uid}`} cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="#1a1208" />
          <stop offset="1" stopColor="#0b0b0d" />
        </radialGradient>
        {/* Top gloss */}
        <linearGradient id={`gloss-${uid}`} x1="0" y1="0" x2="0" y2="100">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <path id={`top-${uid}`} d="M 50,50 m -42,0 a 42,42 0 1,1 84,0" />
        <path id={`bot-${uid}`} d="M 50,50 m -42,0 a 42,42 0 1,0 84,0" />
        <clipPath id={`clip-${uid}`}>
          <circle cx="50" cy="50" r="49" />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip-${uid})`}>
        {/* Coin */}
        <circle cx="50" cy="50" r="49" fill={`url(#face-${uid})`} />

        {/* Outer engraved rings */}
        <circle cx="50" cy="50" r="47" fill="none" stroke={deep} strokeOpacity="0.7" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="44" fill="none" stroke={deep} strokeOpacity="0.45" strokeWidth="0.4" />

        {/* Ring text */}
        {ringTop && (
          <text
            fontFamily="Fraunces, Georgia, serif"
            fontWeight="700"
            fontSize="5.5"
            fill={deep}
            letterSpacing="2.2"
          >
            <textPath href={`#top-${uid}`} startOffset="50%" textAnchor="middle">
              {ringTop}
            </textPath>
          </text>
        )}
        {ringBottom && (
          <text
            fontFamily="Fraunces, Georgia, serif"
            fontWeight="700"
            fontSize="5"
            fill={deep}
            letterSpacing="3.2"
          >
            <textPath href={`#bot-${uid}`} startOffset="50%" textAnchor="middle">
              {ringBottom}
            </textPath>
          </text>
        )}

        {/* Bezel dot pattern */}
        {Array.from({ length: 32 }).map((_, i) => {
          const a = (i * 360) / 32;
          const r = 41;
          const x = 50 + Math.cos((a * Math.PI) / 180) * r;
          const y = 50 + Math.sin((a * Math.PI) / 180) * r;
          return <circle key={i} cx={x} cy={y} r="0.45" fill={deep} opacity="0.6" />;
        })}

        {/* Inner sunken field */}
        <circle cx="50" cy="50" r="34" fill={`url(#field-${uid})`} />
        <circle cx="50" cy="50" r="34" fill="none" stroke={deep} strokeWidth="0.6" strokeOpacity="0.7" />
        <circle cx="50" cy="50" r="34" fill="none" stroke={light} strokeWidth="0.4" strokeOpacity="0.4" transform="translate(0 0.5)" />

        {/* Inner amber glow behind the initial */}
        <circle
          cx="50"
          cy="50"
          r="24"
          fill={mid}
          opacity="0.18"
        />

        {/* Monogram initial */}
        <text
          x="50"
          y="58"
          fontFamily="Fraunces, Georgia, serif"
          fontWeight="700"
          fontSize="32"
          textAnchor="middle"
          fill={light}
          fontStyle="italic"
        >
          {initial}
        </text>

        {/* Top edge gloss */}
        <circle cx="50" cy="50" r="49" fill={`url(#gloss-${uid})`} opacity="0.55" />
      </g>

      {/* Outer rim */}
      <circle cx="50" cy="50" r="49" fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="0.7" />
      <circle cx="50" cy="50" r="49.4" fill="none" stroke={light} strokeOpacity="0.7" strokeWidth="0.4" />
    </svg>
  );
}
