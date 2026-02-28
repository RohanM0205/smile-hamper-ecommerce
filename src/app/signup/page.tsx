import React from "react";
import { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import SignupClient from "./components/SignupClient";

export const metadata: Metadata = {
  title: "Sign Up - TheSmileHamper",
  description: "Create an account to start shopping for premium gift hampers.",
};

export default function Signup() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <SignupClient />
      </main>
      <Footer />
    </>
  );
}