import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { buildFeed, type FeedMode } from "@/lib/feed";

export async function GET(req: Request) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 30), 100);
  const modeParam = searchParams.get("mode");
  const mode: FeedMode = modeParam === "following" ? "following" : "foryou";
  const items = await buildFeed(session?.user?.id ?? null, limit, mode);
  return NextResponse.json({ items });
}
