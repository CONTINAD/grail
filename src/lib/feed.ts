/**
 * TikTok-style feed ranking.
 *
 * Blends four signals per post:
 *   - engagement (likes + comments + completion rate)   35%
 *   - trade relevance (featured card on viewer wishlist) 25%
 *   - freshness (recency)                                20%
 *   - follow graph (I follow poster OR poster follows me)10%
 *   - diversity exploration (random jitter)              10%
 *
 * Returns a ranked list with ad slots injected at fixed cadence.
 */

import { prisma } from "@/lib/db";

export interface FeedItem {
  kind: "post" | "ad";
  id: string;
  userId?: string;        // for posts
  advertiserId?: string;  // for ads
  username?: string | null;
  userImage?: string | null;
  caption?: string | null;
  mediaUrl: string;
  mediaType: string;
  thumbUrl?: string | null;
  postKind?: string;
  featuredCardId?: string | null;
  featuredCardName?: string | null;
  featuredCardImage?: string | null;
  featuredGradeCompany?: string | null;
  featuredGradeScore?: number | null;
  askingPrice?: number | null;
  openToTrade?: boolean;
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  createdAt?: string;
  liked?: boolean;
  followingAuthor?: boolean;
  // ad-only
  ctaLabel?: string;
  ctaUrl?: string;
  score?: number;          // debug
}

const AD_EVERY = 6; // one ad per 6 organic posts

export type FeedMode = "foryou" | "following";

export async function buildFeed(
  viewerId: string | null,
  limit = 30,
  mode: FeedMode = "foryou"
): Promise<FeedItem[]> {
  // Candidate pool: recent posts (last 30 days), most-engaged first
  const candidateTake = Math.max(limit * 4, 60);

  // If mode=following but no viewer, fall back to foryou
  const effectiveMode: FeedMode = viewerId ? mode : "foryou";

  let followIdFilter: string[] | null = null;
  if (effectiveMode === "following" && viewerId) {
    const follows = await prisma.follow.findMany({
      where: { followerId: viewerId },
      select: { followedId: true },
    });
    followIdFilter = follows.map((f) => f.followedId);
    if (followIdFilter.length === 0) {
      // User follows nobody — return empty so UI can show empty state
      return [];
    }
  }

  const [posts, viewer, viewerLikes, viewerFollows] = await Promise.all([
    prisma.post.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
        ...(followIdFilter ? { userId: { in: followIdFilter } } : {}),
      },
      include: {
        user: {
          select: { id: true, username: true, name: true, image: true },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      take: candidateTake,
    }),
    viewerId
      ? prisma.user.findUnique({
          where: { id: viewerId },
          include: {
            wishlist: { select: { cardId: true, priority: true } },
          },
        })
      : Promise.resolve(null),
    viewerId
      ? prisma.postLike.findMany({
          where: { userId: viewerId },
          select: { postId: true },
        })
      : Promise.resolve([] as { postId: string }[]),
    viewerId
      ? prisma.follow.findMany({
          where: { followerId: viewerId },
          select: { followedId: true },
        })
      : Promise.resolve([] as { followedId: string }[]),
  ]);

  const likedSet = new Set(viewerLikes.map((l) => l.postId));
  const followedSet = new Set(viewerFollows.map((f) => f.followedId));
  const wishlistMap = new Map<string, number>(
    (viewer?.wishlist ?? []).map((w) => [w.cardId, w.priority])
  );

  const now = Date.now();

  const ranked: FeedItem[] = posts
    .map((p) => {
      // 1. Engagement — logarithmic to cap outliers
      const engagementRaw =
        p.likeCount * 1 + p.commentCount * 3 + p.shareCount * 5;
      const engagement = Math.min(Math.log10(engagementRaw + 1) / 3, 1); // 0..1

      // 2. Trade relevance
      let relevance = 0;
      if (p.featuredCardId && wishlistMap.has(p.featuredCardId)) {
        const prio = wishlistMap.get(p.featuredCardId)!; // 1..3
        relevance = 0.6 + prio * 0.13; // 0.73 / 0.86 / 0.99
      } else if (p.kind === "WANT" && viewer) {
        relevance = 0.35; // someone looking for trades is always mildly relevant
      }

      // 3. Freshness — decays over 7 days
      const ageH = (now - p.createdAt.getTime()) / 3600_000;
      const freshness = Math.max(0, 1 - ageH / (24 * 7));

      // 4. Follow bonus
      const follow = followedSet.has(p.userId) ? 1 : 0;

      // 5. Exploration jitter
      const jitter = Math.random();

      const score =
        engagement * 0.35 +
        relevance * 0.25 +
        freshness * 0.2 +
        follow * 0.1 +
        jitter * 0.1;

      return {
        kind: "post" as const,
        id: p.id,
        userId: p.userId,
        username: p.user.username ?? p.user.name,
        userImage: p.user.image,
        caption: p.caption,
        mediaUrl: p.mediaUrl,
        mediaType: p.mediaType,
        thumbUrl: p.thumbUrl,
        postKind: p.kind,
        featuredCardId: p.featuredCardId,
        featuredCardName: p.featuredCardName,
        featuredCardImage: p.featuredCardImage,
        featuredGradeCompany: p.featuredGradeCompany,
        featuredGradeScore: p.featuredGradeScore,
        askingPrice: p.askingPrice,
        openToTrade: p.openToTrade,
        tags: p.tags,
        viewCount: p.viewCount,
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        shareCount: p.shareCount,
        createdAt: p.createdAt.toISOString(),
        liked: likedSet.has(p.id),
        followingAuthor: followedSet.has(p.userId),
        score,
      };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit);

  return injectAds(ranked, viewer?.wishlist.map((w) => w.cardId) ?? []);
}

async function injectAds(
  posts: FeedItem[],
  _viewerWishlistCardIds: string[]
): Promise<FeedItem[]> {
  const ads = await prisma.ad.findMany({
    where: {
      status: "ACTIVE",
      startsAt: { lte: new Date() },
      OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }],
    },
    include: {
      advertiser: {
        select: { id: true, username: true, name: true, image: true },
      },
    },
    take: 20,
  });

  if (ads.length === 0) return posts;

  // Simple round-robin; in production you'd weight by bid × relevance.
  const out: FeedItem[] = [];
  let adIdx = 0;
  posts.forEach((post, i) => {
    out.push(post);
    if ((i + 1) % AD_EVERY === 0 && ads.length > 0) {
      const ad = ads[adIdx % ads.length];
      adIdx++;
      out.push({
        kind: "ad",
        id: `ad_${ad.id}`,
        advertiserId: ad.advertiserId,
        username: ad.advertiser.username ?? ad.advertiser.name,
        userImage: ad.advertiser.image,
        caption: ad.caption,
        mediaUrl: ad.mediaUrl,
        mediaType: ad.mediaType,
        thumbUrl: ad.thumbUrl,
        ctaLabel: ad.ctaLabel,
        ctaUrl: ad.ctaUrl,
        tags: ad.targetTags,
      });
    }
  });
  return out;
}
