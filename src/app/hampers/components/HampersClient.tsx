"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FilterChips from "./FilterChips";
import HamperGrid from "./HamperGrid";
import { HamperGridItem } from "../page";

export default function HampersClient({
  hampers,
}: {
  hampers: HamperGridItem[];
}) {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  const previousFilter = useRef(filter);
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     Detect filter change
  ========================= */
  useEffect(() => {
    if (previousFilter.current !== filter) {
      setIsLoading(true);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400); // smooth loading feel

      previousFilter.current = filter;

      return () => clearTimeout(timer);
    }
  }, [filter]);

  /* =========================
     Scroll only when filter changes
  ========================= */
  useEffect(() => {
    if (previousFilter.current === filter) return;

    const element = document.getElementById("hamper-grid");
    if (!element) return;

    const HEADER_OFFSET = 110;

    const y =
      element.getBoundingClientRect().top +
      window.scrollY -
      HEADER_OFFSET;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  }, [filter]);

  return (
    <>
      <FilterChips />

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
            className="fixed top-0 left-0 h-1 bg-[#8b6b55] z-50"
          />
        )}
      </AnimatePresence>

      <HamperGrid hampers={hampers} isLoading={isLoading} />
    </>
  );
}