"use client";

import React, { useState } from "react";
import Icon from "@/components/ui/AppIcon";

const ProductInfo: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="space-y-6">
      {/* Title & Rating */}
      <div>
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
          Deluxe Chocolate Hamper
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={`star_${i}`}
                  name="StarIcon"
                  size={18}
                  variant={i < 4 ? "solid" : "outline"}
                  className="text-yellow-500"
                />
              ))}
            </div>
            <span className="text-sm text-foreground font-medium">4.8</span>
          </div>
          <span className="text-sm text-muted-foreground">(234 reviews)</span>
          <span className="text-sm text-success">In Stock</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 pb-6 border-b border-border">
        <span className="font-serif text-4xl text-foreground">₹2,499</span>
        <span className="text-xl text-muted-foreground line-through">
          ₹2,999
        </span>
        <span className="px-3 py-1 bg-error/10 text-error rounded-full text-sm font-semibold">
          17% OFF
        </span>
      </div>

      {/* What's Inside */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">What's Inside</h3>
        <ul className="space-y-2">
          {[
            "12 Premium Belgian Chocolates",
            "Assorted Truffle Collection",
            "Dark & Milk Chocolate Mix",
            "Premium Gift Box with Ribbon",
            "Personalized Message Card",
          ].map((item, index) => (
            <li
              key={`item_${index}`}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon
                name="CheckCircleIcon"
                size={18}
                variant="solid"
                className="text-success"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Delivery Date Selector */}
      <div>
        <label htmlFor="delivery-date" className="block font-semibold text-foreground mb-2">
          Select Delivery Date
        </label>
        <input
          type="date"
          id="delivery-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-3 border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground mt-2">
          <Icon name="TruckIcon" size={14} className="inline mr-1" />
          Same-day delivery available for orders before 2 PM
        </p>
      </div>

      {/* Quantity Selector */}
      <div>
        <label className="block font-semibold text-foreground mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={decrementQuantity}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Decrease quantity"
          >
            <Icon name="MinusIcon" size={18} />
          </button>
          <span className="w-12 text-center font-medium text-foreground">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Increase quantity"
          >
            <Icon name="PlusIcon" size={18} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          <Icon name="ShoppingBagIcon" size={20} />
          Add to Cart
        </button>
        <button className="sm:w-auto px-6 py-4 border border-border rounded-xl hover:bg-muted transition-colors">
          <Icon name="HeartIcon" size={20} className="text-foreground" />
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
        <div className="text-center">
          <Icon
            name="ShieldCheckIcon"
            size={24}
            className="text-success mx-auto mb-2"
          />
          <p className="text-xs text-muted-foreground">Secure Payment</p>
        </div>
        <div className="text-center">
          <Icon
            name="TruckIcon"
            size={24}
            className="text-success mx-auto mb-2"
          />
          <p className="text-xs text-muted-foreground">Free Delivery</p>
        </div>
        <div className="text-center">
          <Icon
            name="ArrowPathIcon"
            size={24}
            className="text-success mx-auto mb-2"
          />
          <p className="text-xs text-muted-foreground">Easy Returns</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;