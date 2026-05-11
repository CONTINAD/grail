import { NextRequest, NextResponse } from "next/server";
import { searchCards } from "@/lib/pokemon-tcg";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const page = Number(req.nextUrl.searchParams.get("page") ?? "1");
  if (!q || q.length < 2) return NextResponse.json({ cards: [], totalCount: 0 });

  try {
    const result = await searchCards(q, page, 60);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Card search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
