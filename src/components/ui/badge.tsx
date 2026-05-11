import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-zinc-800 text-zinc-300 border border-zinc-700",
        primary: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
        success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        warning: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
        danger:  "bg-red-500/10 text-red-400 border border-red-500/20",
        info:    "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
