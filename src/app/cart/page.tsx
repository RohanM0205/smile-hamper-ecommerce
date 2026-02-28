import React from "react";
import { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CartClient from "./components/CartClient";

export const metadata: Metadata = {
  title: "Shopping Cart - TheSmileHamper",
  description:
    "Review your selected gift hampers and proceed to checkout. Secure payment, same-day delivery available.",
  keywords: "shopping cart, checkout, gift hampers, online shopping",
};

export default function Cart() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8">
            Shopping Cart
          </h1>
          <CartClient />
        </div>
      </main>
      <Footer />
    </>
  );
}