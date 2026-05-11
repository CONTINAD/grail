import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CardSearchPageClient } from "./CardSearchPageClient";

export default async function CardSearchPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/sign-in");

  const [collectionCards, wishlistCards] = await Promise.all([
    prisma.collectionCard.findMany({
      where: { userId: session.user.id },
      select: { cardId: true },
    }),
    prisma.wishlistCard.findMany({
      where: { userId: session.user.id },
      select: { cardId: true },
    }),
  ]);

  return (
    <Suspense>
      <CardSearchPageClient
        initialCollectionIds={collectionCards.map((c) => c.cardId)}
        initialWishlistIds={wishlistCards.map((w) => w.cardId)}
      />
    </Suspense>
  );
}
