"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function HamperSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`/hampers?${params.toString()}`, {
      scroll: false,
    });

    setTimeout(() => {
      const section = document.getElementById("hamper-grid");
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <section className="bg-background py-10 border-b border-border">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search hampers..."
              className="w-full border rounded-xl px-12 py-3"
            />

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>

          <button
            onClick={handleSearch}
            className="px-6 bg-primary text-primary-foreground rounded-xl"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}