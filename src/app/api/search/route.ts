import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ users: [], cards: [], tags: [] });
  }

  const isTag = q.startsWith("#");
  const term = isTag ? q.slice(1) : q;

  const [users, cards, posts] = await Promise.all([
    isTag
      ? Promise.resolve([])
      : prisma.user.findMany({
          where: {
            OR: [
              { username: { contains: term, mode: "insensitive" } },
              { name: { contains: term, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            completedTrades: true,
            averageRating: true,
          },
          take: 8,
        }),
    isTag
      ? Promise.resolve([])
      : prisma.pokemonCard.findMany({
          where: {
            name: { contains: term, mode: "insensitive" },
          },
          orderBy: { marketPrice: "desc" },
          take: 12,
          select: {
            id: true,
            name: true,
            setName: true,
            imageSmall: true,
            rarity: true,
            marketPrice: true,
          },
        }),
    prisma.post.findMany({
      where: isTag
        ? { tags: { has: term.toLowerCase() } }
        : {
            OR: [
              { caption: { contains: term, mode: "insensitive" } },
              { featuredCardName: { contains: term, mode: "insensitive" } },
              { tags: { has: term.toLowerCase() } },
            ],
          },
      orderBy: { likeCount: "desc" },
      take: 12,
      include: {
        user: { select: { id: true, username: true, name: true, image: true } },
      },
    }),
  ]);

  return NextResponse.json({ users, cards, posts });
}
