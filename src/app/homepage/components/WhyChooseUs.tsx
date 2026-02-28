import React from "react";
import AppImage from "@/components/ui/AppImage";
import Icon from "@/components/ui/AppIcon";

const benefits = [
  {
    id: "benefit_quality",
    icon: "CheckBadgeIcon",
    title: "Premium Quality",
    description: "100% genuine products sourced from trusted brands",
  },
  {
    id: "benefit_delivery",
    icon: "TruckIcon",
    title: "Same Day Delivery",
    description: "Order before 2 PM for same-day delivery in select cities",
  },
  {
    id: "benefit_personalize",
    icon: "PencilIcon",
    title: "Personalized Messages",
    description: "Add your heartfelt message with every gift",
  },
  {
    id: "benefit_support",
    icon: "ChatBubbleLeftRightIcon",
    title: "24/7 Support",
    description: "Our team is always here to help you",
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Content */}
          <div className="space-y-10 order-2 lg:order-1">

            <div>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="h-[1px] w-12 bg-primary" />
                <span className="text-primary font-semibold text-sm uppercase tracking-widest">
                  Why Choose Us
                </span>
              </div>

              <h2 className="font-serif text-5xl leading-tight">
                Making Gifting
                <br />
                <span className="italic text-primary">
                  Effortless
                </span>
              </h2>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                At TheSmileHamper, we believe every gift should tell a story.
                That's why we curate each hamper with love, ensuring quality,
                presentation, and timely delivery.
              </p>
              <p>
                Whether it's a birthday surprise or a corporate gesture,
                we make sure your gift brings genuine smiles.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid sm:grid-cols-2 gap-8 pt-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="group flex gap-4 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:shadow-md">
                      <Icon
                        name={benefit.icon as any}
                        size={22}
                        className="text-primary group-hover:text-white transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          {/* Image Column */}
<div className="relative order-1 lg:order-2 h-[550px]">

<div className="absolute inset-0 mask-arch overflow-hidden shadow-2xl">

  <AppImage
    src="https://images.unsplash.com/photo-1713693212520-cb09c53eefdc"
    alt="Woman holding beautifully wrapped gift box"
    className="
      w-full h-full object-cover
      grayscale
      transition-all duration-1000 ease-out
      hover:grayscale-0
      hover:scale-105
      transform-gpu
    "
    style={{
      backfaceVisibility: "hidden",
    }}
  />

</div>

{/* Floating Badge */}
<div className="absolute -bottom-8 -left-8 bg-card p-6 rounded-full shadow-xl border border-border hidden md:block animate-float">
  <div className="w-28 h-28 flex flex-col items-center justify-center">
    <span className="font-serif text-3xl text-primary">
      10K+
    </span>
    <span className="text-xs text-muted-foreground text-center mt-1">
      Happy Customers
    </span>
  </div>
</div>

</div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;