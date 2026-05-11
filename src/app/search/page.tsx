import { Suspense } from "react";
import { SearchClient } from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-zinc-500 text-sm">Loading…</div>}>
      <SearchClient />
    </Suspense>
  );
}
