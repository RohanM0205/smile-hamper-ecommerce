"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/AppIcon";

const features = [
  {
    icon: "GiftIcon",
    title: "Handcrafted Premium Hampers",
    description:
      "Every hamper is thoughtfully curated with premium products that leave a lasting impression.",
  },
  {
    icon: "TruckIcon",
    title: "Fast & Secure Delivery",
    description:
      "We ensure safe packaging and timely delivery so your surprises arrive perfectly.",
  },
  {
    icon: "SparklesIcon",
    title: "Personalised Gifting",
    description:
      "Add custom messages and tailor your gift to make every moment more meaningful.",
  },
  {
    icon: "StarIcon",
    title: "Trusted by Thousands",
    description:
      "Loved by customers across India for our quality, elegance, and service excellence.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">

      {/* ================= PREMIUM BACKGROUND LAYERS ================= */}

      <div className="absolute inset-0 -z-10">

        {/* Center Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#f3ede6] rounded-full blur-[160px] opacity-40" />

        {/* Left soft tint */}
        <div className="absolute -left-32 top-1/3 w-[500px] h-[500px] bg-[#efe7de] rounded-full blur-[140px] opacity-30" />

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#e8ded4] rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-20 right-24 w-3 h-3 bg-[#f0e6dc] rounded-full animate-pulse opacity-30" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#e8ded4] rounded-full animate-pulse opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ================= EDITORIAL HEADER ================= */}

        <div className="text-center max-w-3xl mx-auto space-y-8 mb-20">

          <div className="w-20 h-[1px] bg-[#8b6b55]/40 mx-auto" />

          <p className="text-[11px] tracking-[0.4em] uppercase text-[#8b6b55]">
            Why Choose TheSmileHamper
          </p>

          <h2 className="text-3xl md:text-5xl font-serif text-[#3f2e22] leading-tight">
            Crafted With Love.
            <br className="hidden md:block" />
            Delivered With Care.
          </h2>

          <p className="text-sm md:text-base text-[#6d4f3b]/75 leading-relaxed">
            We don’t just send gifts — we craft emotions, preserve memories,
            and deliver joy wrapped in elegance.
          </p>
        </div>

        {/* ================= FEATURE GRID ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="
                group relative
                bg-white/70 backdrop-blur-xl
                border border-[#e8ded4]
                rounded-[36px]
                p-10
                shadow-[0_30px_80px_rgba(0,0,0,0.04)]
                hover:shadow-[0_40px_120px_rgba(0,0,0,0.08)]
                hover:-translate-y-3
                transition-all duration-700
                overflow-hidden
              "
            >

              {/* Hover spotlight glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700">
                <div className="absolute -top-20 -right-20 w-[200px] h-[200px] bg-[#f3ede6] rounded-full blur-[100px] opacity-60" />
              </div>

              {/* Icon Halo */}
              <div className="
                relative z-10
                w-20 h-20
                rounded-full
                bg-gradient-to-br from-[#f3ede6] via-white to-[#faf6f1]
                flex items-center justify-center
                mb-8
                shadow-[inset_0_4px_15px_rgba(0,0,0,0.05)]
                group-hover:scale-110
                transition-transform duration-500
              ">
                <div className="absolute inset-0 rounded-full bg-[#8b6b55]/10 blur-md opacity-0 group-hover:opacity-100 transition duration-700" />
                <Icon
                  name={feature.icon}
                  size={28}
                  className="text-[#8b6b55]"
                />
              </div>

              {/* Title */}
              <h3 className="relative z-10 text-[17px] font-semibold text-[#3f2e22] leading-snug">
                {feature.title}
              </h3>

              {/* Animated underline */}
              <div className="h-[1px] w-0 bg-[#8b6b55]/50 mt-4 group-hover:w-16 transition-all duration-700" />

              {/* Description */}
              <p className="relative z-10 mt-5 text-sm text-[#6d4f3b]/80 leading-relaxed">
                {feature.description}
              </p>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
