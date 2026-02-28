"use client";

import { supabaseBrowser } from "@/lib/supabase/client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function WishlistClient({
  items,
}: {
  items: any[];
}) {
  const supabase = supabaseBrowser();

  /* ---------------- STATE ---------------- */
  const [wishlist, setWishlist] = useState(items);
  const [movingId, setMovingId] = useState<string | null>(null);

  /* ---------------- REMOVE ITEM ---------------- */
  const removeItem = async (id: string) => {
    try {
      await supabase
        .from("wishlist")
        .delete()
        .eq("id", id);

      // Update UI safely
      setWishlist((prev) =>
        prev.filter((item) => item.id !== id)
      );

      // 🔥 Notify Header wishlist changed
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  /* ---------------- MOVE TO CART ---------------- */
  const moveToCart = async (item: any) => {
    setMovingId(item.id);

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: item.product_id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to move to cart");
        setMovingId(null);
        return;
      }

      // 🔥 Notify Header cart changed
      window.dispatchEvent(new Event("cartUpdated"));

      // Remove from wishlist
      await removeItem(item.id);
    } catch (err) {
      console.error("Move to cart failed:", err);
    }

    setMovingId(null);
  };

  /* ---------------- EMPTY STATE ---------------- */
  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Your wishlist is empty 💔
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {wishlist.map((item) => {
        const product = item.products;

        const image =
          product.product_images?.[0]?.image_url ||
          "/placeholder.png";

        const finalPrice =
          product.discount_price ?? product.price;

        return (
          <div
            key={item.id}
            className="border rounded-2xl p-4 space-y-4"
          >
            <Link href={`/products/${product.slug}`}>
              <div className="relative h-56 rounded-xl overflow-hidden">
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            <h3 className="font-medium">
              {product.name}
            </h3>

            <p className="font-serif text-lg">
              ₹{finalPrice}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => moveToCart(item)}
                disabled={movingId === item.id}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                {movingId === item.id
                  ? "Moving..."
                  : "Move to Cart"}
              </button>

              <button
                onClick={() => removeItem(item.id)}
                className="flex-1 py-2 border rounded-lg"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}