import React from "react";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import MedicineDetailClient from "./MedicineDetailClient";
import { getImageUrl } from "@/utils/imageUrl";

async function getMedicineData(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${baseUrl}/medicines/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.medicine;
  } catch (error) {
    console.error("Error fetching medicine for metadata:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const medicine = await getMedicineData(params.id);

  if (!medicine) {
    return {
      title: "Medicine Not Found | MediFind",
    };
  }

  const title = `${medicine.name} (${medicine.unitWeight || ""}) - Buy Online | MediFind`;
  const description = medicine.description || `Buy ${medicine.name} by ${medicine.brand} at the best price from verified local pharmacies. Check availability and get fast delivery.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: medicine.images?.[0] ? [getImageUrl(medicine.images[0])] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: medicine.images?.[0] ? [getImageUrl(medicine.images[0])] : [],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const medicine = await getMedicineData(params.id);

  if (!medicine) {
    return (
      <React.Suspense fallback={<div className="text-center p-10 text-slate-500">Loading details...</div>}>
        <MedicineDetailClient />
      </React.Suspense>
    ); // Let the client handle the "not found" state
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": medicine.name,
    "image": medicine.images?.map((img: string) => getImageUrl(img)) || [],
    "description": medicine.description,
    "brand": {
      "@type": "Brand",
      "name": medicine.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `https://medifind.com/medicines/${medicine._id}`,
      "priceCurrency": "INR",
      "price": medicine.pricing.sellingPrice,
      "availability": medicine.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Pharmacy",
        "name": medicine.shop?.name || "Local Pharmacy"
      }
    }
  };

  const breadcrumbs = [
    { label: "Medicines", href: "/medicines" },
    { label: medicine.category || "General", href: `/medicines?category=${medicine.category}` },
    { label: medicine.name, href: `/medicines/${medicine._id}` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={productSchema} />
      <div className="max-w-5xl mx-auto px-6 pt-24">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <React.Suspense fallback={<div className="text-center p-10 text-slate-500">Loading details...</div>}>
        <MedicineDetailClient initialData={medicine} />
      </React.Suspense>
    </div>
  );
}
