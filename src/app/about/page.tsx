
import React from "react";
import { Metadata } from "next";
import AboutSectionClient from "@/components/AboutSectionClient"; 
import Navbar from "../navbar/page";
import { Footer } from "../footer/page";  
export const metadata: Metadata = {
  title: "About MediFind | Our Mission & Vision",
  description: "Learn about MediFind's mission to connect patients with verified pharmacies, ensuring fast, reliable, and real-time healthcare access.",
  openGraph: {
    title: "About MediFind",
    description: "Building the future of healthcare access with real-time tracking and verified partners.",
  },
};

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 font-sans overflow-hidden">
       <Navbar />
      <div className="pt-20">
       
        <AboutSectionClient />
        <Footer />
      </div>
    </main>
  );
};

export default AboutPage;