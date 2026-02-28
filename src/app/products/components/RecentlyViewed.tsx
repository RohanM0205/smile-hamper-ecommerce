"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  tags: string[] | null;
  product_images: any[];
}

export default function RecentlyViewed() {
  const supabase = supabaseBrowser();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const stored = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      );

      if (!stored.length) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          price,
          discount_price,
          tags,
          product_images (
            image_url,
            is_primary,
            sort_order
          )
        `)
        .in("id", stored)
        .eq("is_active", true);

      if (data) {
        const ordered = stored
          .map((id: string) =>
            data.find((p) => p.id === id)
          )
          .filter(Boolean);

        setProducts(ordered);
      }

      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="relative py-16 md:py-24">

      {/* Soft background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#f3ede6] rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-12">

        {/* Editorial Divider */}
        <div className="text-center space-y-6">

          <div className="w-16 h-[1px] bg-[#8b6b55]/40 mx-auto" />

          <p className="text-[10px] md:text-xs tracking-[0.35em] text-[#8b6b55] uppercase">
            Your Journey
          </p>

          <h2 className="text-2xl md:text-4xl font-serif text-[#3f2e22]">
            Recently Viewed
          </h2>

          <p className="text-sm md:text-base text-[#6d4f3b]/70 max-w-2xl mx-auto leading-relaxed">
            A glimpse of the gifts that caught your heart.
            Continue where your story left off.
          </p>

        </div>

        {/* Scroll Container */}
        <div className="relative">

          {/* Left Fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-20" />

          {/* Right Fade */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-20" />

          {/* Horizontal Scroll */}
          <div className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4 scroll-smooth snap-x snap-mandatory">

            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-[260px] md:min-w-[300px] snap-start transition-transform duration-500 hover:-translate-y-2"
              >
                <ProductCard product={product} />
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
