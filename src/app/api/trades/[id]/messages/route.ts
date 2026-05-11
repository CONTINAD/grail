import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const Schema = z.object({ body: z.string().min(1).max(1000) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const trade = await prisma.trade.findUnique({ where: { id } });
  if (!trade) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isParticipant =
    trade.initiatorId === session.user.id || trade.receiverId === session.user.id;
  if (!isParticipant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (["CANCELLED", "EXPIRED"].includes(trade.status)) {
    return NextResponse.json({ error: "Cannot message a closed trade" }, { status: 400 });
  }

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid message" }, { status: 400 });

  const message = await prisma.tradeMessage.create({
    data: { tradeId: id, userId: session.user.id, body: parsed.data.body },
    include: { user: { select: { id: true, username: true, image: true } } },
  });

  // Notify the other person
  const recipientId = trade.initiatorId === session.user.id
    ? trade.receiverId
    : trade.initiatorId;

  await prisma.notification.create({
    data: {
      userId: recipientId,
      type: "TRADE_OFFER",  // closest available type
      title: "New message",
      body: `${message.user.username ?? "Your trade partner"} sent you a message.`,
      data: { tradeId: id },
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
