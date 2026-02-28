"use client";

import { useRouter, useSearchParams } from "next/navigation";

const filters = [
  { id: "all", label: "All Hampers" },
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
  { id: "festivals", label: "Festivals" },
  { id: "wedding", label: "Wedding" },
  { id: "valentines", label: "Valentine's" },
  { id: "bulk", label: "Bulk" },
  { id: "others", label: "Others" },
];

export default function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get("filter") || "all";

  const handleClick = (filter: string) => {
    // 🚫 Do nothing if same filter clicked
    if (filter === activeFilter) return;

    if (filter === "all") {
      router.push("/hampers", { scroll: false });
    } else {
      router.push(`/hampers?filter=${filter}`, {
        scroll: false,
      });
    }
  };

  return (
    <section className="bg-background py-10 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="
  flex gap-3 
  justify-start md:justify-center
  overflow-x-auto md:overflow-visible
  no-scrollbar
">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleClick(filter.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-medium border transition ${
                activeFilter === filter.id
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white text-foreground/70 border-border hover:border-primary hover:text-primary"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}