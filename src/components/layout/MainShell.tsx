"use client";

import { usePathname } from "next/navigation";

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const flush =
    pathname.startsWith("/preview") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/demo");
  return (
    <main className={`flex-1 ${flush ? "" : "md:pt-16 pb-20 md:pb-0"}`}>
      {children}
    </main>
  );
}
