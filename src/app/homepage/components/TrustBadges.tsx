import React from "react";
import Icon from "@/components/ui/AppIcon";

const partners = [
  { id: "partner_1", name: "Lindt" },
  { id: "partner_2", name: "Ferrero Rocher" },
  { id: "partner_3", name: "Godiva" },
  { id: "partner_4", name: "Cadbury" },
  { id: "partner_5", name: "Ghirardelli" },
  { id: "partner_6", name: "L\'Occitane" },
  { id: "partner_7", name: "The Body Shop" },
  { id: "partner_8", name: "Forest Essentials" },
];

const TrustBadges: React.FC = () => {
  return (
    <section className="py-12 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground text-sm">
            Trusted by 10,000+ customers • Partnered with premium brands
          </p>
        </div>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

          {/* Marquee Content */}
          <div className="flex animate-marquee">
            {/* First Set */}
            <div className="flex items-center gap-12 px-6 shrink-0">
              {partners.map((partner) => (
                <div
                  key={`${partner.id}_1`}
                  className="flex items-center justify-center min-w-[120px] h-16 px-6 bg-card rounded-xl border border-border grayscale hover:grayscale-0 transition-all duration-500"
                >
                  <span className="font-medium text-foreground text-sm">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Duplicate Set for Seamless Loop */}
            <div className="flex items-center gap-12 px-6 shrink-0">
              {partners.map((partner) => (
                <div
                  key={`${partner.id}_2`}
                  className="flex items-center justify-center min-w-[120px] h-16 px-6 bg-card rounded-xl border border-border grayscale hover:grayscale-0 transition-all duration-500"
                >
                  <span className="font-medium text-foreground text-sm">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="ShieldCheckIcon" size={20} className="text-success" />
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="TruckIcon" size={20} className="text-success" />
            <span>Free Delivery Over ₹999</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="CheckBadgeIcon" size={20} className="text-success" />
            <span>100% Genuine Products</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="ChatBubbleLeftRightIcon" size={20} className="text-success" />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;