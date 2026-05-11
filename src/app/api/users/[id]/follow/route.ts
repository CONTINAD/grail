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
  const { id: followedId } = await params;
  if (followedId === session.user.id) {
    return NextResponse.json({ error: "Cannot follow self" }, { status: 400 });
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followedId: { followerId: session.user.id, followedId },
    },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return NextResponse.json({ following: false });
  }

  await prisma.follow.create({
    data: { followerId: session.user.id, followedId },
  });

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, name: true },
  });
  await notify({
    userId: followedId,
    type: "NEW_FOLLOW",
    title: `@${me?.username ?? me?.name ?? "someone"} followed you`,
    body: "Tap to view their profile",
    href: `/u/${session.user.id}`,
  });

  return NextResponse.json({ following: true });
}
