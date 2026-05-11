import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 6) return d.toLocaleDateString();
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export const CONDITION_LABELS: Record<string, string> = {
  MINT: "Mint",
  NEAR_MINT: "Near Mint",
  LIGHTLY_PLAYED: "Lightly Played",
  MODERATELY_PLAYED: "Mod. Played",
  HEAVILY_PLAYED: "Heavily Played",
  DAMAGED: "Damaged",
};

export const CONDITION_COLORS: Record<string, string> = {
  MINT: "text-emerald-400",
  NEAR_MINT: "text-green-400",
  LIGHTLY_PLAYED: "text-yellow-400",
  MODERATELY_PLAYED: "text-orange-400",
  HEAVILY_PLAYED: "text-red-400",
  DAMAGED: "text-gray-400",
};
