"use client";

import { motion } from "framer-motion";

interface DeckCard {
  src: string;
  alt?: string;
  /** displayed under the card if provided */
  tag?: string;
  /** displayed as the price tag — already-formatted string */
  price?: string;
}

interface Props {
  cards: DeckCard[];
  className?: string;
}

/**
 * The Cover deck — a 5-card 3D fan with the hero card centered and
 * larger, two flanking, and two rear cards in deep parallax. Each
 * floats on its own delay/amplitude so the stack breathes. Used as the
 * Landing Cover hero.
 */
export function HeroDeck({ cards, className }: Props) {
  const slice = cards.slice(0, 5);

  // Tuned per slot. z is z-translate in px (perspective 1500 set on parent).
  const layout = [
    { x: -260, y: 60,  z: -220, rot: -16, scale: 0.78, float: 5,  delay: 0.35 },
    { x: -150, y: -10, z: -100, rot: -7,  scale: 0.92, float: -6, delay: 0.20 },
    { x:    0, y:   0, z:   60, rot:  0,  scale: 1.06, float: 8,  delay: 0.05 },
    { x:  150, y: -20, z: -100, rot:  6,  scale: 0.92, float: -5, delay: 0.20 },
    { x:  260, y: 70,  z: -220, rot: 15,  scale: 0.78, float: 6,  delay: 0.35 },
  ];

  return (
    <div
      className={`relative w-full select-none ${className ?? ""}`}
      style={{ perspective: "1500px", aspectRatio: "5/3" }}
    >
      {/* Behind everything: a halo */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(247,201,72,0.30) 0%, rgba(247,201,72,0.06) 45%, transparent 75%)",
        }}
      />

      {/* Floor shadow plate */}
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-2 h-8 w-[68%] rounded-full blur-2xl pointer-events-none"
        style={{ background: "rgba(0,0,0,0.7)" }}
      />

      {slice.map((c, i) => {
        const L = layout[i] ?? layout[2];
        const isHero = i === 2;
        return (
          <motion.div
            key={c.src + i}
            initial={{
              opacity: 0,
              rotateZ: L.rot * 1.5,
              translateX: L.x * 1.4,
              translateY: L.y + 60,
              translateZ: L.z - 100,
              scale: L.scale * 0.85,
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
              opacity:    { duration: 0.9, delay: L.delay, ease: [0.16, 1, 0.3, 1] },
              rotateZ:    { duration: 1.0, delay: L.delay, ease: [0.16, 1, 0.3, 1] },
              translateX: { duration: 1.0, delay: L.delay, ease: [0.16, 1, 0.3, 1] },
              translateZ: { duration: 1.0, delay: L.delay, ease: [0.16, 1, 0.3, 1] },
              scale:      { duration: 1.0, delay: L.delay, ease: [0.16, 1, 0.3, 1] },
              translateY: {
                duration: 5 + i * 0.3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                delay: L.delay + 1.1,
              },
            }}
            className="absolute left-1/2 top-1/2"
            style={{
              width: 220,
              height: 308,
              marginLeft: -110,
              marginTop: -154,
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
              zIndex: i === 2 ? 9 : 5 - Math.abs(i - 2),
            }}
          >
            <div
              className="relative h-full w-full rounded-[14px] overflow-hidden"
              style={{
                boxShadow: isHero
                  ? "0 50px 100px -25px rgba(0,0,0,0.85), 0 0 0 1px rgba(247,201,72,0.30), 0 0 90px -10px rgba(247,201,72,0.55)"
                  : "0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(247,201,72,0.12)",
              }}
            >
              {/* Base */}
              <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--ink-900)] via-[color:var(--ink-850)] to-[color:var(--ink-950)]" />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isHero
                    ? "radial-gradient(60% 50% at 50% 32%, rgba(247,201,72,0.30) 0%, transparent 70%)"
                    : "radial-gradient(60% 50% at 50% 32%, rgba(247,201,72,0.12) 0%, transparent 70%)",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.src}
                alt={c.alt ?? ""}
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain p-5"
              />

              {/* Holo bands */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                  opacity: isHero ? 0.45 : 0.25,
                  background:
                    "repeating-linear-gradient(115deg, transparent 0px, transparent 12px, rgba(255,255,255,0.10) 12px, rgba(255,255,255,0.10) 14px, transparent 14px, transparent 26px, rgba(247,201,72,0.20) 26px, rgba(247,201,72,0.20) 28px)",
                }}
              />

              {/* Drifting shine */}
              <motion.div
                aria-hidden
                className="absolute inset-0 pointer-events-none mix-blend-screen"
                initial={{ x: "-120%" }}
                animate={{ x: "120%" }}
                transition={{
                  duration: isHero ? 4.5 : 6 + i * 0.4,
                  ease: "linear",
                  repeat: Infinity,
                  delay: L.delay + 0.8,
                }}
                style={{
                  background:
                    "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.55) 50%, transparent 62%)",
                }}
              />

              {/* Top edge highlight */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.4) 70%, transparent)",
                }}
              />
            </div>

            {/* Hero card gets a price tag */}
            {isHero && c.price && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="absolute left-1/2 -translate-x-1/2 -bottom-12 text-center"
                style={{ transform: "translateZ(80px) translateX(-50%)" }}
              >
                <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-zinc-500">
                  Listed
                </p>
                <p className="font-display text-2xl font-bold tabular-nums text-white mt-0.5">
                  {c.price}
                </p>
              </motion.div>
            )}

            {/* Side-card mini tags */}
            {!isHero && c.tag && (
              <p
                className="absolute -bottom-7 left-0 right-0 text-center font-mono text-[9px] tracking-[0.22em] uppercase text-zinc-600"
                style={{ transform: "translateZ(20px)" }}
              >
                {c.tag}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
