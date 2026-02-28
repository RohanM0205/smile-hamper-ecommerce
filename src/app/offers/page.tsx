import React from "react";
import { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import OffersClient from "./components/OffersClient";

export const metadata: Metadata = {
  title: "Offers & Coupons - TheSmileHamper",
  description: "Get exclusive discounts and offers on premium gift hampers.",
};

export default function Offers() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              Exclusive Offers & Coupons
            </h1>
            <p className="text-lg text-muted-foreground">
              Save more on your favorite gift hampers
            </p>
          </div>
          <OffersClient />
        </div>
      </main>
      <Footer />
    </>
  );
}