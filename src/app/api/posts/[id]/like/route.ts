import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notify } from "@/lib/notifications";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const existing = await prisma.postLike.findUnique({
    where: { postId_userId: { postId: id, userId: session.user.id } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.postLike.delete({ where: { id: existing.id } }),
      prisma.post.update({
        where: { id },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
    return NextResponse.json({ liked: false });
  }

  await prisma.$transaction([
    prisma.postLike.create({
      data: { postId: id, userId: session.user.id },
    }),
    prisma.post.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    }),
  ]);

  // Notify the post's author (skip self-likes)
  const post = await prisma.post.findUnique({
    where: { id },
    select: { userId: true, caption: true },
  });
  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, name: true },
  });
  if (post && post.userId !== session.user.id) {
    await notify({
      userId: post.userId,
      type: "NEW_LIKE",
      title: `@${me?.username ?? me?.name ?? "someone"} liked your post`,
      body: post.caption?.slice(0, 140) ?? "Tap to view",
      href: `/?post=${id}`,
    });
  }

  return NextResponse.json({ liked: true });
}
