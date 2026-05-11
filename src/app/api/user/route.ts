import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const UpdateSchema = z.object({
  username:       z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, and underscores only").optional(),
  bio:            z.string().max(200).optional(),
  location:       z.string().max(100).optional(),
  acceptsCash:    z.boolean().optional(),
  cardOnlyTrades: z.boolean().optional(),
  localTradesOnly:z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Check username uniqueness if being set
  if (parsed.data.username) {
    const conflict = await prisma.user.findFirst({
      where: {
        username: parsed.data.username,
        id: { not: session.user.id },
      },
    });
    if (conflict) {
      return NextResponse.json({ error: "Username is taken." }, { status: 409 });
    }
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      location: true,
      acceptsCash: true,
      cardOnlyTrades: true,
      localTradesOnly: true,
      completedTrades: true,
      averageRating: true,
    },
  });

  return NextResponse.json({ user });
}
