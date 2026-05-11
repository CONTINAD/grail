import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { upsertCard } from "@/lib/pokemon-tcg";
import { z } from "zod";

const AddSchema = z.object({
  cardId:       z.string(),
  condition:    z.enum(["MINT","NEAR_MINT","LIGHTLY_PLAYED","MODERATELY_PLAYED","HEAVILY_PLAYED","DAMAGED"]).optional(),
  quantity:     z.number().int().min(1).optional(),
  forTrade:     z.boolean().optional(),
  language:     z.string().optional(),
  isGraded:     z.boolean().optional(),
  gradeCompany: z.string().optional(),
  gradeScore:   z.number().optional(),
  notes:        z.string().optional(),
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
    condition = "NEAR_MINT",
    quantity = 1,
    forTrade = true,
    language = "EN",
    ...rest
  } = parsed.data;

  // Fetch full card from TCGdex and upsert to DB (no-op if already fresh)
  const card = await upsertCard(cardId);
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const item = await prisma.collectionCard.upsert({
    where: {
      userId_cardId_condition_language: {
        userId: session.user.id,
        cardId,
        condition,
        language,
      },
    },
    create: {
      userId: session.user.id,
      cardId,
      condition,
      quantity,
      forTrade,
      language,
      ...rest,
    },
    update: { quantity: { increment: quantity } },
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
  await prisma.collectionCard.deleteMany({
    where: { userId: session.user.id, cardId },
  });
  return NextResponse.json({ success: true });
}
