import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const Schema = z.object({
  score:   z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const trade = await prisma.trade.findUnique({ where: { id } });
  if (!trade) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (trade.status !== "COMPLETED") {
    return NextResponse.json({ error: "Can only rate completed trades" }, { status: 400 });
  }

  const isParticipant =
    trade.initiatorId === session.user.id || trade.receiverId === session.user.id;
  if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const ratedId = trade.initiatorId === session.user.id
    ? trade.receiverId
    : trade.initiatorId;

  const rating = await prisma.rating.create({
    data: {
      tradeId: id,
      raterId: session.user.id,
      ratedId,
      score: parsed.data.score,
      comment: parsed.data.comment,
    },
  });

  // Recompute the rated user's average rating
  const allRatings = await prisma.rating.findMany({
    where: { ratedId },
    select: { score: true },
  });
  const avg = allRatings.reduce((s, r) => s + r.score, 0) / allRatings.length;

  await prisma.user.update({
    where: { id: ratedId },
    data: {
      averageRating: Number(avg.toFixed(2)),
      totalRatings: allRatings.length,
    },
  });

  // Notify rated user
  const rater = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true },
  });

  await prisma.notification.create({
    data: {
      userId: ratedId,
      type: "NEW_RATING",
      title: "New rating",
      body: `${rater?.username ?? "Someone"} left you a ${parsed.data.score}-star rating.`,
      data: { tradeId: id },
    },
  });

  return NextResponse.json({ rating }, { status: 201 });
}
