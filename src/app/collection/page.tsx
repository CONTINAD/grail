import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CollectionClient } from "./CollectionClient";
import { Counter } from "@/components/motion/Counter";

export default async function CollectionPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/sign-in");

  const collection = await prisma.collectionCard.findMany({
    where: { userId: session.user.id },
    include: { card: true },
    orderBy: { addedAt: "desc" },
  });

  const graded = collection.filter((c) => c.isGraded).length;
  const available = collection.filter((c) => c.forTrade).length;
  const totalValue = collection.reduce(
    (sum, c) => sum + (c.card.marketPrice ?? 0) * c.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-8 md:py-14">
      <header className="pb-6 md:pb-10 border-b border-[color:var(--line)] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="kicker">Your vault</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-[0.95] mt-2">
            Collection
          </h1>
          <p className="text-zinc-400 mt-3 max-w-md">
            {collection.length > 0
              ? `${collection.length} ${collection.length === 1 ? "card" : "cards"} — ${available} open to trade.`
              : "Add your first card to start trading."}
          </p>
        </div>
        {collection.length > 0 && (
          <div className="grid grid-cols-3 gap-6 text-right">
            <div>
              <p className="kicker-mute">Total</p>
              <Counter
                value={collection.length}
                className="font-display text-2xl font-bold tabular-nums"
              />
            </div>
            <div>
              <p className="kicker-mute">Graded</p>
              <Counter
                value={graded}
                className="font-display text-2xl font-bold text-[color:var(--amber-400)] tabular-nums"
              />
            </div>
            <div>
              <p className="kicker-mute">Est. value</p>
              <Counter
                value={Math.round(totalValue)}
                prefix="$"
                className="font-display text-2xl font-bold text-[color:var(--jade-400)] tabular-nums"
              />
            </div>
          </div>
        )}
      </header>
      <div className="mt-8">
        <CollectionClient initialCollection={collection} />
      </div>
    </div>
  );
}
