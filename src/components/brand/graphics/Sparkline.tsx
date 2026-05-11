interface Props {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
  stroke?: string;
  fill?: boolean;
}

/**
 * Minimal market sparkline — monotone cubic interpolation, optional
 * gradient fill beneath. Used in ads/creatives to signal momentum.
 */
export function Sparkline({
  values,
  width = 240,
  height = 60,
  className,
  stroke = "#5ae5a0",
  fill = true,
}: Props) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 4;
  const step = (width - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (height - pad * 2) * (1 - (v - min) / range);
    return [x, y] as const;
  });

  // Monotone cubic-ish smoothing via simple midpoints
  let path = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    path += ` Q ${cx} ${y0} ${cx} ${(y0 + y1) / 2} T ${x1} ${y1}`;
  }

  const area = `${path} L ${pts[pts.length - 1][0]} ${height - pad} L ${pts[0][0]} ${height - pad} Z`;

  const gradId = `spark-${stroke.replace("#", "")}`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={stroke} stopOpacity="0.4" />
          <stop offset="1" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gradId})`} />}
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      {/* Last-point dot */}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={stroke} />
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="6"
        fill={stroke}
        opacity="0.25"
      />
    </svg>
  );
}
