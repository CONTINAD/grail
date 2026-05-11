import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const PatchSchema = z.object({
  priority:    z.number().int().min(1).max(3).optional(),
  maxCondition:z.enum(["MINT","NEAR_MINT","LIGHTLY_PLAYED","MODERATELY_PLAYED","HEAVILY_PLAYED","DAMAGED"]).optional(),
  cashFlex:    z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.wishlistCard.findUnique({ where: { id } });
  if (!item || item.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = await prisma.wishlistCard.update({
    where: { id },
    data: parsed.data,
    include: { card: true },
  });

  return NextResponse.json({ item: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.wishlistCard.findUnique({ where: { id } });
  if (!item || item.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.wishlistCard.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
