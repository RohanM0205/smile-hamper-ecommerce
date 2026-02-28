"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/AppIcon";
import { supabaseBrowser } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImage {
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  tags: string[] | null;
  product_images: ProductImage[];
}

/* ---------------- TAG CONFIG ---------------- */

const TAG_LABELS: Record<string, string> = {
  new: "New",
  trending: "Trending",
  best_seller: "Best Seller",
  sale: "Sale",
};

const TAG_PRIORITY = ["new", "sale", "best_seller", "trending"];

export default function ProductCard({ product }: { product: Product }) {
  const supabase = supabaseBrowser();

  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);

  /* ---------------- IMAGE LOGIC ---------------- */

  const images =
    product.product_images?.length
      ? [...product.product_images].sort(
          (a, b) => a.sort_order - b.sort_order
        )
      : [];

  const primaryImage =
    images.find((img) => img.is_primary)?.image_url ||
    images[0]?.image_url ||
    "/placeholder.png";

  const secondaryImage =
    images.length > 1
      ? images.find((img) => !img.is_primary)?.image_url ||
        images[1]?.image_url
      : null;

  /* ---------------- PRICE LOGIC ---------------- */

  const finalPrice = product.discount_price ?? product.price;

  const discountPercent =
    product.discount_price &&
    product.discount_price < product.price
      ? Math.round(
          ((product.price - product.discount_price) /
            product.price) *
            100
        )
      : null;

  /* ---------------- PRIMARY TAG LOGIC ---------------- */

  let primaryTag: string | null = null;

  if (product.tags?.length) {
    for (const tag of TAG_PRIORITY) {
      if (product.tags.includes(tag)) {
        primaryTag = tag;
        break;
      }
    }
  }

  /* ---------------- CHECK WISHLIST ---------------- */

  useEffect(() => {
    const checkWishlist = async () => {
      const { data: userData } =
        await supabase.auth.getUser();

      if (!userData.user) return;

      const { data } = await supabase
        .from("wishlist")
        .select("id")
        .eq("product_id", product.id)
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (data) setLiked(true);
    };

    checkWishlist();
  }, [product.id]);

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
  
    if (liked) {
      await supabase
        .from("wishlist")
        .delete()
        .eq("product_id", product.id)
        .eq("user_id", userData.user.id);
  
      setLiked(false);
    } else {
      await supabase.from("wishlist").insert({
        user_id: userData.user.id,
        product_id: product.id,
      });
  
      setLiked(true);
    }
  
    /* 🔥 DISPATCH GLOBAL EVENT */
    window.dispatchEvent(new Event("wishlistUpdated"));
  
    setLoading(false);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative block rounded-[32px] overflow-hidden
      bg-gradient-to-b from-white to-[#faf6f1]
      shadow-[0_15px_50px_rgba(0,0,0,0.06)]
      hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)]
      transition-all duration-700"
    >
      {/* ================= IMAGE AREA ================= */}
      <div className="relative h-72 overflow-hidden rounded-t-[32px]">

        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-1000 ease-out
            ${secondaryImage ? "group-hover:opacity-0" : ""}
          `}
        />

        {/* Secondary Image (Hover) */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.name} hover`}
            fill
            className="object-cover opacity-0 group-hover:opacity-100
            transition-all duration-1000 ease-out
            group-hover:scale-110"
          />
        )}

        {/* ===== Tag Ribbon ===== */}
        {primaryTag && TAG_LABELS[primaryTag] && (
          <div className="absolute top-5 left-0 z-30">
            <div className="relative pl-6 pr-5 py-2
              bg-gradient-to-r from-[#8b6b55] to-[#6d4f3b]
              text-white text-[11px]
              tracking-[0.25em] uppercase font-semibold
              shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
              {TAG_LABELS[primaryTag]}
              <div className="absolute -right-3 top-0
                w-0 h-0
                border-t-[18px]
                border-b-[18px]
                border-l-[12px]
                border-t-transparent
                border-b-transparent
                border-l-[#6d4f3b]" />
            </div>
          </div>
        )}

        {/* ===== Wishlist Button ===== */}
        <motion.button
          onClick={toggleWishlist}
          disabled={loading}
          whileTap={{ scale: 0.85 }}
          className="absolute top-5 right-5 z-30 w-11 h-11 rounded-full
          bg-white/90 backdrop-blur-xl
          shadow-[0_10px_30px_rgba(0,0,0,0.15)]
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
              size={18}
              variant={liked ? "solid" : "outline"}
              className={`transition-all duration-300
                ${liked ? "text-red-500 scale-110" : "text-[#6d4f3b]"}
                ${animateHeart ? "animate-heartPop" : ""}`}
            />
          </motion.div>
        </motion.button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="px-6 py-6 space-y-4">

        <h3 className="text-[15px] tracking-wide font-medium text-[#3f2e22]
          line-clamp-2 leading-snug
          group-hover:text-black transition-colors duration-300">
          {product.name}
        </h3>

        <div className="h-px bg-gradient-to-r from-transparent via-[#e6d8c8] to-transparent" />

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-2xl text-[#3f2e22] tracking-tight">
              ₹{finalPrice}
            </span>

            {product.discount_price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          {discountPercent && (
            <div className="text-[11px] font-bold tracking-widest uppercase
              text-emerald-700 bg-emerald-100
              px-3 py-1 rounded-full shadow-sm">
              {discountPercent}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 flex items-end justify-center
        bg-gradient-to-t from-black/70 via-black/20 to-transparent
        opacity-0 group-hover:opacity-100 transition duration-700">

        <div className="mb-8 px-6 py-2.5 bg-white text-[#3f2e22]
          text-sm font-semibold tracking-wide rounded-full
          shadow-[0_8px_25px_rgba(0,0,0,0.25)]
          transform translate-y-6 group-hover:translate-y-0
          transition-all duration-700">
          View Details
        </div>
      </div>
    </Link>
  );
}
