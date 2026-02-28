"use client";

import { useState } from "react";
import { Truck, Package, CreditCard, RotateCcw } from "lucide-react";
import ProductReviews from "@/app/products/[slug]/components/ProductReviews";

interface Props {
  productId: string;
  description: string;
}

export default function ProductTabs({
  productId,
  description,
}: Props) {
  const [activeTab, setActiveTab] =
    useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "reviews", label: "Reviews" },
    { id: "shipping", label: "Shipping & Returns" },
  ];

  return (
    <div className="mt-20">

      {/* Premium Tabs Header */}
      <div className="relative border-b border-[#e8ded2]">

        <div className="flex gap-10 overflow-x-auto scrollbar-hide">

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative pb-5 text-sm sm:text-base font-medium
                whitespace-nowrap transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "text-[#5a3e2b]"
                    : "text-gray-500 hover:text-[#5a3e2b]"
                }
              `}
            >
              {tab.label}

              <span
                className={`
                  absolute left-0 -bottom-[1px] h-[3px] w-full
                  bg-[#7B4F2A] rounded-full
                  transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0"
                  }
                `}
                style={{ transformOrigin: "left" }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-10 animate-fadeIn">

        {/* DESCRIPTION */}
        {activeTab === "description" && (
          <div className="max-w-3xl space-y-6 text-base leading-relaxed text-gray-700">
            {description ? (
              description
                .split("\n")
                .map((para, index) => (
                  <p key={index}>{para}</p>
                ))
            ) : (
              <p>No description available.</p>
            )}
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <ProductReviews productId={productId} />
        )}

        {/* SHIPPING & RETURNS */}
        {activeTab === "shipping" && (
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">

            {[
              {
                icon: Truck,
                title: "Free Shipping",
                desc: "On orders above ₹1999",
              },
              {
                icon: Package,
                title: "Fast Delivery",
                desc: "Delivered within 24–48 hours",
              },
              {
                icon: CreditCard,
                title: "Secure Payment & COD",
                desc: "Multiple safe payment options",
              },
              {
                icon: RotateCcw,
                title: "Easy Returns",
                desc: "Hassle-free returns within 7 days",
              },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className="group p-6 rounded-2xl
                             bg-gradient-to-br from-[#f8f4ef] to-white
                             border border-[#efe5da]
                             shadow-sm
                             hover:shadow-md
                             hover:-translate-y-1
                             transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center 
                                    rounded-xl 
                                    bg-[#f3ece5] text-[#7B4F2A]
                                    group-hover:scale-110 transition">
                      <Icon size={20} />
                    </div>

                    <h4 className="font-semibold text-[#5a3e2b]">
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-sm text-gray-600">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}