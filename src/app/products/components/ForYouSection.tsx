"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const herImages = [
  "https://res.cloudinary.com/dmjds6upr/image/upload/v1770964371/1_exdauk.png",
  "https://res.cloudinary.com/dmjds6upr/image/upload/v1770964371/5_vgghzr.png",
  "https://res.cloudinary.com/dmjds6upr/image/upload/v1770964371/3_sojwgn.png",
];

const himImages = [
  "https://res.cloudinary.com/dmjds6upr/image/upload/v1770964497/6_nxggos.png",
  "https://res.cloudinary.com/dmjds6upr/image/upload/v1770964497/4_wdqbdt.png",
  "https://res.cloudinary.com/dmjds6upr/image/upload/v1770964497/2_xor1ib.png",
];

export default function ForYouSection() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  /* -----------------------------
     ALWAYS START PAGE FROM TOP
  ----------------------------- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  /* -----------------------------
     IMAGE ROTATION
  ----------------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % herImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleShopNow = (type: "her" | "him") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("quick", type);
    params.set("page", "1");

    router.push(`/products?${params.toString()}`, { scroll: false });

    setTimeout(() => {
      const grid = document.getElementById("products-grid");
      if (grid) {
        grid.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 200);
  };

  return (
    <section className="space-y-10 md:space-y-16">

      {/* ================= PREMIUM QUOTE ================= */}
      <div className="text-center max-w-3xl mx-auto space-y-4 px-4">
        <p className="text-[10px] md:text-xs tracking-[0.35em] text-[#8b6b55] uppercase">
          Curated With Love
        </p>

        <h2 className="text-2xl md:text-4xl font-serif text-[#3f2e22] leading-snug">
          Find The Perfect Gift
        </h2>

        <div className="w-20 h-[2px] bg-[#8b6b55] mx-auto" />

      </div>

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 bg-[#f6f1eb] p-4 md:p-6 rounded-3xl">

        <Card
          images={herImages}
          index={index}
          label="FOR HER"
          text="Surprise the one who makes your world beautiful."
          gradient="from-pink-100 via-pink-50 to-white"
          buttonColor="bg-pink-500"
          onClick={() => handleShopNow("her")}
        />

        <Card
          images={himImages}
          index={index}
          label="FOR HIM"
          text="Gift the man who stands by you always."
          gradient="from-blue-100 via-blue-50 to-white"
          buttonColor="bg-blue-600"
          reverse
          onClick={() => handleShopNow("him")}
        />

      </div>

    </section>
  );
}

/* ================= CARD COMPONENT ================= */

function Card({
  images,
  index,
  label,
  text,
  gradient,
  buttonColor,
  reverse = false,
  onClick,
}: {
  images: string[];
  index: number;
  label: string;
  text: string;
  gradient: string;
  buttonColor: string;
  reverse?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="relative rounded-3xl overflow-hidden flex flex-col md:flex-row
      shadow-[0_15px_45px_rgba(0,0,0,0.08)]
      md:hover:shadow-[0_25px_70px_rgba(0,0,0,0.12)]
      md:hover:-translate-y-1
      transition-all duration-500"
    >
      {/* IMAGE */}
      <div
        className={`relative w-full md:w-[65%] h-[260px] md:h-[430px]
        flex items-center justify-center bg-[#faf6f1] overflow-hidden
        ${reverse ? "order-1 md:order-2" : ""}`}
      >
        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt={label}
            fill
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`absolute inset-0 object-contain object-center transition-opacity duration-1000 ease-in-out
              ${i === index ? "opacity-100 animate-float" : "opacity-0"}
            `}
          />
        ))}
      </div>

      {/* PANEL */}
      <div
        className={`w-full md:w-[35%] ${
          reverse ? "order-2 md:order-1" : ""
        } bg-gradient-to-br ${gradient}
        flex flex-col justify-center px-5 md:px-8 py-6 md:py-0`}
      >
        <p className="text-[10px] md:text-xs tracking-widest font-semibold text-[#8b6b55]">
          {label}
        </p>

        <h3 className="mt-3 md:mt-4 text-[16px] md:text-[20px] font-medium leading-relaxed tracking-wide text-[#3f2e22]">
          {text}
        </h3>

        <button
          type="button"
          onClick={onClick}
          className={`relative mt-6 md:mt-8 ${buttonColor} text-white py-2.5 text-sm rounded-full shadow-md md:hover:scale-105 transition overflow-hidden`}
        >
          <span className="absolute inset-0 bg-white/20 -translate-x-full md:hover:translate-x-full transition duration-700 skew-x-12"></span>
          <span className="relative z-10">Shop Now</span>
        </button>
      </div>
    </div>
  );
}
