import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

// mediaUrl accepts either a normal URL (uploaded media) or an in-app
// designed creative encoded as `grail-creative:<base64url>`.
const mediaUrlSchema = z
  .string()
  .min(1)
  .refine(
    (v) =>
      v.startsWith("grail-creative:") ||
      /^https?:\/\//i.test(v) ||
      /^data:/i.test(v),
    "Must be an https URL, data URI, or grail-creative spec"
  );

const schema = z.object({
  title: z.string().min(2).max(120),
  caption: z.string().max(2200).optional(),
  mediaUrl: mediaUrlSchema,
  mediaType: z.enum(["video", "image"]).default("video"),
  thumbUrl: z.string().url().optional(),
  ctaLabel: z.string().max(40).default("Learn More"),
  ctaUrl: z.string().url(),
  targetTags: z.array(z.string()).default([]),
  dailyBudgetUsd: z.number().positive().default(10),
  totalBudgetUsd: z.number().positive().optional(),
  cpmUsd: z.number().positive().default(2.5),
});

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ads = await prisma.ad.findMany({
    where: { advertiserId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ads });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const ad = await prisma.ad.create({
    data: { ...parsed.data, advertiserId: session.user.id },
  });
  return NextResponse.json({ ad }, { status: 201 });
}
