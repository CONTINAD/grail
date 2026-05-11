"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = "success" | "error" | "info";

interface Toast {
  id: string;
  kind: Kind;
  text: string;
}

interface Ctx {
  toast: (text: string, kind?: Kind) => void;
}

const ToastContext = createContext<Ctx>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastImpl: (text: string, kind?: Kind) => void = () => {};

export function toast(text: string, kind: Kind = "info") {
  toastImpl(text, kind);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((text: string, kind: Kind = "info") => {
    const id = Math.random().toString(36).slice(2);
    setItems((cur) => [...cur, { id, kind, text }]);
    setTimeout(() => {
      setItems((cur) => cur.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    toastImpl = push;
    return () => {
      toastImpl = () => {};
    };
  }, [push]);

  return (
    <ToastContext.Provider value={{ toast: push }}>
      {children}
      <div className="fixed z-[100] bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={cn(
                "pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5 shadow-2xl border backdrop-blur-md min-w-[180px] max-w-[90vw]",
                t.kind === "success" &&
                  "bg-emerald-500/90 border-emerald-400 text-white",
                t.kind === "error" && "bg-red-500/90 border-red-400 text-white",
                t.kind === "info" && "bg-zinc-900/90 border-zinc-700 text-white"
              )}
            >
              {t.kind === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
              {t.kind === "error" && <XCircle className="h-4 w-4 shrink-0" />}
              {t.kind === "info" && <Info className="h-4 w-4 shrink-0" />}
              <span className="text-sm font-medium flex-1">{t.text}</span>
              <button
                onClick={() =>
                  setItems((cur) => cur.filter((x) => x.id !== t.id))
                }
                className="opacity-70 hover:opacity-100"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
