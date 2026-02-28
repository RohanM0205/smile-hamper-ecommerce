import React from "react";
import { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Icon from "@/components/ui/AppIcon";
import ImageGallery from "./components/ImageGallery";
import ProductInfo from "./components/ProductInfo";
import PersonalizationBuilder from "./components/PersonalizationBuilder";
import ProductTabs from "./components/ProductTabs";
import RelatedProducts from "./components/RelatedProducts";

export const metadata: Metadata = {
  title: "Deluxe Chocolate Hamper - TheSmileHamper",
  description:
    "Premium Belgian chocolate hamper with 12 assorted chocolates, truffles, and pralines. Perfect for birthdays, anniversaries, and special occasions. Same-day delivery available.",
  keywords:
    "chocolate hamper, premium chocolates, Belgian chocolates, gift box, birthday gift, luxury hamper",
};

export default function ProductDetail() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <a
              href="/homepage"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Home
            </a>
            <Icon
              name="ChevronRightIcon"
              size={16}
              className="text-muted-foreground"
            />
            <a
              href="/products"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Products
            </a>
            <Icon
              name="ChevronRightIcon"
              size={16}
              className="text-muted-foreground"
            />
            <span className="text-foreground font-medium">
              Deluxe Chocolate Hamper
            </span>
          </nav>

          {/* Product Main Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div>
              <ImageGallery />
            </div>

            {/* Product Info */}
            <div>
              <ProductInfo />
            </div>
          </div>

          {/* Personalization Section */}
          <div className="mb-16">
            <PersonalizationBuilder />
          </div>

          {/* Product Details Tabs */}
          <div className="mb-16">
            <ProductTabs />
          </div>

          {/* Related Products */}
          <RelatedProducts />
        </div>

        {/* Sticky Add to Cart Bar (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t border-border p-4 z-40 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Price</p>
              <p className="font-serif text-2xl text-foreground">₹2,499</p>
            </div>
            <button className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <Icon name="ShoppingBagIcon" size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}