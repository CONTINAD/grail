import Link from "next/link";
import Image from "next/image";
import { Flame, TrendingUp, Crown, Tag, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { CategoryBar } from "@/components/discover/CategoryBar";
import {
  Reveal,
  RevealStagger,
  RevealItem,
  ScrollReveal,
} from "@/components/motion/Reveal";
import { TiltCard } from "@/components/cards/TiltCard";
import { PostTile } from "@/components/feed/PostTile";
import { Counter } from "@/components/motion/Counter";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const session = await getSession();
  const viewerId = session?.user?.id ?? null;

  const [trendingPosts, trendingCards, topTraders, allTagsSnap, priceTotal] =
    await Promise.all([
      prisma.post.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) },
        },
        orderBy: [{ likeCount: "desc" }, { viewCount: "desc" }],
        take: 12,
        include: {
          user: { select: { id: true, username: true, name: true, image: true } },
        },
      }),
      prisma.pokemonCard.findMany({
        where: { marketPrice: { gt: 0 } },
        orderBy: { marketPrice: "desc" },
        take: 16,
      }),
      prisma.user.findMany({
        where: viewerId
          ? {
              id: { not: viewerId },
              followers: { none: { followerId: viewerId } },
            }
          : {},
        orderBy: [{ completedTrades: "desc" }, { averageRating: "desc" }],
        take: 5,
        include: {
          _count: { select: { followers: true, posts: true } },
        },
      }),
      prisma.post.findMany({
        select: { tags: true },
        take: 200,
        orderBy: { createdAt: "desc" },
      }),
      prisma.pokemonCard.aggregate({ _sum: { marketPrice: true }, _count: true }),
    ]);

  const tagFreq = new Map<string, number>();
  for (const p of allTagsSnap) for (const t of p.tags) tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1);
  const hotTags = [...tagFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const feature = trendingPosts[0];
  const secondary = trendingPosts.slice(1, 5);
  const rest = trendingPosts.slice(5);

  const now = new Date();
  const week = `VOL. ${getWeekNumber(now)} / ${now.getFullYear()}`;

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-8 md:py-12 space-y-14 md:space-y-20">
      {/* ── Masthead ─────────────────────────────────────────────── */}
      <Reveal>
        <header className="relative">
          <div className="flex items-end justify-between gap-6 pb-5 border-b border-[color:var(--line)]">
            <div className="space-y-3">
              <div className="kicker">The Trading Floor</div>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight">
                Discover
                <br />
                <span className="italic text-[color:var(--amber-400)]">the movement</span>
              </h1>
              <p className="text-zinc-400 text-sm max-w-md">
                Pokémon, sports, comics, sneakers, watches, vinyl. One feed,
                smart matching, flat fees.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="kicker-mute">{week}</p>
              <p className="text-zinc-500 text-sm mt-1 max-w-xs">
                <Counter
                  value={priceTotal._count ?? 0}
                  className="text-zinc-300 font-bold tabular-nums"
                />{" "}
                cards indexed · updated daily
              </p>
            </div>
          </div>

          <div className="mt-8">
            <CategoryBar active="pokemon" />
          </div>
        </header>
      </Reveal>

      {/* ── Editorial feature + sidebar ──────────────────────────── */}
      {feature && (
        <section className="grid lg:grid-cols-[minmax(0,2fr)_1fr] gap-6 md:gap-10">
          <Link
            href={`/?post=${feature.id}`}
            className="group relative overflow-hidden rounded-[28px] aspect-[16/11] md:aspect-[16/10] bg-black"
          >
            {feature.mediaType === "video" ? (
              <video
                src={feature.mediaUrl}
                poster={feature.thumbUrl ?? undefined}
                muted
                playsInline
                loop
                autoPlay
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2s]"
              />
            ) : (
              <img
                src={feature.mediaUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2s]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="kicker bg-[color:var(--amber-400)]/15 border border-[color:var(--amber-400)]/30 text-[color:var(--amber-400)] backdrop-blur px-2.5 py-1 rounded-full">
                <Flame className="h-3 w-3 inline -mt-0.5 mr-1" /> FEATURE
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 space-y-3">
              <p className="kicker-mute text-white/70">@{feature.user.username ?? feature.user.name}</p>
              <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight max-w-2xl">
                {truncate(feature.caption ?? feature.featuredCardName ?? "Trending this week", 100)}
              </h2>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span>🔥 {fmt(feature.likeCount)} loves</span>
                <span>·</span>
                <span>👁 {fmt(feature.viewCount)} views</span>
                <span className="inline-flex items-center gap-1 ml-auto font-bold text-[color:var(--amber-400)] group-hover:translate-x-0.5 transition-transform">
                  Watch <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* sidebar: 4-up secondary stories */}
          <div className="space-y-4">
            <div className="kicker-mute">Also trending</div>
            {secondary.map((p, i) => (
              <Link
                key={p.id}
                href={`/?post=${p.id}`}
                className="group flex gap-4 items-start"
              >
                <span className="font-display text-3xl text-zinc-600 leading-none pt-1 shrink-0 tabular-nums">
                  0{i + 2}
                </span>
                <div className="relative h-20 w-16 rounded-lg overflow-hidden bg-black shrink-0 ring-1 ring-[color:var(--line)]">
                  {p.mediaType === "video" ? (
                    <video
                      src={p.mediaUrl}
                      poster={p.thumbUrl ?? undefined}
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={p.mediaUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-[color:var(--amber-400)] font-bold">
                    @{p.user.username ?? p.user.name}
                  </p>
                  <p className="font-display text-base leading-snug text-zinc-100 mt-0.5 line-clamp-3 group-hover:text-[color:var(--amber-400)] transition-colors">
                    {truncate(p.caption ?? p.featuredCardName ?? "Trending post", 72)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    🔥 {fmt(p.likeCount)} · 👁 {fmt(p.viewCount)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Market index: trending cards ─────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="kicker">
              <TrendingUp className="h-3 w-3 inline -mt-0.5 mr-1" />
              Market index
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">
              Hottest cards, by market value
            </h2>
          </div>
          <Link
            href="/cards/search"
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-zinc-300 hover:text-[color:var(--amber-400)]"
          >
            Browse all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <RevealStagger
          stagger={0.04}
          className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3 md:gap-4"
        >
          {trendingCards.map((c, i) => (
            <RevealItem key={c.id}>
              <Link href={`/cards/${c.id}`} className="group block space-y-2">
                <TiltCard
                  max={8}
                  scale={1.03}
                  className="relative aspect-[5/7] rounded-xl overflow-hidden bg-gradient-to-b from-[color:var(--ink-800)] to-[color:var(--ink-900)] ring-1 ring-[color:var(--line)] group-hover:ring-[color:var(--amber-400)]/50 transition-all"
                >
                  <span className="absolute top-2 left-2 z-10 font-display text-xs text-zinc-500 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Image
                    src={c.imageSmall}
                    alt={c.name}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </TiltCard>
                <div>
                  <p className="text-xs font-semibold text-zinc-200 truncate">{c.name}</p>
                  <p className="text-[11px] text-[color:var(--jade-400)] font-bold tabular-nums">
                    ${c.marketPrice?.toFixed(2)}
                  </p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      {/* ── Top traders ──────────────────────────────────────────── */}
      {topTraders.length > 0 && (
        <ScrollReveal>
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="kicker">
                <Crown className="h-3 w-3 inline -mt-0.5 mr-1" />
                The Regulars
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">
                Top traders this month
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-5 gap-3 md:gap-4">
            {topTraders.map((u, i) => (
              <Link
                key={u.id}
                href={`/u/${u.id}`}
                className="panel p-5 flex flex-col items-start hover:border-[color:var(--amber-400)]/30 transition-all group"
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="font-display text-2xl text-zinc-600 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {u.averageRating >= 4.8 && (
                    <Crown className="h-4 w-4 text-[color:var(--amber-400)]" />
                  )}
                </div>
                <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-[color:var(--amber-400)]/30 bg-zinc-800">
                  {u.image ? (
                    <Image src={u.image} alt="" fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[color:var(--amber-400)] text-black font-bold">
                      {(u.username ?? u.name ?? "?")[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="font-bold text-zinc-100 mt-3 truncate max-w-full group-hover:text-[color:var(--amber-400)] transition-colors">
                  @{u.username ?? u.name}
                </p>
                <div className="mt-2 space-y-0.5 text-xs text-zinc-500">
                  <p className="tabular-nums">
                    {u.completedTrades} trades · {u.averageRating.toFixed(1)}★
                  </p>
                  <p>
                    {u._count.followers} followers · {u._count.posts} posts
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        </ScrollReveal>
      )}

      {/* ── Tag marquee ──────────────────────────────────────────── */}
      {hotTags.length > 0 && (
        <section className="relative overflow-hidden py-6 -mx-5 md:-mx-10">
          <div className="kicker mb-4 px-5 md:px-10">
            <Tag className="h-3 w-3 inline -mt-0.5 mr-1" />
            In the conversation
          </div>
          <div className="flex gap-3 marquee-track whitespace-nowrap">
            {[...hotTags, ...hotTags].map(([tag, count], idx) => (
              <Link
                key={`${tag}-${idx}`}
                href={`/search?q=%23${encodeURIComponent(tag)}`}
                className="panel px-5 py-3 hover:border-[color:var(--amber-400)]/40 transition-colors shrink-0"
              >
                <span className="font-display text-xl italic text-[color:var(--amber-400)]">
                  #{tag}
                </span>
                <span className="text-zinc-500 ml-3 text-xs tabular-nums">{count} posts</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── More posts grid ──────────────────────────────────────── */}
      {rest.length > 0 && (
        <Reveal>
          <section>
            <div className="kicker mb-6">More stories</div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3">
              {rest.map((p) => (
                <PostTile
                  key={p.id}
                  href={`/?post=${p.id}`}
                  mediaUrl={p.mediaUrl}
                  mediaType={p.mediaType}
                  thumbUrl={p.thumbUrl}
                  className="rounded-xl"
                  overlay={
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <p className="text-[10px] tracking-wider uppercase font-bold text-[color:var(--amber-400)]">
                        @{p.user.username ?? p.user.name}
                      </p>
                      <p className="text-xs mt-0.5 line-clamp-2 leading-tight">
                        {p.caption ?? p.featuredCardName ?? ""}
                      </p>
                    </div>
                  }
                />
              ))}
            </div>
          </section>
        </Reveal>
      )}
    </div>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n).trim() + "…";
}

function getWeekNumber(d: Date): string {
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return String(week).padStart(2, "0");
}
