import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findMatches } from "@/lib/matching";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const matches = await findMatches(session.user.id, 24);
  return NextResponse.json({ matches });
}
