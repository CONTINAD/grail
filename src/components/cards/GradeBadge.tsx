import { cn } from "@/lib/utils";

interface GradeBadgeProps {
  company: string | null | undefined;
  score: number | null | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Professional grading badge (PSA / BGS / CGC / SGC).
 * Renders a distinctive chip styled like the real slab labels.
 */
export function GradeBadge({ company, score, size = "md", className }: GradeBadgeProps) {
  if (!company || score == null) return null;

  const COLORS: Record<string, { bg: string; text: string; ring: string }> = {
    PSA: { bg: "bg-[#d4233a]", text: "text-white", ring: "ring-[#d4233a]/40" },
    BGS: { bg: "bg-[#1a3a6c]", text: "text-white", ring: "ring-[#1a3a6c]/40" },
    CGC: { bg: "bg-[#1d8b3a]", text: "text-white", ring: "ring-[#1d8b3a]/40" },
    SGC: { bg: "bg-[#0f6b4a]", text: "text-white", ring: "ring-[#0f6b4a]/40" },
  };

  const brand = COLORS[company.toUpperCase()] ?? {
    bg: "bg-zinc-700",
    text: "text-white",
    ring: "ring-zinc-700/40",
  };

  const sizes = {
    sm: {
      wrap: "text-[10px] h-5",
      label: "px-1.5",
      score: "px-1.5 bg-black/30 font-bold",
    },
    md: {
      wrap: "text-[11px] h-6",
      label: "px-2",
      score: "px-2 bg-black/30 font-bold",
    },
    lg: {
      wrap: "text-sm h-8",
      label: "px-3",
      score: "px-3 bg-black/30 font-bold",
    },
  }[size];

  const isPristine = score >= 10;
  const displayScore =
    score % 1 === 0 ? String(Math.round(score)) : score.toFixed(1);

  return (
    <span
      className={cn(
        "inline-flex items-stretch rounded-sm overflow-hidden font-bold tracking-[0.08em] uppercase ring-1 shadow-sm shrink-0",
        sizes.wrap,
        brand.bg,
        brand.text,
        brand.ring,
        className
      )}
    >
      <span className={cn("inline-flex items-center", sizes.label)}>{company}</span>
      <span className={cn("inline-flex items-center tabular-nums", sizes.score)}>
        {displayScore}
      </span>
      {isPristine && (
        <span className="inline-flex items-center px-1.5 bg-[color:var(--amber-400)] text-black">
          GEM
        </span>
      )}
    </span>
  );
}
