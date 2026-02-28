import AboutHero from "./components/AboutHero";
import OurStory from "./components/OurStory";
import WhyChooseUs from "./components/WhyChooseUs";
import MissionVision from "./components/MissionVision";
import HowItWorks from "./components/HowItWorks";
import BrandQuote from "./components/BrandQuote";
import TrustSection from "./components/TrustSection";
import AboutCTA from "./components/AboutCTA";
import Footer from "@/components/common/Footer";

export const metadata = {
  title: "About Us | TheSmileHamper",
  description:
    "Discover the story behind TheSmileHamper — where every gift is crafted with care, emotion, and personalization.",
};

export default function AboutPage() {
  return (
    <>
      <div className="pt-20 bg-[#f9f6f2]">
        <AboutHero />
        <OurStory />
        <WhyChooseUs />
        <MissionVision />
        <HowItWorks />
        <BrandQuote />
        <TrustSection />
        <AboutCTA />
      </div>

      <Footer />
    </>
  );
}