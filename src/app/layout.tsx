import React from "react";
import type { Metadata, Viewport } from "next";
import "../styles/index.css";
import Header from "@/components/common/Header";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import { CartProvider } from "@/context/CartContext";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "TheSmileHamper",
  description: "Premium Gift Hampers for Every Occasion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">

        {/* Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        <AnnouncementBar />
        <Header />

        {/* Add top padding so content is not hidden behind fixed header */}
        <main className="pt-28">
        <CartProvider>
          {children}
          </CartProvider>
        </main>
      </body>
    </html>
  );
}
