import React from "react";
import { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import LoginClient from "./components/LoginClient";

export const metadata: Metadata = {
  title: "Login - TheSmileHamper",
  description: "Login to your account to manage orders and wishlist.",
};

export default function Login() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <LoginClient />
      </main>
      <Footer />
    </>
  );
}