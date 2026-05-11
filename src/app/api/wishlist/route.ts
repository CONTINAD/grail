import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { upsertCard } from "@/lib/pokemon-tcg";
import { z } from "zod";

const AddSchema = z.object({
  cardId:       z.string(),
  maxCondition: z.enum(["MINT","NEAR_MINT","LIGHTLY_PLAYED","MODERATELY_PLAYED","HEAVILY_PLAYED","DAMAGED"]).optional(),
  language:     z.string().optional(),
  cashFlex:     z.boolean().optional(),
  priority:     z.number().int().min(1).max(3).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = AddSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const {
    cardId,
    maxCondition = "LIGHTLY_PLAYED",
    language = "EN",
    cashFlex = true,
    priority = 1,
  } = parsed.data;

  // Fetch full card from TCGdex and upsert to DB (no-op if already fresh)
  const card = await upsertCard(cardId);
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const item = await prisma.wishlistCard.upsert({
    where: { userId_cardId: { userId: session.user.id, cardId } },
    create: { userId: session.user.id, cardId, maxCondition, language, cashFlex, priority },
    update: { priority },
    include: { card: true },
  });

  return NextResponse.json({ item }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const cardId = searchParams.get("cardId");
  if (!cardId) {
    return NextResponse.json({ error: "cardId required" }, { status: 400 });
  }
  await prisma.wishlistCard.deleteMany({
    where: { userId: session.user.id, cardId },
  });
  return NextResponse.json({ success: true });
}
