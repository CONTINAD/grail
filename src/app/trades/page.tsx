import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";

const STATUS_VARIANT: Record<string, "default" | "info" | "success" | "warning" | "danger"> = {
  PENDING:           "warning",
  COUNTERED:         "warning",
  ACCEPTED:          "info",
  SHIPPED_INITIATOR: "info",
  SHIPPED_RECEIVER:  "info",
  IN_TRANSIT:        "info",
  COMPLETED:         "success",
  CANCELLED:         "default",
  DISPUTED:          "danger",
  EXPIRED:           "default",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING:           "Pending",
  COUNTERED:         "Counter Offer",
  ACCEPTED:          "Accepted",
  SHIPPED_INITIATOR: "Partially Shipped",
  SHIPPED_RECEIVER:  "Partially Shipped",
  IN_TRANSIT:        "In Transit",
  COMPLETED:         "Completed",
  CANCELLED:         "Cancelled",
  DISPUTED:          "Disputed",
  EXPIRED:           "Expired",
};

export default async function TradesPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/sign-in");

  const trades = await prisma.trade.findMany({
    where: {
      OR: [
        { initiatorId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
    include: {
      initiator: { select: { id: true, username: true, image: true } },
      receiver:  { select: { id: true, username: true, image: true } },
      items: { include: { collectionCard: { include: { card: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const active = trades.filter((t) =>
    !["COMPLETED", "CANCELLED", "EXPIRED"].includes(t.status)
  );
  const history = trades.filter((t) =>
    ["COMPLETED", "CANCELLED", "EXPIRED"].includes(t.status)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-100 flex items-center gap-2">
            <ArrowLeftRight className="h-7 w-7 text-yellow-400" />
            Trades
          </h1>
          <p className="text-zinc-400 mt-1">{active.length} active</p>
        </div>
      </div>

      {trades.length === 0 && (
        <div className="text-center py-24 text-zinc-500">
          <p className="text-lg font-medium">No trades yet</p>
          <p className="text-sm mt-1">
            Head to{" "}
            <Link href="/matches" className="text-yellow-400 hover:underline">
              Matches
            </Link>{" "}
            to propose your first trade.
          </p>
        </div>
      )}

      {active.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-200">Active</h2>
          <div className="space-y-3">
            {active.map((trade) => {
              const partner =
                trade.initiatorId === session.user!.id
                  ? trade.receiver
                  : trade.initiator;
              const myItems = trade.items.filter(
                (i) =>
                  (trade.initiatorId === session.user!.id && i.side === "INITIATOR") ||
                  (trade.receiverId === session.user!.id && i.side === "RECEIVER")
              );
              const theirItems = trade.items.filter(
                (i) =>
                  (trade.initiatorId === session.user!.id && i.side === "RECEIVER") ||
                  (trade.receiverId === session.user!.id && i.side === "INITIATOR")
              );

              return (
                <Link
                  key={trade.id}
                  href={`/trades/${trade.id}`}
                  className="block rounded-2xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                        {(partner.username ?? "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-100 text-sm">
                          {partner.username ?? "Anonymous"}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {myItems.length} → {theirItems.length} cards
                          {trade.cashAmount
                            ? ` · $${trade.cashAmount.toFixed(2)} cash`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={STATUS_VARIANT[trade.status]}>
                        {STATUS_LABEL[trade.status]}
                      </Badge>
                      <span className="text-xs text-zinc-600">
                        {formatRelativeTime(trade.updatedAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {history.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-400">History</h2>
          <div className="space-y-3 opacity-70">
            {history.map((trade) => {
              const partner =
                trade.initiatorId === session.user!.id
                  ? trade.receiver
                  : trade.initiator;
              return (
                <Link
                  key={trade.id}
                  href={`/trades/${trade.id}`}
                  className="block rounded-2xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-zinc-400">
                      Trade with{" "}
                      <span className="font-medium text-zinc-300">
                        {partner.username ?? "Anonymous"}
                      </span>
                    </p>
                    <div className="flex items-center gap-3">
                      <Badge variant={STATUS_VARIANT[trade.status]}>
                        {STATUS_LABEL[trade.status]}
                      </Badge>
                      <span className="text-xs text-zinc-600">
                        {formatRelativeTime(trade.updatedAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
