"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Search, Loader2, ChevronLeft, ChevronRight, PackageOpen } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PokemonCardTile } from "@/components/cards/PokemonCardTile";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchCard {
  id: string;
  name: string;
  number: string;
  setId: string;
  setName: string;
  imageSmall: string;
  imageLarge: string;
  rarity?: string | null;
  marketPrice?: number | null;
}

interface Props {
  initialCollectionIds: string[];
  initialWishlistIds: string[];
}

const PAGE_SIZE = 60;

export function CardSearchPageClient({ initialCollectionIds, initialWishlistIds }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 350);

  // Atomic: q + page always consistent
  const [search, setSearch] = useState({
    q: searchParams.get("q") ?? "",
    page: Number(searchParams.get("page") ?? "1"),
  });

  const [results, setResults] = useState<SearchCard[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [collectionIds, setCollectionIds] = useState(() => new Set(initialCollectionIds));
  const [wishlistIds, setWishlistIds] = useState(() => new Set(initialWishlistIds));

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // When debounced query changes, reset to page 1
  useEffect(() => {
    setSearch({ q: debouncedQuery, page: 1 });
  }, [debouncedQuery]);

  // Fetch whenever search state changes
  useEffect(() => {
    const { q, page } = search;

    // Sync URL
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (page > 1) params.set("page", String(page));
    router.replace(`/cards/search?${params.toString()}`, { scroll: false });

    if (!q || q.length < 2) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/cards/search?q=${encodeURIComponent(q)}&page=${page}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        setResults(data.cards ?? []);
        setTotalCount(data.totalCount ?? 0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const addToCollection = useCallback(async (card: SearchCard) => {
    const res = await fetch("/api/collection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: card.id }),
    });
    if (res.ok) setCollectionIds((prev) => new Set([...prev, card.id]));
  }, []);

  const addToWishlist = useCallback(async (card: SearchCard) => {
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: card.id }),
    });
    if (res.ok) setWishlistIds((prev) => new Set([...prev, card.id]));
  }, []);

  function goToPage(p: number) {
    setSearch((s) => ({ ...s, page: p }));
  }

  const hasResults = results.length > 0;
  const showEmpty = !loading && search.q.length >= 2 && !hasResults;

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-10 py-8 md:py-14 space-y-8">
      <div>
        <div className="kicker">Card index</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mt-2 leading-[0.95]">
          Browse every card
        </h1>
        <p className="text-zinc-400 text-sm mt-3 max-w-lg">
          18,000+ cards from Base Set to the latest drops — add to your
          collection or wishlist in one tap.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/collection">
          <Button variant="secondary" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cards, e.g. Charizard, Umbreon VMAX…"
            icon={
              loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              ) : (
                <Search className="h-4 w-4 text-zinc-400" />
              )
            }
          />
        </div>
      </div>

      {/* Result count + pagination */}
      {(hasResults || loading) && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            {loading ? (
              "Searching…"
            ) : (
              <>
                <span className="text-zinc-100 font-semibold">{totalCount.toLocaleString()}</span>{" "}
                result{totalCount !== 1 ? "s" : ""}
                {totalPages > 1 && (
                  <> &middot; page {search.page} of {totalPages}</>
                )}
              </>
            )}
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                disabled={search.page <= 1 || loading}
                onClick={() => goToPage(Math.max(1, search.page - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-zinc-400 w-20 text-center">
                {search.page} / {totalPages}
              </span>
              <Button
                variant="secondary"
                size="icon"
                disabled={search.page >= totalPages || loading}
                onClick={() => goToPage(Math.min(totalPages, search.page + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty states */}
      {!search.q && (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500 space-y-3">
          <Search className="h-10 w-10 opacity-30" />
          <p className="text-lg font-medium">Search for any card</p>
          <p className="text-sm">Try &quot;Charizard&quot;, &quot;base1-4&quot;, or a set name</p>
        </div>
      )}

      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-32 text-zinc-500 space-y-3">
          <PackageOpen className="h-10 w-10 opacity-30" />
          <p className="text-lg font-medium">No cards found</p>
          <p className="text-sm">Try a different name or check the spelling</p>
        </div>
      )}

      {/* Card grid */}
      {hasResults && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((card) => (
            <PokemonCardTile
              key={card.id}
              card={card}
              inCollection={collectionIds.has(card.id)}
              inWishlist={wishlistIds.has(card.id)}
              onAddToCollection={() => addToCollection(card)}
              onAddToWishlist={() => addToWishlist(card)}
            />
          ))}
        </div>
      )}

      {/* Bottom pagination (repeat for long pages) */}
      {totalPages > 1 && hasResults && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="secondary"
            disabled={search.page <= 1 || loading}
            onClick={() => goToPage(Math.max(1, search.page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-zinc-400">
            Page {search.page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={search.page >= totalPages || loading}
            onClick={() => goToPage(Math.min(totalPages, search.page + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
