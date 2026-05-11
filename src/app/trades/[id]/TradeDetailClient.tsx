"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftRight, Star, Package, CheckCircle2, XCircle,
  AlertTriangle, Send, ChevronLeft, Truck,
} from "lucide-react";
import { cn, formatCurrency, formatRelativeTime, CONDITION_LABELS, CONDITION_COLORS } from "@/lib/utils";
import { calculateFee, formatFeeLabel } from "@/lib/fees";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Trade, TradeItem, CollectionCard, PokemonCard, TradeMessage, User, Rating, TradeSide } from "@/generated/prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────

type PopulatedItem = TradeItem & {
  collectionCard: CollectionCard & { card: PokemonCard };
};

type PopulatedMessage = TradeMessage & {
  user: { id: string; username: string | null; image: string | null };
};

type PopulatedTrade = Trade & {
  initiator: { id: string; username: string | null; image: string | null; completedTrades: number; averageRating: number };
  receiver:  { id: string; username: string | null; image: string | null; completedTrades: number; averageRating: number };
  items: PopulatedItem[];
  messages: PopulatedMessage[];
  ratings: Rating[];
};

interface TradeDetailClientProps {
  trade: PopulatedTrade;
  myId: string;
  myRating: Rating | null;
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; color: string; variant: "default" | "info" | "success" | "warning" | "danger" }> = {
  PENDING:           { label: "Pending",          color: "text-yellow-400", variant: "warning" },
  COUNTERED:         { label: "Counter Offer",     color: "text-yellow-400", variant: "warning" },
  ACCEPTED:          { label: "Accepted",          color: "text-blue-400",   variant: "info" },
  SHIPPED_INITIATOR: { label: "Partially Shipped", color: "text-blue-400",   variant: "info" },
  SHIPPED_RECEIVER:  { label: "Partially Shipped", color: "text-blue-400",   variant: "info" },
  IN_TRANSIT:        { label: "In Transit",        color: "text-blue-400",   variant: "info" },
  COMPLETED:         { label: "Completed",         color: "text-emerald-400",variant: "success" },
  CANCELLED:         { label: "Cancelled",         color: "text-zinc-400",   variant: "default" },
  DISPUTED:          { label: "Disputed",          color: "text-red-400",    variant: "danger" },
  EXPIRED:           { label: "Expired",           color: "text-zinc-400",   variant: "default" },
};

// ── Card thumbnail ────────────────────────────────────────────────────────────

function CardThumb({ item }: { item: PopulatedItem }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900 p-2 hover:border-zinc-700 transition-colors">
      <div className="relative h-14 w-10 shrink-0 rounded overflow-hidden bg-zinc-800">
        <Image
          src={item.collectionCard.card.imageSmall}
          alt={item.collectionCard.card.name}
          fill
          sizes="40px"
          className="object-contain p-0.5"
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-zinc-100 truncate">
          {item.collectionCard.card.name}
        </p>
        <p className="text-[10px] text-zinc-500 truncate">
          {item.collectionCard.card.setName}
        </p>
        <p className={cn("text-[10px] font-medium", CONDITION_COLORS[item.collectionCard.condition])}>
          {CONDITION_LABELS[item.collectionCard.condition]}
        </p>
      </div>
      {item.collectionCard.card.marketPrice != null && (
        <p className="ml-auto text-xs font-semibold text-zinc-400 shrink-0">
          {formatCurrency(item.collectionCard.card.marketPrice)}
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TradeDetailClient({ trade, myId, myRating }: TradeDetailClientProps) {
  const router = useRouter();
  const isInitiator = trade.initiatorId === myId;
  const partner = isInitiator ? trade.receiver : trade.initiator;
  const myItems = trade.items.filter((i) => i.side === (isInitiator ? "INITIATOR" : "RECEIVER") as TradeSide);
  const theirItems = trade.items.filter((i) => i.side === (isInitiator ? "RECEIVER" : "INITIATOR") as TradeSide);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(trade.messages);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [tracking, setTracking] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [localStatus, setLocalStatus] = useState(trade.status);
  const [hasRated, setHasRated] = useState(!!myRating);
  const [error, setError] = useState("");

  const meta = STATUS_META[localStatus] ?? STATUS_META.PENDING;
  const myValue = myItems.reduce((acc, i) => acc + (i.collectionCard.card.marketPrice ?? 0), 0);
  const theirValue = theirItems.reduce((acc, i) => acc + (i.collectionCard.card.marketPrice ?? 0), 0);
  const fee = calculateFee(myValue + theirValue, trade.cashAmount ?? 0);

  async function doAction(action: string, extra?: Record<string, unknown>) {
    setActionLoading(action);
    setError("");
    const res = await fetch(`/api/trades/${trade.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    setActionLoading(null);
    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? "Something went wrong.");
      return;
    }
    const d = await res.json();
    setLocalStatus(d.trade.status);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSendingMsg(true);
    const res = await fetch(`/api/trades/${trade.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: message.trim() }),
    });
    setSendingMsg(false);
    if (!res.ok) return;
    const d = await res.json();
    setMessages((prev) => [...prev, d.message]);
    setMessage("");
  }

  async function submitRating() {
    if (!ratingScore) return;
    setSubmittingRating(true);
    const res = await fetch(`/api/trades/${trade.id}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: ratingScore, comment: ratingComment }),
    });
    setSubmittingRating(false);
    if (res.ok) setHasRated(true);
  }

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push("/trades")}
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mt-1"
        >
          <ChevronLeft className="h-4 w-4" /> Trades
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-extrabold text-zinc-100 flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-yellow-400" />
              Trade with{" "}
              <span className="text-yellow-400">{partner.username ?? "Anonymous"}</span>
            </h1>
            <Badge variant={meta.variant}>{meta.label}</Badge>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Opened {formatRelativeTime(trade.createdAt)} · Expires {formatRelativeTime(trade.expiresAt)}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Card grids */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* My side */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-300 text-sm">Your cards</h2>
            <span className="text-xs text-zinc-500">{formatCurrency(myValue)}</span>
          </div>
          {myItems.map((item) => <CardThumb key={item.id} item={item} />)}
        </div>

        {/* Their side */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-300 text-sm">
              {partner.username ?? "Their"} cards
            </h2>
            <span className="text-xs text-zinc-500">{formatCurrency(theirValue)}</span>
          </div>
          {theirItems.map((item) => <CardThumb key={item.id} item={item} />)}
        </div>
      </div>

      {/* Cash + fee summary */}
      {(trade.cashAmount != null || true) && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 flex flex-wrap gap-6 text-sm">
          {trade.cashAmount != null && trade.cashAmount > 0 && (
            <div>
              <p className="text-zinc-500 text-xs mb-0.5">Cash sweetener</p>
              <p className="font-semibold text-zinc-100">
                {formatCurrency(trade.cashAmount)}{" "}
                <span className="text-zinc-400 font-normal">
                  paid by {trade.cashFromWho === "initiator"
                    ? (isInitiator ? "you" : partner.username ?? "them")
                    : (isInitiator ? partner.username ?? "them" : "you")}
                </span>
              </p>
            </div>
          )}
          <div>
            <p className="text-zinc-500 text-xs mb-0.5">Platform fee</p>
            <p className="font-semibold text-zinc-100">{formatFeeLabel(fee)}</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!["COMPLETED", "CANCELLED", "EXPIRED", "DISPUTED"].includes(localStatus) && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <h3 className="font-semibold text-zinc-200">Actions</h3>

          <div className="flex flex-wrap gap-3">
            {/* Accept — only receiver on PENDING */}
            {localStatus === "PENDING" && !isInitiator && (
              <Button
                onClick={() => doAction("accept")}
                loading={actionLoading === "accept"}
              >
                <CheckCircle2 className="h-4 w-4" /> Accept Trade
              </Button>
            )}

            {/* Mark shipped — both sides on ACCEPTED / one-sided shipped */}
            {["ACCEPTED", "SHIPPED_INITIATOR", "SHIPPED_RECEIVER"].includes(localStatus) &&
              !(localStatus === "SHIPPED_INITIATOR" && isInitiator) &&
              !(localStatus === "SHIPPED_RECEIVER" && !isInitiator) && (
                <div className="flex items-end gap-3">
                  <Input
                    label="Tracking number (optional)"
                    placeholder="1Z999AA10123456784"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    className="w-64"
                  />
                  <Button
                    onClick={() => doAction("mark_shipped", { trackingNumber: tracking || undefined })}
                    loading={actionLoading === "mark_shipped"}
                    variant="secondary"
                  >
                    <Truck className="h-4 w-4" /> Mark Shipped
                  </Button>
                </div>
              )}

            {/* Confirm received */}
            {["SHIPPED_INITIATOR", "SHIPPED_RECEIVER", "IN_TRANSIT"].includes(localStatus) && (
              <Button
                onClick={() => doAction("confirm_received")}
                loading={actionLoading === "confirm_received"}
              >
                <CheckCircle2 className="h-4 w-4" /> Confirm Received
              </Button>
            )}

            {/* Cancel */}
            {["PENDING", "COUNTERED", "ACCEPTED"].includes(localStatus) && (
              <Button
                variant="danger"
                onClick={() => { if (confirm("Cancel this trade?")) doAction("cancel"); }}
                loading={actionLoading === "cancel"}
              >
                <XCircle className="h-4 w-4" /> Cancel
              </Button>
            )}

            {/* Dispute */}
            {["SHIPPED_INITIATOR", "SHIPPED_RECEIVER", "IN_TRANSIT"].includes(localStatus) && (
              <Button
                variant="outline"
                onClick={() => { if (confirm("Open a dispute? Our team will review this trade.")) doAction("dispute"); }}
                loading={actionLoading === "dispute"}
              >
                <AlertTriangle className="h-4 w-4" /> Dispute
              </Button>
            )}
          </div>

          {localStatus === "ACCEPTED" && (
            <p className="text-xs text-zinc-500 flex items-start gap-1.5">
              <Package className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              Trade accepted! Both sides should ship within 3 days. Mark shipped once your package is on its way.
            </p>
          )}
        </div>
      )}

      {/* Rating form */}
      {localStatus === "COMPLETED" && !hasRated && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <h3 className="font-semibold text-zinc-200">Rate your experience</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRatingScore(s)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "h-8 w-8",
                    s <= ratingScore
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-zinc-600 hover:text-zinc-400"
                  )}
                />
              </button>
            ))}
          </div>
          <Input
            placeholder="Leave a comment (optional)"
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
          />
          <Button
            onClick={submitRating}
            loading={submittingRating}
            disabled={!ratingScore}
          >
            Submit Rating
          </Button>
        </div>
      )}

      {localStatus === "COMPLETED" && hasRated && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-300 font-medium">
            Trade complete — thanks for trading on Grail!
          </p>
        </div>
      )}

      {/* Message thread */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="font-semibold text-zinc-200">Messages</h3>
        </div>

        <div className="flex flex-col gap-3 p-4 max-h-80 overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-center text-sm text-zinc-600 py-4">
              No messages yet. Say hi!
            </p>
          )}
          {messages.map((msg) => {
            const isMe = msg.userId === myId;
            return (
              <div key={msg.id} className={cn("flex gap-2.5", isMe && "flex-row-reverse")}>
                <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0 overflow-hidden">
                  {msg.user.image ? (
                    <Image src={msg.user.image} alt="" width={28} height={28} className="object-cover" />
                  ) : (
                    (msg.user.username ?? "?")[0].toUpperCase()
                  )}
                </div>
                <div className={cn("max-w-[75%]", isMe && "items-end flex flex-col")}>
                  <div className={cn(
                    "rounded-2xl px-3.5 py-2.5 text-sm",
                    isMe
                      ? "bg-yellow-400/10 text-zinc-100 border border-yellow-400/20"
                      : "bg-zinc-800 text-zinc-200"
                  )}>
                    {msg.body}
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1 px-1">
                    {formatRelativeTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {!["CANCELLED", "EXPIRED"].includes(localStatus) && (
          <form onSubmit={sendMessage} className="flex gap-2 p-4 border-t border-zinc-800">
            <input
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50"
              placeholder="Type a message…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              type="submit"
              size="icon"
              loading={sendingMsg}
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
