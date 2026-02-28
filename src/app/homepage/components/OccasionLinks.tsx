"use client";

import React, { useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/AppIcon";

interface Occasion {
  id: string;
  name: string;
  icon: string;
  slug: string;
  image: string;
}

const occasions: Occasion[] = [
  {
    id: "birthday",
    name: "Birthday",
    icon: "CakeIcon",
    slug: "birthday",
    image: "https://res.cloudinary.com/dmjds6upr/image/upload/v1771936579/birthday3_fj187m.jpg",
  },
  {
    id: "anniversary",
    name: "Anniversary",
    icon: "HeartIcon",
    slug: "anniversary",
    image: "https://res.cloudinary.com/dmjds6upr/image/upload/v1771154925/photo-1522673607200-164d1b6ce486_dmfnum.avif",
  },
  {
    id: "wedding",
    name: "Wedding",
    icon: "GiftIcon",
    slug: "wedding",
    image: "https://res.cloudinary.com/dmjds6upr/image/upload/v1771153755/photo-1520854221256-17451cc331bf_ft188z.avif",
  },
  {
    id: "festival",
    name: "Festival",
    icon: "SparklesIcon",
    slug: "festivals",
    image: "https://res.cloudinary.com/dmjds6upr/image/upload/v1771155835/holi_y3soxy.jpg",
  },
  {
    id: "corporate",
    name: "Corporate",
    icon: "BriefcaseIcon",
    slug: "bulk",
    image: "https://res.cloudinary.com/dmjds6upr/image/upload/v1771153663/photo-1556761175-5973dc0f32e7_h6xdxc.avif",
  },
  {
    id: "newborn",
    name: "New Born",
    icon: "SparklesIcon",
    slug: "others",
    image: "https://res.cloudinary.com/dmjds6upr/image/upload/v1771153513/Spring_Baby_Shower_Ideas_Mom_s_First_Steps_xqyatf.jpg",
  },
  {
    id: "thankyou",
    name: "Thank You",
    icon: "HandThumbUpIcon",
    slug: "special-days",
    image: "https://res.cloudinary.com/dmjds6upr/image/upload/v1771155410/mmdayn_pckvvd.jpg",
  },
  {
    id: "getwell",
    name: "Get Well Soon",
    icon: "HeartIcon",
    slug: "others",
    image: "https://res.cloudinary.com/dmjds6upr/image/upload/v1771936656/getWellSoon_ktwiug.jpg",
  },
];

const OccasionLinks: React.FC = () => {
  const [style, setStyle] = useState({});

  const handleMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * 4;
    const rotateY = ((x - rect.width / 2) / rect.width) * -4;

    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const reset = () => {
    setStyle({ transform: "rotateX(0deg) rotateY(0deg)" });
  };

  return (
    <section className="py-28 bg-gradient-to-b from-background to-sand-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">
          <h2 className="font-serif text-5xl text-foreground mb-4">
            Shop by Occasion
          </h2>
          <p className="text-muted-foreground text-lg">
            Curated collections for life's most meaningful moments
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 perspective-[1200px]">

          {occasions.map((item) => (
            <Link
              key={item.id}
              href={`/occasions/${item.slug}`}
              className="group block"
            >
              <div
                onMouseMove={handleMove}
                onMouseLeave={reset}
                style={style}
                className="relative h-64 rounded-3xl overflow-hidden transition-all duration-300 will-change-transform"
              >

                {/* Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                {/* Dark cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/60 transition-all duration-500" />

                {/* Inner glow ring */}
                <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 group-hover:ring-primary/50 transition-all duration-500" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">
                      <Icon name={item.icon as any} size={22} />
                      <h3 className="text-lg font-medium tracking-wide">
                        {item.name}
                      </h3>
                    </div>

                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xl">
                      →
                    </span>

                  </div>

                </div>

              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
};

export default OccasionLinks;