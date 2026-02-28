import React from "react";
import { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CheckoutClient from "./components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout - TheSmileHamper",
  description:
    "Complete your order with secure checkout. Multiple payment options available.",
  keywords: "checkout, payment, secure checkout, order",
};

export default function Checkout() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-8">
            Checkout
          </h1>
          <CheckoutClient />
        </div>
      </main>
      <Footer />
    </>
  );
}