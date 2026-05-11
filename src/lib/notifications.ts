/**
 * Tiny helper for creating Notification rows.
 * Swallow errors — notifications are nice-to-have, not critical path.
 */

import { prisma } from "@/lib/db";

type NotifType =
  | "NEW_MATCH"
  | "TRADE_OFFER"
  | "TRADE_COUNTERED"
  | "TRADE_ACCEPTED"
  | "TRADE_CANCELLED"
  | "ITEM_SHIPPED"
  | "TRADE_COMPLETED"
  | "NEW_RATING"
  | "PRICE_ALERT"
  | "NEW_LIKE"
  | "NEW_COMMENT"
  | "NEW_FOLLOW";

interface NotifyArgs {
  userId: string;
  type: NotifType;
  title: string;
  body: string;
  href?: string;
}

export async function notify({ userId, type, title, body, href }: NotifyArgs) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data: href ? { href } : undefined,
      },
    });
  } catch (e) {
    console.error("notify failed:", e);
  }
}
