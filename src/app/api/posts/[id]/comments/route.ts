import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notify } from "@/lib/notifications";

const schema = z.object({ body: z.string().min(1).max(500) });

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await prisma.postComment.findMany({
    where: { postId: id },
    include: {
      user: { select: { username: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ comments });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  const [comment] = await prisma.$transaction([
    prisma.postComment.create({
      data: {
        postId: id,
        userId: session.user.id,
        body: parsed.data.body,
      },
      include: {
        user: { select: { username: true, name: true, image: true } },
      },
    }),
    prisma.post.update({
      where: { id },
      data: { commentCount: { increment: 1 } },
    }),
  ]);

  const post = await prisma.post.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (post && post.userId !== session.user.id) {
    const me = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true, name: true },
    });
    await notify({
      userId: post.userId,
      type: "NEW_COMMENT",
      title: `@${me?.username ?? me?.name ?? "someone"} commented`,
      body: parsed.data.body.slice(0, 140),
      href: `/?post=${id}`,
    });
  }

  return NextResponse.json({ comment }, { status: 201 });
}
