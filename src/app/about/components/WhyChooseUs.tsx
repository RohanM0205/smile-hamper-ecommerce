import { Gift, Sparkles, Package, Truck } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Gift,
      title: "Curated With Care",
      desc: "Every product is handpicked for quality, elegance, and delight.",
    },
    {
      icon: Sparkles,
      title: "Customizable Experience",
      desc: "Build your own hamper and create something truly personal.",
    },
    {
      icon: Package,
      title: "Elegant Packaging",
      desc: "Premium presentation with attention to every detail.",
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      desc: "Secure, timely delivery you can trust.",
    },
  ];

  return (
    <section className="py-24 bg-[#f9f6f2]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#3f2e22]">
          Why Choose TheSmileHamper?
        </h2>

        <div className="grid md:grid-cols-4 gap-12 mt-16">
          {features.map((item, index) => (
            <div key={index} className="space-y-4">
              <item.icon className="mx-auto text-[#8b6b55]" size={36} />
              <h3 className="text-lg font-semibold text-[#3f2e22]">
                {item.title}
              </h3>
              <p className="text-sm text-[#6d4f3b]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}