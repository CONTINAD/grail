"use client";

import { useState } from "react";
import Link from "next/link";
import { PokemonCardTile } from "@/components/cards/PokemonCardTile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WishlistCard, PokemonCard } from "@/generated/prisma/client";

type WishlistItem = WishlistCard & { card: PokemonCard };

const PRIORITY_LABELS: Record<number, string> = { 1: "Low", 2: "Medium", 3: "High" };
const PRIORITY_VARIANTS: Record<number, "default" | "warning" | "danger"> = {
  1: "default",
  2: "warning",
  3: "danger",
};

interface WishlistClientProps {
  initialWishlist: WishlistItem[];
}

export function WishlistClient({ initialWishlist }: WishlistClientProps) {
  const [wishlist, setWishlist] = useState(initialWishlist);

  async function setPriority(id: string, priority: number) {
    const res = await fetch(`/api/wishlist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority }),
    });
    if (!res.ok) return;
    setWishlist((prev) =>
      prev.map((w) => (w.id === id ? { ...w, priority } : w))
    );
  }

  async function removeCard(id: string) {
    const res = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setWishlist((prev) => prev.filter((w) => w.id !== id));
  }

  return (
    <div className="space-y-6">
      <Link href="/cards/search">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Cards
        </Button>
      </Link>

      {wishlist.length === 0 ? (
        <div className="text-center py-24 text-zinc-500">
          <p className="text-lg font-medium">Wishlist is empty</p>
          <p className="text-sm mt-1">
            Hit &quot;Add Cards&quot; to search — we&apos;ll find people who have them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="relative group">
              <PokemonCardTile card={item.card} />

              {/* Priority badge */}
              <div className="absolute top-2 left-2">
                <Badge variant={PRIORITY_VARIANTS[item.priority]}>
                  {PRIORITY_LABELS[item.priority]}
                </Badge>
              </div>

              {/* Actions */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(item.id, p)}
                    className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center transition-colors",
                      item.priority === p
                        ? "bg-yellow-400 text-zinc-900"
                        : "bg-zinc-800 text-zinc-500 hover:text-zinc-100"
                    )}
                    title={`Set ${PRIORITY_LABELS[p]} priority`}
                  >
                    <Star className="h-3 w-3" />
                  </button>
                ))}
                <Button
                  size="icon"
                  variant="danger"
                  className="h-7 w-7 ml-auto"
                  onClick={() => removeCard(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
