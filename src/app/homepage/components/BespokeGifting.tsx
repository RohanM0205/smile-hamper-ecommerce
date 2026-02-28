"use client";

import Link from "next/link";
import Icon from "@/components/ui/AppIcon";

const BespokeGifting = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-background via-sand-100 to-background">

      {/* Glow Background */}
      <div className="absolute top-1/3 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-[160px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-[180px] animate-pulse pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-card/60 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Bespoke Gifting
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground leading-[1.05]">
            Tailored For Every
            <span className="italic text-primary relative inline-block ml-3">
              Occasion
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
          </h2>

          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            Whether for someone special or an entire organization,
            we craft personalized gifting experiences that leave a lasting impression.
          </p>
        </div>

        {/* Split Layout */}
        <div className="mt-20 grid md:grid-cols-2 gap-10">

          {/* Individual Personalization */}
          <div className="bg-card/60 backdrop-blur-md border border-border rounded-3xl p-10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-6">

            <div className="flex items-center gap-3">
              <Icon name="SparklesIcon" size={22} className="text-primary" />
              <h3 className="font-serif text-2xl text-foreground">
                For Individuals
              </h3>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Handpick products, add engraved names, include heartfelt
              messages, and design packaging that reflects your unique sentiment.
            </p>

            <Link
              href="/hampers/build"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              Design Your Hamper
              <Icon name="ArrowRightIcon" size={16} />
            </Link>
          </div>

          {/* Corporate Gifting */}
          <div className="bg-card/60 backdrop-blur-md border border-border rounded-3xl p-10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-6">

            <div className="flex items-center gap-3">
              <Icon name="BriefcaseIcon" size={22} className="text-primary" />
              <h3 className="font-serif text-2xl text-foreground">
                For Businesses
              </h3>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Custom-branded hampers, bulk orders, employee appreciation
              kits, and client gifting — executed with precision and elegance.
            </p>

            <Link
              href="/corporate"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              Explore Corporate Gifting
              <Icon name="ArrowRightIcon" size={16} />
            </Link>
          </div>

        </div>

        {/* Bottom Unified CTA */}
        <div className="mt-16 text-center">

          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-base transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            <span className="relative flex items-center gap-2">
              Discuss Your Requirements
              <Icon
                name="ArrowRightIcon"
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </Link>

        </div>

      </div>

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

export default BespokeGifting;