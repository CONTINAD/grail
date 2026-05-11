"use client";

import { useState } from "react";
import Link from "next/link";
import { PokemonCardTile } from "@/components/cards/PokemonCardTile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, EyeOff, Plus } from "lucide-react";
import { CONDITION_LABELS } from "@/lib/utils";
import type { CollectionCard, PokemonCard } from "@/generated/prisma/client";

type CollectionItem = CollectionCard & { card: PokemonCard };

interface CollectionClientProps {
  initialCollection: CollectionItem[];
}

export function CollectionClient({ initialCollection }: CollectionClientProps) {
  const [collection, setCollection] = useState(initialCollection);

  async function toggleForTrade(id: string, current: boolean) {
    const res = await fetch(`/api/collection/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ forTrade: !current }),
    });
    if (!res.ok) return;
    setCollection((prev) =>
      prev.map((c) => (c.id === id ? { ...c, forTrade: !current } : c))
    );
  }

  async function removeCard(id: string) {
    const res = await fetch(`/api/collection/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setCollection((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Add cards button */}
      <Link href="/cards/search">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Cards
        </Button>
      </Link>

      {/* Grid */}
      {collection.length === 0 ? (
        <div className="text-center py-24 text-zinc-500">
          <p className="text-lg font-medium">No cards yet</p>
          <p className="text-sm mt-1">Hit &quot;Add Cards&quot; to search and add your first card.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {collection.map((item) => (
            <div key={item.id} className="relative group">
              <PokemonCardTile
                card={item.card}
                condition={item.condition}
                forTrade={item.forTrade}
                isGraded={item.isGraded}
                gradeCompany={item.gradeCompany}
                gradeScore={item.gradeScore}
              />
              {/* Actions overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7"
                  title={item.forTrade ? "Hide from trading" : "Make available for trade"}
                  onClick={() => toggleForTrade(item.id, item.forTrade)}
                >
                  {item.forTrade ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="danger"
                  className="h-7 w-7 ml-auto"
                  title="Remove from collection"
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
