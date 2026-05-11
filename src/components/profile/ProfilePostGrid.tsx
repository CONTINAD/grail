"use client";

import Link from "next/link";
import { Heart, Eye, Play } from "lucide-react";
import { PostTile } from "@/components/feed/PostTile";

interface GridPost {
  id: string;
  mediaUrl: string;
  mediaType: string;
  thumbUrl: string | null;
  likeCount: number;
  viewCount: number;
  featuredCardName: string | null;
}

export function ProfilePostGrid({ posts }: { posts: GridPost[] }) {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {posts.map((p) => (
        <PostTile
          key={p.id}
          href={`/?post=${p.id}`}
          mediaUrl={p.mediaUrl}
          mediaType={p.mediaType}
          thumbUrl={p.thumbUrl}
          className="rounded-lg"
          overlay={
            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-3 text-[11px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="inline-flex items-center gap-1">
                <Heart className="h-3 w-3 fill-white" />
                {fmt(p.likeCount)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {fmt(p.viewCount)}
              </span>
            </div>
          }
        />
      ))}
    </div>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
