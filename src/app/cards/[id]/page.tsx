import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeftRight, Heart, TrendingUp, User } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { CardActions } from "@/components/cards/CardActions";
import { GradeBadge } from "@/components/cards/GradeBadge";
import { TiltCard } from "@/components/cards/TiltCard";
import { Reveal, RevealStagger, RevealItem } from "@/components/motion/Reveal";
import { PostTile } from "@/components/feed/PostTile";

export const dynamic = "force-dynamic";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const viewerId = session?.user?.id ?? null;

  const card = await prisma.pokemonCard.findUnique({
    where: { id },
    include: {
      collectionCards: {
        where: { forTrade: true },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              averageRating: true,
              completedTrades: true,
            },
          },
        },
        take: 20,
      },
      wishlistCards: {
        include: {
          user: {
            select: { id: true, username: true, name: true, image: true },
          },
        },
        take: 20,
      },
    },
  });

  if (!card) notFound();

  const [myCollection, myWishlist, relatedPosts] = await Promise.all([
    viewerId
      ? prisma.collectionCard.findFirst({ where: { userId: viewerId, cardId: id } })
      : Promise.resolve(null),
    viewerId
      ? prisma.wishlistCard.findFirst({ where: { userId: viewerId, cardId: id } })
      : Promise.resolve(null),
    prisma.post.findMany({
      where: { featuredCardId: id },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: { select: { id: true, username: true, name: true, image: true } },
      },
    }),
  ]);

  const offerCount = card.collectionCards.length;
  const wantCount = card.wishlistCards.length;

  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-8 md:py-14">
      {/* ── Lot header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6">
        <span className="kicker">LOT · {card.setId.toUpperCase()} / {card.number}</span>
        <span className="text-zinc-700">·</span>
        <Link href="/discover" className="text-xs text-zinc-500 hover:text-zinc-300">
          ← Back to market
        </Link>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 md:gap-16">
        {/* ── Card image (big, premium, 3D tilt) ──────────────── */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-10 blur-3xl opacity-50 pointer-events-none"
            style={{
              background:
                "radial-gradient(closest-side, rgba(247,201,72,0.22), transparent 70%)",
            }}
          />
          <TiltCard
            max={10}
            scale={1.015}
            className="relative aspect-[5/7] max-w-md mx-auto lg:mx-0 w-full rounded-3xl overflow-hidden ring-1 ring-[color:var(--amber-400)]/20 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
          >
            <Image
              src={card.imageLarge}
              alt={card.name}
              fill
              className="object-cover"
              sizes="(min-width:1024px) 500px, 90vw"
              priority
            />
          </TiltCard>
        </div>

        {/* ── Details ─────────────────────────────────────────── */}
        <Reveal delay={0.05} className="space-y-8">
          <div>
            <p className="kicker">{card.setName} · {card.setSeries}</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mt-3">
              {card.name}
            </h1>
            <p className="text-zinc-500 text-sm mt-3">
              #{card.number} · {card.rarity ?? "—"}
              {card.artist && <> · Illus. <span className="italic text-zinc-300">{card.artist}</span></>}
            </p>
          </div>

          {/* Price strip */}
          {card.marketPrice != null && (
            <div className="panel p-6 md:p-8">
              <div className="flex items-baseline gap-4">
                <div className="flex-1">
                  <div className="kicker-mute mb-2">
                    <TrendingUp className="h-3 w-3 inline -mt-0.5 mr-1" />
                    Current market
                  </div>
                  <p className="font-display text-5xl md:text-6xl font-bold text-[color:var(--amber-400)] tabular-nums leading-none">
                    ${card.marketPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="kicker-mute">Updated</p>
                  <p className="text-zinc-400 text-sm mt-1">
                    {card.marketUpdated
                      ? card.marketUpdated.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Type chips */}
          {card.types && card.types.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {card.types.map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-bold uppercase tracking-widest bg-[color:var(--ink-800)] border border-[color:var(--line)] text-zinc-200 rounded-full px-3 py-1.5"
                >
                  {t}
                </span>
              ))}
              {card.hp && (
                <span className="text-[11px] font-bold uppercase tracking-widest bg-[color:var(--rose-500)]/10 border border-[color:var(--rose-500)]/30 text-[color:var(--rose-500)] rounded-full px-3 py-1.5">
                  HP {card.hp}
                </span>
              )}
            </div>
          )}

          {/* Market snapshot */}
          <div className="grid grid-cols-2 gap-3">
            <div className="panel-inset p-4">
              <p className="kicker-mute">Open offers</p>
              <p className="font-display text-3xl font-bold mt-1">{offerCount}</p>
              <p className="text-xs text-zinc-500 mt-1">trading partners</p>
            </div>
            <div className="panel-inset p-4">
              <p className="kicker-mute">Wishlisted by</p>
              <p className="font-display text-3xl font-bold mt-1">{wantCount}</p>
              <p className="text-xs text-zinc-500 mt-1">collectors</p>
            </div>
          </div>

          {viewerId ? (
            <CardActions
              cardId={card.id}
              inCollection={Boolean(myCollection)}
              inWishlist={Boolean(myWishlist)}
            />
          ) : (
            <Link
              href="/auth/sign-in"
              className="btn-amber inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold"
            >
              Sign in to collect this card
            </Link>
          )}
        </Reveal>
      </div>

      {/* ── Related posts ──────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 md:mt-24">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="kicker">Feed</div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mt-1">
                Seen recently on the floor
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3">
            {relatedPosts.map((p) => (
              <PostTile
                key={p.id}
                href={`/?post=${p.id}`}
                mediaUrl={p.mediaUrl}
                mediaType={p.mediaType}
                thumbUrl={p.thumbUrl}
                username={p.user.username ?? p.user.name}
                className="rounded-xl"
              />
            ))}
          </div>
        </section>
      )}

      {/* ── People lists ───────────────────────────────────────── */}
      <section className="mt-16 md:mt-20 grid md:grid-cols-2 gap-5">
        <HolderList
          title="Open to trade"
          subtitle={`${offerCount} ${offerCount === 1 ? "trader has" : "traders have"} it`}
          icon={ArrowLeftRight}
          empty="No one's offering this yet."
          viewerId={viewerId}
          items={card.collectionCards
            .filter((c) => c.user.id !== viewerId)
            .map((c) => ({
              id: c.user.id,
              username: c.user.username,
              name: c.user.name,
              image: c.user.image,
              sub: `${c.user.completedTrades} trades${
                c.user.averageRating ? ` · ${c.user.averageRating.toFixed(1)}★` : ""
              }`,
              grade:
                c.isGraded && c.gradeCompany && c.gradeScore != null
                  ? { company: c.gradeCompany, score: c.gradeScore }
                  : null,
              action: "trade" as const,
            }))}
        />
        <HolderList
          title="Has it on wishlist"
          subtitle={`${wantCount} ${wantCount === 1 ? "collector" : "collectors"}`}
          icon={Heart}
          empty="Nobody's wishlisted it yet."
          viewerId={viewerId}
          items={card.wishlistCards
            .filter((w) => w.user.id !== viewerId)
            .map((w) => ({
              id: w.user.id,
              username: w.user.username,
              name: w.user.name,
              image: w.user.image,
              sub: `priority ${w.priority}/3`,
              grade: null,
              action: "profile" as const,
            }))}
        />
      </section>
    </div>
  );
}

function HolderList({
  title,
  subtitle,
  icon: Icon,
  empty,
  viewerId,
  items,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  empty: string;
  viewerId: string | null;
  items: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
    sub: string;
    grade: { company: string; score: number } | null;
    action: "trade" | "profile";
  }[];
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex items-end justify-between px-5 md:px-6 py-4 border-b border-[color:var(--line)]">
        <div>
          <div className="kicker-mute flex items-center gap-1.5">
            <Icon className="h-3 w-3" />
            {title}
          </div>
          <p className="text-sm text-zinc-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="p-10 text-sm text-zinc-500 text-center">{empty}</p>
      ) : (
        <ul className="divide-y divide-[color:var(--line)]">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-3 px-5 md:px-6 py-3.5">
              <Link
                href={`/u/${it.id}`}
                className="flex items-center gap-3 min-w-0 flex-1 group"
              >
                <div className="h-10 w-10 rounded-full overflow-hidden bg-zinc-700 shrink-0 relative ring-1 ring-[color:var(--line)] group-hover:ring-[color:var(--amber-400)]/40 transition-all">
                  {it.image ? (
                    <Image src={it.image} alt="" fill className="object-cover" sizes="40px" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[color:var(--amber-400)] text-black text-sm font-bold">
                      {(it.username ?? it.name ?? "?")[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-sm font-bold text-zinc-100 truncate group-hover:text-[color:var(--amber-400)] transition-colors">
                      @{it.username ?? it.name ?? "user"}
                    </p>
                    {it.grade && (
                      <GradeBadge company={it.grade.company} score={it.grade.score} size="sm" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{it.sub}</p>
                </div>
              </Link>
              {viewerId && it.action === "trade" ? (
                <Link
                  href={`/trades/new?with=${it.id}`}
                  className="btn-amber inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold"
                >
                  <ArrowLeftRight className="h-3 w-3" />
                  Trade
                </Link>
              ) : (
                <Link
                  href={`/u/${it.id}`}
                  className="h-8 w-8 rounded-full flex items-center justify-center border border-[color:var(--line)] hover:border-[color:var(--ink-500)] text-zinc-400"
                >
                  <User className="h-3.5 w-3.5" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
