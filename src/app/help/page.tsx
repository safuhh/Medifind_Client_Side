import Navbar from "../navbar/page";
import Footer from "../footer/page";
import { HelpSection } from "@/components/HelpSection";

export const metadata = {
  title: "Help & FAQ - MediFind",
  description: "Get answers about MediFind usage, medicine tracking, and pharmacy network.",
};

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="pt-20">
        <HelpSection />
      </div>

      <Footer />
    </main>
  );
}