"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

const phrases = [
  "Search for necklaces",
  "Search for bracelets",
  "Search for birthday hampers",
  "Search for anniversary gifts",
];

type Phase = "typing" | "pausing" | "deleting";

export default function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(
    searchParams.get("search") || ""
  );

  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔥 Slower & smoother
  const typingSpeed = 90;
  const deletingSpeed = 60;
  const pauseDuration = 1500;

  useEffect(() => {
    if (value) return;

    const currentPhrase = phrases[phraseIndex];

    const runAnimation = () => {
      if (phase === "typing") {
        const nextText = currentPhrase.slice(0, displayText.length + 1);
        setDisplayText(nextText);

        if (nextText === currentPhrase) {
          setPhase("pausing");
        }
      } 
      else if (phase === "pausing") {
        timeoutRef.current = setTimeout(() => {
          setPhase("deleting");
        }, pauseDuration);
        return;
      } 
      else if (phase === "deleting") {
        const nextText = currentPhrase.slice(0, displayText.length - 1);
        setDisplayText(nextText);

        if (nextText === "") {
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          setPhase("typing");
        }
      }
    };

    timeoutRef.current = setTimeout(
      runAnimation,
      phase === "deleting" ? deletingSpeed : typingSpeed
    );

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

  }, [displayText, phase, phraseIndex, value]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
  
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
  
    params.set("page", "1");
  
    router.push(`/products?${params.toString()}`, {
      scroll: false, // 🚀 prevent auto scroll to top
    });
  
    // 👇 Smooth scroll to Quick Filters after navigation
    setTimeout(() => {
      const section = document.getElementById("quick-filters");
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100); // small delay ensures DOM is ready
  };

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">

        {/* Real Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border rounded-xl px-12 py-3"
        />

        {/* Animated Placeholder Overlay */}
        {!value && (
          <div className="absolute inset-0 flex items-center px-4 pointer-events-none text-muted-foreground">
            <Search size={18} className="mr-2 opacity-70" />
            <span>{displayText}</span>
          </div>
        )}

      </div>

      <button
        onClick={handleSearch}
        className="px-6 bg-primary text-primary-foreground rounded-xl"
      >
        Search
      </button>
    </div>
  );
}
