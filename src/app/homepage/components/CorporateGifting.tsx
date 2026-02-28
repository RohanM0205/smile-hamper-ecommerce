"use client";

import Link from "next/link";
import Icon from "@/components/ui/AppIcon";

const CorporateGifting = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-sand-100 via-background to-background">

      {/* Background Glow */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[160px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-accent/10 rounded-full blur-[180px] animate-pulse pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-card/60 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">
              Corporate Gifting
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground leading-[1.05]">
            Gifting, Elevated for
            <span className="italic text-primary relative inline-block ml-3">
              Business
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
            Impress clients, reward employees, and celebrate milestones
            with premium corporate hampers designed to reflect your brand.
          </p>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">

          <div className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
            <Icon name="BriefcaseIcon" size={22} className="text-primary" />
            <h3 className="font-serif text-xl text-foreground">
              Bulk Orders, Seamlessly Managed
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              From small teams to large enterprises, we handle bulk gifting
              with precision, quality control, and timely delivery.
            </p>
          </div>

          <div className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
            <Icon name="BuildingOffice2Icon" size={22} className="text-primary" />
            <h3 className="font-serif text-xl text-foreground">
              Custom Brand Integration
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Add your company logo, personalized notes, and branded packaging
              to create a lasting impression.
            </p>
          </div>

          <div className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4">
            <Icon name="TruckIcon" size={22} className="text-primary" />
            <h3 className="font-serif text-xl text-foreground">
              Nationwide Delivery
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Reliable logistics support across locations,
              ensuring every gift arrives beautifully and on time.
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            href="/corporate"
            className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium text-base transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            <span className="relative flex items-center gap-2">
              Explore Corporate Gifting
              <Icon
                name="ArrowRightIcon"
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </Link>

          <Link
            href="/contact"
            className="px-8 py-4 bg-white border border-primary/30 text-primary rounded-full font-medium text-base hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
          >
            Request Bulk Quote
          </Link>

        </div>

      </div>

      {/* underline animation */}
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

export default CorporateGifting;