"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn, formatCurrency, CONDITION_LABELS, CONDITION_COLORS } from "@/lib/utils";
import { calculateFee, formatFeeLabel } from "@/lib/fees";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeftRight, Star, CheckCircle2, DollarSign,
  Info, ChevronDown, ChevronUp,
} from "lucide-react";
import type { CollectionCard, PokemonCard } from "@/generated/prisma/client";

type CollectionItem = CollectionCard & { card: PokemonCard };

interface Partner {
  id: string;
  username: string | null;
  image: string | null;
  completedTrades: number;
  averageRating: number;
  acceptsCash: boolean;
}

interface TradeProposalClientProps {
  partner: Partner;
  myCollection: CollectionItem[];
  theirCollection: CollectionItem[];
  myWishlistIds: string[];
  theirWishlistIds: string[];
}

function CardPickerGrid({
  items,
  selected,
  onToggle,
  highlightIds,
  emptyMessage,
}: {
  items: CollectionItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  highlightIds?: Set<string>;
  emptyMessage: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 12);

  if (items.length === 0) {
    return (
      <p className="text-center py-8 text-sm text-zinc-500">{emptyMessage}</p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {visible.map((item) => {
          const isSelected = selected.has(item.id);
          const isHighlighted = highlightIds?.has(item.cardId);

          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={cn(
                "relative rounded-xl border overflow-hidden text-left transition-all duration-150",
                isSelected
                  ? "border-yellow-400 ring-1 ring-yellow-400/50 shadow-lg shadow-yellow-400/10"
                  : isHighlighted
                  ? "border-blue-500/50 hover:border-blue-400"
                  : "border-zinc-700 hover:border-zinc-500"
              )}
            >
              {/* Card image */}
              <div className="relative aspect-[2.5/3.5] bg-zinc-800">
                <Image
                  src={item.card.imageSmall}
                  alt={item.card.name}
                  fill
                  sizes="120px"
                  className="object-contain p-1"
                />
                {isHighlighted && !isSelected && (
                  <div className="absolute top-1 right-1">
                    <div className="h-2 w-2 rounded-full bg-blue-400" title="They want this" />
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-yellow-400/10 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-yellow-400 drop-shadow" />
                  </div>
                )}
              </div>

              {/* Card label */}
              <div className="px-1.5 py-1 bg-zinc-900">
                <p className="text-[10px] font-semibold text-zinc-200 truncate leading-tight">
                  {item.card.name}
                </p>
                <p className={cn("text-[9px]", CONDITION_COLORS[item.condition])}>
                  {CONDITION_LABELS[item.condition]}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {items.length > 12 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 py-2"
        >
          {showAll ? (
            <><ChevronUp className="h-3.5 w-3.5" /> Show less</>
          ) : (
            <><ChevronDown className="h-3.5 w-3.5" /> Show all {items.length} cards</>
          )}
        </button>
      )}
    </div>
  );
}

export function TradeProposalClient({
  partner,
  myCollection,
  theirCollection,
  myWishlistIds,
  theirWishlistIds,
}: TradeProposalClientProps) {
  const router = useRouter();

  const [mySelected, setMySelected] = useState<Set<string>>(new Set());
  const [theirSelected, setTheirSelected] = useState<Set<string>>(new Set());
  const [cashAmount, setCashAmount] = useState("");
  const [cashFrom, setCashFrom] = useState<"me" | "them">("them");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const mySelectedItems = myCollection.filter((c) => mySelected.has(c.id));
  const theirSelectedItems = theirCollection.filter((c) => theirSelected.has(c.id));

  const myOfferValue = mySelectedItems.reduce((acc, c) => acc + (c.card.marketPrice ?? 0), 0);
  const theirOfferValue = theirSelectedItems.reduce((acc, c) => acc + (c.card.marketPrice ?? 0), 0);
  const cashNum = parseFloat(cashAmount) || 0;
  const tradeValue = myOfferValue + theirOfferValue;
  const fee = calculateFee(tradeValue, cashNum);

  const myWishSet = useMemo(() => new Set(myWishlistIds), [myWishlistIds]);
  const theirWishSet = useMemo(() => new Set(theirWishlistIds), [theirWishlistIds]);

  function toggleMine(id: string) {
    setMySelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleTheirs(id: string) {
    setTheirSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function submit() {
    if (mySelected.size === 0 || theirSelected.size === 0) {
      setError("Select at least one card from each side.");
      return;
    }

    setSubmitting(true);
    setError("");

    const res = await fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiverId: partner.id,
        initiatorItems: [...mySelected].map((id) => ({ collectionCardId: id, quantity: 1 })),
        receiverItems: [...theirSelected].map((id) => ({ collectionCardId: id, quantity: 1 })),
        cashAmount: cashNum > 0 ? cashNum : undefined,
        cashFromWho: cashNum > 0 ? (cashFrom === "me" ? "initiator" : "receiver") : undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to send offer.");
      setSubmitting(false);
      return;
    }

    const data = await res.json();
    router.push(`/trades/${data.trade.id}`);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
            <ArrowLeftRight className="h-6 w-6 text-yellow-400" />
            Propose a Trade
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Select cards to offer and request, then send your offer.
          </p>
        </div>

        {/* Partner badge */}
        <div className="ml-auto flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5">
          <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-300 overflow-hidden">
            {partner.image ? (
              <Image src={partner.image} alt="" width={36} height={36} className="object-cover" />
            ) : (
              (partner.username ?? "?")[0].toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-zinc-100 text-sm">{partner.username ?? "Anonymous"}</p>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{partner.averageRating.toFixed(1)}</span>
              <span>·</span>
              <span>{partner.completedTrades} trades</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column card picker */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* My cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-zinc-100">
              Your offer
              {mySelected.size > 0 && (
                <span className="ml-2 text-sm font-normal text-yellow-400">
                  {mySelected.size} card{mySelected.size !== 1 ? "s" : ""} · {formatCurrency(myOfferValue)}
                </span>
              )}
            </h2>
            <Badge variant="info" className="text-[10px]">
              Blue dot = they want it
            </Badge>
          </div>
          <CardPickerGrid
            items={myCollection}
            selected={mySelected}
            onToggle={toggleMine}
            highlightIds={theirWishSet}
            emptyMessage="No cards available for trade. Add some to your collection first."
          />
        </div>

        {/* Their cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-zinc-100">
              You&apos;re requesting
              {theirSelected.size > 0 && (
                <span className="ml-2 text-sm font-normal text-blue-400">
                  {theirSelected.size} card{theirSelected.size !== 1 ? "s" : ""} · {formatCurrency(theirOfferValue)}
                </span>
              )}
            </h2>
            <Badge variant="primary" className="text-[10px]">
              Gold = on your wishlist
            </Badge>
          </div>
          <CardPickerGrid
            items={theirCollection}
            selected={theirSelected}
            onToggle={toggleTheirs}
            highlightIds={myWishSet}
            emptyMessage="They have no cards available for trade."
          />
        </div>
      </div>

      {/* Cash sweetener */}
      {partner.acceptsCash && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-zinc-400" />
            <h3 className="font-semibold text-zinc-100">Cash sweetener (optional)</h3>
          </div>

          <div className="flex items-end gap-4">
            <div className="w-36">
              <Input
                label="Amount (USD)"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
              />
            </div>

            {cashNum > 0 && (
              <div className="flex gap-2">
                {(["me", "them"] as const).map((side) => (
                  <button
                    key={side}
                    onClick={() => setCashFrom(side)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-sm font-medium border transition-colors",
                      cashFrom === side
                        ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-400"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    )}
                  >
                    {side === "me" ? "I pay" : "They pay"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trade summary */}
      {(mySelected.size > 0 || theirSelected.size > 0) && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
          <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
            <Info className="h-4 w-4 text-zinc-500" />
            Trade summary
          </h3>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-zinc-500 text-xs mb-1">Your cards</p>
              <p className="font-bold text-zinc-100">{formatCurrency(myOfferValue)}</p>
            </div>
            <div className="text-center border-x border-zinc-800">
              <p className="text-zinc-500 text-xs mb-1">Value gap</p>
              <p className={cn(
                "font-bold",
                Math.abs(myOfferValue - theirOfferValue) < 1 ? "text-emerald-400" : "text-orange-400"
              )}>
                {formatCurrency(Math.abs(myOfferValue - theirOfferValue))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-zinc-500 text-xs mb-1">Their cards</p>
              <p className="font-bold text-zinc-100">{formatCurrency(theirOfferValue)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-sm">
            <span className="text-zinc-400">Platform fee</span>
            <span className="text-zinc-300 font-medium">{formatFeeLabel(fee)}</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button
          className="flex-2"
          loading={submitting}
          onClick={submit}
          disabled={mySelected.size === 0 || theirSelected.size === 0}
        >
          <ArrowLeftRight className="h-4 w-4" />
          Send Trade Offer
        </Button>
      </div>
    </div>
  );
}
