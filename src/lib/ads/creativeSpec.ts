import { z } from "zod";

export const CreativeTemplates = [
  "spotlight",
  "editorial",
  "ticker",
  "ribbon",
] as const;
export type CreativeTemplate = (typeof CreativeTemplates)[number];

export const CreativeAccents = ["amber", "violet", "jade", "rose"] as const;
export type CreativeAccent = (typeof CreativeAccents)[number];

export const creativeSpecSchema = z.object({
  template: z.enum(CreativeTemplates),
  accent: z.enum(CreativeAccents).default("amber"),
  kicker: z.string().max(32).optional(),
  headline: z.string().min(1).max(80),
  subhead: z.string().max(120).optional(),
  ctaLabel: z.string().max(24).default("Shop now"),
  cardImage: z.string().url().optional(),
  cardName: z.string().max(60).optional(),
  price: z.number().nonnegative().optional(),
  priceChangePct: z.number().optional(),
  ribbonLabel: z.string().max(24).optional(),
  sparklineValues: z.array(z.number()).max(64).optional(),
});

export type CreativeSpec = z.infer<typeof creativeSpecSchema>;

const SCHEME = "grail-creative:";

/** Encode a CreativeSpec into a compact URL-safe scheme we can stash
 *  in the existing Ad.mediaUrl column without schema changes. */
export function encodeCreativeSpec(spec: CreativeSpec): string {
  const json = JSON.stringify(spec);
  // base64url — safe for URL fields and shorter than percent-encoding
  const base64 =
    typeof window === "undefined"
      ? Buffer.from(json, "utf8").toString("base64")
      : btoa(unescape(encodeURIComponent(json)));
  const urlSafe = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${SCHEME}${urlSafe}`;
}

export function isCreativeSpecUrl(url: string): boolean {
  return typeof url === "string" && url.startsWith(SCHEME);
}

export function decodeCreativeSpec(url: string): CreativeSpec | null {
  if (!isCreativeSpecUrl(url)) return null;
  try {
    const body = url.slice(SCHEME.length);
    const base64 = body.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json =
      typeof window === "undefined"
        ? Buffer.from(padded, "base64").toString("utf8")
        : decodeURIComponent(escape(atob(padded)));
    const parsed = creativeSpecSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
