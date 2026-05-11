"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface Props {
  src: string;
  alt: string;
  /** ratio width/height — defaults to a TCG card (3/4) */
  ratio?: number;
  /** Stamp drawn over the upper-left corner */
  stamp?: { line1: string; line2?: string; line3?: string };
  /** Caption rendered below the card */
  caption?: { fig: string; price?: string; note?: string };
  className?: string;
}

/**
 * Hero "grail" card with mouse-tracked 3D parallax, holographic shimmer,
 * dust-mote rim light and a slow idle float. The card itself is the
 * product photograph; everything else is light and ceremony.
 */
export function HoloCard({ src, alt, ratio = 3 / 4, stamp, caption, className }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotX = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 120, damping: 15 });
  const rotY = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 120, damping: 15 });
  const shineX = useTransform(mx, [-1, 1], ["20%", "80%"]);
  const shineY = useTransform(my, [-1, 1], ["20%", "80%"]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div className={className}>
      <div
        ref={wrap}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative"
        style={{ perspective: "1200px" }}
      >
        {/* Ambient orb behind the card */}
        <div
          aria-hidden
          className="absolute -inset-6 md:-inset-10 rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(247,201,72,0.32) 0%, rgba(247,201,72,0.08) 45%, transparent 75%)",
          }}
        />

        {/* Floor shadow */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 -bottom-6 h-8 w-3/4 rounded-full blur-2xl pointer-events-none"
          style={{ background: "rgba(0,0,0,0.7)" }}
        />

        <motion.div
          style={{
            rotateX: rotX,
            rotateY: rotY,
            transformStyle: "preserve-3d",
            aspectRatio: ratio,
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full"
        >
          {/* The card body */}
          <div
            className="relative h-full w-full rounded-[18px] overflow-hidden border border-[color:var(--line)] bg-gradient-to-br from-[color:var(--ink-900)] via-[color:var(--ink-850)] to-[color:var(--ink-950)]"
            style={{
              boxShadow:
                "0 50px 120px -30px rgba(0,0,0,0.85), 0 0 0 1px rgba(247,201,72,0.18), 0 0 80px -20px rgba(247,201,72,0.35)",
              transform: "translateZ(0)",
            }}
          >
            {/* Inner amber glow */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 32%, rgba(247,201,72,0.22) 0%, transparent 70%)",
              }}
            />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="absolute inset-0 h-full w-full object-contain p-7 md:p-10"
              style={{ transform: "translateZ(40px)" }}
            />

            {/* Holographic shimmer that follows the cursor */}
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
              style={{
                background: useTransform(
                  [shineX, shineY] as never,
                  ([x, y]: [string, string]) =>
                    `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.55) 0%, rgba(255,236,180,0.18) 18%, transparent 40%)`
                ),
              }}
            />

            {/* Diagonal holo bands */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
              style={{
                background:
                  "repeating-linear-gradient(115deg, transparent 0px, transparent 14px, rgba(255,255,255,0.12) 14px, rgba(255,255,255,0.12) 16px, transparent 16px, transparent 30px, rgba(247,201,72,0.18) 30px, rgba(247,201,72,0.18) 32px)",
              }}
            />

            {/* Soft top edge highlight */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.35) 70%, transparent)",
              }}
            />
          </div>

          {/* Postmark stamp — sits in front, also tilts with the card */}
          {stamp && (
            <div
              className="absolute -top-5 -left-5 md:-top-7 md:-left-7 z-20 rotate-[-9deg] flex flex-col items-center justify-center font-mono text-[9px] md:text-[10px] font-bold tracking-[0.18em] uppercase text-[color:var(--amber-400)] border-2 border-[color:var(--amber-400)] rounded-full h-24 w-24 md:h-28 md:w-28 leading-tight text-center bg-[color:var(--ink-950)]/90 backdrop-blur-sm"
              style={{ transform: "translateZ(60px) rotate(-9deg)" }}
            >
              <span>{stamp.line1}</span>
              {stamp.line2 && (
                <>
                  <span className="text-zinc-600">·</span>
                  <span>{stamp.line2}</span>
                </>
              )}
              {stamp.line3 && (
                <>
                  <span className="text-zinc-600">·</span>
                  <span>{stamp.line3}</span>
                </>
              )}
            </div>
          )}

          {/* Grading wax-seal at bottom-right */}
          <div
            className="absolute -bottom-4 -right-3 md:-bottom-5 md:-right-5 z-20 h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center font-display font-bold text-base md:text-lg text-black"
            style={{
              transform: "translateZ(60px)",
              background:
                "radial-gradient(circle at 35% 30%, #ffe187 0%, #f7c948 45%, #b07c0b 100%)",
              boxShadow:
                "inset 0 -3px 6px rgba(0,0,0,0.35), inset 0 3px 6px rgba(255,255,255,0.4), 0 8px 24px -6px rgba(0,0,0,0.7)",
            }}
            aria-hidden
          >
            <div className="text-center leading-none">
              <div className="font-mono text-[8px] tracking-[0.2em] uppercase opacity-80">
                Auth.
              </div>
              <div className="text-xl mt-0.5">G</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Caption strip */}
      {caption && (
        <div className="mt-5 grid grid-cols-[1fr,auto] items-end gap-4">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500">
              {caption.fig}
            </p>
            {caption.note && (
              <p className="text-[12px] text-zinc-400 italic leading-snug mt-1 max-w-[36ch]">
                {caption.note}
              </p>
            )}
          </div>
          {caption.price && (
            <p className="font-mono text-2xl font-bold tabular-nums text-white">
              {caption.price}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
