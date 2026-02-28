"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  itemCount: number;
}

const collections: Collection[] = [
  {
    id: "col_luxury",
    name: "Luxury Hampers",
    description: "Premium gifts for those special moments",
    image:
      "https://img.rocket.new/generatedImages/rocket_gen_img_1b20e0945-1766925702654.png",
    alt: "Luxury gift hamper",
    itemCount: 24,
  },
  {
    id: "col_chocolate",
    name: "Chocolate Paradise",
    description: "Indulgent treats for chocolate lovers",
    image:
      "https://images.unsplash.com/photo-1569442130148-5dd96b7e4ec9",
    alt: "Chocolate gift box",
    itemCount: 18,
  },
  {
    id: "col_wellness",
    name: "Wellness Collection",
    description: "Self-care gifts for mind and body",
    image:
      "https://img.rocket.new/generatedImages/rocket_gen_img_10cfce0de-1768328062843.png",
    alt: "Wellness hamper",
    itemCount: 15,
  },
];

const FeaturedCollections: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevents hydration mismatch

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + collections.length) % collections.length
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % collections.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-primary text-xs uppercase tracking-widest block mb-3">
              Curated Collections
            </span>
            <h2 className="font-serif text-5xl text-foreground">
              Signature Collections
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition"
            >
              <Icon name="ChevronLeftIcon" size={20} />
            </button>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition"
            >
              <Icon name="ChevronRightIcon" size={20} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="relative h-[520px] flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {collections.map((collection, index) => {
            const isActive = index === activeIndex;
            const isPrev =
              index ===
              (activeIndex - 1 + collections.length) %
                collections.length;
            const isNext =
              index ===
              (activeIndex + 1) % collections.length;

            return (
              <div
                key={collection.id}
                className={`
                  absolute transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${
                    isActive
                      ? "z-30 scale-100 opacity-100"
                      : isPrev
                      ? "z-20 -translate-x-[55%] scale-90 opacity-60"
                      : isNext
                      ? "z-20 translate-x-[55%] scale-90 opacity-60"
                      : "opacity-0 pointer-events-none"
                  }
                `}
                style={{ width: "520px" }}
              >
                <Link
                  href="/products"
                  className="group block rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition"
                >
                  <div className="relative h-[420px]">

                    <AppImage
                      src={collection.image}
                      alt={collection.alt}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute top-5 left-5">
                      <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1 rounded-full text-xs tracking-wide">
                        {collection.itemCount} Items
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="font-serif text-3xl mb-3">
                        {collection.name}
                      </h3>
                      <p className="text-white/80 mb-6">
                        {collection.description}
                      </p>

                      <span className="inline-flex items-center gap-2 text-sm group-hover:gap-3 transition-all">
                        Explore Collection
                        <Icon
                          name="ArrowRightIcon"
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;