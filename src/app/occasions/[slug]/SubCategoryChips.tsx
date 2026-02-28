"use client";

import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  occasionSlug: string;
  categories: Category[];
  activeSlug?: string;
}

export default function SubCategoryChips({
  occasionSlug,
  categories,
  activeSlug,
}: Props) {
  return (
    <div className="relative py-12 md:py-16">

      {/* Softer Ambient Glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[650px] h-[300px] bg-[#f6f1eb] rounded-full blur-[130px] opacity-60" />
      </div>

      {/* Capsule Container */}
      <div
        className="
          relative
          flex flex-wrap justify-center
          gap-x-5 gap-y-4
          max-w-5xl mx-auto
          bg-[#fbf8f4]/90 backdrop-blur-md
          border border-[#e9e2d9]
          rounded-[60px]
          px-6 md:px-10
          py-5 md:py-7
          shadow-[0_20px_60px_rgba(0,0,0,0.04)]
        "
      >
        {/* Soft Inner Highlight */}
        <div className="absolute inset-0 rounded-[60px] bg-white/30 pointer-events-none" />

        {/* ALL Button */}
        <Chip
          href={`/occasions/${occasionSlug}`}
          label="All"
          isActive={!activeSlug}
        />

        {categories.map((cat) => (
          <Chip
            key={cat.id}
            href={`/occasions/${occasionSlug}?sub=${cat.slug}`}
            label={cat.name}
            isActive={activeSlug === cat.slug}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Refined Chip ---------------- */

function Chip({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        relative
        px-5 md:px-6
        py-2 md:py-2.5
        text-sm md:text-[15px]
        rounded-full
        font-medium
        transition-all duration-300
        whitespace-nowrap
        ${
          isActive
            ? `
              bg-gradient-to-r from-[#8b6b55] to-[#a3836c]
              text-white
              shadow-[0_6px_20px_rgba(0,0,0,0.12)]
            `
            : `
              text-[#6d4f3b]
              bg-white
              border border-transparent
              hover:bg-[#f3ede6]
              hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]
            `
        }
      `}
    >
      {label}
    </Link>
  );
}
