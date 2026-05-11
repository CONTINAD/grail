import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.object({
  watchedMs: z.number().int().nonnegative(),
  completed: z.boolean().default(false),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  // Anonymous viewers increment the counter but don't get a PostView row
  if (!session?.user?.id) {
    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.$transaction([
    prisma.postView.create({
      data: {
        postId: id,
        userId: session.user.id,
        watchedMs: parsed.data.watchedMs,
        completed: parsed.data.completed,
      },
    }),
    prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }),
  ]);
  return NextResponse.json({ ok: true });
}
