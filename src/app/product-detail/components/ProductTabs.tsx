"use client";

import React, { useState } from "react";
import Icon from "@/components/ui/AppIcon";

type TabId = "description" | "details" | "delivery" | "reviews";

const ProductTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  const tabs = [
    { id: "description" as TabId, label: "Description" },
    { id: "details" as TabId, label: "What's Inside" },
    { id: "delivery" as TabId, label: "Delivery Info" },
    { id: "reviews" as TabId, label: "Reviews (234)" },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-border overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[120px] px-6 py-4 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary bg-primary/5" :"text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8">
        {activeTab === "description" && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-muted-foreground leading-relaxed">
              Indulge in our Deluxe Chocolate Hamper, a luxurious collection of
              premium Belgian chocolates that will delight any chocolate lover.
              Each piece is carefully selected to create a perfect balance of
              flavors and textures.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This exquisite hamper features a curated selection of artisanal
              truffles, pralines, and chocolate bars, all beautifully presented
              in our signature gift box. Perfect for birthdays, anniversaries,
              or as a thoughtful gesture to show someone you care.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <Icon name="CheckBadgeIcon" size={24} className="text-success shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Premium Quality
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Only the finest Belgian chocolate
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="GiftIcon" size={24} className="text-success shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    Elegant Packaging
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Beautiful presentation ready to gift
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-semibold text-foreground text-lg mb-4">
              Complete Contents
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-foreground mb-3">Chocolates</h4>
                <ul className="space-y-2">
                  {[
                    "6 Dark Chocolate Truffles",
                    "6 Milk Chocolate Pralines",
                    "3 White Chocolate Bars",
                    "3 HazelnutCreams",
                  ].map((item, index) => (
                    <li
                      key={`choc_${index}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Icon name="CheckIcon" size={16} className="text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-3">Presentation</h4>
                <ul className="space-y-2">
                  {[
                    "Luxury Gift Box",
                    "Satin Ribbon",
                    "Message Card Holder",
                    "Tissue Paper Lining",
                  ].map((item, index) => (
                    <li
                      key={`pres_${index}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Icon name="CheckIcon" size={16} className="text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "delivery" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <Icon name="TruckIcon" size={24} className="text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Same Day Delivery
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Order before 2 PM for same-day delivery in Mumbai, Delhi, Bangalore, Pune, and Hyderabad. Next-day delivery available in other major cities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon name="MapPinIcon" size={24} className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Delivery Locations
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We deliver across India. Enter your pincode at checkout to check delivery availability and estimated delivery date.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                <Icon name="ClockIcon" size={24} className="text-warning" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Scheduled Delivery
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Select a future delivery date for surprise gifts. We'll deliver on your chosen date between 9 AM - 9 PM.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-foreground">
                <Icon name="InformationCircleIcon" size={18} className="inline mr-2 text-primary" />
                Free delivery on orders above ₹999. Standard delivery charges apply for orders below.
              </p>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Rating Summary */}
            <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-border">
              <div className="text-center sm:text-left">
                <div className="font-serif text-5xl text-foreground mb-2">4.8</div>
                <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={`summary_star_${i}`}
                      name="StarIcon"
                      size={18}
                      variant={i < 4 ? "solid" : "outline"}
                      className="text-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Based on 234 reviews</p>
              </div>

              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={`rating_${stars}`} className="flex items-center gap-3">
                    <span className="text-sm text-foreground w-8">{stars}★</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${stars === 5 ? 75 : stars === 4 ? 20 : stars === 3 ? 3 : stars === 2 ? 1 : 1}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {stars === 5 ? 175 : stars === 4 ? 47 : stars === 3 ? 8 : stars === 2 ? 3 : 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {[
                {
                  id: "rev_1",
                  name: "Priya Sharma",
                  rating: 5,
                  date: "2 days ago",
                  review: "Absolutely loved this hamper! The chocolates were fresh and delicious. Perfect gift for my sister's birthday.",
                  verified: true,
                },
                {
                  id: "rev_2",
                  name: "Rajesh Kumar",
                  rating: 5,
                  date: "1 week ago",
                  review: "Great quality and presentation. Delivery was on time. Highly recommend!",
                  verified: true,
                },
                {
                  id: "rev_3",
                  name: "Ananya Patel",
                  rating: 4,
                  date: "2 weeks ago",
                  review: "Good selection of chocolates. The gift wrapping could be better but overall satisfied.",
                  verified: true,
                },
              ].map((review) => (
                <div
                  key={review.id}
                  className="bg-muted/30 rounded-xl p-6 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-foreground">
                            {review.name}
                          </h5>
                          {review.verified && (
                            <Icon
                              name="CheckBadgeIcon"
                              size={16}
                              className="text-success"
                            />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={`rev_star_${review.id}_${i}`}
                          name="StarIcon"
                          size={14}
                          variant={i < review.rating ? "solid" : "outline"}
                          className="text-yellow-500"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed">{review.review}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                      <Icon name="HandThumbUpIcon" size={16} />
                      <span>Helpful (12)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Reviews */}
            <div className="text-center pt-4">
              <button className="px-6 py-3 border border-border rounded-xl text-foreground hover:bg-muted transition-colors">
                Load More Reviews
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;