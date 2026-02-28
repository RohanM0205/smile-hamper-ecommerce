"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
  totalCount: number;
}

const PAGE_SIZE = 9;
const HEADER_OFFSET = 110;

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  totalCount,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const isPaginating = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  /* -----------------------------------
     Detect page/filter change
  ----------------------------------- */
  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); // smooth loading feel

    return () => clearTimeout(timer);
  }, [products]);

  /* -----------------------------------
     Scroll only when paginating
  ----------------------------------- */
  useEffect(() => {
    if (!isPaginating.current) return;

    const scroll = () => {
      const element = document.getElementById("quick-filters");
      if (!element) return;

      const y =
        element.getBoundingClientRect().top +
        window.scrollY -
        HEADER_OFFSET;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      isPaginating.current = false;
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(scroll);
    });
  }, [currentPage]);

  /* -----------------------------------
     Page Change
  ----------------------------------- */
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    isPaginating.current = true;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    router.push(`/products?${params.toString()}`, {
      scroll: false,
    });
  };

  /* -----------------------------------
     Generate Smart Pages
  ----------------------------------- */
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
    <div className="space-y-14 relative">

      {/* =========================
         TOP PROGRESS BAR
      ========================= */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 left-0 h-1 bg-[#8b6b55] rounded-full"
          />
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="text-sm text-[#6d4f3b]">
        Showing{" "}
        <span className="font-medium text-[#3f2e22]">
          {products.length}
        </span>{" "}
        of{" "}
        <span className="font-medium text-[#3f2e22]">
          {totalCount}
        </span>{" "}
        products
      </div>

      {/* =========================
           GRID
      ========================= */}

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="wait">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </AnimatePresence>
      </motion.div>

      {/* =========================
           PAGINATION
      ========================= */}

      {totalPages > 1 && (
        <div className="pt-8">

          {/* DESKTOP */}
          <div className="hidden md:flex justify-center items-center gap-8">

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`text-sm font-medium transition-all duration-300
                ${
                  currentPage === 1
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:text-[#3f2e22] hover:-translate-x-1"
                }`}
            >
              ← Previous
            </button>

            <div className="flex items-center gap-3">
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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    key={page}
                    onClick={() =>
                      handlePageChange(page as number)
                    }
                    className={`w-11 h-11 rounded-full text-sm font-medium
                      transition-all duration-300
                      ${
                        isActive
                          ? "bg-[#8b6b55] text-white shadow-xl"
                          : "bg-[#f3ede6] text-[#6d4f3b] hover:bg-[#e8ded4]"
                      }`}
                  >
                    {page}
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`text-sm font-medium transition-all duration-300
                ${
                  currentPage === totalPages
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:text-[#3f2e22] hover:translate-x-1"
                }`}
            >
              Next →
            </button>
          </div>

          {/* MOBILE */}
          <div className="flex md:hidden justify-between items-center mt-6 px-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-sm text-[#6d4f3b] disabled:opacity-40"
            >
              ←
            </button>

            <span className="text-sm text-[#3f2e22] font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-sm text-[#6d4f3b] disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

/* =========================
   Skeleton Loader
========================= */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse">
      <div className="h-64 bg-gradient-to-r from-[#f3ede6] via-[#e8ded4] to-[#f3ede6] bg-[length:200%_100%] animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#f3ede6] rounded w-3/4" />
        <div className="h-4 bg-[#f3ede6] rounded w-1/2" />
      </div>
    </div>
  );
}
