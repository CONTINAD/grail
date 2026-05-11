import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { findMatches } from "@/lib/matching";
import { MatchCard } from "@/components/trades/MatchCard";
import { Sparkles } from "lucide-react";
import { Counter } from "@/components/motion/Counter";

export const revalidate = 300; // re-run matching every 5 min

export default async function MatchesPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/sign-in");

  const matches = await findMatches(session.user.id, 24);

  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-8 md:py-14">
      <header className="pb-6 md:pb-10 border-b border-[color:var(--line)] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="kicker">
            <Sparkles className="h-3 w-3 inline -mt-0.5 mr-1" />
            The algorithm
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-[0.95]">
            Your matches
          </h1>
          <p className="text-zinc-400 max-w-md">
            {matches.length > 0
              ? `${matches.length} traders found with cards you want — ranked by match quality.`
              : "Add cards to your Collection and Wishlist to see matches."}
          </p>
        </div>
        {matches.length > 0 && (
          <div className="grid grid-cols-3 gap-6 text-right">
            <div>
              <p className="kicker-mute">Total</p>
              <Counter
                value={matches.length}
                className="font-display text-2xl font-bold tabular-nums"
              />
            </div>
            <div>
              <p className="kicker-mute">Elite</p>
              <Counter
                value={matches.filter((m) => m.matchScore >= 85).length}
                className="font-display text-2xl font-bold text-[color:var(--jade-400)] tabular-nums"
              />
            </div>
            <div>
              <p className="kicker-mute">Top score</p>
              <Counter
                value={matches[0]?.matchScore ?? 0}
                className="font-display text-2xl font-bold text-[color:var(--amber-400)] tabular-nums"
              />
            </div>
          </div>
        )}
      </header>

      {matches.length === 0 ? (
        <div className="panel p-16 text-center mt-10 space-y-4">
          <Sparkles className="h-10 w-10 text-[color:var(--amber-400)]/50 mx-auto" />
          <p className="font-display text-2xl">No matches yet</p>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Add cards to your Collection and Wishlist — the algorithm surfaces
            partners continuously.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <a href="/cards/search" className="btn-amber rounded-full px-5 py-2.5 text-sm">
              Add cards
            </a>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-8">
          {matches.map((match) => (
            <MatchCard key={match.userId} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
