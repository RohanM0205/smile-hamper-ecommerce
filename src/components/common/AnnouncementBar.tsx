"use client";

import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/AppIcon";

const messages = [
  "24-48 Hours Delivery Across India",
  "5 Lakh+ Gifts Delivered",
  "Free Shipping on Orders Above ₹1999",
  "Cash on Delivery Available",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % messages.length);
  };

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? messages.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] bg-[#6b4f3b] text-white text-xs sm:text-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-10">

        {/* Instagram */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0120 7.75v8.5A3.75 3.75 0 0116.25 20h-8.5A3.75 3.75 0 014 16.25v-8.5A3.75 3.75 0 017.75 4zm4.25 2.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm0 2a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm5.25-.75a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
        </a>

        {/* Center Slider */}
        {/* Center Slider */}
<div className="flex-1 flex justify-center items-center">

<div className="relative flex items-center justify-center w-[260px] sm:w-[520px]">

  {/* Left Arrow */}
  <button
    onClick={prevSlide}
    className="absolute -left-6 sm:-left-8 hover:opacity-70 transition"
  >
    <Icon name="ChevronLeftIcon" size={16} />
  </button>

  {/* Message */}
  <span className="text-center w-full truncate">
    {messages[index]}
  </span>

  {/* Right Arrow */}
  <button
    onClick={nextSlide}
    className="absolute -right-6 sm:-right-8 hover:opacity-70 transition"
  >
    <Icon name="ChevronRightIcon" size={16} />
  </button>

</div>

</div>


        {/* LinkedIn */}
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M4.98 3.5C4.98 4.88 3.86 6 2.49 6S0 4.88 0 3.5 1.12 1 2.49 1s2.49 1.12 2.49 2.5zM.5 8h4v13h-4V8zm7.5 0h3.6v1.8h.05c.5-.95 1.7-1.95 3.5-1.95 3.75 0 4.45 2.45 4.45 5.65V21h-4v-6.5c0-1.55-.03-3.55-2.15-3.55-2.15 0-2.48 1.7-2.48 3.45V21h-4V8z" />
          </svg>
        </a>

      </div>
    </div>
  );
}
