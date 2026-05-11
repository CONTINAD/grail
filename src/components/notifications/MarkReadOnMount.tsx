"use client";

import { useEffect } from "react";

export function MarkReadOnMount() {
  useEffect(() => {
    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_read" }),
    }).catch(() => {});
  }, []);
  return null;
}
