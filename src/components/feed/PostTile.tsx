"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  mediaUrl: string;
  mediaType: string;
  thumbUrl?: string | null;
  username?: string | null;
  overlay?: React.ReactNode;
  className?: string;
  aspect?: string;
}

/**
 * Grid post tile that plays muted preview on hover (desktop) or swaps
 * to a brighter state on tap (mobile). Used in Discover, Profile grids,
 * Search results, related-posts rails.
 */
export function PostTile({
  href,
  mediaUrl,
  mediaType,
  thumbUrl,
  username,
  overlay,
  className,
  aspect = "aspect-[9/14]",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);

  const onEnter = () => {
    setHovering(true);
    const v = videoRef.current;
    if (v && mediaType === "video") {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };
  const onLeave = () => {
    setHovering(false);
    const v = videoRef.current;
    if (v && mediaType === "video") v.pause();
  };

  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        "group relative overflow-hidden bg-black ring-1 ring-[color:var(--line)] transition-all",
        "hover:ring-[color:var(--amber-400)]/40 hover:scale-[1.02] hover:shadow-[0_10px_30px_-10px_rgba(247,201,72,0.35)]",
        "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        aspect,
        className
      )}
    >
      {mediaType === "video" ? (
        <video
          ref={videoRef}
          src={mediaUrl}
          poster={thumbUrl ?? undefined}
          muted
          playsInline
          preload="metadata"
          loop
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src={mediaUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {/* Play indicator for videos */}
      {mediaType === "video" && !hovering && (
        <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 backdrop-blur flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-3 w-3 text-white fill-white ml-0.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
      {overlay ? (
        overlay
      ) : username ? (
        <div className="absolute bottom-2 left-2 right-2 text-[10px] tracking-wider uppercase font-bold text-[color:var(--amber-400)] truncate">
          @{username}
        </div>
      ) : null}
    </Link>
  );
}
