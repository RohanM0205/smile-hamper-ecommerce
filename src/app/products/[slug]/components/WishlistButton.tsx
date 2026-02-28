"use client";

import { useEffect, useState, useCallback } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import Icon from "@/components/ui/AppIcon";
import { motion } from "framer-motion";

interface Props {
  productId: string;
}

export default function WishlistButton({ productId }: Props) {
  const supabase = supabaseBrowser();

  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);

  /* ---------------- CHECK WISHLIST ---------------- */

  const checkWishlist = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setLiked(false);
      return;
    }

    const { data } = await supabase
      .from("wishlist")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", userData.user.id)
      .maybeSingle();

    setLiked(!!data);
  }, [productId, supabase]);

  useEffect(() => {
    checkWishlist();
  }, [checkWishlist]);

  /* ---------------- TOGGLE WISHLIST ---------------- */

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert("Please login first");
      return;
    }

    setLoading(true);

    try {
      if (liked) {
        await supabase
          .from("wishlist")
          .delete()
          .eq("product_id", productId)
          .eq("user_id", userData.user.id);

        setAnimateHeart(true);
        setTimeout(() => setAnimateHeart(false), 400);

        setLiked(false);
      } else {
        await supabase.from("wishlist").insert({
          user_id: userData.user.id,
          product_id: productId,
        });

        setLiked(true);
      }

      /* 🔥 CRITICAL: Notify Header */
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
    }

    setLoading(false);
  };

  return (
    <motion.button
      onClick={toggleWishlist}
      disabled={loading}
      whileTap={{ scale: 0.85 }}
      className="absolute top-5 right-5 z-30 w-12 h-12 rounded-full
      bg-white/90 backdrop-blur-xl
      shadow-[0_15px_35px_rgba(0,0,0,0.18)]
      flex items-center justify-center"
    >
      <motion.div
        key={liked ? "liked" : "unliked"}
        initial={{ scale: 0.8 }}
        animate={{
          scale: liked ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 0.4 }}
      >
        <Icon
          name="HeartIcon"
          size={20}
          variant={liked ? "solid" : "outline"}
          className={`transition-all duration-300
            ${liked ? "text-red-500 scale-110" : "text-[#6d4f3b]"}
            ${animateHeart ? "animate-heartPop" : ""}`}
        />
      </motion.div>
    </motion.button>
  );
}