import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { WishlistClient } from "./WishlistClient";

export default async function WishlistPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/sign-in");

  const wishlist = await prisma.wishlistCard.findMany({
    where: { userId: session.user.id },
    include: { card: true },
    orderBy: [{ priority: "desc" }, { addedAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-10 py-8 md:py-14">
      <header className="pb-6 md:pb-10 border-b border-[color:var(--line)]">
        <div className="kicker">Most wanted</div>
        <h1 className="font-display text-5xl md:text-6xl font-bold leading-[0.95] mt-2">
          Your wishlist
        </h1>
        <p className="text-zinc-400 mt-3 max-w-md">
          {wishlist.length > 0
            ? `${wishlist.length} ${wishlist.length === 1 ? "card" : "cards"} on your hunt list — matching runs continuously.`
            : "Add cards you want. Our algorithm surfaces collectors who have them."}
        </p>
      </header>
      <div className="mt-8">
        <WishlistClient initialWishlist={wishlist} />
      </div>
    </div>
  );
}
