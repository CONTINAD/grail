import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftRight, Star, Users, Package, MapPin, Crown } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { FollowButton } from "@/components/profile/FollowButton";
import { ProfilePostGrid } from "@/components/profile/ProfilePostGrid";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
          collection: true,
        },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          mediaUrl: true,
          mediaType: true,
          thumbUrl: true,
          likeCount: true,
          viewCount: true,
          featuredCardName: true,
        },
      },
    },
  });

  if (!user) notFound();

  const viewerId = session?.user?.id ?? null;
  const isSelf = viewerId === user.id;

  const followingMe = viewerId
    ? await prisma.follow.findUnique({
        where: {
          followerId_followedId: { followerId: viewerId, followedId: user.id },
        },
      })
    : null;

  const isElite = user.averageRating >= 4.8 && user.completedTrades >= 20;

  return (
    <div className="mx-auto max-w-[1100px] px-5 md:px-10 py-8 md:py-14">
      {/* ── Editorial header band ──────────────────────────────── */}
      <header className="relative panel overflow-hidden">
        {/* subtle background */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 240px at 20% 0%, rgba(247,201,72,0.1), transparent 60%), radial-gradient(500px 200px at 100% 100%, rgba(139,109,255,0.08), transparent 60%)",
          }}
        />
        <div className="relative flex flex-col md:flex-row md:items-end gap-8 md:gap-10 p-6 md:p-10">
          <div className="relative h-28 w-28 md:h-40 md:w-40 rounded-full overflow-hidden ring-[3px] ring-[color:var(--amber-400)]/30 bg-zinc-800 shrink-0 self-center md:self-start">
            {user.image ? (
              <Image src={user.image} alt="" fill className="object-cover" sizes="160px" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-6xl font-bold bg-[color:var(--amber-400)] text-black">
                {(user.username ?? user.name ?? "?")[0]?.toUpperCase()}
              </div>
            )}
            {isElite && (
              <div
                className="absolute -bottom-1 -right-1 h-10 w-10 rounded-full bg-[color:var(--amber-400)] text-black flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(247,201,72,0.5)]"
                title="Elite trader"
              >
                <Crown className="h-5 w-5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2">
              <span className="kicker">
                {isElite ? "Elite trader" : "Member"} · Since{" "}
                {user.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              @{user.username ?? user.name ?? "user"}
            </h1>
            {user.bio && (
              <p className="text-zinc-400 text-[15px] leading-relaxed max-w-xl">
                {user.bio}
              </p>
            )}
            {user.location && (
              <p className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
                <MapPin className="h-3.5 w-3.5" />
                {user.location}
              </p>
            )}

            {!isSelf && viewerId && (
              <div className="flex gap-2 pt-2">
                <FollowButton userId={user.id} initialFollowing={Boolean(followingMe)} />
                <Link
                  href={`/trades/new?with=${user.id}`}
                  className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Trade
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Stat strip */}
        <div className="relative grid grid-cols-2 md:grid-cols-5 border-t border-[color:var(--line)]">
          <Stat
            icon={Package}
            value={user._count.posts}
            label="posts"
            visual={<DotRow count={user._count.posts} />}
          />
          <Stat
            icon={Users}
            value={user._count.followers}
            label="followers"
            visual={
              <RatioBar
                a={user._count.followers}
                b={user._count.following}
                hint={
                  user._count.followers >= user._count.following
                    ? "more followers"
                    : "following more"
                }
              />
            }
          />
          <Stat
            icon={Users}
            value={user._count.following}
            label="following"
            visual={
              <RatioBar
                a={user._count.following}
                b={user._count.followers}
                hint={null}
                muted
              />
            }
          />
          <Stat
            icon={ArrowLeftRight}
            value={user.completedTrades}
            label="trades"
            visual={<CompletionMeter count={user.completedTrades} />}
          />
          <Stat
            icon={Star}
            value={
              user.totalRatings
                ? `${user.averageRating.toFixed(1)}`
                : "—"
            }
            sub={user.totalRatings ? `${user.totalRatings} ratings` : undefined}
            label="rating"
            visual={
              user.totalRatings ? (
                <StarBar value={user.averageRating} />
              ) : null
            }
          />
        </div>
      </header>

      {/* ── Post grid ──────────────────────────────────────────── */}
      <section className="mt-12 md:mt-16">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="kicker">Body of work</div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mt-1">
              {user._count.posts} post{user._count.posts === 1 ? "" : "s"}
            </h2>
          </div>
        </div>

        {user.posts.length === 0 ? (
          <div className="panel p-14 text-center">
            <p className="font-display text-xl text-zinc-400">
              No posts yet
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              Check back later — this trader hasn&apos;t shared anything.
            </p>
          </div>
        ) : (
          <ProfilePostGrid posts={user.posts} />
        )}
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  sub,
  visual,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number | string;
  label: string;
  sub?: string;
  visual?: React.ReactNode;
}) {
  return (
    <div className="group relative px-5 md:px-6 py-5 border-r border-[color:var(--line)] last:border-r-0 md:border-b-0 border-b overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--amber-400)]/0 to-transparent group-hover:via-[color:var(--amber-400)]/50 transition-colors duration-500"
      />
      <div className="flex items-center gap-2 text-zinc-500">
        <Icon className="h-3.5 w-3.5 text-[color:var(--amber-400)]/70" />
        <span className="kicker-mute">{label}</span>
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="font-display text-2xl md:text-3xl font-bold tabular-nums leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-[10px] text-zinc-500 leading-tight">{sub}</p>
        )}
      </div>
      {visual && <div className="mt-3">{visual}</div>}
    </div>
  );
}

function DotRow({ count, max = 20 }: { count: number; max?: number }) {
  const filled = Math.min(count, max);
  const overflow = count > max;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${
            i < filled
              ? "bg-[color:var(--amber-400)]"
              : "bg-[color:var(--line)]"
          }`}
        />
      ))}
      {overflow && (
        <span className="ml-1 font-mono text-[9px] tracking-wider text-zinc-500">
          +{count - max}
        </span>
      )}
    </div>
  );
}

function RatioBar({
  a,
  b,
  hint,
  muted,
}: {
  a: number;
  b: number;
  hint: string | null;
  muted?: boolean;
}) {
  const total = a + b || 1;
  const pct = Math.round((a / total) * 100);
  return (
    <div className="space-y-1">
      <div className="h-1 rounded-full bg-[color:var(--line)] overflow-hidden">
        <div
          className={`h-full ${
            muted
              ? "bg-zinc-500"
              : "bg-gradient-to-r from-[color:var(--amber-500)] to-[color:var(--amber-400)]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {hint && (
        <p className="font-mono text-[9px] tracking-wider uppercase text-zinc-500">
          {hint}
        </p>
      )}
    </div>
  );
}

function CompletionMeter({ count }: { count: number }) {
  // Scale: 0 → faint, 10 → mid, 50+ → full. Decorative, no fake data.
  const pct = Math.min(100, Math.round((count / 50) * 100));
  return (
    <div className="space-y-1">
      <div className="h-1 rounded-full bg-[color:var(--line)] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[color:var(--amber-500)] to-[color:var(--amber-400)]"
          style={{ width: `${Math.max(pct, count > 0 ? 6 : 0)}%` }}
        />
      </div>
      <p className="font-mono text-[9px] tracking-wider uppercase text-zinc-500">
        {count === 0
          ? "no trades yet"
          : count < 5
            ? "getting started"
            : count < 25
              ? "active trader"
              : "veteran"}
      </p>
    </div>
  );
}

function StarBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block h-3 w-3">
            <Star className="absolute inset-0 h-3 w-3 text-[color:var(--line)]" />
            <span
              aria-hidden
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star className="h-3 w-3 text-[color:var(--amber-400)] fill-[color:var(--amber-400)]" />
            </span>
          </span>
        );
      })}
    </div>
  );
}
