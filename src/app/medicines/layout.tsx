import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Medicines & Pharmacies",
  description: "Find thousands of medicines from verified local pharmacies. Compare prices, check availability, and get fast delivery in your area.",
  openGraph: {
    title: "Search Medicines Nearby | MediFind",
    description: "Real-time medicine search and availability tracking at local pharmacies.",
  },
};

export default function MedicinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
