import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Sparkles,
  ArrowLeftRight,
  ShieldCheck,
  Truck,
  Star,
  DollarSign,
  Heart,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { MarkReadOnMount } from "@/components/notifications/MarkReadOnMount";

export const dynamic = "force-dynamic";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  NEW_MATCH: Sparkles,
  TRADE_OFFER: ArrowLeftRight,
  TRADE_COUNTERED: ArrowLeftRight,
  TRADE_ACCEPTED: ShieldCheck,
  TRADE_CANCELLED: ArrowLeftRight,
  ITEM_SHIPPED: Truck,
  TRADE_COMPLETED: ShieldCheck,
  NEW_RATING: Star,
  PRICE_ALERT: DollarSign,
  NEW_LIKE: Heart,
  NEW_COMMENT: MessageCircle,
  NEW_FOLLOW: UserPlus,
};

const COLORS: Record<string, string> = {
  NEW_MATCH: "text-yellow-400 bg-yellow-400/10",
  TRADE_OFFER: "text-blue-400 bg-blue-400/10",
  TRADE_COUNTERED: "text-blue-400 bg-blue-400/10",
  TRADE_ACCEPTED: "text-emerald-400 bg-emerald-400/10",
  TRADE_CANCELLED: "text-red-400 bg-red-400/10",
  ITEM_SHIPPED: "text-orange-400 bg-orange-400/10",
  TRADE_COMPLETED: "text-emerald-400 bg-emerald-400/10",
  NEW_RATING: "text-fuchsia-400 bg-fuchsia-400/10",
  PRICE_ALERT: "text-emerald-400 bg-emerald-400/10",
  NEW_LIKE: "text-red-400 bg-red-400/10",
  NEW_COMMENT: "text-blue-400 bg-blue-400/10",
  NEW_FOLLOW: "text-yellow-400 bg-yellow-400/10",
};

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/sign-in?callbackUrl=/notifications");

  const items = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <MarkReadOnMount />
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-6 w-6 text-yellow-400" />
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-100">Notifications</h1>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <Bell className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-300">You&apos;re all caught up</h3>
          <p className="text-sm text-zinc-500 mt-1">
            New matches, likes, and trade updates show up here.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            const color = COLORS[n.type] ?? "text-zinc-400 bg-zinc-800";
            const data = (n.data as { href?: string } | null) ?? null;
            const href = data?.href ?? "#";
            const row = (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-4 transition-colors ${
                  n.read
                    ? "border-zinc-800 bg-zinc-900"
                    : "border-yellow-400/20 bg-yellow-400/[0.03]"
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-100">{n.title}</p>
                  <p className="text-sm text-zinc-400 mt-0.5 leading-relaxed">
                    {n.body}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1.5">
                    {formatDistanceToNow(n.createdAt, { addSuffix: true })}
                  </p>
                </div>
                {!n.read && (
                  <span className="h-2 w-2 rounded-full bg-yellow-400 shrink-0 mt-1.5" />
                )}
              </div>
            );
            return (
              <li key={n.id}>
                {href !== "#" ? <Link href={href}>{row}</Link> : row}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
