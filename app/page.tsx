import Footer from "./footer/page";
import AboutSectionClient from "./components/AboutSectionClient";
import { HelpSection } from "./components/HelpSection";
import PartnerSection from "./components/PartnerSection";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Navbar from "./navbar/page";
import { Hero } from "./components/Hero";
import BecomeDeliveryBoyPage from "../app/delivery/page";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <Hero />

      <Features />
      <HowItWorks />
      <AboutSectionClient />
      <PartnerSection />

      <BecomeDeliveryBoyPage />
      <HelpSection />
      <Footer />
    </div>
  );
}
