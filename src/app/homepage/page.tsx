import React from "react";
import { Metadata } from "next";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import HeroSection from "./components/HeroSection";
import OccasionLinks from "./components/OccasionLinks";
import FeaturedCollections from "./components/FeaturedCollections";
import WhyChooseUs from "./components/WhyChooseUs";
import BestSellers from "./components/BestSellers";
import CustomerReviews from "./components/CustomerReviews";
import TrustBadges from "./components/TrustBadges";
import BespokeGifting from "./components/BespokeGifting";
import MostLoved from "./components/MostLoved";

export const metadata: Metadata = {
  title: "TheSmileHamper - Premium Gift Hampers for Every Occasion",
  description:
    "Discover thoughtfully curated gift hampers for birthdays, anniversaries, weddings, festivals, and corporate events. Premium quality, same-day delivery, personalized messages.",
  keywords:
    "gift hampers, birthday gifts, anniversary gifts, corporate gifts, festival hampers, personalized gifts, luxury hampers, same day delivery gifts",
};

export default function Homepage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <OccasionLinks />
        <FeaturedCollections />
        <BespokeGifting/> 
        <WhyChooseUs />
        <MostLoved />
        <CustomerReviews />
        <TrustBadges />
      </main>
      <Footer />
    </>
  );
}