"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  ArrowLeftRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  UserPlus,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import type { FeedItem } from "@/lib/feed";
import { cn } from "@/lib/utils";
import { CommentSheet } from "./CommentSheet";
import { GradeBadge } from "@/components/cards/GradeBadge";
import { AdCreative } from "@/components/ads/AdCreative";
import {
  decodeCreativeSpec,
  isCreativeSpecUrl,
} from "@/lib/ads/creativeSpec";

interface Props {
  item: FeedItem;
  isActive: boolean;
  viewerId: string | null;
}

export function FeedCard({ item, isActive, viewerId }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(Boolean(item.liked));
  const [likeCount, setLikeCount] = useState(item.likeCount ?? 0);
  const [commentCount, setCommentCount] = useState(item.commentCount ?? 0);
  const [following, setFollowing] = useState(Boolean(item.followingAuthor));
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [heartBurst, setHeartBurst] = useState(false);
  const watchStartRef = useRef<number | null>(null);
  const lastTapRef = useRef(0);

  const isAd = item.kind === "ad";
  const isVideo = item.mediaType === "video";
  const creativeSpec =
    isAd && isCreativeSpecUrl(item.mediaUrl)
      ? decodeCreativeSpec(item.mediaUrl)
      : null;
  const isCreativeAd = Boolean(creativeSpec);

  // Auto-play when active, pause when not
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.currentTime = 0;
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      watchStartRef.current = Date.now();
    } else {
      v.pause();
      setPlaying(false);
      // Log view if we have a start time
      if (watchStartRef.current && !isAd) {
        const watchedMs = Date.now() - watchStartRef.current;
        fetch(`/api/posts/${item.id}/view`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ watchedMs, completed: v.ended }),
        }).catch(() => {});
        watchStartRef.current = null;
      }
    }
  }, [isActive, isAd, item.id]);

  // Keyboard shortcuts — respond only when active
  useEffect(() => {
    if (!isActive) return;
    const handleToggle = () => togglePlay();
    const handleMute = () => setMuted((m) => !m);
    const handleLike = () => toggleLike();
    document.addEventListener("feed-toggle-play", handleToggle);
    document.addEventListener("feed-toggle-mute", handleMute);
    document.addEventListener("feed-like-active", handleLike);
    return () => {
      document.removeEventListener("feed-toggle-play", handleToggle);
      document.removeEventListener("feed-toggle-mute", handleMute);
      document.removeEventListener("feed-like-active", handleLike);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, liked, viewerId]);

  // Video progress tracking
  useEffect(() => {
    if (!isActive || !isVideo) {
      setProgress(0);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (v.duration) setProgress(v.currentTime / v.duration);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [isActive, isVideo]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleLike = async () => {
    if (!viewerId) {
      window.location.href = "/auth/sign-in";
      return;
    }
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => c + (wasLiked ? -1 : 1));
    if (!wasLiked) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 700);
    }
    try {
      const res = await fetch(`/api/posts/${item.id}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLiked(data.liked);
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => c + (wasLiked ? 1 : -1));
    }
  };

  const handleMediaClick = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 280) {
      // Double tap → like
      toggleLike();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      // Single tap handled after brief delay
      setTimeout(() => {
        if (lastTapRef.current && now - lastTapRef.current < 280) return;
        if (lastTapRef.current === now) togglePlay();
      }, 280);
    }
  };

  const toggleFollow = async () => {
    if (!viewerId || !item.userId || viewerId === item.userId) return;
    const was = following;
    setFollowing(!was);
    try {
      const res = await fetch(`/api/users/${item.userId}/follow`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFollowing(data.following);
    } catch {
      setFollowing(was);
    }
  };

  const share = async () => {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}/?post=${item.id}` : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: item.caption ?? "Grail", url });
      } else {
        await navigator.clipboard.writeText(url);
        const { toast } = await import("@/components/ui/Toaster");
        toast("Link copied", "success");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-black select-none">
      {/* ── Media ──────────────────────────────────────────────────────── */}
      {isCreativeAd && creativeSpec ? (
        item.ctaUrl ? (
          <a
            href={item.ctaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="absolute inset-0 h-full w-full cursor-pointer"
          >
            <AdCreative spec={creativeSpec} />
          </a>
        ) : (
          <div className="absolute inset-0 h-full w-full">
            <AdCreative spec={creativeSpec} />
          </div>
        )
      ) : (
        <>
          {/* Blurred backdrop (shows when content is letterboxed) */}
          {isVideo ? (
            <img
              src={item.thumbUrl ?? item.mediaUrl}
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-40 pointer-events-none"
            />
          ) : (
            <img
              src={item.mediaUrl}
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover scale-110 blur-3xl opacity-50 pointer-events-none"
            />
          )}
          {isVideo ? (
            <video
              ref={videoRef}
              src={item.mediaUrl}
              poster={item.thumbUrl ?? undefined}
              className="absolute inset-0 h-full w-full object-contain cursor-pointer"
              loop
              playsInline
              muted={muted}
              onClick={handleMediaClick}
            />
          ) : (
            <img
              src={item.mediaUrl}
              alt={item.caption ?? ""}
              className="absolute inset-0 h-full w-full object-contain cursor-pointer"
              onClick={handleMediaClick}
            />
          )}
        </>
      )}

      {/* Double-tap heart burst */}
      {heartBurst && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Heart className="h-32 w-32 text-red-500 fill-red-500 animate-ping drop-shadow-2xl" />
        </div>
      )}

      {/* Video progress bar */}
      {isVideo && isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/15 z-10">
          <div
            className="h-full bg-white transition-[width] duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {/* Soft gradient for readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

      {/* Play/pause overlay */}
      {isVideo && !playing && isActive && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Play"
        >
          <div className="rounded-full bg-black/50 p-5 backdrop-blur">
            <Play className="h-10 w-10 text-white" />
          </div>
        </button>
      )}

      {/* Mute toggle */}
      {isVideo && (
        <button
          onClick={() => setMuted((m) => !m)}
          className="absolute top-20 md:top-20 right-4 rounded-full bg-black/40 backdrop-blur p-2 text-white"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}

      {/* Ad badge */}
      {isAd && (
        <div className="absolute top-20 left-4 md:top-20 z-10 kicker bg-[color:var(--amber-400)]/90 text-black backdrop-blur px-3 py-1 rounded-full">
          Sponsored
        </div>
      )}

      {/* ── Author + caption (bottom-left) ─────────────────────────────── */}
      <div className="absolute bottom-6 left-4 right-20 z-10 space-y-3 text-white">
        <div className="flex items-center gap-3">
          <Link
            href={isAd ? "#" : `/u/${item.userId}`}
            className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white/80 bg-zinc-800 shrink-0"
          >
            {item.userImage ? (
              <Image
                src={item.userImage}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-sm font-bold bg-yellow-400 text-black">
                {(item.username?.[0] ?? "?").toUpperCase()}
              </div>
            )}
          </Link>
          <div className="flex-1 min-w-0">
            <p className="font-bold tracking-tight truncate text-[15px]">
              @{item.username ?? (isAd ? "advertiser" : "user")}
            </p>
            {item.postKind === "WANT" && (
              <p className="kicker text-[color:var(--amber-400)] mt-0.5">LOOKING FOR TRADES</p>
            )}
            {item.postKind === "TRADE_STORY" && (
              <p className="kicker text-[color:var(--jade-400)] mt-0.5">TRADE STORY</p>
            )}
            {item.postKind === "PACK_OPEN" && (
              <p className="kicker text-[color:var(--violet-400)] mt-0.5">PACK OPENING</p>
            )}
          </div>
          {!isAd && viewerId && item.userId && item.userId !== viewerId && (
            <button
              onClick={toggleFollow}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all",
                following
                  ? "bg-white/10 border-white/30 text-white"
                  : "bg-[color:var(--amber-400)] border-[color:var(--amber-400)] text-black shadow-[0_4px_14px_-4px_rgba(247,201,72,0.6)]"
              )}
            >
              {following ? (
                <span className="inline-flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  Following
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <UserPlus className="h-3 w-3" />
                  Follow
                </span>
              )}
            </button>
          )}
        </div>

        {item.caption && !isCreativeAd && (
          <p className="text-sm leading-snug whitespace-pre-wrap line-clamp-3">
            {item.caption}
          </p>
        )}

        {item.featuredCardName && (
          <Link
            href={item.featuredCardId ? `/cards/${item.featuredCardId}` : "#"}
            className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/15 px-3 py-2 max-w-full hover:ring-[color:var(--amber-400)]/50 transition-all"
          >
            {item.featuredCardImage && (
              <img
                src={item.featuredCardImage}
                alt=""
                className="h-11 w-8 rounded-md object-cover shrink-0 ring-1 ring-white/20"
              />
            )}
            <div className="text-xs min-w-0 flex-1">
              <p className="font-semibold truncate">{item.featuredCardName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {item.featuredGradeCompany && item.featuredGradeScore != null && (
                  <GradeBadge
                    company={item.featuredGradeCompany}
                    score={item.featuredGradeScore}
                    size="sm"
                  />
                )}
                {item.askingPrice != null && (
                  <span className="text-[color:var(--amber-400)] font-bold tabular-nums">
                    ${item.askingPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )}

        {isAd && !isCreativeAd && item.ctaLabel && item.ctaUrl && (
          <a
            href={item.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-amber inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm"
          >
            {item.ctaLabel}
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[11px] font-semibold text-white/80 bg-white/10 rounded-full px-2.5 py-0.5 hover:bg-white/15 transition-colors"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Action rail (bottom-right, TikTok style) ───────────────────── */}
      <div className="absolute bottom-8 right-3 z-10 flex flex-col items-center gap-5 text-white">
        {!isAd && (
          <button onClick={toggleLike} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "rounded-full p-3 transition-colors",
                liked ? "bg-red-500" : "bg-white/10 backdrop-blur"
              )}
            >
              <Heart className={cn("h-6 w-6", liked && "fill-white")} />
            </div>
            <span className="text-xs font-bold">{fmt(likeCount)}</span>
          </button>
        )}

        {!isAd && (
          <button
            onClick={() => setCommentsOpen(true)}
            className="flex flex-col items-center gap-1"
          >
            <div className="rounded-full bg-white/10 backdrop-blur p-3">
              <MessageCircle className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold">{fmt(commentCount)}</span>
          </button>
        )}

        {!isAd && item.openToTrade !== false && (
          <Link
            href={item.userId ? `/trades/new?with=${item.userId}` : "#"}
            className="flex flex-col items-center gap-1"
          >
            <div className="rounded-full bg-yellow-400 text-black p-3">
              <ArrowLeftRight className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold">Trade</span>
          </Link>
        )}

        <button onClick={share} className="flex flex-col items-center gap-1">
          <div className="rounded-full bg-white/10 backdrop-blur p-3">
            <Share2 className="h-6 w-6" />
          </div>
          <span className="text-xs font-bold">{fmt(item.shareCount ?? 0)}</span>
        </button>
      </div>

      {!isAd && (
        <CommentSheet
          postId={item.id}
          open={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          onCommentAdded={() => setCommentCount((c) => c + 1)}
          canComment={Boolean(viewerId)}
        />
      )}
    </div>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
