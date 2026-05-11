"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface Results {
  users: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
    completedTrades: number;
    averageRating: number;
  }[];
  cards: {
    id: string;
    name: string;
    setName: string;
    imageSmall: string;
    rarity: string | null;
    marketPrice: number | null;
  }[];
  posts: {
    id: string;
    mediaUrl: string;
    mediaType: string;
    thumbUrl: string | null;
    caption: string | null;
    likeCount: number;
    user: { username: string | null; name: string | null };
  }[];
}

export function SearchClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const debounced = useDebounce(q, 250);
  const [res, setRes] = useState<Results>({ users: [], cards: [], posts: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debounced || debounced.length < 2) {
      setRes({ users: [], cards: [], posts: [] });
      return;
    }
    setLoading(true);
    const url = new URL(window.location.href);
    url.searchParams.set("q", debounced);
    window.history.replaceState(null, "", url.pathname + url.search);

    fetch(`/api/search?q=${encodeURIComponent(debounced)}`)
      .then((r) => r.json())
      .then(setRes)
      .finally(() => setLoading(false));
  }, [debounced]);

  const showEmpty =
    !loading && debounced.length >= 2 && !res.users.length && !res.cards.length && !res.posts.length;

  return (
    <div className="mx-auto max-w-4xl px-5 md:px-8 py-8 md:py-14 space-y-8">
      <div>
        <div className="kicker mb-3">Search</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold leading-[0.95]">
          Find anything
        </h1>
        <p className="text-zinc-500 mt-2 max-w-md">
          Cards, collectors, hashtags. Start typing — we search live.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Charizard, #mailday, @demo…"
          className="w-full bg-[color:var(--ink-850)] border border-[color:var(--line)] rounded-2xl pl-14 pr-14 py-5 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[color:var(--amber-400)]/60 focus:bg-[color:var(--ink-900)]"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            aria-label="Clear"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {q.length < 2 && (
        <div className="panel p-10 text-center space-y-3">
          <Search className="h-8 w-8 text-zinc-600 mx-auto" />
          <p className="text-zinc-400 text-sm">
            Start typing to search cards, users, or{" "}
            <span className="font-mono text-[color:var(--amber-400)]">#tags</span>.
          </p>
        </div>
      )}

      {showEmpty && (
        <div className="panel p-10 text-center text-zinc-500 text-sm">
          No results for &quot;<span className="text-zinc-300">{debounced}</span>&quot;
        </div>
      )}

      {res.users.length > 0 && (
        <section>
          <div className="kicker mb-3">Traders</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {res.users.map((u) => (
              <Link
                key={u.id}
                href={`/u/${u.id}`}
                className="flex items-center gap-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-yellow-400/30 px-4 py-3 transition-colors"
              >
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-zinc-700 shrink-0">
                  {u.image ? (
                    <Image src={u.image} alt="" fill className="object-cover" sizes="40px" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-yellow-400 text-black font-bold">
                      {(u.username ?? u.name ?? "?")[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-zinc-100 truncate">
                    @{u.username ?? u.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {u.completedTrades} trades · {u.averageRating.toFixed(1)}★
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {res.cards.length > 0 && (
        <section>
          <div className="kicker mb-3">Cards</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-3">
            {res.cards.map((c) => (
              <Link key={c.id} href={`/cards/${c.id}`} className="group space-y-1.5">
                <div className="relative aspect-[5/7] rounded-lg overflow-hidden bg-zinc-900 ring-1 ring-zinc-800 group-hover:ring-yellow-400/40 transition-all">
                  <Image src={c.imageSmall} alt={c.name} fill sizes="150px" className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-200 truncate">{c.name}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{c.setName}</p>
                  {c.marketPrice != null && (
                    <p className="text-[11px] text-emerald-400 font-bold">${c.marketPrice.toFixed(2)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {res.posts.length > 0 && (
        <section>
          <div className="kicker mb-3">Posts</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {res.posts.map((p) => (
              <Link
                key={p.id}
                href={`/?post=${p.id}`}
                className="relative aspect-[9/14] rounded-lg overflow-hidden bg-zinc-900"
              >
                {p.mediaType === "video" ? (
                  <video
                    src={p.mediaUrl}
                    poster={p.thumbUrl ?? undefined}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={p.mediaUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute bottom-1.5 left-1.5 text-[11px] font-bold text-white">
                  @{p.user.username ?? p.user.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
