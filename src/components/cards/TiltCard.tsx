"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import React, { useRef } from "react";

/**
 * 3D tilt-on-hover card. Follows the cursor for a premium holofoil feel.
 * Respects prefers-reduced-motion.
 */
export function TiltCard({
  children,
  max = 12,
  scale = 1.02,
  className,
}: {
  children: React.ReactNode;
  /** Max tilt in degrees */
  max?: number;
  /** Hover scale multiplier */
  scale?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Raw mouse position → normalized (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smoothed springs
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), {
    stiffness: 220,
    damping: 20,
  });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), {
    stiffness: 220,
    damping: 20,
  });

  // Glare position
  const glareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useSpring(0, { stiffness: 220, damping: 20 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseEnter={() => glareOpacity.set(0.35)}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
        glareOpacity.set(0);
      }}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
      className={className}
    >
      <div
        style={{ transformStyle: "preserve-3d", transform: "translateZ(0)" }}
        className="relative h-full w-full"
      >
        {children}
        {/* Holofoil glare */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
          style={{
            opacity: glareOpacity,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.8), rgba(255,255,255,0) 50%)`
            ),
          }}
        />
      </div>
    </motion.div>
  );
}
