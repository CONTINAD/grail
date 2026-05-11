"use client";

import { useState } from "react";
import {
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ROUTES = [
  { href: "/", label: "Feed" },
  { href: "/discover", label: "Discover" },
  { href: "/search", label: "Search" },
  { href: "/cards/base1-4", label: "Card" },
  { href: "/auth/sign-in", label: "Sign-in" },
  { href: "/post/new", label: "Post" },
  { href: "/collection", label: "Collection" },
  { href: "/matches", label: "Matches" },
  { href: "/notifications", label: "Alerts" },
];

type Mode = "split" | "phone" | "tablet" | "desktop";

export function PreviewClient() {
  const [route, setRoute] = useState("/");
  const [mode, setMode] = useState<Mode>("split");
  const [bust, setBust] = useState(0);

  const src = `${route}?_v=${bust}`;

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--ink-950)]">
      {/* ── Top control bar ────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-black/85 backdrop-blur-xl">
        <div className="mx-auto max-w-[1800px] flex items-center gap-4 px-4 md:px-6 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit preview
          </Link>

          <div className="h-6 w-px bg-[color:var(--line)]" />

          <div className="kicker">Device Preview</div>

          <div className="flex-1" />

          {/* Route picker */}
          <div className="hidden md:flex items-center gap-1 bg-[color:var(--ink-850)] rounded-full p-1 border border-[color:var(--line)]">
            {ROUTES.map((r) => (
              <button
                key={r.href}
                onClick={() => setRoute(r.href)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                  route === r.href
                    ? "bg-[color:var(--amber-400)] text-black"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <select
            className="md:hidden bg-[color:var(--ink-850)] border border-[color:var(--line)] rounded-lg px-3 py-1.5 text-sm text-zinc-200"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
          >
            {ROUTES.map((r) => (
              <option key={r.href} value={r.href}>
                {r.label}
              </option>
            ))}
          </select>

          <div className="h-6 w-px bg-[color:var(--line)]" />

          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-[color:var(--ink-850)] rounded-full p-1 border border-[color:var(--line)]">
            <ModeBtn mode={mode} set={setMode} v="split" icon={null} label="Split" />
            <ModeBtn mode={mode} set={setMode} v="phone" icon={<Smartphone className="h-3.5 w-3.5" />} />
            <ModeBtn mode={mode} set={setMode} v="tablet" icon={<Tablet className="h-3.5 w-3.5" />} />
            <ModeBtn mode={mode} set={setMode} v="desktop" icon={<Monitor className="h-3.5 w-3.5" />} />
          </div>

          <button
            onClick={() => setBust((b) => b + 1)}
            className="h-9 w-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5"
            title="Reload frames"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <a
            href={route}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 w-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5"
            title="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* ── Stage ──────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-[1800px] px-4 md:px-10 py-6 md:py-10">
          <div
            className={cn(
              "gap-6 md:gap-10 items-start",
              mode === "split" ? "grid lg:grid-cols-[minmax(0,1fr)_420px]" : "flex flex-col items-center"
            )}
          >
            {/* Desktop frame */}
            {(mode === "split" || mode === "desktop") && (
              <DesktopFrame src={src} />
            )}
            {mode === "tablet" && <TabletFrame src={src} />}
            {/* Phone frame */}
            {(mode === "split" || mode === "phone") && (
              <PhoneFrame src={src} />
            )}
          </div>

          {/* Footer ruler */}
          <div className="mt-10 text-center">
            <p className="kicker-mute">Viewing {route} · Tap any device to interact</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function ModeBtn({
  mode,
  set,
  v,
  icon,
  label,
}: {
  mode: Mode;
  set: (m: Mode) => void;
  v: Mode;
  icon?: React.ReactNode;
  label?: string;
}) {
  const active = mode === v;
  return (
    <button
      onClick={() => set(v)}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize",
        active ? "bg-[color:var(--amber-400)] text-black" : "text-zinc-400 hover:text-white"
      )}
    >
      {icon}
      {label ?? v}
    </button>
  );
}

/* ────────────────────────────────────────────────
   Device frames
   ──────────────────────────────────────────────── */

function DesktopFrame({ src }: { src: string }) {
  return (
    <div className="rounded-2xl bg-[color:var(--ink-850)] border border-[color:var(--line)] shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[color:var(--line)] bg-[color:var(--ink-900)]">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="mx-auto text-[11px] text-zinc-500 font-mono">
          localhost:3000{src.split("?")[0]}
        </div>
      </div>
      <div className="aspect-[16/10] bg-black">
        <iframe
          src={src}
          className="w-full h-full"
          title="Desktop preview"
        />
      </div>
    </div>
  );
}

function TabletFrame({ src }: { src: string }) {
  return (
    <div className="mx-auto rounded-[36px] p-3 bg-[color:var(--ink-800)] border border-[color:var(--line)] shadow-2xl">
      <div className="rounded-[28px] overflow-hidden bg-black" style={{ width: 768, height: 1024 }}>
        <iframe src={src} className="w-full h-full" title="Tablet preview" />
      </div>
    </div>
  );
}

function PhoneFrame({ src }: { src: string }) {
  // iPhone 15 Pro proportions: 393×852 logical
  return (
    <div className="mx-auto relative">
      {/* Outer frame */}
      <div
        className="relative rounded-[52px] p-[10px] bg-gradient-to-b from-[#2a2a34] to-[#16161b] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.03)_inset]"
        style={{ width: 412 }}
      >
        {/* Glass edge */}
        <div className="absolute inset-0 rounded-[52px] ring-1 ring-white/5 pointer-events-none" />

        {/* Screen */}
        <div
          className="relative rounded-[44px] overflow-hidden bg-black"
          style={{ width: 392, height: 852 }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-[14px] left-1/2 -translate-x-1/2 z-10 h-[30px] w-[112px] rounded-full bg-black pointer-events-none" />

          <iframe
            src={src}
            className="w-full h-full border-0"
            title="Phone preview"
            style={{ colorScheme: "dark" }}
          />
        </div>

        {/* Volume buttons (decorative) */}
        <span className="absolute left-[-2px] top-[140px] h-[30px] w-[4px] rounded-full bg-[#1f1f26]" />
        <span className="absolute left-[-2px] top-[190px] h-[60px] w-[4px] rounded-full bg-[#1f1f26]" />
        <span className="absolute left-[-2px] top-[265px] h-[60px] w-[4px] rounded-full bg-[#1f1f26]" />
        <span className="absolute right-[-2px] top-[175px] h-[90px] w-[4px] rounded-full bg-[#1f1f26]" />
      </div>

      <p className="text-center text-[11px] text-zinc-600 mt-4 font-mono tracking-wider">
        iPhone 15 Pro · 393 × 852
      </p>
    </div>
  );
}
