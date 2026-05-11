"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { UserPlus, UserCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

interface Props {
  userId: string;
  initialFollowing: boolean;
}

export function FollowButton({ userId, initialFollowing }: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const was = following;
    setFollowing(!was);
    if (!was) {
      setBurst(true);
      setTimeout(() => setBurst(false), 700);
    }
    try {
      const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFollowing(data.following);
      toast(data.following ? "Following" : "Unfollowed", "success");
    } catch {
      setFollowing(was);
      toast("Couldn't update follow", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      disabled={busy}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-colors overflow-visible",
        following
          ? "bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700"
          : "btn-amber"
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {following ? (
          <motion.span
            key="following"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-2"
          >
            <UserCheck className="h-4 w-4" />
            Following
          </motion.span>
        ) : (
          <motion.span
            key="follow"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="inline-flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Follow
          </motion.span>
        )}
      </AnimatePresence>

      {/* Check-burst on follow */}
      <AnimatePresence>
        {burst && (
          <motion.span
            key="burst"
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="h-10 w-10 rounded-full bg-[color:var(--amber-400)]/40" />
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {burst && (
          <motion.span
            key="burst-check"
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
            animate={{ opacity: [0, 1, 0], scale: 1.2, rotate: 0 }}
            transition={{ duration: 0.7, times: [0, 0.4, 1] }}
          >
            <Check className="h-6 w-6 text-black" strokeWidth={3.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
