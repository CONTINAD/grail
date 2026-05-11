import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  mediaUrl: z.string().url(),
  mediaType: z.enum(["video", "image"]).default("video"),
  thumbUrl: z.string().url().optional(),
  caption: z.string().max(2200).optional(),
  kind: z.enum(["SHOWCASE", "WANT", "PACK_OPEN", "TRADE_STORY"]).default("SHOWCASE"),
  featuredCardId: z.string().optional(),
  featuredCardName: z.string().optional(),
  featuredCardImage: z.string().url().optional(),
  featuredGradeCompany: z.enum(["PSA", "BGS", "CGC", "SGC"]).optional(),
  featuredGradeScore: z.number().min(1).max(10).optional(),
  askingPrice: z.number().nonnegative().optional(),
  openToTrade: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const post = await prisma.post.create({
    data: {
      ...parsed.data,
      userId: session.user.id,
    },
  });
  return NextResponse.json({ post }, { status: 201 });
}
