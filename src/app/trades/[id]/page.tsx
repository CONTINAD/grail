import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { TradeDetailClient } from "./TradeDetailClient";

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/sign-in");

  const { id } = await params;

  const trade = await prisma.trade.findUnique({
    where: { id },
    include: {
      initiator: {
        select: {
          id: true, username: true, image: true,
          completedTrades: true, averageRating: true,
        },
      },
      receiver: {
        select: {
          id: true, username: true, image: true,
          completedTrades: true, averageRating: true,
        },
      },
      items: {
        include: { collectionCard: { include: { card: true } } },
      },
      messages: {
        include: { user: { select: { id: true, username: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
      ratings: true,
    },
  });

  if (!trade) notFound();

  const isParticipant =
    trade.initiatorId === session.user.id ||
    trade.receiverId === session.user.id;
  if (!isParticipant) notFound();

  const myId = session.user.id;
  const myRating = trade.ratings.find((r) => r.raterId === myId);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <TradeDetailClient trade={trade} myId={myId} myRating={myRating ?? null} />
    </div>
  );
}
