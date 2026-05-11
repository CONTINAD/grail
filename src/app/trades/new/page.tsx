import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { TradeProposalClient } from "./TradeProposalClient";

export default async function NewTradePage({
  searchParams,
}: {
  searchParams: Promise<{ with?: string }>;
}) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/sign-in");

  const { with: partnerId } = await searchParams;
  if (!partnerId) redirect("/matches");

  const [partner, myCollection, theirCollection, myWishlist, theirWishlist] =
    await Promise.all([
      // Partner info
      prisma.user.findUnique({
        where: { id: partnerId },
        select: {
          id: true,
          username: true,
          image: true,
          completedTrades: true,
          averageRating: true,
          acceptsCash: true,
        },
      }),
      // My tradeable cards
      prisma.collectionCard.findMany({
        where: { userId: session.user.id, forTrade: true },
        include: { card: true },
        orderBy: { addedAt: "desc" },
      }),
      // Their tradeable cards
      prisma.collectionCard.findMany({
        where: { userId: partnerId, forTrade: true },
        include: { card: true },
        orderBy: { addedAt: "desc" },
      }),
      // My wishlist
      prisma.wishlistCard.findMany({
        where: { userId: session.user.id },
        select: { cardId: true },
      }),
      // Their wishlist
      prisma.wishlistCard.findMany({
        where: { userId: partnerId },
        select: { cardId: true },
      }),
    ]);

  if (!partner) notFound();

  const myWishlistIds = new Set(myWishlist.map((w) => w.cardId));
  const theirWishlistIds = new Set(theirWishlist.map((w) => w.cardId));

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <TradeProposalClient
        partner={partner}
        myCollection={myCollection}
        theirCollection={theirCollection}
        myWishlistIds={[...myWishlistIds]}
        theirWishlistIds={[...theirWishlistIds]}
      />
    </div>
  );
}
