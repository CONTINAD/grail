"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

interface Props {
  cardId: string;
  inCollection: boolean;
  inWishlist: boolean;
}

export function CardActions({ cardId, inCollection, inWishlist }: Props) {
  const router = useRouter();
  const [inC, setInC] = useState(inCollection);
  const [inW, setInW] = useState(inWishlist);
  const [pending, startTransition] = useTransition();

  async function toggleCollection() {
    const was = inC;
    setInC(!was);
    try {
      if (was) {
        await fetch(`/api/collection?cardId=${cardId}`, { method: "DELETE" });
        toast("Removed from collection", "success");
      } else {
        await fetch("/api/collection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId }),
        });
        toast("Added to collection", "success");
      }
      startTransition(() => router.refresh());
    } catch {
      setInC(was);
      toast("Update failed", "error");
    }
  }

  async function toggleWishlist() {
    const was = inW;
    setInW(!was);
    try {
      if (was) {
        await fetch(`/api/wishlist?cardId=${cardId}`, { method: "DELETE" });
        toast("Removed from wishlist", "success");
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId }),
        });
        toast("Added to wishlist", "success");
      }
      startTransition(() => router.refresh());
    } catch {
      setInW(was);
      toast("Update failed", "error");
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleCollection}
        disabled={pending}
        className={cn(
          "flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 font-bold text-sm transition-colors",
          inC
            ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400"
            : "bg-yellow-400 text-black hover:bg-yellow-300"
        )}
      >
        {inC ? (
          <>
            <Check className="h-4 w-4" />
            In Collection
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            Add to Collection
          </>
        )}
      </button>
      <button
        onClick={toggleWishlist}
        disabled={pending}
        className={cn(
          "flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 font-bold text-sm transition-colors border",
          inW
            ? "bg-red-500/10 border-red-500/40 text-red-400"
            : "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700"
        )}
      >
        <Heart className={cn("h-4 w-4", inW && "fill-red-400")} />
        {inW ? "Wishlisted" : "Wishlist"}
      </button>
    </div>
  );
}
