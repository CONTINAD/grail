import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { addDays } from "date-fns";

const TradeItemSchema = z.object({
  collectionCardId: z.string(),
  quantity: z.number().int().min(1).default(1),
});

const CreateTradeSchema = z.object({
  receiverId:       z.string(),
  initiatorItems:   z.array(TradeItemSchema).min(1),
  receiverItems:    z.array(TradeItemSchema).min(1),
  cashAmount:       z.number().min(0).optional(),
  cashFromWho:      z.enum(["initiator","receiver"]).optional(),
  matchScore:       z.number().int().min(0).max(100).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateTradeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { receiverId, initiatorItems, receiverItems, cashAmount, cashFromWho, matchScore } = parsed.data;

  if (receiverId === session.user.id) {
    return NextResponse.json({ error: "Cannot trade with yourself" }, { status: 400 });
  }

  // Verify all initiator cards belong to the session user
  const iCardIds = initiatorItems.map((i) => i.collectionCardId);
  const iCards = await prisma.collectionCard.findMany({
    where: { id: { in: iCardIds }, userId: session.user.id, forTrade: true },
  });
  if (iCards.length !== iCardIds.length) {
    return NextResponse.json({ error: "One or more cards are not available for trade" }, { status: 400 });
  }

  const trade = await prisma.trade.create({
    data: {
      initiatorId: session.user.id,
      receiverId,
      cashAmount,
      cashFromWho,
      matchScore,
      expiresAt: addDays(new Date(), 7),
      items: {
        create: [
          ...initiatorItems.map((i) => ({ side: "INITIATOR" as const, collectionCardId: i.collectionCardId, quantity: i.quantity })),
          ...receiverItems.map((i)  => ({ side: "RECEIVER"  as const, collectionCardId: i.collectionCardId, quantity: i.quantity })),
        ],
      },
    },
    include: {
      initiator: { select: { id: true, username: true } },
      receiver:  { select: { id: true, username: true } },
      items: { include: { collectionCard: { include: { card: true } } } },
    },
  });

  // Notify receiver
  await prisma.notification.create({
    data: {
      userId: receiverId,
      type: "TRADE_OFFER",
      title: "New trade offer",
      body: `${trade.initiator.username ?? "Someone"} wants to trade with you!`,
      data: { tradeId: trade.id },
    },
  });

  return NextResponse.json({ trade }, { status: 201 });
}
