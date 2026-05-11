"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import {
  AmberBurst,
  ChaliceMark,
  Sparkline,
} from "@/components/brand/graphics";
import { AdCreative } from "@/components/ads/AdCreative";
import { INDEX_MOVERS, RECENT_TRADES } from "@/lib/landingData";

/* ───────────────────────────────────────────────────────────────────
   Scene script — total ≈ 42 seconds. Durations in ms.
   ─────────────────────────────────────────────────────────────────── */

interface Scene {
  id: string;
  ms: number;
  label: string;
}

const SCENES: Scene[] = [
  { id: "open",      ms: 3200, label: "Cold open" },
  { id: "cover",     ms: 5800, label: "Cover" },
  { id: "marcus",    ms: 5400, label: "Lot 01" },
  { id: "ledger",    ms: 5800, label: "The Ledger" },
  { id: "match",     ms: 5600, label: "Match" },
  { id: "ad",        ms: 5400, label: "Ad designer" },
  { id: "wall",      ms: 4200, label: "Wall of trades" },
  { id: "stamp",     ms: 4800, label: "End stamp" },
];

const TOTAL_MS = SCENES.reduce((s, x) => s + x.ms, 0);

/* ───────────────────────────────────────────────────────────────── */

export function DemoClient() {
  const reduce = useReducedMotion();
  const [sceneIdx, setSceneIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!playing || done) return;
    const t = setTimeout(() => {
      setSceneIdx((i) => {
        if (i + 1 >= SCENES.length) {
          setDone(true);
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, SCENES[sceneIdx].ms);
    return () => clearTimeout(t);
  }, [sceneIdx, playing, done]);

  const restart = () => {
    setSceneIdx(0);
    setDone(false);
    setPlaying(true);
  };

  const togglePlay = () => {
    if (done) restart();
    else setPlaying((p) => !p);
  };

  const current = SCENES[sceneIdx];

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden font-sans select-none">
      {/* Persistent filmic grain + vignette */}
      <Grain />
      <Vignette />

      {/* The reel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {current.id === "open" && <SceneOpen key="open" />}
          {current.id === "cover" && <SceneCover key="cover" />}
          {current.id === "marcus" && <SceneMarcus key="marcus" />}
          {current.id === "ledger" && <SceneLedger key="ledger" />}
          {current.id === "match" && <SceneMatch key="match" />}
          {current.id === "ad" && <SceneAd key="ad" />}
          {current.id === "wall" && <SceneWall key="wall" />}
          {current.id === "stamp" && <SceneStamp key="stamp" reduce={reduce ?? false} />}
        </AnimatePresence>
      </div>

      {/* HUD overlay */}
      <Hud
        scenes={SCENES}
        sceneIdx={sceneIdx}
        playing={playing}
        muted={muted}
        done={done}
        onScene={(i) => {
          setSceneIdx(i);
          setDone(false);
          setPlaying(true);
        }}
        onPlay={togglePlay}
        onMute={() => setMuted((m) => !m)}
        onRestart={restart}
      />

      {/* Done overlay */}
      <AnimatePresence>
        {done && <DoneOverlay key="done" onReplay={restart} />}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 1 · COLD OPEN — black, mark assembles, masthead types
   ═══════════════════════════════════════════════════════════════════ */

function SceneOpen() {
  return (
    <motion.div
      key="open"
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.7, ease: [0.85, 0, 0.15, 1] } }}
      transition={{ duration: 0.6 }}
    >
      {/* Faint burst behind the mark */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      >
        <AmberBurst size={900} intensity="bold" />
      </motion.div>

      {/* Mark */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <ChaliceMark size={144} tone="amber" />
      </motion.div>

      {/* Wordmark */}
      <motion.h1
        initial={{ opacity: 0, y: 16, letterSpacing: "0.4em" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "-0.04em" }}
        transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-8 font-display font-bold text-7xl md:text-9xl tracking-[-0.04em]"
      >
        Grail
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.3 }}
          className="font-italic-display italic text-[color:var(--amber-400)]"
        >
          .
        </motion.span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="relative z-10 mt-6 font-mono text-[11px] md:text-xs tracking-[0.42em] uppercase text-zinc-400"
      >
        ◆  A 40-second film  ◆
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 2 · COVER — magazine cover assembles
   ═══════════════════════════════════════════════════════════════════ */

function SceneCover() {
  return (
    <motion.div
      key="cover"
      className="absolute inset-0 px-6 md:px-16 py-10 md:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.6 }}
    >
      {/* Masthead */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex items-baseline justify-between font-mono text-[10px] md:text-xs tracking-[0.32em] uppercase text-zinc-500"
      >
        <span className="text-[color:var(--amber-400)] font-bold">GRAIL</span>
        <span>Vol. I · No. 01 · May 2026</span>
        <span className="text-zinc-600">$0/issue</span>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.85, 0, 0.15, 1] }}
        className="mt-3 h-px bg-[color:var(--amber-400)]/40 origin-left"
      />

      <div className="grid grid-cols-12 gap-6 md:gap-10 mt-8 md:mt-14 items-start">
        {/* Headline left */}
        <div className="col-span-12 md:col-span-7">
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="font-mono text-[10px] md:text-xs tracking-[0.22em] uppercase text-zinc-500 mb-5"
          >
            <span className="text-[color:var(--amber-400)]">¶</span>&nbsp;&nbsp;Cover story · Pasadena, CA
          </motion.p>

          <h1 className="font-display font-bold text-[44px] md:text-[88px] leading-[0.88] tracking-[-0.045em]">
            <TypeReveal text="The Charizard" delay={1.0} />
            <br />
            <TypeReveal text="hasn't moved" delay={1.7} />
            <br />
            <motion.span
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-italic-display italic font-normal text-[color:var(--amber-400)] inline-block"
            >
              in twenty-six
              <br />
              years.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.4, duration: 0.6 }}
            className="mt-8 max-w-[44ch] text-sm md:text-base text-zinc-400 leading-relaxed font-light"
          >
            Single owner. Original Toys-R-Us receipt. Twenty-six years inside an airtight album in a Pasadena attic.
          </motion.p>
        </div>

        {/* Card right */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 md:col-span-5 relative"
        >
          {/* Postmark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: 20 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ delay: 2.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-4 -left-4 md:-left-8 z-20 flex flex-col items-center justify-center font-mono text-[9px] md:text-[10px] font-bold tracking-[0.16em] uppercase text-[color:var(--amber-400)] border-2 border-[color:var(--amber-400)] rounded-full h-24 w-24 leading-tight text-center bg-black"
          >
            <span>GRAIL</span>
            <span className="text-zinc-500">·</span>
            <span>LOT 01</span>
            <span className="text-zinc-500">·</span>
            <span>PSA 10</span>
          </motion.div>

          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-[color:var(--ink-900)] via-[color:var(--ink-850)] to-[color:var(--ink-950)] border border-[color:var(--line)]">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 35%, rgba(247,201,72,0.22) 0%, transparent 70%)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src="https://images.pokemontcg.io/base1/4_hires.png"
              alt="Charizard"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute inset-0 h-full w-full object-contain p-8 md:p-10"
              draggable={false}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.8, duration: 0.5 }}
            className="mt-3 flex items-baseline justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-zinc-500"
          >
            <span>Fig. 01 — Charizard, Base · 1st Ed · Shadowless</span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.2, duration: 0.4 }}
              className="font-mono text-xl font-bold tabular-nums text-white"
            >
              $32,400
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 3 · MARCUS — packs visualization
   ═══════════════════════════════════════════════════════════════════ */

function SceneMarcus() {
  return (
    <motion.div
      key="marcus"
      className="absolute inset-0 flex items-center justify-center px-6 md:px-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-12 gap-10 items-center max-w-6xl w-full">
        <div className="col-span-12 md:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-zinc-500 mb-6"
          >
            Pasadena · February 1999
          </motion.p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-display font-bold text-3xl md:text-5xl leading-[1.08] tracking-[-0.03em] max-w-[22ch]"
          >
            <span className="block">Marcus bought</span>
            <span className="block">
              <span className="font-italic-display italic font-normal text-[color:var(--amber-400)]">
                four packs.
              </span>
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.6, duration: 0.7 }}
              className="block mt-3 text-zinc-400 text-2xl md:text-3xl"
            >
              Three are gone.
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.4, duration: 0.7 }}
              className="block text-zinc-400 text-2xl md:text-3xl"
            >
              The fourth he never opened.
            </motion.span>
          </motion.h2>
        </div>

        {/* Four packs, three fade out */}
        <div className="col-span-12 md:col-span-5 flex items-end justify-center gap-3 md:gap-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: i === 3 ? 1 : [1, 1, 0.2],
                y: 0,
                scale: i === 3 ? [1, 1, 1.05] : [1, 1, 0.96],
                filter: i === 3 ? ["grayscale(0)", "grayscale(0)", "grayscale(0)"] : ["grayscale(0)", "grayscale(0)", "grayscale(1)"],
              }}
              transition={{
                opacity: { delay: 0.5 + i * 0.18, duration: 2.4, times: [0, 0.4, 1] },
                y: { delay: 0.5 + i * 0.18, duration: 0.6 },
                scale: { delay: 0.5 + i * 0.18, duration: 2.4, times: [0, 0.4, 1] },
                filter: { delay: 0.5 + i * 0.18, duration: 2.4, times: [0, 0.4, 1] },
              }}
              className="relative"
            >
              <div
                className="w-16 h-32 md:w-20 md:h-40 rounded-md overflow-hidden border border-[color:var(--amber-400)]/40"
                style={{
                  background:
                    "linear-gradient(155deg, #ffe8a0 0%, #f7c948 35%, #b87407 100%)",
                }}
              >
                <div className="h-full p-2 flex flex-col items-center justify-between">
                  <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-black/70">
                    BASE SET
                  </span>
                  <ChaliceMark size={20} tone="ink" withPeriod={false} />
                  <span className="font-mono text-[7px] font-bold tracking-[0.2em] text-black/70">
                    1999
                  </span>
                </div>
              </div>
              {i === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 4.0, duration: 0.5 }}
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-[color:var(--amber-400)] whitespace-nowrap"
                >
                  ★ THIS ONE
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 4 · THE LEDGER — rows populate
   ═══════════════════════════════════════════════════════════════════ */

function SceneLedger() {
  return (
    <motion.div
      key="ledger"
      className="absolute inset-0 px-6 md:px-16 py-10 md:py-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-6 md:mb-8"
      >
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-zinc-500 mb-2">
            II · The Ledger · Live
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl leading-none tracking-[-0.03em]">
            What cards <span className="font-italic-display italic font-normal text-[color:var(--amber-400)]">actually</span>
            <br />
            change hands for.
          </h2>
        </div>
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500 hidden md:block">
          Updated · {new Date().toLocaleTimeString("en-US", { hour12: false })}
        </p>
      </motion.div>

      <div className="border border-[color:var(--line)] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[36px,1.4fr,1fr,80px,110px] px-5 py-3 border-b border-[color:var(--line)] bg-[color:var(--ink-900)] font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500">
          <span>№</span>
          <span>Lot</span>
          <span className="hidden md:block">Note</span>
          <span className="text-right">Avg</span>
          <span className="text-right">30d</span>
        </div>
        {INDEX_MOVERS.slice(0, 6).map((m, i) => {
          const isUp = m.pct >= 0;
          return (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.32, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-[36px,1.4fr,1fr,80px,110px] items-center px-5 py-4 border-b border-[color:var(--line)] last:border-b-0"
            >
              <span className="font-mono text-[12px] text-zinc-600 tabular-nums">
                {String(m.rank).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg md:text-xl text-white tracking-tight leading-none">
                  {m.name}
                </p>
                <p className="font-mono text-[10px] tracking-[0.04em] text-zinc-500 mt-1 truncate">
                  {m.set}
                </p>
              </div>
              <p className="hidden md:block text-[12px] text-zinc-400 italic font-light pr-3 leading-snug">
                — {m.note}
              </p>
              <span className="font-mono text-sm font-bold tabular-nums text-white text-right">
                ${m.price >= 10000 ? Math.round(m.price / 1000) + "k" : m.price.toLocaleString()}
              </span>
              <div className="flex items-center justify-end gap-2">
                <Sparkline
                  values={m.series}
                  width={50}
                  height={18}
                  stroke={isUp ? "#5ae5a0" : "#ff4d6d"}
                  fill={false}
                />
                <span
                  className="font-mono text-[12px] font-bold tabular-nums w-12 text-right"
                  style={{ color: isUp ? "var(--jade-400)" : "var(--rose-500)" }}
                >
                  {isUp ? "+" : ""}{m.pct.toFixed(1)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 5 · MATCH — two avatars + escrow flow
   ═══════════════════════════════════════════════════════════════════ */

function SceneMatch() {
  const steps = [
    { t: "MATCH FOUND",  ms: 0,    color: "var(--amber-400)" },
    { t: "ESCROW SECURED", ms: 1600, color: "var(--violet-400)" },
    { t: "CARDS VERIFIED", ms: 3000, color: "var(--violet-400)" },
    { t: "TRADE CLOSED · $1,820", ms: 4200, color: "var(--jade-400)" },
  ];

  return (
    <motion.div
      key="match"
      className="absolute inset-0 flex items-center justify-center px-6 md:px-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative w-full max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[11px] tracking-[0.22em] uppercase text-zinc-500 mb-10 text-center"
        >
          A real trade · Closed Tuesday 02:47:12 UTC
        </motion.p>

        {/* Two collectors + cards exchanging in the middle */}
        <div className="grid grid-cols-3 items-center gap-6 md:gap-12">
          {/* Mira */}
          <CollectorPlate
            initial={{ x: -60, opacity: 0 }}
            letter="M"
            name="Mira Tanaka"
            handle="@mira.holos · Osaka"
            offers="Vaporeon ex"
            color="var(--amber-400)"
            side="left"
          />

          {/* Cards exchanging in the middle */}
          <div className="relative flex items-center justify-center h-48 md:h-64">
            <motion.div
              initial={{ x: -180, opacity: 0, rotate: -8 }}
              animate={{ x: [-180, -40, 40, 60], opacity: [0, 1, 1, 1], rotate: [-8, -4, 4, 6] }}
              transition={{ duration: 4.2, times: [0, 0.35, 0.7, 1], ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
            >
              <CardChip name="Vaporeon ex" color="#3b9eff" />
            </motion.div>
            <motion.div
              initial={{ x: 180, opacity: 0, rotate: 8 }}
              animate={{ x: [180, 40, -40, -60], opacity: [0, 1, 1, 1], rotate: [8, 4, -4, -6] }}
              transition={{ duration: 4.2, times: [0, 0.35, 0.7, 1], ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
            >
              <CardChip name="Gengar VMAX" color="#a47cff" />
            </motion.div>

            {/* Center divider line with shimmer */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[color:var(--amber-400)] to-transparent opacity-50"
            />
          </div>

          {/* Atlanta guy */}
          <CollectorPlate
            initial={{ x: 60, opacity: 0 }}
            letter="A"
            name="Adam Foster"
            handle="@psa_kev · Atlanta"
            offers="Gengar VMAX"
            color="var(--violet-400)"
            side="right"
          />
        </div>

        {/* Status ticker */}
        <div className="mt-12 md:mt-16 max-w-md mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: s.ms / 1000, duration: 0.4 }}
              className="flex items-center gap-3 py-2"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: s.ms / 1000 + 0.1, duration: 0.3, type: "spring", stiffness: 220 }}
                className="font-mono text-[10px] font-bold inline-block w-5 h-5 rounded-full text-black text-center leading-5"
                style={{ background: s.color }}
              >
                ✓
              </motion.span>
              <span
                className="font-mono text-[12px] md:text-sm font-bold tracking-[0.22em] uppercase tabular-nums"
                style={{ color: s.color }}
              >
                {s.t}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CollectorPlate({
  letter,
  name,
  handle,
  offers,
  color,
  initial,
  side,
}: {
  letter: string;
  name: string;
  handle: string;
  offers: string;
  color: string;
  initial: { x: number; opacity: number };
  side: "left" | "right";
}) {
  return (
    <motion.div
      initial={initial}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col items-center text-center ${side === "left" ? "md:items-end md:text-right" : "md:items-start md:text-left"}`}
    >
      <div
        className="h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center font-display font-bold text-2xl md:text-3xl text-black"
        style={{ background: color }}
      >
        {letter}
      </div>
      <p className="font-display font-bold text-lg md:text-xl mt-3 tracking-[-0.02em]">{name}</p>
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-zinc-500 mt-1">
        {handle}
      </p>
      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-600 mt-3">
        Offers
      </p>
      <p className="text-sm font-semibold mt-1" style={{ color }}>{offers}</p>
    </motion.div>
  );
}

function CardChip({ name, color }: { name: string; color: string }) {
  return (
    <div className="w-32 h-44 md:w-36 md:h-52 rounded-lg border overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)]"
      style={{ borderColor: color, background: "linear-gradient(165deg, #1a1a22, #050506)" }}
    >
      <div className="h-full p-3 flex flex-col">
        <div className="h-1 rounded-full mb-2" style={{ background: color }} />
        <div className="flex-1 flex items-center justify-center">
          <ChaliceMark size={36} tone="ghost" />
        </div>
        <p className="font-display font-bold text-[13px] leading-tight tracking-tight text-white">
          {name}
        </p>
        <p className="font-mono text-[8px] tracking-[0.18em] uppercase mt-1" style={{ color }}>
          PSA 10
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 6 · AD DESIGNER — template assembles
   ═══════════════════════════════════════════════════════════════════ */

function SceneAd() {
  return (
    <motion.div
      key="ad"
      className="absolute inset-0 flex items-center justify-center px-6 md:px-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-12 gap-10 max-w-6xl w-full items-center">
        {/* Left: typewriter form */}
        <div className="col-span-12 md:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-zinc-500 mb-5"
          >
            VII · The ad designer
          </motion.p>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display font-bold text-3xl md:text-5xl leading-[1.02] tracking-[-0.03em] max-w-[18ch]"
          >
            Type the headline.
            <br />
            <span className="font-italic-display italic font-normal text-[color:var(--amber-400)]">
              Watch it render.
            </span>
          </motion.h2>

          <div className="mt-8 space-y-3 max-w-md font-mono text-sm">
            <FieldLine label="TEMPLATE"  value="Spotlight"                       delay={0.8} />
            <FieldLine label="ACCENT"    value="●  AMBER"                        delay={1.4} accentDot />
            <FieldLine label="HEADLINE"  value="The shadowless is moving."       delay={2.0} typing />
            <FieldLine label="CTA"       value="Step on the floor →"             delay={3.0} />
          </div>
        </div>

        {/* Right: live preview building */}
        <div className="col-span-12 md:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[9/16] max-w-[300px] mx-auto rounded-[22px] overflow-hidden ring-1 ring-[color:var(--line)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
          >
            <AdCreative
              spec={{
                template: "spotlight",
                accent: "amber",
                kicker: "GRAIL OF THE WEEK",
                headline: "The shadowless is moving.",
                subhead: "Verified-only lots. Flat fees. Trades that close.",
                ctaLabel: "Step on the floor",
                cardImage: "https://images.pokemontcg.io/base1/4_hires.png",
                cardName: "Charizard · Shadowless",
                price: 32400,
                priceChangePct: 18.3,
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.8, duration: 0.5 }}
            className="mt-4 text-center font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500"
          >
            Inline SVG · Always crisp · No upload
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function FieldLine({
  label,
  value,
  delay,
  typing,
  accentDot,
}: {
  label: string;
  value: string;
  delay: number;
  typing?: boolean;
  accentDot?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="grid grid-cols-[120px,1fr] items-center gap-3"
    >
      <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-zinc-500">
        {label}
      </span>
      <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--ink-900)] px-3 py-2 text-white">
        {accentDot ? (
          <span className="text-[color:var(--amber-400)]">{value}</span>
        ) : typing ? (
          <TypeReveal text={value} delay={delay + 0.2} />
        ) : (
          value
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 7 · WALL — fast horizontal ticker of recent trades
   ═══════════════════════════════════════════════════════════════════ */

function SceneWall() {
  const rows = [RECENT_TRADES, RECENT_TRADES.slice().reverse(), RECENT_TRADES];

  return (
    <motion.div
      key="wall"
      className="absolute inset-0 flex flex-col justify-center px-0 md:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 md:px-16 mb-10"
      >
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-zinc-500 mb-3">
          Closed this week · {RECENT_TRADES.length * 186} trades · $3.4M moved
        </p>
        <h2 className="font-display font-bold text-3xl md:text-5xl leading-[1] tracking-[-0.03em] max-w-[20ch]">
          The floor doesn't <span className="font-italic-display italic font-normal text-[color:var(--amber-400)]">stop.</span>
        </h2>
      </motion.div>

      <div className="space-y-3 overflow-hidden">
        {rows.map((trades, ri) => {
          const doubled = [...trades, ...trades, ...trades];
          return (
            <div key={ri} className="overflow-hidden">
              <div
                className={`flex gap-4 ${ri % 2 === 0 ? "ticker-track-fast" : "ticker-track"}`}
                style={ri % 2 === 1 ? { animationDirection: "reverse" } : undefined}
              >
                {doubled.map((t, i) => (
                  <div
                    key={`${ri}-${i}`}
                    className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-full bg-[color:var(--ink-900)] border border-[color:var(--line)] whitespace-nowrap"
                  >
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-zinc-500">
                      {t.fromUser}
                    </span>
                    <span className="text-[color:var(--amber-400)]">→</span>
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-zinc-500">
                      {t.toUser}
                    </span>
                    <span className="font-display text-sm text-white tracking-tight">
                      {t.card}
                    </span>
                    <span className="font-mono text-[12px] font-bold tabular-nums text-[color:var(--amber-400)]">
                      ${t.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="px-6 md:px-16 mt-10 text-center font-mono text-[10px] tracking-[0.22em] uppercase text-zinc-500"
      >
        Every entry is a verified hand-off
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE 8 · END STAMP — final mark
   ═══════════════════════════════════════════════════════════════════ */

function SceneStamp({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      key="stamp"
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <AmberBurst size={800} intensity="bold" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <ChaliceMark size={120} tone="amber" />
        <p className="mt-6 font-display font-bold text-7xl md:text-8xl tracking-[-0.04em]">
          Grail<span className="font-italic-display italic text-[color:var(--amber-400)]">.</span>
        </p>
        <p className="mt-4 font-italic-display italic text-2xl md:text-3xl text-zinc-300 max-w-[20ch] text-center leading-tight">
          The room is open.
          <br />
          Twenty-four hours.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
      >
        <Link
          href="/"
          className="btn-amber inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm"
        >
          See the room
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.32em] uppercase text-zinc-600 z-10"
      >
        Grail · Issue 01 · 2026  {reduce ? "· (motion reduced)" : ""}
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HUD — chrome around the film
   ═══════════════════════════════════════════════════════════════════ */

function Hud({
  scenes,
  sceneIdx,
  playing,
  muted,
  done,
  onScene,
  onPlay,
  onMute,
  onRestart,
}: {
  scenes: Scene[];
  sceneIdx: number;
  playing: boolean;
  muted: boolean;
  done: boolean;
  onScene: (i: number) => void;
  onPlay: () => void;
  onMute: () => void;
  onRestart: () => void;
}) {
  const elapsed = useMemo(
    () => scenes.slice(0, sceneIdx).reduce((s, x) => s + x.ms, 0),
    [scenes, sceneIdx]
  );

  return (
    <>
      {/* Top-left brand */}
      <div className="absolute top-5 left-5 md:top-7 md:left-8 z-50 flex items-center gap-3">
        <ChaliceMark size={26} tone="amber" />
        <div>
          <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-zinc-300">
            GRAIL
          </p>
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-zinc-500">
            Demo film · 40s
          </p>
        </div>
      </div>

      {/* Top-right exit */}
      <Link
        href="/"
        className="absolute top-5 right-5 md:top-7 md:right-8 z-50 font-mono text-[10px] tracking-[0.28em] uppercase text-zinc-400 hover:text-white inline-flex items-center gap-2"
      >
        Exit demo
        <span aria-hidden>✕</span>
      </Link>

      {/* Bottom progress bar + scene chapters */}
      <div className="absolute bottom-0 inset-x-0 z-50 px-5 md:px-8 pb-5 md:pb-7 pt-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
        {/* Chapter segments */}
        <div className="flex gap-1.5 md:gap-2 max-w-5xl mx-auto pointer-events-auto">
          {scenes.map((s, i) => {
            const isActive = i === sceneIdx;
            const isDone = i < sceneIdx || done;
            return (
              <button
                key={s.id}
                onClick={() => onScene(i)}
                className="flex-1 group"
                title={s.label}
              >
                <div className="h-[3px] bg-white/15 rounded-full overflow-hidden">
                  <motion.div
                    key={`${i}-${sceneIdx}-${playing}`}
                    initial={{ width: isDone ? "100%" : "0%" }}
                    animate={{ width: isActive ? "100%" : isDone ? "100%" : "0%" }}
                    transition={{ duration: isActive && playing ? s.ms / 1000 : 0, ease: "linear" }}
                    className="h-full bg-[color:var(--amber-400)] rounded-full"
                  />
                </div>
                <p className="mt-2 font-mono text-[9px] tracking-[0.22em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors text-left">
                  {String(i + 1).padStart(2, "0")} · {s.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Controls row */}
        <div className="mt-5 flex items-center justify-between max-w-5xl mx-auto pointer-events-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={onPlay}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label={playing ? "Pause" : "Play"}
            >
              {done ? <RotateCcw className="h-4 w-4" /> : playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={onRestart}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Restart"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={onMute}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Toggle sound"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

          <div className="font-mono text-[11px] tracking-[0.18em] tabular-nums text-zinc-400">
            {fmtMs(Math.min(elapsed + (playing ? 0 : 0), TOTAL_MS))} / {fmtMs(TOTAL_MS)}
          </div>
        </div>
      </div>
    </>
  );
}

function fmtMs(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ═══════════════════════════════════════════════════════════════════
   DONE OVERLAY
   ═══════════════════════════════════════════════════════════════════ */

function DoneOverlay({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
    >
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        onClick={onReplay}
        className="pointer-events-auto rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 px-7 py-3.5 text-sm font-mono font-bold tracking-[0.28em] uppercase text-white border border-white/20"
      >
        ↻  Play again
      </motion.button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ATMOSPHERICS — grain, vignette, type reveal
   ═══════════════════════════════════════════════════════════════════ */

function Grain() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay z-30"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}

function Vignette() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none z-30"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  );
}

function TypeReveal({ text, delay }: { text: string; delay: number }) {
  const chars = Array.from(text);
  return (
    <span aria-label={text} className="inline-block">
      {chars.map((c, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.022,
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}
