"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/app/products/components/ProductCard";
import { HamperGridItem } from "../page";

const PAGE_SIZE = 9;
const HEADER_OFFSET = 110;

export default function HamperGrid({
  hampers,
  isLoading,
}: {
  hampers: HamperGridItem[];
  isLoading: boolean;
}) {
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaginating, setIsPaginating] = useState(false);

  /* =========================
     RESET PAGE WHEN FILTER CHANGES
  ========================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [hampers]);

  /* =========================
     SORTING
  ========================= */
  const sortedHampers = useMemo(() => {
    let result = [...hampers];

    if (sortOption === "low-high") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [hampers, sortOption]);

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.ceil(sortedHampers.length / PAGE_SIZE);

  const paginatedHampers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedHampers.slice(start, start + PAGE_SIZE);
  }, [sortedHampers, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setIsPaginating(true);
    setCurrentPage(page);

    const grid = document.getElementById("hamper-grid");
    if (!grid) return;

    const y =
      grid.getBoundingClientRect().top +
      window.scrollY -
      HEADER_OFFSET;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    setTimeout(() => setIsPaginating(false), 400);
  };

  /* =========================
     SMART PAGE GENERATOR
  ========================= */
  const generatePages = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      start = 1;
      end = Math.min(totalPages, maxVisible);
    }

    if (currentPage >= totalPages - 2) {
      start = Math.max(1, totalPages - 4);
      end = totalPages;
    }

    if (start > 1) pages.push("start-ellipsis");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) pages.push("end-ellipsis");

    return pages;
  };

  const pages = generatePages();

  return (
    <section id="hamper-grid" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* =========================
           TOP PROGRESS BAR
        ========================= */}
        <AnimatePresence>
          {(isLoading || isPaginating) && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-0 left-0 h-1 bg-[#8b6b55] rounded-full"
            />
          )}
        </AnimatePresence>

        {/* =========================
           HEADER
        ========================= */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#3f2e22]">
            Explore Our Collection
          </h2>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-border rounded-full px-5 py-2 text-sm bg-white"
          >
            <option value="default">Sort By</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {/* =========================
           GRID / LOADING
        ========================= */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : paginatedHampers.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No hampers found.
          </div>
        ) : (
          <>
            {/* ================= GRID ================= */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="wait">
                {paginatedHampers.map((hamper, index) => (
                  <motion.div
                    key={hamper.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                    }}
                  >
                    <ProductCard product={hamper} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* =========================
               PAGINATION
            ========================= */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-14">

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-sm font-medium disabled:opacity-40 hover:text-[#3f2e22]"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  {pages.map((page, index) => {
                    if (page === "start-ellipsis" || page === "end-ellipsis") {
                      return (
                        <span key={index} className="px-2 text-[#b9a89a]">
                          ...
                        </span>
                      );
                    }

                    const isActive = page === currentPage;

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition
                          ${
                            isActive
                              ? "bg-[#8b6b55] text-white shadow-md"
                              : "bg-[#f3ede6] text-[#6d4f3b] hover:bg-[#e8ded4]"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-sm font-medium disabled:opacity-40 hover:text-[#3f2e22]"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* =========================
   SKELETON CARD
========================= */

function SkeletonCard() {
  return (
    <div className="h-80 rounded-[32px] bg-gradient-to-r 
    from-[#f3ede6] via-[#e8ded4] to-[#f3ede6]
    bg-[length:200%_100%] animate-shimmer" />
  );
}