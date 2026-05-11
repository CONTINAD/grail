import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const PatchSchema = z.object({
  action: z.enum(["accept","cancel","mark_shipped","confirm_received","dispute"]),
  trackingNumber: z.string().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const trade = await prisma.trade.findUnique({
    where: { id },
    include: {
      initiator: { select: { id: true, username: true, image: true, averageRating: true, completedTrades: true } },
      receiver:  { select: { id: true, username: true, image: true, averageRating: true, completedTrades: true } },
      items: { include: { collectionCard: { include: { card: true } } } },
      messages: { include: { user: { select: { id: true, username: true, image: true } } }, orderBy: { createdAt: "asc" } },
      ratings: true,
    },
  });

  if (!trade) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (trade.initiatorId !== session.user.id && trade.receiverId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ trade });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const trade = await prisma.trade.findUnique({ where: { id } });
  if (!trade) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isInitiator = trade.initiatorId === session.user.id;
  const isReceiver  = trade.receiverId  === session.user.id;
  if (!isInitiator && !isReceiver) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { action, trackingNumber } = parsed.data;

  let updatedTrade;

  switch (action) {
    case "accept":
      if (!isReceiver || trade.status !== "PENDING") {
        return NextResponse.json({ error: "Cannot accept this trade" }, { status: 400 });
      }
      updatedTrade = await prisma.trade.update({
        where: { id },
        data: { status: "ACCEPTED" },
      });
      await prisma.notification.create({
        data: {
          userId: trade.initiatorId,
          type: "TRADE_ACCEPTED",
          title: "Trade accepted!",
          body: "Your trade offer was accepted. Time to ship!",
          data: { tradeId: id },
        },
      });
      break;

    case "cancel":
      if (!["PENDING","COUNTERED","ACCEPTED"].includes(trade.status)) {
        return NextResponse.json({ error: "Cannot cancel at this stage" }, { status: 400 });
      }
      updatedTrade = await prisma.trade.update({
        where: { id },
        data: { status: "CANCELLED" },
      });
      break;

    case "mark_shipped": {
      const shippableStatuses = ["ACCEPTED", "SHIPPED_INITIATOR", "SHIPPED_RECEIVER"];
      if (!shippableStatuses.includes(trade.status)) {
        return NextResponse.json({ error: "Trade must be accepted before shipping" }, { status: 400 });
      }
      const shippedStatus = isInitiator ? "SHIPPED_INITIATOR" : "SHIPPED_RECEIVER";
      const tracking      = isInitiator
        ? { initiatorTracking: trackingNumber }
        : { receiverTracking: trackingNumber };

      // Check if the other side already shipped → both in transit
      const otherShipped =
        (isInitiator && trade.status === "SHIPPED_RECEIVER") ||
        (isReceiver  && trade.status === "SHIPPED_INITIATOR");

      updatedTrade = await prisma.trade.update({
        where: { id },
        data: { status: otherShipped ? "IN_TRANSIT" : shippedStatus, ...tracking },
      });
      break;
    }

    case "confirm_received":
      if (!["SHIPPED_INITIATOR","SHIPPED_RECEIVER","IN_TRANSIT"].includes(trade.status)) {
        return NextResponse.json({ error: "Cannot confirm at this stage" }, { status: 400 });
      }
      updatedTrade = await prisma.trade.update({
        where: { id },
        data: { status: "COMPLETED", completedAt: new Date() },
      });
      // Increment completed trade counts
      await prisma.user.updateMany({
        where: { id: { in: [trade.initiatorId, trade.receiverId] } },
        data: { completedTrades: { increment: 1 } },
      });
      break;

    case "dispute":
      updatedTrade = await prisma.trade.update({
        where: { id },
        data: { status: "DISPUTED" },
      });
      break;

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ trade: updatedTrade });
}
