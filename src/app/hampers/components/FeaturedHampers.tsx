"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/app/products/components/ProductCard";

interface Hamper {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  image: string;
}

export default function FeaturedHampers({
  hampers = [],
}: {
  hampers: Hamper[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const limited = hampers.slice(0, 5);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#e8ded4] rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-[#f0e6dc] rounded-full animate-pulse opacity-30" />
      </div>

      <div
        className={`relative max-w-7xl mx-auto rounded-[36px]
        bg-gradient-to-br from-[#f6f1eb] via-[#f3ede6] to-[#efe7de]
        px-6 md:px-14 py-10 md:py-16
        shadow-[0_40px_120px_rgba(0,0,0,0.05)]
        transition-all duration-1000
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
      >
        {/* Glow Accent */}
        <div className="absolute -top-32 -right-32 w-[300px] h-[300px] bg-[#e8ded4] rounded-full blur-3xl opacity-40" />

        {/* HEADER */}
        <div className="text-center mb-14 relative z-10">
          <p className="text-[10px] md:text-xs tracking-[0.35em] text-[#8b6b55] uppercase">
            Customer Favorites
          </p>

          <h2 className="text-2xl md:text-4xl font-serif text-[#3f2e22] leading-snug mt-4">
            Best Selling Hampers
          </h2>

          <div className="w-16 h-[2px] bg-[#8b6b55] mx-auto mt-4" />

          <p className="text-[#6d4f3b] text-sm md:text-base max-w-md mx-auto leading-relaxed mt-4">
            A little love, beautifully packaged. Hampers curated to
            bring warmth to every occasion you celebrate.
          </p>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Skeleton */}
            <div className="lg:row-span-2 h-[420px] rounded-[32px] bg-gradient-to-r from-[#f3ede6] via-[#e8ded4] to-[#f3ede6] animate-pulse" />

            {/* Supporting Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:col-span-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-[32px] bg-gradient-to-r 
                  from-[#f3ede6] via-[#e8ded4] to-[#f3ede6]
                  animate-pulse"
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= PRODUCTS ================= */}
       {/* ================= PRODUCTS ================= */}
{!loading && limited.length > 0 && (
  <motion.div
    layout
    className="grid grid-cols-1 lg:grid-cols-5 gap-12 relative z-10"
  >
    {/* ================= MAIN PRODUCT (40%) ================= */}
    <motion.div
      key={limited[0].id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="lg:col-span-2"
    >
      <div
        className="relative h-[440px] rounded-[32px] overflow-hidden
        bg-white/60 backdrop-blur-sm
        border border-white/40
        shadow-[0_25px_70px_rgba(0,0,0,0.08)]
        group transition-all duration-700"
      >
        {/* Featured Badge */}
        <span className="absolute top-5 left-5 z-20 
          bg-[#3f2e22] text-white text-[10px] 
          px-5 py-2 rounded-full tracking-[0.3em] 
          shadow-md">
          FEATURED
        </span>

        <div className="h-full group-hover:scale-[1.02] transition-all duration-[1000ms]">
          <ProductCard product={limited[0] as any} />
        </div>
      </div>
    </motion.div>

    {/* ================= SUPPORTING GRID (60%) ================= */}
    <div className="grid grid-cols-2 gap-10 lg:col-span-3">
      {limited.slice(1).map((hamper, index) => (
        <motion.div
          key={hamper.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.08,
          }}
          whileHover={{ y: -4 }}
          className="rounded-[28px] overflow-hidden
            bg-white/50 backdrop-blur-sm
            border border-white/40
            shadow-[0_18px_50px_rgba(0,0,0,0.06)]
            hover:shadow-[0_28px_70px_rgba(0,0,0,0.10)]
            transition-all duration-500"
        >
          <div className="h-[210px]">
            <ProductCard product={hamper as any} />
          </div>
        </motion.div>
      ))}
    


    </div>
  </motion.div>
)}

        {!loading && limited.length === 0 && (
          <div className="text-center py-16 text-[#6d4f3b]">
            Best sellers will appear here soon.
          </div>
        )}
      </div>
    </section>
  );
}