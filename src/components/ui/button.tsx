import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-tight transition-all duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "btn-amber",
        secondary: "btn-ghost",
        ghost:
          "text-zinc-400 hover:text-zinc-100 hover:bg-white/5",
        danger:
          "bg-[color:var(--rose-500)] text-white hover:brightness-110 shadow-[0_8px_24px_-8px_rgba(255,77,109,0.5)]",
        outline:
          "border border-[color:var(--line)] text-zinc-200 hover:border-[color:var(--ink-500)] hover:bg-white/5",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-5 text-[13px]",
        lg: "h-12 px-7 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
