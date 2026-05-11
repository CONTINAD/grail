import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[color:var(--line)] bg-[color:var(--ink-900)]">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-12 md:py-16 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo size={32} showEyebrow />
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
            A modern trading floor for collectors. Pokémon, sports cards,
            comics, sneakers, watches, vinyl — one feed, smart matching, flat
            fees.
          </p>
          <div className="kicker-mute">© 2026 Grail</div>
        </div>

        <FooterCol
          label="Product"
          links={[
            { href: "/", label: "Feed" },
            { href: "/discover", label: "Discover" },
            { href: "/search", label: "Search" },
            { href: "/matches", label: "Matches" },
          ]}
        />
        <FooterCol
          label="For traders"
          links={[
            { href: "/collection", label: "Your collection" },
            { href: "/wishlist", label: "Your wishlist" },
            { href: "/post/new", label: "Post to the feed" },
            { href: "/ads/new", label: "Run an ad" },
          ]}
        />
        <FooterCol
          label="Preview"
          links={[
            { href: "/preview", label: "Device preview" },
            { href: "/auth/sign-in", label: "Sign in" },
            { href: "/auth/sign-up", label: "Create account" },
          ]}
        />
      </div>

      <div className="border-t border-[color:var(--line)] py-5 px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 max-w-[1400px] mx-auto">
        <p className="text-xs text-zinc-600">
          Card data © Pokémon · The Pokémon Company International · TCG API
        </p>
        <p className="text-xs text-zinc-600">
          Real collectors · Real trades · Zero listings
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <div className="kicker-mute mb-3">{label}</div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-zinc-300 hover:text-[color:var(--amber-400)] transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
