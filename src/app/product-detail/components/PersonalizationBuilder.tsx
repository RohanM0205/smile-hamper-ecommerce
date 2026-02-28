"use client";

import React, { useState } from "react";
import Icon from "@/components/ui/AppIcon";

const PersonalizationBuilder: React.FC = () => {
  const [message, setMessage] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const maxLength = 150;

  return (
    <div className="bg-muted/30 rounded-2xl p-6 space-y-6">
      <h3 className="font-serif text-2xl text-foreground flex items-center gap-2">
        <Icon name="PencilIcon" size={24} className="text-primary" />
        Personalize Your Gift
      </h3>

      {/* Message Card Input */}
      <div>
        <label htmlFor="gift-message" className="block font-medium text-foreground mb-2">
          Add Your Message
        </label>
        <textarea
          id="gift-message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
          placeholder="Write your heartfelt message here..."
          className="w-full p-4 border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={4}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">
            Your message will be beautifully handwritten on a premium card
          </p>
          <span className="text-xs text-muted-foreground">
            {message.length}/{maxLength}
          </span>
        </div>
      </div>

      {/* Preview Card */}
      {message && (
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg animate-fadeIn">
          <h4 className="font-serif text-lg text-foreground mb-3">Preview:</h4>
          <div className="bg-gradient-to-br from-sand-100 to-sand-200 p-6 rounded-lg">
            <p className="font-serif text-foreground italic leading-relaxed">
              {message || "Your message will appear here"}
            </p>
            <p className="text-right text-sm text-muted-foreground mt-4">
              — With love
            </p>
          </div>
        </div>
      )}

      {/* Gift Wrap Option */}
      <div className="flex items-start gap-4 p-4 border border-border rounded-xl bg-card">
        <input
          type="checkbox"
          id="gift-wrap"
          checked={giftWrap}
          onChange={(e) => setGiftWrap(e.target.checked)}
          className="w-5 h-5 mt-0.5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
        />
        <div className="flex-1">
          <label htmlFor="gift-wrap" className="font-medium text-foreground cursor-pointer">
            Add Premium Gift Wrapping (+₹99)
          </label>
          <p className="text-sm text-muted-foreground mt-1">
            Elegant wrapping paper with satin ribbon and decorative elements
          </p>
        </div>
        <Icon name="GiftIcon" size={32} className="text-primary" />
      </div>

      {/* Add-ons Suggestion */}
      <div className="pt-4 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Complete Your Gift</h4>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center gap-3 p-3 border border-border rounded-xl hover:border-primary hover:bg-muted transition-colors">
            <Icon name="CakeIcon" size={24} className="text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Greeting Card</p>
              <p className="text-xs text-muted-foreground">₹49</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-3 border border-border rounded-xl hover:border-primary hover:bg-muted transition-colors">
            <Icon name="SparklesIcon" size={24} className="text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Chocolates</p>
              <p className="text-xs text-muted-foreground">₹199</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationBuilder;