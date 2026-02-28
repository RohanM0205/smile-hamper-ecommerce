"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";

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

export default function BestsellerSpotlight({
  products,
}: {
  products: Product[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!products || products.length === 0) return null;

  const featured = products[0];
  const supporting = products.slice(1, 4);

  /* ---------------------------
     EXPLORE HANDLER
  --------------------------- */
  const handleExplore = () => {
    router.push(`/products?quick=best_seller&page=1`, {
      scroll: false,
    });

    // smooth scroll to grid
    setTimeout(() => {
      const grid = document.getElementById("products-grid");
      if (grid) {
        grid.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 200);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Floating Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#e8ded4] rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-[#f0e6dc] rounded-full animate-pulse opacity-30" />
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-[#e8ded4] rounded-full animate-pulse opacity-40" />
      </div>

      <div
        className={`relative max-w-7xl mx-auto rounded-[28px] md:rounded-[36px]
        bg-gradient-to-br from-[#f6f1eb] via-[#f3ede6] to-[#efe7de]
        px-6 md:px-14 py-10 md:py-16
        shadow-[0_40px_120px_rgba(0,0,0,0.05)]
        transition-all duration-1000
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
      >
        {/* Soft Glow Accent */}
        <div className="absolute -top-32 -right-32 w-[300px] h-[300px] bg-[#e8ded4] rounded-full blur-[120px] opacity-40" />

        {/* Top Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT TEXT */}
          <div className="space-y-6 relative z-10 text-center lg:text-left">

            <p className="text-[10px] md:text-xs tracking-[0.35em] text-[#8b6b55] uppercase">
              Customer Favorites
            </p>

            <h2 className="text-2xl md:text-4xl font-serif text-[#3f2e22] leading-snug">
              Best Selling Gifts
            </h2>

            <div className="w-16 h-[2px] bg-[#8b6b55] mx-auto lg:mx-0" />

            <p className="text-[#6d4f3b] text-sm md:text-base max-w-md mx-auto lg:mx-0 leading-relaxed">
            Some gifts are bought. Ours are built—moment by moment, detail by detail, with someone special in mind.
            </p>

            {/* 🔥 UPDATED BUTTON */}
            <button
              onClick={handleExplore}
              className="inline-block relative text-sm font-medium text-[#3f2e22] group"
            >
              Explore Collection
              <span className="block h-[2px] bg-[#8b6b55] w-0 group-hover:w-full transition-all duration-400 mt-1" />
            </button>
          </div>

          {/* FEATURED PRODUCT */}
          <div className="relative z-10 group">
            <div className="transition-all duration-700 transform group-hover:scale-[1.02] group-hover:-translate-y-2">
              <ProductCard product={featured} />
            </div>
          </div>
        </div>

        {/* Supporting Products */}
        {supporting.length > 0 && (
          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 relative z-10">
            {supporting.map((product) => (
              <div
                key={product.id}
                className="transition-all duration-700 hover:-translate-y-2 hover:scale-[1.01]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
