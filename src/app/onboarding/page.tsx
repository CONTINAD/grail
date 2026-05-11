"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin, Package } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  // "local" | "shipping" — default to open shipping
  const [tradeRange, setTradeRange] = useState<"local" | "shipping">("shipping");
  const [location, setLocation] = useState("");

  async function finish() {
    if (tradeRange === "local" && !location.trim()) {
      setError("Please enter your city so we can find local traders near you.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        localTradesOnly: tradeRange === "local",
        location: location.trim() || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push("/collection");
  }

  const options = [
    {
      value: "shipping" as const,
      icon: Package,
      label: "I'm open to shipping",
      sub: "Trade with anyone in the country. Cards ship both ways — most popular option.",
    },
    {
      value: "local" as const,
      icon: MapPin,
      label: "Local trades only",
      sub: "Meet up in person. Great for high-value cards where you want to inspect before trading.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="h-[400px] w-[600px] rounded-full bg-yellow-400/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <Logo size={36} showWordmark={false} />
          <div className="kicker">Welcome</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-center leading-tight">
            {step === 1 ? "Pick your handle" : "How do you trade?"}
          </h1>
          <p className="text-zinc-400 text-sm text-center max-w-xs">
            {step === 1
              ? "This is how other collectors will find you on the floor."
              : "You can change this anytime in your profile."}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 justify-center">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                s <= step ? "bg-yellow-400 w-8" : "bg-zinc-700 w-4"
              )}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
          {step === 1 ? (
            <>
              <Input
                label="Username"
                placeholder="trainer_ash"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={30}
              />
              <p className="text-xs text-zinc-500">
                3–30 characters. Letters, numbers, and underscores only.
              </p>
              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}
              <Button
                className="w-full"
                disabled={username.length < 3}
                onClick={() => { setError(""); setStep(2); }}
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-3">
                {options.map(({ value, icon: Icon, label, sub }) => {
                  const active = tradeRange === value;
                  return (
                    <button
                      key={value}
                      onClick={() => { setTradeRange(value); setError(""); }}
                      className={cn(
                        "w-full flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150",
                        active
                          ? "border-yellow-400/50 bg-yellow-400/5 shadow-sm shadow-yellow-400/10"
                          : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600"
                      )}
                    >
                      <div className={cn(
                        "p-2.5 rounded-xl mt-0.5 shrink-0",
                        active ? "bg-yellow-400/10" : "bg-zinc-700"
                      )}>
                        <Icon className={cn("h-5 w-5", active ? "text-yellow-400" : "text-zinc-400")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-semibold leading-snug",
                          active ? "text-zinc-100" : "text-zinc-300"
                        )}>
                          {label}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{sub}</p>
                      </div>
                      {/* Radio dot */}
                      <div className={cn(
                        "mt-1 h-4 w-4 rounded-full border-2 shrink-0 transition-all",
                        active
                          ? "border-yellow-400 bg-yellow-400"
                          : "border-zinc-600"
                      )} />
                    </button>
                  );
                })}
              </div>

              {/* Location input — only shown for local */}
              {tradeRange === "local" && (
                <div className="space-y-1.5">
                  <Input
                    label="Your city or region"
                    placeholder="e.g. Austin, TX"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <p className="text-xs text-zinc-500">
                    Used to find traders near you. Never shared publicly.
                  </p>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <Button variant="secondary" onClick={() => { setError(""); setStep(1); }} className="flex-1">
                  Back
                </Button>
                <Button className="flex-1" loading={loading} onClick={finish}>
                  Start Trading <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
