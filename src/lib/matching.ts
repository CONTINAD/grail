/**
 * Trade matching algorithm
 *
 * Finds users whose "for trade" collection overlaps with a user's wishlist
 * and vice versa, scoring each potential match 0-100.
 *
 * Score components:
 *   - Mutual card overlap   (60 pts max)
 *   - Value balance         (20 pts max) — less cash sweetener needed = better
 *   - Priority weighting    (10 pts max) — high-priority wishlist cards score more
 *   - Trust score           (10 pts max) — based on completed trades + rating
 */

import { prisma } from "@/lib/db";
import type { CardCondition } from "@/generated/prisma/client";

const CONDITION_RANK: Record<CardCondition, number> = {
  MINT: 5,
  NEAR_MINT: 4,
  LIGHTLY_PLAYED: 3,
  MODERATELY_PLAYED: 2,
  HEAVILY_PLAYED: 1,
  DAMAGED: 0,
};

export interface TradeMatch {
  userId: string          // the matched trading partner
  username: string | null
  image: string | null
  matchScore: number      // 0-100
  theyHaveForYou: string[]  // cardIds from their collection on your wishlist
  youHaveForThem: string[]  // cardIds from your collection on their wishlist
  estimatedYourValue: number
  estimatedTheirValue: number
  suggestedCashAmount: number   // positive = they owe you, negative = you owe them
  completedTrades: number
  averageRating: number
}

/**
 * Find the top trade matches for a given user.
 * @param userId  The user looking for trades
 * @param limit   Max matches to return
 */
export async function findMatches(
  userId: string,
  limit = 20
): Promise<TradeMatch[]> {
  // 1. Load our wishlist
  const myWishlist = await prisma.wishlistCard.findMany({
    where: { userId },
    include: { card: true },
  });

  // 2. Load our tradeable collection
  const myCollection = await prisma.collectionCard.findMany({
    where: { userId, forTrade: true, quantity: { gte: 1 } },
    include: { card: true },
  });

  if (myWishlist.length === 0 || myCollection.length === 0) return [];

  const myWishlistCardIds = new Set(myWishlist.map((w) => w.cardId));
  const myCollectionCardIds = new Set(myCollection.map((c) => c.cardId));

  // 3. Find all users who have ≥1 of our wishlist cards available for trade
  const potentialPartners = await prisma.user.findMany({
    where: {
      id: { not: userId },
      collection: {
        some: {
          cardId: { in: [...myWishlistCardIds] },
          forTrade: true,
        },
      },
    },
    include: {
      collection: {
        where: { forTrade: true },
        include: { card: true },
      },
      wishlist: {
        include: { card: true },
      },
    },
    take: 200, // pre-filter before scoring
  });

  const scored: TradeMatch[] = [];

  for (const partner of potentialPartners) {
    const partnerCollectionIds = new Set(partner.collection.map((c) => c.cardId));
    const partnerWishlistIds = new Set(partner.wishlist.map((w) => w.cardId));

    // Cards they have that I want
    const theyHaveForMe = myWishlist.filter((w) => {
      if (!partnerCollectionIds.has(w.cardId)) return false;
      const theirCard = partner.collection.find((c) => c.cardId === w.cardId)!;
      return CONDITION_RANK[theirCard.condition] >= CONDITION_RANK[w.maxCondition];
    });

    // Cards I have that they want
    const iHaveForThem = myCollection.filter((c) => {
      if (!partnerWishlistIds.has(c.cardId)) return false;
      const theirWish = partner.wishlist.find((w) => w.cardId === c.cardId)!;
      return CONDITION_RANK[c.condition] >= CONDITION_RANK[theirWish.maxCondition];
    });

    if (theyHaveForMe.length === 0 || iHaveForThem.length === 0) continue;

    // ── Score: card overlap (60 pts) ─────────────────────────────────────────
    const overlapScore =
      Math.min(theyHaveForMe.length / myWishlist.length, 1) * 30 +
      Math.min(iHaveForThem.length / partner.wishlist.length, 1) * 30;

    // ── Score: priority weighting (10 pts) ───────────────────────────────────
    const prioritySum = theyHaveForMe.reduce((acc, w) => acc + w.priority, 0);
    const maxPriority = theyHaveForMe.length * 3;
    const priorityScore = (prioritySum / maxPriority) * 10;

    // ── Score: value balance (20 pts) ────────────────────────────────────────
    const myOfferValue = iHaveForThem.reduce(
      (acc, c) => acc + (c.card.marketPrice ?? 0),
      0
    );
    const theirOfferValue = theyHaveForMe.reduce(
      (acc, w) => {
        const theirCard = partner.collection.find((c) => c.cardId === w.cardId)!;
        return acc + (theirCard.card.marketPrice ?? 0);
      },
      0
    );

    const totalValue = myOfferValue + theirOfferValue;
    const diff = Math.abs(myOfferValue - theirOfferValue);
    const balanceScore = totalValue > 0
      ? Math.max(0, (1 - diff / totalValue)) * 20
      : 10; // no price data → neutral

    // ── Score: trust (10 pts) ────────────────────────────────────────────────
    const trustScore =
      Math.min(partner.completedTrades / 20, 1) * 5 +
      (partner.averageRating / 5) * 5;

    const totalScore = Math.round(
      overlapScore + priorityScore + balanceScore + trustScore
    );

    const suggestedCash = myOfferValue - theirOfferValue; // + means they owe me

    scored.push({
      userId: partner.id,
      username: partner.username,
      image: partner.image,
      matchScore: Math.min(totalScore, 100),
      theyHaveForYou: theyHaveForMe.map((w) => w.cardId),
      youHaveForThem: iHaveForThem.map((c) => c.cardId),
      estimatedYourValue: myOfferValue,
      estimatedTheirValue: theirOfferValue,
      suggestedCashAmount: suggestedCash,
      completedTrades: partner.completedTrades,
      averageRating: partner.averageRating,
    });
  }

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
}
