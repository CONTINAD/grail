import type { Metadata } from "next";
import { DemoClient } from "./DemoClient";

export const metadata: Metadata = {
  title: "Grail · 40 seconds",
  description:
    "A short demo film for Grail — the trading floor for collectors.",
};

export default function DemoPage() {
  return <DemoClient />;
}
