"use client";
import { useState } from "react";

interface Props {
  title: string;
}
/* ---------------- Normalize Helper ---------------- */
const normalize = (str: string) =>
  str.replace("’", "'").trim();
/* ---------------- Background Images ---------------- */
const bgImages: Record<string, string> = {
  Birthday:
    "https://res.cloudinary.com/dmjds6upr/image/upload/v1771155410/Happy_Birthday_Wallpapers_HD_sxyezs.jpg",

  Anniversary:
    "https://res.cloudinary.com/dmjds6upr/image/upload/v1771154925/photo-1522673607200-164d1b6ce486_dmfnum.avif",

  Wedding:
    "https://res.cloudinary.com/dmjds6upr/image/upload/v1771153755/photo-1520854221256-17451cc331bf_ft188z.avif",

  "Valentine's":
    "https://res.cloudinary.com/dmjds6upr/image/upload/v1771154253/Couple_walking_on_beach_at_sunset_by_Beautiful_things_on_creativemarket_ahf0rj.jpg",

  Festivals:
    "https://res.cloudinary.com/dmjds6upr/image/upload/v1771155835/holi_y3soxy.jpg",

  Bulk:
    "https://res.cloudinary.com/dmjds6upr/image/upload/v1771153663/photo-1556761175-5973dc0f32e7_h6xdxc.avif",

  Others:
    "https://res.cloudinary.com/dmjds6upr/image/upload/v1771153513/Spring_Baby_Shower_Ideas_Mom_s_First_Steps_xqyatf.jpg",

  "Special Days":
    "https://res.cloudinary.com/dmjds6upr/image/upload/v1771155410/mmdayn_pckvvd.jpg"
};

/* ---------------- Occasion Text Content ---------------- */

const occasionContent: Record<
  string,
  { heading: string; sub: string }
> = {
  Birthday: {
    heading: "Celebrate Their Day",
    sub: "Thoughtfully curated hampers designed to make every birthday unforgettable."
  },

  Anniversary: {
    heading: "Celebrate Love",
    sub: "Elegant gifts crafted to honor milestones, memories, and lasting bonds."
  },

  Wedding: {
    heading: "New Beginnings",
    sub: "Timeless hampers created to celebrate beautiful unions and fresh starts."
  },

  "Valentine's": {
    heading: "Love, Beautifully Expressed",
    sub: "Romantic gifts that speak from the heart and create unforgettable moments."
  },

  Festivals: {
    heading: "Festive Gifting",
    sub: "Celebrate traditions with warmth, light, and premium festive collections."
  },

  Bulk: {
    heading: "Corporate & Bulk Gifting",
    sub: "Impress with refined gifting solutions designed to leave a lasting impact."
  },

  Others: {
    heading: "Curated Celebrations",
    sub: "Discover elegant hampers crafted for meaningful moments and special occasions."
  },

  "Special Days": {
    heading: "Celebrate Special Moments",
    sub: "Thoughtful gifts designed to honor life’s most cherished days with elegance."
  }
};

export default function OccasionHero({ title }: Props) {
  const normalizedTitle = normalize(title);

  const content =
    occasionContent[normalizedTitle] || {
      heading: `${title} Gifts`,
      sub: "Discover thoughtfully curated hampers for unforgettable moments."
    };

  const imageUrl = bgImages[normalizedTitle];

  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl h-[200px] sm:h-[240px] md:h-[260px]">

      {/* Background Image */}
      {imageUrl && (
        <>
          {!loaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
          )}

          <img
            src={imageUrl}
            alt={title}
            onLoad={() => setLoaded(true)}
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-all duration-1000 ease-out
              ${loaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-sm"}
            `}
          />
        </>
      )}

      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white max-w-2xl mx-auto">

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight">
          {content.heading}
        </h1>

        <p className="text-sm sm:text-base md:text-lg mt-3 opacity-90 leading-relaxed">
          {content.sub}
        </p>

      </div>
    </div>
  );
}
