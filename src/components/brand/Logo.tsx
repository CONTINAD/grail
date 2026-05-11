"use client";

import { motion } from "framer-motion";
import { GrailCrest } from "@/components/brand/graphics";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  showEyebrow?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * The Grail mark — the struck-coin GrailCrest with a rotating shine
 * sweep, paired with the wordmark in editorial serif.
 *
 * The crest itself lives in `components/brand/graphics/GrailCrest`. This
 * component just composes it with the wordmark + sheen for use in
 * navbars, footers, and auth chrome.
 */
export function Logo({
  size = 28,
  showWordmark = true,
  showEyebrow = false,
  animated = true,
  className,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ height: size, width: size }}
      >
        <GrailCrest size={size} variant="compact" tone="amber" ordinal="" />

        {animated && (
          <motion.span
            aria-hidden
            className="absolute inset-0 pointer-events-none rounded-full"
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
              mixBlendMode: "overlay",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "130%" }}
            transition={{
              duration: 2.8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 4.5,
            }}
          />
        )}
      </span>
      {showWordmark && (
        <span className="inline-flex items-baseline">
          <span
            className="font-display font-bold tracking-[-0.03em] text-[color:var(--ink-100)]"
            style={{ fontSize: size * 0.62, lineHeight: 1 }}
          >
            Grail
          </span>
          <span
            className="font-display italic tracking-[-0.02em]"
            style={{
              fontSize: size * 0.62,
              lineHeight: 1,
              background:
                "linear-gradient(135deg, #FFE8A0 0%, #F7C948 50%, #CB8A08 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            .
          </span>
          {showEyebrow && (
            <span
              className="kicker-mute ml-3 hidden lg:inline-block"
              style={{ fontSize: size * 0.3 }}
            >
              TRADING FLOOR
            </span>
          )}
        </span>
      )}
    </span>
  );
}
