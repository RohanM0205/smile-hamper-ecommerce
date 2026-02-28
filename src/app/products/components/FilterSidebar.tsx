"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function FilterSidebar({
  categories,
  currentMin,
  currentMax,
  currentCategory,
  currentSort,
  currentSearch,
}: {
  categories: Category[];
  currentMin?: string;
  currentMax?: string;
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categorySearch, setCategorySearch] =
    useState("");

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) params.set(key, value);
    else params.delete(key);

    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
  };

  const filteredCategories = categories.filter((c) =>
    c.name
      .toLowerCase()
      .includes(categorySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2 border rounded-xl text-sm hover:bg-muted transition"
      >
        Clear All Filters
      </button>

      {/* Sort */}
      <div className="bg-card border rounded-2xl p-5">
        <h3 className="font-semibold mb-4">
          Sort By
        </h3>

        <select
          value={currentSort}
          onChange={(e) =>
            updateFilter("sort", e.target.value)
          }
          className="w-full border rounded-xl px-3 py-2"
        >
          <option value="newest">Most Popular</option>
          <option value="price_asc">
            Price: Low to High
          </option>
          <option value="price_desc">
            Price: High to Low
          </option>
        </select>
      </div>

      {/* Category */}
      <div className="bg-card border rounded-2xl p-5">
        <details className="lg:open">
          <summary className="font-semibold cursor-pointer">
            Category
          </summary>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Search category..."
              value={categorySearch}
              onChange={(e) =>
                setCategorySearch(e.target.value)
              }
              className="w-full border rounded-xl px-3 py-2"
            />

            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  updateFilter(
                    "category",
                    currentCategory === cat.slug
                      ? null
                      : cat.slug
                  )
                }
                className={`block w-full text-left ${
                  currentCategory === cat.slug
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </details>
      </div>

      {/* Price */}
      <div className="bg-card border rounded-2xl p-5">
        <details className="lg:open">
          <summary className="font-semibold cursor-pointer">
            Price Range
          </summary>

          <div className="mt-4 space-y-3">
            <button
              onClick={() => {
                updateFilter("min", "0");
                updateFilter("max", "1000");
              }}
              className="block w-full text-left text-muted-foreground hover:text-primary"
            >
              Under ₹1,000
            </button>

            <button
              onClick={() => {
                updateFilter("min", "1000");
                updateFilter("max", "3000");
              }}
              className="block w-full text-left text-muted-foreground hover:text-primary"
            >
              ₹1,000 - ₹3,000
            </button>

            <button
              onClick={() => {
                updateFilter("min", "3000");
                updateFilter("max", null);
              }}
              className="block w-full text-left text-muted-foreground hover:text-primary"
            >
              Above ₹3,000
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}
