"use client";

import React, { useState } from "react";
import Icon from "@/components/ui/AppIcon";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";

interface ActiveFilter {
  id: string;
  label: string;
}

const ProductsClient: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { id: "filter_1", label: "Birthday" },
    { id: "filter_2", label: "₹1,000 - ₹2,000" },
  ]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  const removeFilter = (filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  return (
    <>
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-muted-foreground">Active Filters:</span>
          {activeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => removeFilter(filter.id)}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
            >
              {filter.label}
              <Icon name="XMarkIcon" size={14} />
            </button>
          ))}
        </div>
      )}

      {/* Sort & Filter Bar */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted transition-colors"
          >
            <Icon name="AdjustmentsHorizontalIcon" size={20} />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm text-muted-foreground">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="popular">Most Popular</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[256px_1fr] gap-8">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        {/* Product Grid */}
        <div>
          <ProductGrid />
        </div>
      </div>
    </>
  );
};

export default ProductsClient;