import { useId } from "react";

interface Props {
  size?: number;
  /** "compact" = coin only, no ring text. "full" = ring text + laurels. */
  variant?: "compact" | "full";
  /** "amber" = warm gold, "ink" = burnished black, "ghost" = outline */
  tone?: "amber" | "ink" | "ghost";
  className?: string;
  /** Below-chalice ordinal — defaults to "I". Pass "" to suppress. */
  ordinal?: string;
}

/**
 * GrailCrest — the brand mark, drawn as a struck-coin emblem.
 *
 *   ┌── thin outer ring (engraved)
 *   │   ┌── ring text band ("GRAIL · TRADING FLOOR · EST. MMXXVI")
 *   │   │   ┌── inner sunburst field
 *   │   │   │   ┌── chalice (with foot, stem, bowl, gloss)
 *   │   │   │   │   ┌── ordinal numeral struck below
 *   │   │   │   │   │   ┌── pair of laurel sprigs flanking
 *
 * `compact` strips the ring text + laurels for use in chrome (navbars,
 * favicons). `full` is for hero / colophon use.
 */
export function GrailCrest({
  size = 96,
  variant = "full",
  tone = "amber",
  className,
  ordinal = "I",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const showRing = variant === "full";

  const isGhost = tone === "ghost";
  const isInk = tone === "ink";

  // Palette
  const gold0 = isInk ? "#1a0f00" : "#FFE8A0";
  const gold1 = isInk ? "#2a1a00" : "#F7C948";
  const gold2 = isInk ? "#0a0700" : "#B07C0B";
  const fieldDark = "#0b0b0d";
  const fieldGlow = "rgba(247, 201, 72, 0.30)";
  const inkChalice = isGhost ? "transparent" : isInk ? "#0a0700" : "#1a0f00";
  const ringTextColor = isGhost ? "#F7C948" : isInk ? "#1a0f00" : "#1a0f00";

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        {/* Coin face — radial gold with gloss top-left, dark bottom-right */}
        <radialGradient id={`face-${uid}`} cx="32%" cy="22%" r="78%">
          <stop offset="0" stopColor={gold0} />
          <stop offset="0.42" stopColor={gold1} />
          <stop offset="1" stopColor={gold2} />
        </radialGradient>

        {/* Inner field for sunburst */}
        <radialGradient id={`field-${uid}`} cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="#1a1208" />
          <stop offset="0.55" stopColor="#0d0905" />
          <stop offset="1" stopColor={fieldDark} />
        </radialGradient>

        {/* Chalice ink — top-bright, bottom-deep */}
        <linearGradient id={`chalice-${uid}`} x1="100" y1="55" x2="100" y2="155">
          <stop offset="0" stopColor={isInk ? "#000" : "#3a2300"} />
          <stop offset="1" stopColor={inkChalice} />
        </linearGradient>

        {/* Sunrays */}
        <linearGradient id={`ray-${uid}`} x1="100" y1="100" x2="100" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F7C948" stopOpacity="0" />
          <stop offset="0.3" stopColor="#F7C948" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FFE8A0" stopOpacity="0.55" />
        </linearGradient>

        {/* Top-light gloss for the coin edge */}
        <linearGradient id={`gloss-${uid}`} x1="0" y1="0" x2="0" y2="200">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* The path the ring text follows — counter-clockwise above */}
        <path
          id={`ring-top-${uid}`}
          d="M 100,100 m -82,0 a 82,82 0 1,1 164,0"
        />
        <path
          id={`ring-bottom-${uid}`}
          d="M 100,100 m -82,0 a 82,82 0 1,0 164,0"
        />

        {/* Coin edge clip */}
        <clipPath id={`coin-clip-${uid}`}>
          <circle cx="100" cy="100" r="98" />
        </clipPath>
      </defs>

      {/* GHOST mode: just outline, simple */}
      {isGhost ? (
        <>
          <circle cx="100" cy="100" r="92" stroke="#F7C948" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="68" stroke="#F7C948" strokeWidth="0.8" strokeOpacity="0.4" />
          <ChaliceShape uid={uid} fill="none" stroke="#F7C948" strokeWidth={2} />
        </>
      ) : (
        <g clipPath={`url(#coin-clip-${uid})`}>
          {/* Coin face */}
          <circle cx="100" cy="100" r="98" fill={`url(#face-${uid})`} />

          {/* Outer engraved ring */}
          <circle cx="100" cy="100" r="96" fill="none" stroke={gold2} strokeWidth="0.6" strokeOpacity="0.6" />
          <circle cx="100" cy="100" r="92" fill="none" stroke={gold0} strokeWidth="0.6" strokeOpacity="0.5" />

          {/* Ring text band — only in full variant */}
          {showRing && (
            <>
              <circle cx="100" cy="100" r="86" fill="none" stroke={gold2} strokeWidth="0.4" strokeOpacity="0.45" />
              <text
                fontFamily="Fraunces, Georgia, serif"
                fontWeight="700"
                fontSize="9"
                fill={ringTextColor}
                letterSpacing="3.6"
                textRendering="geometricPrecision"
              >
                <textPath href={`#ring-top-${uid}`} startOffset="50%" textAnchor="middle">
                  GRAIL · TRADING FLOOR · MMXXVI
                </textPath>
              </text>
              {/* Bottom ring decorative dots */}
              <text
                fontFamily="Fraunces, Georgia, serif"
                fontWeight="700"
                fontSize="9"
                fill={ringTextColor}
                letterSpacing="6"
                textRendering="geometricPrecision"
              >
                <textPath href={`#ring-bottom-${uid}`} startOffset="50%" textAnchor="middle">
                  ✦  ✦  ✦  ✦  ✦
                </textPath>
              </text>
              {/* Inner ring */}
              <circle cx="100" cy="100" r="78" fill="none" stroke={gold2} strokeWidth="0.5" strokeOpacity="0.5" />
            </>
          )}

          {/* Inner field — dark plate where chalice + sunrays sit */}
          <circle cx="100" cy="100" r={showRing ? 70 : 86} fill={`url(#field-${uid})`} />
          <circle cx="100" cy="100" r={showRing ? 70 : 86} fill="none" stroke={gold2} strokeWidth="0.6" strokeOpacity="0.7" />

          {/* Sunrays radiating from behind the chalice */}
          <g transform={`translate(100 100)`} opacity="0.85">
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i * 360) / 24;
              return (
                <path
                  key={i}
                  d={`M -1.6 -10 L 1.6 -10 L 0.6 -${showRing ? 64 : 80} L -0.6 -${showRing ? 64 : 80} Z`}
                  fill={`url(#ray-${uid})`}
                  transform={`rotate(${a})`}
                />
              );
            })}
          </g>

          {/* Inner glow halo */}
          <circle cx="100" cy="100" r="38" fill={fieldGlow} opacity="0.65" />

          {/* Laurel sprigs flanking — full variant only */}
          {showRing && (
            <>
              <Laurel uid={uid + "L"} cx={48} cy={140} side="left" tone={gold0} />
              <Laurel uid={uid + "R"} cx={152} cy={140} side="right" tone={gold0} />
            </>
          )}

          {/* The chalice — heart of the emblem */}
          <g transform="translate(0,0)">
            <ChaliceShape uid={uid} fill={`url(#chalice-${uid})`} />
            {/* Chalice gloss */}
            <path
              d="M 78 70 Q 80 95 92 108 L 92 116 Q 75 102 72 78 Z"
              fill="#fff7d8"
              opacity="0.18"
            />
          </g>

          {/* Ordinal numeral struck below the chalice */}
          {ordinal && (
            <g transform="translate(100 162)">
              <line x1="-18" y1="0" x2="-7" y2="0" stroke={gold0} strokeWidth="0.7" opacity="0.6" />
              <line x1="7" y1="0" x2="18" y2="0" stroke={gold0} strokeWidth="0.7" opacity="0.6" />
              <text
                fontFamily="Fraunces, Georgia, serif"
                fontStyle="italic"
                fontWeight="600"
                fontSize="14"
                textAnchor="middle"
                dominantBaseline="middle"
                fill={inkChalice}
              >
                {ordinal}
              </text>
            </g>
          )}

          {/* Top edge gloss */}
          <circle cx="100" cy="100" r="98" fill={`url(#gloss-${uid})`} opacity="0.55" />

          {/* Subtle inner shadow at bottom for depth */}
          <ellipse cx="100" cy="180" rx="80" ry="14" fill="#000" opacity="0.25" />
        </g>
      )}

      {/* Outer rim shadow ring (lives outside clip) */}
      {!isGhost && (
        <>
          <circle cx="100" cy="100" r="98" fill="none" stroke="#000" strokeOpacity="0.3" strokeWidth="1" />
          <circle cx="100" cy="100" r="98.5" fill="none" stroke={gold0} strokeOpacity="0.65" strokeWidth="0.5" />
        </>
      )}
    </svg>
  );
}

/** The chalice silhouette — re-extracted at coin scale (200×200 viewBox, centered). */
function ChaliceShape({
  uid,
  fill,
  stroke,
  strokeWidth,
}: {
  uid: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  return (
    <path
      key={uid}
      d="
        M 70 56
        L 130 56
        Q 130 58 129.5 60
        Q 127 92 105 108
        L 105 138
        L 130 138
        Q 132 138 132 141
        L 132 152
        Q 132 156 128 156
        L 72 156
        Q 68 156 68 152
        L 68 141
        Q 68 138 70 138
        L 95 138
        L 95 108
        Q 73 92 70.5 60
        Q 70 58 70 56 Z
      "
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

/** A small olive/laurel sprig — five paired leaves around a curved stem. */
function Laurel({
  uid,
  cx,
  cy,
  side,
  tone,
}: {
  uid: string;
  cx: number;
  cy: number;
  side: "left" | "right";
  tone: string;
}) {
  const flip = side === "left" ? 1 : -1;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${flip} 1)`}>
      {/* Stem */}
      <path
        d="M 0 0 Q -6 -10 -10 -22 Q -12 -32 -8 -42"
        fill="none"
        stroke={tone}
        strokeWidth="1.1"
        strokeOpacity="0.85"
      />
      {/* Leaves */}
      {[
        { x: -3, y: -6, rot: -38, len: 8 },
        { x: -7, y: -16, rot: -50, len: 8 },
        { x: -10, y: -26, rot: -62, len: 7 },
        { x: -10, y: -36, rot: -78, len: 6.5 },
      ].map((L, i) => (
        <g key={`${uid}-${i}`} transform={`translate(${L.x} ${L.y}) rotate(${L.rot})`}>
          <ellipse rx={L.len} ry={2.2} cx={L.len * 0.6} cy={0} fill={tone} opacity="0.75" />
          <ellipse rx={L.len} ry={2.2} cx={-L.len * 0.6} cy={0} fill={tone} opacity="0.75" />
        </g>
      ))}
      {/* Berry */}
      <circle cx={-6} cy={-3} r="1.4" fill={tone} opacity="0.95" />
    </g>
  );
}
