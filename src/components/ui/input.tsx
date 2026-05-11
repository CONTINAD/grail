import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-xl border bg-[color:var(--ink-850)] border-[color:var(--line)] px-3.5 py-2.5 text-[14px] text-zinc-100 placeholder:text-zinc-500 transition-colors",
              "focus:outline-none focus:border-[color:var(--amber-400)]/60 focus:bg-[color:var(--ink-900)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-10",
              error && "border-[color:var(--rose-500)]/50 focus:border-[color:var(--rose-500)]",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[color:var(--rose-500)]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
