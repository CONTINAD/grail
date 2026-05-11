"use client";

import { motion } from "framer-motion";

/**
 * A floating 3D stack of cards. Pure CSS transforms + Framer Motion.
 * Each card has its own depth, tilt, and subtle hover/idle animation.
 * Designed for hero sections — reads as "collection" at a glance.
 */

interface CardStackProps {
  cards: { src: string; alt?: string }[];
}

export function CardStack({ cards }: CardStackProps) {
  const slice = cards.slice(0, 5);

  // Per-card transforms tuned to layer elegantly
  const layout = [
    { x: -140, y: 30, z: -80, rot: -18, scale: 0.78, delay: 0.6, float: 4 },
    { x: -70, y: -15, z: -20, rot: -8, scale: 0.92, delay: 0.45, float: -5 },
    { x: 0, y: 0, z: 0, rot: 0, scale: 1, delay: 0.2, float: 6 },
    { x: 75, y: -10, z: -20, rot: 7, scale: 0.92, delay: 0.45, float: -4 },
    { x: 150, y: 40, z: -80, rot: 16, scale: 0.78, delay: 0.6, float: 5 },
  ];

  return (
    <div
      className="relative w-full select-none pointer-events-none"
      style={{ perspective: "1400px", aspectRatio: "5/3" }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(closest-side, rgba(247,201,72,0.22) 0%, transparent 70%)",
        }}
      />

      {/* Shadow plate */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-4 h-6 w-64 rounded-full blur-2xl"
        style={{ background: "rgba(0,0,0,0.6)" }}
      />

      {slice.map((c, i) => {
        const L = layout[i] ?? layout[2];
        return (
          <motion.div
            key={c.src + i}
            initial={{
              opacity: 0,
              rotateZ: L.rot,
              translateX: L.x,
              translateY: L.y + 30,
              translateZ: L.z,
              scale: L.scale * 0.9,
            }}
            animate={{
              opacity: 1,
              rotateZ: L.rot,
              translateX: L.x,
              translateY: [L.y, L.y + L.float, L.y],
              translateZ: L.z,
              scale: L.scale,
            }}
            transition={{
              opacity: { duration: 0.8, delay: L.delay, ease: [0.22, 1, 0.36, 1] },
              rotateZ: { duration: 0.8, delay: L.delay, ease: [0.22, 1, 0.36, 1] },
              translateX: { duration: 0.8, delay: L.delay, ease: [0.22, 1, 0.36, 1] },
              translateZ: { duration: 0.8, delay: L.delay, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 0.8, delay: L.delay, ease: [0.22, 1, 0.36, 1] },
              translateY: {
                duration: 4 + i * 0.3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                delay: L.delay + 1,
              },
            }}
            className="absolute left-1/2 top-1/2 -ml-[90px] -mt-[126px]"
            style={{
              width: 180,
              height: 252,
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
              zIndex: i === 2 ? 5 : 5 - Math.abs(i - 2),
            }}
          >
            <div
              className="relative h-full w-full rounded-2xl overflow-hidden ring-1"
              style={{
                boxShadow:
                  "0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(247,201,72,0.15)",
                transform: "translateZ(0)",
              }}
            >
              <img
                src={c.src}
                alt={c.alt ?? ""}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              {/* Holo shine */}
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-overlay opacity-60"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
