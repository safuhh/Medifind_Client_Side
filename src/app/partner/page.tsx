import Navbar from "../navbar/page";
import Footer from "../footer/page";
import PartnerSection from "@/components/PartnerSection";
import { FeatureGrid } from "@/components/FeatureGrid";

export default function PartnerPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* full page layout */}
      <div className="pt-20">
        <PartnerSection />
        <FeatureGrid />
      </div>

      <Footer />
    </main>
  );
}