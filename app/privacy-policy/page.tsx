import { Metadata } from "next";
import PrivacyPolicyUI from "@/app/components/PrivacyPolicyUI";

import Navbar from "../navbar/page";

// 1. Unmatched SEO: Statically defining metadata for crawlers
export const metadata: Metadata = {
  title: "Privacy Policy | MediFind",
  description:
    "Learn how MediFind collects, uses, and protects your personal information and healthcare data across our digital marketplace.",
  openGraph: {
    title: "Privacy Policy | MediFind",
    description: "Our commitment to your data privacy and security.",
    url: "https://medifind.com/privacy-policy",
    siteName: "MediFind",
  },
};

// Types for our policy structure
export interface PolicySection {
  id: string;
  title: string;
  content: string;
}

// 2. Data fetching happens on the server
const getPrivacyPolicyData = async (): Promise<PolicySection[]> => {
  // In a real app, this might be fetched from a Headless CMS.
  // For now, we return static data tailored to the healthcare marketplace.
  return [
    {
      id: "data-collection",
      title: "1. Information We Collect",
      content:
        "When you use MediFind to search for medicines or connect with healthcare partners, we collect necessary information including your account details, search queries, and transaction history. We ensure this data is encrypted and handled with the highest standards of medical data privacy.",
    },
    {
      id: "data-usage",
      title: "2. How We Use Your Data",
      content:
        "Your data is strictly used to facilitate the digital healthcare marketplace experience. This includes processing medicine orders, verifying prescriptions with our partner pharmacies, and improving the accuracy of our medicine search platform.",
    },
    {
      id: "third-party",
      title: "3. Third-Party Sharing",
      content:
        "We do not sell your personal data. Information is only shared with verified seller dashboards and delivery partners explicitly involved in fulfilling your healthcare requests.",
    },
    {
      id: "security",
      title: "4. Security Measures",
      content:
        "MediFind employs enterprise-grade, glassmorphism-inspired security interfaces and robust backend encryption to protect your sensitive health information against unauthorized access.",
    },
  ];
};

export default async function PrivacyPolicyPage() {
  const sections = await getPrivacyPolicyData();

  return (
<div>
    <Navbar />
    <br />
    <br />
        <main className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
      {/* 
        3. Pass the server-fetched data to the Client Component 
        for premium interactive rendering 
      */}
      <PrivacyPolicyUI sections={sections} lastUpdated="April 30, 2026" />
    </main>
</div>
  );
}