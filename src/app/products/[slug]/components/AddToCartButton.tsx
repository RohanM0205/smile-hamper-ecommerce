"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  disabled?: boolean;
  customization?: Record<string, any>;
}

export default function AddToCartButton({
  productId,
  disabled = false,
  customization,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (disabled || loading) return;

    setLoading(true);

    try {
      const supabase = supabaseBrowser();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          customization,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        throw new Error("Cart API failed");
      }

      router.push("/cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`
        relative w-full
        py-3.5 sm:py-4
        rounded-xl
        font-semibold
        text-sm sm:text-base
        transition-all duration-200
        active:scale-[0.98]
        ${
          isDisabled
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-[#5C3D2E] text-white hover:bg-[#4b3226] shadow-md hover:shadow-lg"
        }
      `}
    >
      {/* Spinner */}
      {loading && (
        <span className="absolute left-6 top-1/2 -translate-y-1/2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
        </span>
      )}

      {disabled
        ? "Out of Stock"
        : loading
        ? "Adding to Cart..."
        : "Add to Cart"}
    </button>
  );
}
