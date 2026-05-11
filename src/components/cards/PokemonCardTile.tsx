"use client";

import Image from "next/image";
import { cn, CONDITION_LABELS, CONDITION_COLORS, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Bookmark, CheckCircle2 } from "lucide-react";
import { GradeBadge } from "@/components/cards/GradeBadge";

interface PokemonCardTileProps {
  card: {
    id: string;
    name: string;
    imageSmall: string;
    setName: string;
    rarity?: string | null;
    marketPrice?: number | null;
    number: string;
  };
  condition?: string;
  inCollection?: boolean;
  inWishlist?: boolean;
  forTrade?: boolean;
  isGraded?: boolean;
  gradeCompany?: string | null;
  gradeScore?: number | null;
  onAddToCollection?: () => void;
  onAddToWishlist?: () => void;
  onClick?: () => void;
  className?: string;
}

export function PokemonCardTile({
  card,
  condition,
  inCollection,
  inWishlist,
  forTrade,
  isGraded,
  gradeCompany,
  gradeScore,
  onAddToCollection,
  onAddToWishlist,
  onClick,
  className,
}: PokemonCardTileProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden",
        "hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/5 transition-all duration-200",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Card Image */}
      <div className="relative aspect-[2.5/3.5] bg-zinc-800 overflow-hidden">
        <Image
          src={card.imageSmall}
          alt={card.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />

        {/* For Trade badge */}
        {forTrade && (
          <div className="absolute top-2 right-2">
            <Badge variant="primary" className="text-[10px] px-1.5 py-0.5">
              For Trade
            </Badge>
          </div>
        )}

        {/* Grade slab badge */}
        {isGraded && gradeCompany && gradeScore != null && (
          <div className="absolute top-2 left-2">
            <GradeBadge company={gradeCompany} score={gradeScore} size="sm" />
          </div>
        )}

        {/* Hover overlay */}
        {(onAddToCollection || onAddToWishlist) && (
          <div className="absolute inset-0 bg-zinc-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
            {onAddToCollection && (
              <Button
                size="sm"
                variant={inCollection ? "secondary" : "primary"}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCollection();
                }}
                className="text-xs"
              >
                {inCollection ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Owned
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    Collection
                  </>
                )}
              </Button>
            )}
            {onAddToWishlist && (
              <Button
                size="sm"
                variant={inWishlist ? "secondary" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToWishlist();
                }}
                className="text-xs"
              >
                <Bookmark
                  className={cn("h-3.5 w-3.5", inWishlist && "fill-current")}
                />
                {inWishlist ? "Saved" : "Wishlist"}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3 space-y-1">
        <p className="text-sm font-semibold text-zinc-100 leading-tight truncate">
          {card.name}
        </p>
        <p className="text-xs text-zinc-500 truncate">
          {card.setName} · #{card.number}
        </p>

        <div className="flex items-center justify-between pt-1">
          {condition ? (
            <span className={cn("text-xs font-medium", CONDITION_COLORS[condition])}>
              {CONDITION_LABELS[condition]}
            </span>
          ) : card.rarity ? (
            <span className="text-xs text-zinc-500 truncate">{card.rarity}</span>
          ) : (
            <span />
          )}

          {card.marketPrice != null && (
            <span className="text-xs font-semibold text-zinc-300">
              {formatCurrency(card.marketPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
