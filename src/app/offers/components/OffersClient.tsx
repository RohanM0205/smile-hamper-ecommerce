"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import MoreOffers from "./MoreOffers";

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  minOrder: number;
  validUntil: string;
  type: "percentage" | "flat" | "freeShipping";
}


const OffersClient: React.FC = () => {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showMoreSection, setShowMoreSection] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  const coupons: Coupon[] = [
    {
      id: "coupon_1",
      code: "SMILE20",
      title: "20% Off on All Orders",
      description: "Get flat 20% discount on your entire order",
      discount: "20% OFF",
      minOrder: 1000,
      validUntil: "2026-02-28",
      type: "percentage",
    },
    {
      id: "coupon_2",
      code: "FIRST500",
      title: "First Order Discount",
      description: "Flat ₹500 off on your first purchase",
      discount: "₹500 OFF",
      minOrder: 2000,
      validUntil: "2026-03-15",
      type: "flat",
    },
    {
      id: "coupon_3",
      code: "FREESHIP",
      title: "Free Shipping",
      description: "Get free delivery on orders above ₹1500",
      discount: "FREE SHIPPING",
      minOrder: 1500,
      validUntil: "2026-02-20",
      type: "freeShipping",
    },
    {
      id: "coupon_4",
      code: "VALENTINE30",
      title: "Valentine's Special",
      description: "30% off on romantic gift hampers",
      discount: "30% OFF",
      minOrder: 1500,
      validUntil: "2026-02-14",
      type: "percentage",
    },
  ];

  /* ================= Highest Discount ================= */

  const highestDiscountCoupon = useMemo(() => {
    return coupons.reduce((prev, current) => {
      const prevValue = parseInt(prev.discount);
      const currentValue = parseInt(current.discount);
      return currentValue > prevValue ? current : prev;
    });
  }, []);

  /* ================= REAL COUNTDOWN WITH SECONDS ================= */

  useEffect(() => {
    const targetDate = new Date("2026-02-28T23:59:59").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft((prev) => ({ ...prev, expired: true }));
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return "ReceiptPercentIcon";
      case "flat":
        return "CurrencyRupeeIcon";
      case "freeShipping":
        return "TruckIcon";
      default:
        return "GiftIcon";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "percentage":
        return "bg-primary/10 text-primary";
      case "flat":
        return "bg-success/10 text-success";
      case "freeShipping":
        return "bg-warning/10 text-warning";
      default:
        return "bg-accent/10 text-accent";
    }
  };

  const visibleCoupons = coupons.slice(0, 4);

  return (
    <div className="space-y-10">

      {/* ================= Featured Banner ================= */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Icon name="SparklesIcon" size={48} className="mx-auto mb-4 animate-pulse" />

          <h2 className="font-serif text-3xl md:text-4xl mb-3">
            Flash Sale - Up to 40% Off!
          </h2>

          <p className="text-lg mb-4 opacity-90">
            Limited time offer on selected gift hampers
          </p>

          {/* Digital Countdown */}
          {!timeLeft.expired ? (
            <div className="flex justify-center gap-4 mb-6">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-xl text-center min-w-[70px] animate-pulse"
                >
                  <div className="text-2xl font-bold">
                    {String(item.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs uppercase tracking-wide">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-6 font-bold text-red-200">Offer Expired</p>
          )}

          <button
            onClick={() => router.push("/products")}
            className="px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-white/90 transition-transform hover:scale-105 shadow-lg"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* ================= Coupons Grid ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        {visibleCoupons.map((coupon, index) => {
          const isHot = coupon.id === highestDiscountCoupon.id;

          return (
            <div
              key={coupon.id}
              className={`relative bg-card border rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl
                ${isHot ? "border-red-500 shadow-lg scale-105" : "border-border hover:border-primary"}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {isHot && (
                <span className="absolute -top-3 left-4 px-3 py-1 bg-red-500 text-white text-xs rounded-full shadow-md">
                  🔥 HOT
                </span>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(coupon.type)}`}>
                  <Icon name={getTypeIcon(coupon.type) as any} size={24} />
                </div>

                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  {coupon.discount}
                </span>
              </div>

              <h3 className="font-serif text-xl text-foreground mb-2">
                {coupon.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                {coupon.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Icon name="InformationCircleIcon" size={14} />
                <span>Min. order: ₹{coupon.minOrder}</span>
                <span>•</span>
                <span>
                  Valid until{" "}
                  {new Date(coupon.validUntil).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 px-4 py-3 border-2 border-dashed border-primary rounded-xl bg-primary/5">
                  <span className="font-mono font-bold text-foreground text-lg">
                    {coupon.code}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Icon name="CheckIcon" size={18} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Icon name="ClipboardDocumentIcon" size={18} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= Show More Toggle ================= */}
      <div className="text-center">
  {!showMoreSection ? (
    <button
      onClick={() => setShowMoreSection(true)}
      className="px-8 py-3 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-lg"
    >
      Explore More Offers
    </button>
  ) : (
    <button
      onClick={() => setShowMoreSection(false)}
      className="px-8 py-3 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-lg"
    >
      Hide Offers
    </button>
  )}
</div>
{showMoreSection && (
  <MoreOffers visible={showMoreSection} />
)}

      {/* Your How To Use section remains unchanged */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-muted/30 p-12">

  {/* Decorative Glow Effects */}
  <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
  <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

  {/* Header */}
  <div className="text-center mb-14 relative z-10">
    <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
      How to Use Coupons
    </h2>
    <p className="text-muted-foreground max-w-xl mx-auto">
      Redeeming your discount is simple. Follow these easy steps and enjoy savings instantly.
    </p>
  </div>

  {/* Steps */}
  <div className="relative z-10 grid md:grid-cols-3 gap-10">

    {/* Connector Line (Desktop Only) */}
    <div className="hidden md:block absolute top-24 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />

    {[
      {
        step: "01",
        title: "Copy Code",
        desc: "Click the copy button to securely save your coupon code.",
        icon: "ClipboardDocumentIcon",
      },
      {
        step: "02",
        title: "Shop Products",
        desc: "Browse and add your favorite premium gift hampers to cart.",
        icon: "ShoppingBagIcon",
      },
      {
        step: "03",
        title: "Apply at Checkout",
        desc: "Paste the code at checkout and enjoy instant savings.",
        icon: "CreditCardIcon",
      },
    ].map((item) => (
      <div
        key={item.step}
        className="group relative text-center p-8 rounded-2xl backdrop-blur-md bg-white/40 dark:bg-white/5 border border-border hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
      >
        {/* Step Number Badge */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-semibold shadow-md">
          Step {item.step}
        </div>

        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
          <Icon
            name={item.icon as any}
            size={30}
            className="text-primary"
          />
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl text-foreground mb-3">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.desc}
        </p>
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default OffersClient;