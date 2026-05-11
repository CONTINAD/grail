import type { Metadata } from "next";
import { Geist, Fraunces, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MainShell } from "@/components/layout/MainShell";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { Providers } from "@/components/providers/Providers";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Editorial display face: Fraunces, with optical sizing for a luxury feel
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

// Magazine-italic accent for hero moments — sits next to Fraunces
const instrument = Instrument_Serif({
  variable: "--font-italic",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

// Numerals & tickers — tabular, condensed feel
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Grail — Where collectors meet their grails",
  description:
    "A live trading floor for Pokémon cards, sports cards, comics, sneakers and more. Post your pulls, find partners, and close trades — with smart matching and flat fees.",
  openGraph: {
    title: "Grail — Where collectors meet their grails",
    description:
      "A live trading floor for Pokémon, sports cards, comics, sneakers and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grail — The trading floor",
    description:
      "Where collectors meet their grails. Pokémon, sports, comics, sneakers, watches.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${fraunces.variable} ${instrument.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <MainShell>{children}</MainShell>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
