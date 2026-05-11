"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Zap, ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { CardStack } from "@/components/hero/CardStack";

const HERO_CARDS = [
  { src: "https://images.pokemontcg.io/base1/2_hires.png", alt: "Blastoise" },
  { src: "https://images.pokemontcg.io/sv3pt5/185_hires.png", alt: "Charizard ex" },
  { src: "https://images.pokemontcg.io/base1/4_hires.png", alt: "Charizard" },
  { src: "https://images.pokemontcg.io/swsh7/215_hires.png", alt: "Umbreon VMAX" },
  { src: "https://images.pokemontcg.io/sv3pt5/151_hires.png", alt: "Mewtwo" },
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) setError("Invalid email or password.");
    else router.push(callbackUrl);
  }

  async function handleDemo() {
    setDemoLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email: "demo@demo.com",
      password: "demo1234",
      redirect: false,
    });
    setDemoLoading(false);
    if (result?.error) {
      setError("Demo sign-in failed. Run `npm run seed` to create the demo user.");
    } else {
      router.push(callbackUrl);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* ── Left: editorial hero ───────────────────────────────── */}
      <aside className="relative hidden md:flex flex-col justify-between p-10 lg:p-14 border-r border-[color:var(--line)] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-80"
          style={{
            background:
              "radial-gradient(800px 500px at 30% 20%, rgba(247,201,72,0.18), transparent 60%), radial-gradient(700px 400px at 80% 90%, rgba(139,109,255,0.12), transparent 60%)",
          }}
        />
        <Link href="/">
          <Logo size={32} />
        </Link>

        <div className="space-y-8 max-w-lg">
          <Reveal delay={0.05}>
            <div className="kicker">Trading Floor / 2026</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-[0.92] tracking-tight">
              Where
              <br />
              <span className="italic text-[color:var(--amber-400)]">collectors</span>
              <br />
              meet their grails.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
              One trading floor for Pokémon, sports cards, comics, sneakers and
              watches. Post your pulls, match with collectors who want them, and
              close trades — with flat fees.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex items-center gap-6 pt-4 flex-wrap">
              <Stat value="20K+" label="cards indexed" />
              <div className="h-10 w-px bg-[color:var(--line)]" />
              <Stat value="6" label="categories" />
              <div className="h-10 w-px bg-[color:var(--line)]" />
              <Stat value="$1–6" label="flat trade fee" />
              <div className="h-10 w-px bg-[color:var(--line)]" />
              <Stat value="2%" label="cash fee" />
            </div>
          </Reveal>

          {/* Floating card stack — hero flourish */}
          <div className="mt-4 -mb-6 pointer-events-none">
            <CardStack cards={HERO_CARDS} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-600">
          <span>© 2026 Grail</span>
          <span>·</span>
          <span>Real collectors. Real trades. Zero listings.</span>
        </div>
      </aside>

      {/* ── Right: form ────────────────────────────────────────── */}
      <div className="flex items-start md:items-center justify-center px-5 pt-10 pb-10 md:pt-10 md:px-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile-only brand header */}
          <div className="md:hidden text-center space-y-4">
            <Link href="/" className="inline-flex">
              <Logo size={40} />
            </Link>
            <h1 className="font-display text-3xl font-bold leading-tight">
              Where <span className="italic text-[color:var(--amber-400)]">collectors</span>
              <br />
              meet their grails.
            </h1>
          </div>
          <div className="space-y-2">
            <p className="kicker-mute">Access</p>
            <h2 className="font-display text-3xl font-bold">Sign in to trade</h2>
            <p className="text-sm text-zinc-500">
              Or{" "}
              <Link href="/auth/sign-up" className="text-[color:var(--amber-400)] hover:underline">
                create an account
              </Link>{" "}
              — 60 seconds, no email verification required.
            </p>
          </div>

          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={handleDemo} loading={demoLoading}>
              <Zap className="h-4 w-4" />
              Continue as demo
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
            <p className="text-[11px] text-zinc-600 text-center">
              Jump straight into the feed — no signup required
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[color:var(--line)]" />
            <span className="text-[10px] tracking-[0.2em] text-zinc-600 uppercase">or</span>
            <div className="flex-1 h-px bg-[color:var(--line)]" />
          </div>

          <Button
            variant="secondary"
            className="w-full"
            size="lg"
            onClick={handleGoogle}
            loading={googleLoading}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <form onSubmit={handleCredentials} className="space-y-4 pt-2">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-[color:var(--rose-500)] bg-[color:var(--rose-500)]/10 border border-[color:var(--rose-500)]/20 rounded-xl px-3 py-2.5">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" variant="secondary" className="w-full" loading={loading}>
              Sign in with email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl lg:text-3xl font-bold text-[color:var(--amber-400)] tabular-nums leading-none">
        {value}
      </p>
      <p className="text-[10px] tracking-widest uppercase text-zinc-500 mt-1">{label}</p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
