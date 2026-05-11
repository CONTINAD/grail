"use client";

/**
 * Feed-shaped skeleton for the loading state. Matches the final layout
 * (9:16 card, author block, action rail on right) so there's no layout
 * shift when content arrives.
 */
export function FeedSkeleton() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[9/14] rounded-3xl overflow-hidden bg-zinc-900/60 ring-1 ring-white/5">
      <div className="absolute inset-0 shimmer" />

      {/* Author + caption placeholder */}
      <div className="absolute bottom-5 left-5 right-20 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full shimmer" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-1/3 rounded shimmer" />
            <div className="h-2 w-1/4 rounded shimmer opacity-60" />
          </div>
        </div>
        <div className="h-3 w-3/4 rounded shimmer" />
        <div className="h-3 w-1/2 rounded shimmer opacity-70" />
      </div>

      {/* Action rail placeholder */}
      <div className="absolute right-4 bottom-8 flex flex-col gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-11 w-11 rounded-full shimmer" />
            <div className="h-2 w-6 rounded shimmer opacity-60" />
          </div>
        ))}
      </div>
    </div>
  );
}
