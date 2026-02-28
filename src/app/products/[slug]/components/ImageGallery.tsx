"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WishlistButton from "./WishlistButton";

interface ProductImage {
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
  productId: string;
}

export default function ImageGallery({
  images,
  productName,
  productId,
}: ImageGalleryProps) {
  // ✅ Hydration-safe sorting (DO NOT mutate props)
  const sortedImages = useMemo(() => {
    if (!images) return [];
    return [...images].sort((a, b) => a.sort_order - b.sort_order);
  }, [images]);

  const primaryIndex = useMemo(() => {
    const index = sortedImages.findIndex((img) => img.is_primary);
    return index !== -1 ? index : 0;
  }, [sortedImages]);

  const [selectedIndex, setSelectedIndex] = useState(primaryIndex);

  const touchStartX = useRef<number | null>(null);

  const selectedImage =
    sortedImages[selectedIndex]?.image_url || "/placeholder.png";

  const handleImageChange = (index: number) => {
    if (index < 0 || index >= sortedImages.length) return;
    setSelectedIndex(index);
  };

  // Mobile swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const diff =
      touchStartX.current - e.changedTouches[0].clientX;

    if (diff > 50) handleImageChange(selectedIndex + 1);
    if (diff < -50) handleImageChange(selectedIndex - 1);

    touchStartX.current = null;
  };

  if (!sortedImages.length) {
    return (
      <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner text-gray-500">
        No Image Available
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* MAIN IMAGE */}
      <div className="relative overflow-hidden rounded-3xl group">
        <div
          className="relative w-full aspect-square 
                     rounded-3xl overflow-hidden 
                     bg-gradient-to-br from-white to-gray-100
                     shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)]
                     group"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            key={selectedImage}
            src={selectedImage}
            alt={productName}
            fill
            priority
            className="object-cover transition-transform duration-700 ease-out 
                       group-hover:scale-110 
                       cursor-zoom-in"
          />
          <WishlistButton productId={productId} />
        {/* Soft luxury overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

        {/* Desktop Arrows */}
        {selectedIndex > 0 && (
          <button
            onClick={() => handleImageChange(selectedIndex - 1)}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 
                       w-10 h-10 items-center justify-center
                       rounded-full bg-white/80 backdrop-blur-md
                       shadow-lg hover:scale-110 transition"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {selectedIndex < sortedImages.length - 1 && (
          <button
            onClick={() => handleImageChange(selectedIndex + 1)}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 
                       w-10 h-10 items-center justify-center
                       rounded-full bg-white/80 backdrop-blur-md
                       shadow-lg hover:scale-110 transition"
          >
            <ChevronRight size={18} />
          </button>
        )}
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-4 overflow-x-auto px-2 py-3 no-scrollbar">
        {sortedImages.map((img, index) => (
          <button
          key={img.image_url}
          onClick={() => handleImageChange(index)}
          className={`relative 
                      w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                      flex-shrink-0 
                      rounded-2xl
                      transition-all duration-300
                      ${
                        selectedIndex === index
                          ? "scale-105 shadow-xl"
                          : "opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
        >
          {/* Inner wrapper keeps image clipped */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src={img.image_url}
              alt={`${productName} ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        
          {/* Premium Brown Border */}
          {selectedIndex === index && (
            <div className="absolute inset-0 rounded-2xl border-2 border-[#7B4F2A] pointer-events-none" />
          )}
        </button>
        ))}
      </div>
    </div>
  );
}