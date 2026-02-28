"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

const primaryTabs = [
  { label: "All", value: "all" },
  { label: "For Her", value: "her" },
  { label: "For Him", value: "him" },
  { label: "Under ₹1999", value: "budget" },
  { label: "Premium", value: "premium" },
  { label: "New Arrivals", value: "new" },
];

const tagTabs = [
  { label: "Trending", value: "trending" },
  { label: "Best Sellers", value: "best_seller" },
  { label: "Sale", value: "sale" },
  { label: "Featured", value: "featured" },
];

export default function QuickFilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("quick") || "all";
  const [isPending, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  const allTabs = [...primaryTabs, ...tagTabs];

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  /* ---------------- Indicator ---------------- */

  const updateIndicator = () => {
    const container = containerRef.current;
    if (!container) return;

    const activeButton = container.querySelector(
      `[data-value="${active}"]`
    ) as HTMLElement;

    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });

      scrollWrapperRef.current?.scrollTo({
        left:
          activeButton.offsetLeft -
          scrollWrapperRef.current.offsetWidth / 2 +
          activeButton.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    updateIndicator();
  }, [active]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [active]);

  /* ---------------- Click Handler ---------------- */

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("quick");
    } else {
      params.set("quick", value);
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`/products?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  return (
    <section
      id="quick-filters"
      className="relative py-16 md:py-20 px-4"
    >
      {/* Soft Premium Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#f3ede6] rounded-full blur-[140px] opacity-40" />
      </div>

      {/* Heading */}
      <div className="text-center space-y-5 mb-14">
        <div className="w-16 h-[1px] bg-[#8b6b55]/40 mx-auto" />

        <p className="text-[10px] md:text-xs tracking-[0.4em] text-[#8b6b55] uppercase">
          Curated Selection
        </p>

        <h3 className="text-xl md:text-3xl font-serif text-[#3f2e22]">
          Discover Gifts That Speak Love
        </h3>

        <p className="text-sm text-[#6d4f3b]/70 max-w-xl mx-auto">
          Explore handpicked hampers crafted for every emotion and every moment.
        </p>
      </div>

      {/* ================= UNIFIED FILTER CONTAINER ================= */}

      <div className="relative w-full flex justify-center">

        <div
          ref={scrollWrapperRef}
          className="w-full max-w-5xl overflow-x-auto scrollbar-hide"
        >
          <div
            ref={containerRef}
            className="
              relative flex w-max mx-auto items-center gap-2
              bg-white/80 backdrop-blur-md
              border border-[#e8ded4]
              rounded-full
              p-2
              shadow-[0_20px_60px_rgba(0,0,0,0.06)]
            "
          >
            {/* Sliding Indicator */}
            <div
              className="
                absolute top-2 bottom-2
                rounded-full
                bg-gradient-to-r from-[#8b6b55] to-[#6d4f3b]
                transition-all duration-300 ease-out
                shadow-md
              "
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
            />

            {allTabs.map((tab) => {
              const isActive = active === tab.value;

              return (
                <button
                  key={tab.value}
                  data-value={tab.value}
                  disabled={isPending}
                  onClick={() => handleClick(tab.value)}
                  className={`
                    relative z-10 whitespace-nowrap
                    px-6 py-2.5 text-sm rounded-full
                    font-medium
                    transition-all duration-300
                    ${
                      isActive
                        ? "text-white"
                        : "text-[#6d4f3b] hover:text-[#3f2e22]"
                    }
                  `}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}
