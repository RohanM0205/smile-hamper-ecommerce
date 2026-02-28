"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/AppIcon";

const SALE_END_DATE = new Date("2026-03-01T23:59:59").getTime();

const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  function getTimeRemaining() {
    const now = Date.now();
    const difference = SALE_END_DATE - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    setTimeLeft(getTimeRemaining());

    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-b from-sand-100 via-background to-background">

      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[140px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[160px] animate-pulse pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 py-20">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-card/60 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">
            Flash Sale Ends Soon
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tighter text-foreground">
          Gifts That Bring
          <br />
          <span className="italic text-primary relative inline-block">
            Smiles
            <svg
              className="absolute left-0 -bottom-3 w-full h-6"
              viewBox="0 0 200 20"
              preserveAspectRatio="none"
            >
              <path
                d="M5 15 Q 100 25 195 15"
                stroke="currentColor"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                className="underline-draw"
              />
            </svg>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
          Thoughtfully curated gift hampers for every occasion. Premium quality,
          beautiful presentation, delivered with care.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            href="/products"
            className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-base transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            <span className="relative flex items-center gap-2">
              Explore Gifts
              <Icon
                name="ArrowRightIcon"
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </Link>

          <Link
            href="/hampers/build"
            className="px-8 py-4 bg-white border border-primary/30 text-primary rounded-full font-medium text-base hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            Build Your Own Hamper
          </Link>

        </div>

        {/* Countdown (Hydration Safe) */}
        {timeLeft && (
          <div className="grid grid-cols-4 gap-4 sm:gap-8 max-w-xl mx-auto pt-8">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Mins", value: timeLeft.minutes },
              { label: "Secs", value: timeLeft.seconds },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-card/60 backdrop-blur-md rounded-xl py-5 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="font-serif text-3xl sm:text-4xl text-foreground">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Improved Trust Snapshot Section */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-10">

          <div className="flex items-center gap-2 px-4 py-2 bg-card/60 backdrop-blur-md border border-border rounded-full shadow-sm hover:shadow-md transition-all">
            <Icon name="TruckIcon" size={16} className="text-success" />
            <span className="text-sm text-foreground font-medium">
              Same Day Delivery
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-card/60 backdrop-blur-md border border-border rounded-full shadow-sm hover:shadow-md transition-all">
            <Icon name="CheckBadgeIcon" size={16} className="text-success" />
            <span className="text-sm text-foreground font-medium">
              100% Genuine
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-card/60 backdrop-blur-md border border-border rounded-full shadow-sm hover:shadow-md transition-all">
            <Icon name="HeartIcon" size={16} className="text-success" />
            <span className="text-sm text-foreground font-medium">
              10,000+ Happy Customers
            </span>
          </div>

        </div>

      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <style jsx>{`
        .underline-draw {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: draw 1.2s ease forwards;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;