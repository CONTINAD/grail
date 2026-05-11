"use client";

import { useEffect, useRef } from "react";

interface Props {
  /** density per 100k pixels — higher = more particles */
  density?: number;
  className?: string;
}

interface Mote {
  x: number;
  y: number;
  z: number; // 0..1 → depth
  vx: number;
  vy: number;
  r: number;
  hue: 0 | 1; // 0 = amber dust, 1 = pale dust
  twinkle: number;
  twinklePhase: number;
}

/**
 * Cinematic atmospheric haze — drifting dust motes with a parallax sense
 * of depth. Pure canvas, no images, GPU-friendly. Drawn behind the hero
 * to give the cover real volume instead of flat dark.
 */
export function AtmosphereField({ density = 1.4, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let motes: Mote[] = [];
    let raf = 0;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.round(((w * h) / 100000) * density * 18);
      motes = Array.from({ length: target }, () => spawnMote(w, h));
    };

    const spawnMote = (w: number, h: number): Mote => {
      const z = Math.random() ** 1.5;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        z,
        vx: (Math.random() - 0.5) * 0.15 * (1 - z),
        vy: -(0.05 + Math.random() * 0.15) * (1 - z),
        r: 0.6 + Math.random() * (1 + z * 1.2),
        hue: Math.random() < 0.65 ? 0 : 1,
        twinkle: 0.5 + Math.random() * 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
      };
    };

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(60, now - last);
      last = now;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);

      for (const m of motes) {
        m.x += m.vx * (dt / 16);
        m.y += m.vy * (dt / 16);
        m.twinklePhase += dt * 0.001;

        if (m.y < -10) {
          m.y = h + 10;
          m.x = Math.random() * w;
        }
        if (m.x < -10) m.x = w + 10;
        if (m.x > w + 10) m.x = -10;

        const a = (0.18 + 0.12 * Math.sin(m.twinklePhase)) * (0.4 + m.z * 0.6);

        if (m.hue === 0) {
          // amber dust
          ctx.fillStyle = `rgba(247, 201, 72, ${a})`;
        } else {
          ctx.fillStyle = `rgba(232, 232, 236, ${a * 0.7})`;
        }

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();

        // halo for the brighter ones
        if (m.r > 1.4) {
          ctx.fillStyle = `rgba(247, 201, 72, ${a * 0.18})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(loop);
    };

    resize();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      style={{ width: "100%", height: "100%" }}
    />
  );
}
