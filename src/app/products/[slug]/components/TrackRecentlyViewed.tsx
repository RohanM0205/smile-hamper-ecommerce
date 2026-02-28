"use client";

import { useEffect } from "react";

export default function TrackRecentlyViewed({
  productId,
}: {
  productId: string;
}) {
  useEffect(() => {
    const existing =
      JSON.parse(localStorage.getItem("recentlyViewed") || "[]");

    const updated = [
      productId,
      ...existing.filter((id: string) => id !== productId),
    ].slice(0, 8); // max 8 items

    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(updated)
    );
  }, [productId]);

  return null;
}
