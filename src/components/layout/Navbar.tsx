"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import {
  Home,
  Search,
  Compass,
  Plus,
  Bell,
  LayoutGrid,
  BookMarked,
  ArrowLeftRight,
  Sparkles,
  LogIn,
} from "lucide-react";

const BOTTOM_NAV = [
  { href: "/",         label: "Feed",     icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/post/new", label: "Post",     icon: Plus, primary: true },
  { href: "/search",   label: "Search",   icon: Search },
];

const TOP_SECONDARY = [
  { href: "/collection", label: "Collection", icon: LayoutGrid },
  { href: "/wishlist",   label: "Wishlist",   icon: BookMarked },
  { href: "/matches",    label: "Matches",    icon: Sparkles },
  { href: "/trades",     label: "Trades",     icon: ArrowLeftRight },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setUnread(d.unread ?? 0))
      .catch(() => {});
  }, [session?.user?.id, pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const onFeed = pathname === "/";
  const onPreview = pathname.startsWith("/preview");
  const onAuth = pathname.startsWith("/auth") || pathname.startsWith("/onboarding");
  const onDemo = pathname.startsWith("/demo");

  if (onPreview || onAuth || onDemo) return null;

  return (
    <>
      {/* ── Desktop top bar ─────────────────────────────────────── */}
      <header
        className={cn(
          "hidden md:flex fixed top-0 left-0 right-0 z-40 h-16 items-center justify-between px-6 transition-colors",
          onFeed
            ? "bg-transparent"
            : "border-b border-[color:var(--line)] bg-black/70 backdrop-blur-xl"
        )}
      >
        <Link href="/" className="flex items-center shrink-0">
          <Logo size={28} showEyebrow />
        </Link>

        <nav className="flex items-center gap-0.5">
          {[...BOTTOM_NAV, ...TOP_SECONDARY].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                isActive(href)
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-100"
              )}
            >
              <Icon className="h-[15px] w-[15px]" />
              {label}
              {isActive(href) && (
                <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-[color:var(--amber-400)] to-[color:var(--amber-500)]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/preview"
            className="kicker-mute hidden xl:inline-block hover:text-[color:var(--amber-400)] transition-colors"
            title="Device preview"
          >
            PREVIEW
          </Link>
          {session?.user?.id ? (
            <>
              <Link
                href="/notifications"
                className="relative h-10 w-10 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Bell className="h-[18px] w-[18px]" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-[color:var(--rose-500)] text-white text-[10px] font-bold flex items-center justify-center">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>
              <Link
                href={`/u/${session.user.id}`}
                className="relative h-9 w-9 rounded-full overflow-hidden ring-1 ring-[color:var(--line)] hover:ring-[color:var(--amber-400)]/60 transition-all bg-zinc-800"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm font-bold bg-[color:var(--amber-400)] text-black">
                    {(session.user.name ?? session.user.email ?? "?")[0]?.toUpperCase()}
                  </div>
                )}
              </Link>
            </>
          ) : (
            <Link
              href="/auth/sign-in"
              className="btn-amber inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px]"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* ── Mobile bottom tab bar ───────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-end border-t border-[color:var(--line)] bg-black/85 backdrop-blur-xl pb-safe">
        {BOTTOM_NAV.map(({ href, label, icon: Icon, primary }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold tracking-wide transition-colors",
                primary
                  ? "text-black"
                  : active
                  ? "text-[color:var(--amber-400)]"
                  : "text-zinc-500"
              )}
            >
              {primary ? (
                <span className="bg-gradient-to-br from-[color:var(--amber-400)] to-[color:var(--amber-500)] h-9 w-12 rounded-xl flex items-center justify-center shadow-[0_6px_16px_-6px_rgba(247,201,72,0.6)]">
                  <Icon className="h-5 w-5 text-black" />
                </span>
              ) : (
                <Icon className="h-5 w-5" />
              )}
              {!primary && <span className="uppercase">{label}</span>}
            </Link>
          );
        })}
        <Link
          href={session?.user?.id ? "/notifications" : "/auth/sign-in"}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold tracking-wide transition-colors relative",
            isActive("/notifications") ? "text-[color:var(--amber-400)]" : "text-zinc-500"
          )}
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1/4 h-4 min-w-4 px-1 rounded-full bg-[color:var(--rose-500)] text-white text-[9px] font-bold flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
          <span className="uppercase">Alerts</span>
        </Link>
      </nav>
    </>
  );
}
