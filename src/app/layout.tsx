import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "./providers";
import logoss from "@/assets/images/logoss.png";
import { JsonLd } from "@/components/seo/JsonLd";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MediFind",
  "url": "https://medifind.com",
  "logo": "https://medifind.com/images/logoss.png", // Ensure absolute URL
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-1234567890",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://facebook.com/medifind",
    "https://twitter.com/medifind",
    "https://instagram.com/medifind"
  ]
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MediFind | Healthcare & Medicine Management",
    template: "%s | MediFind"
  },
  description: "MediFind is your all-in-one healthcare platform to find verified pharmacies, compare medicine availability, and manage your health network efficiently.",
  metadataBase: new URL("https://medifind.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MediFind | Healthcare & Medicine Management",
    description: "Find verified pharmacies and manage your health network in one platform.",
    url: "https://medifind.com",
    siteName: "MediFind",
    images: [
      {
        url: "/og-image.png", // Ensure this image exists in public folder
        width: 1200,
        height: 630,
        alt: "MediFind Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediFind | Healthcare & Medicine Management",
    description: "The digital core of medicine search. Find verified pharmacies nearby.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: logoss.src,
    apple: logoss.src,
  },
  keywords: ["medicine search", "pharmacy finder", "healthcare management", "online pharmacy", "MediFind"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}
          <ToastContainer position="top-right" autoClose={3000} />
        </Providers>
      </body>
    </html>
  );
}
