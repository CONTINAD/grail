"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  // Hide on fullscreen/immersive pages
  if (
    pathname === "/" ||
    pathname.startsWith("/preview") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/demo")
  )
    return null;
  return <Footer />;
}
