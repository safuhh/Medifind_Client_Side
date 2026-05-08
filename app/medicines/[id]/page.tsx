"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMedicine } from "@/app/apis/medicineapi";
import {
  MapPin,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  Package,
  ShieldCheck,
  Truck,
  Activity,
  Minus,
  Plus,
} from "lucide-react";
import Link from "next/link";
import NavbarPage from "@/app/navbar/page";
import { getImageUrl } from "@/app/utils/imageUrl";

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  pricing: {
    sellingPrice: number;
    mrp: number;
    offer?: string;
  };
  images?: string[];
  description?: string;
  category: string;
  unitWeight?: string;
  stock: number;
  manufacturer?: string;
  shop?: {
    name: string;
    address: string;
    location?: {
      address?: string;
      fullAddress?: string;
    };
    phone?: string;
    licenseNumber?: string;
    distance: string | null;
  };
}

export default function SingleMedicinePage() {
  const { id } = useParams();
  const router = useRouter();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [locationName, setLocationName] = useState<string>("");
  const [locating, setLocating] = useState<boolean>(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/locations/reverse?lat=${lat}&lng=${lng}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en"
        }
      });
      const data = await res.json();
      if (data && data.shortName) {
        setLocationName(data.shortName);
      } else {
        setLocationName(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      setLocationName(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
    }
  };

  const getLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          await reverseGeocode(lat, lng);
          setLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocating(false);
          fetchMedicine(null);
        },
      );
    } else {
      setLocating(false);
      fetchMedicine(null);
    }
  };

  const fetchMedicine = async (
    currentCoords: { lat: number; lng: number } | null = coords,
  ) => {
    try {
      setLoading(true);
      const res = await getMedicine(
        id as string,
        currentCoords?.lat,
        currentCoords?.lng,
      );
      const med = res.data.medicine;
      setMedicine(med);
      // Initialize quantity to 1 if stock exists, else 0
      setQuantity(med.stock > 0 ? 1 : 0);
    } catch (err) {
      console.error("Error fetching medicine:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!medicine) return;
    console.log(`Adding to cart: ${medicine.name}, Quantity: ${quantity}`);
    alert(`${quantity} units of ${medicine.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!medicine) return;
    console.log(`Buying now: ${medicine.name}, Quantity: ${quantity}`);
    // Redirect to a checkout or order page if it exists
    alert(`Proceeding to buy ${quantity} units of ${medicine.name}`);
  };

  useEffect(() => {
    getLocation();
  }, [id]);

  useEffect(() => {
    if (coords) {
      fetchMedicine(coords);
    }
  }, [coords]);



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading medicine details...</p>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Medicine Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The medicine you are looking for might have been removed or is
            unavailable.
          </p>
          <Link
            href="/medicines"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-blue-700 w-full"
          >
            Back to Medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar - Now spans full width properly */}
      <NavbarPage />
      <br />
      <br />
      {/* Main Content Wrapper - Padding is applied here instead */}
      <div className="py-12 px-6 md:px-10 mt-8">
        <div className="max-w-5xl mx-auto">
          {/* Navigation */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-emerald-700 mb-10 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to list
          </button>

          {/* Location Banner */}
          <div className="mb-8 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <MapPin className={`w-4 h-4 ${locating ? "text-emerald-400" : "text-emerald-600"}`} />
            <span className="text-xs font-medium text-emerald-800">
              {locating ? "Updating location..." : `Showing results for ${locationName || "Current Location"}`}
            </span>
            {!locating && (
              <button 
                onClick={getLocation}
                className="ml-auto text-[10px] font-bold uppercase tracking-wider text-emerald-700 hover:underline"
              >
                Refresh
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-12 lg:gap-16 mb-16">
            {/* Image Section */}
            <div className="md:w-1/2 flex flex-col gap-4">
              <div className="relative w-full aspect-square bg-slate-50 border border-slate-100 rounded-2xl p-8 flex items-center justify-center">
                <img
                  src={
                    medicine.images && medicine.images[activeImageIndex]
                      ? getImageUrl(medicine.images[activeImageIndex])
                      : "/no-image.png"
                  }
                  alt={medicine.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-opacity duration-300"
                />
                {medicine.pricing.offer && (
                  <div className="absolute top-4 left-4 bg-emerald-700 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                    {medicine.pricing.offer}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {medicine.images && medicine.images.length > 0 && (
                <div className="flex gap-3 overflow-x-auto py-2">
                  {medicine.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border transition-all flex-shrink-0 bg-slate-50 ${
                        activeImageIndex === idx
                          ? "border-emerald-600 ring-1 ring-emerald-600"
                          : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${medicine.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover mix-blend-multiply p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-emerald-100/50">
                  {medicine.category || "General"}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${medicine.stock > 0 ? "bg-slate-50 text-slate-700 border-slate-200" : "bg-red-50 text-red-600 border-red-100"}`}
                >
                  {medicine.stock > 0 ? `In Stock (${medicine.stock} units)` : "Out of Stock"}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 leading-tight tracking-tight">
                {medicine.name}
                {medicine.unitWeight && (
                  <span className="text-lg md:text-xl text-slate-400 font-medium ml-3">
                    ({medicine.unitWeight})
                  </span>
                )}
              </h1>
              <p className="text-base text-slate-500 mb-6 font-medium">
                By {medicine.brand}
              </p>

              <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-slate-100">
                <p className="text-3xl font-bold text-slate-900">
                  ₹{medicine.pricing.sellingPrice}
                </p>
                {medicine.pricing.mrp > medicine.pricing.sellingPrice && (
                  <p className="text-base text-slate-400 line-through">
                    MRP ₹{medicine.pricing.mrp}
                  </p>
                )}
              </div>

              <div className="mb-8">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                  <p className="text-base font-semibold text-slate-900 mb-2">
                    {medicine.shop?.name || "Premium Pharmacy"}
                  </p>
                  <div className="flex items-start text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm leading-relaxed mb-2">
                        {medicine.shop?.location?.fullAddress ||
                          medicine.shop?.address ||
                          "Address details not available"}
                      </p>

                      <div className="flex flex-wrap gap-4 items-center mt-3">
                        {medicine.shop?.phone && (
                          <p className="text-xs text-slate-500 font-medium">
                            Number: {medicine.shop.phone}
                          </p>
                        )}
                        {medicine.shop?.licenseNumber && (
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Lic: {medicine.shop.licenseNumber}
                          </p>
                        )}
                      </div>

                      {medicine.shop?.distance && (
                        <div className="mt-4 inline-flex items-center bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded text-xs font-semibold">
                          {medicine.shop.distance} km away
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Mini-grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-emerald-700 w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      100% Genuine
                    </p>
                    <p className="text-xs text-slate-500">Quality Assured</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="text-emerald-700 w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Fast Shipping
                    </p>
                    <p className="text-xs text-slate-500">Secure Delivery</p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector - Only shown if in stock */}
              {medicine.stock > 0 ? (
                <div className="flex items-center gap-6 mb-8">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Quantity
                  </p>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="p-2.5 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4 text-slate-600" />
                    </button>
                    <div className="w-12 text-center font-bold text-slate-900 border-x border-slate-200 py-2 bg-white">
                      {quantity}
                    </div>
                    <button
                      disabled={quantity >= medicine.stock}
                      onClick={() => setQuantity(prev => Math.min(medicine.stock, prev + 1))}
                      className="p-2.5 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                  {medicine.stock > 0 && medicine.stock < 10 && (
                    <p className="text-xs font-bold text-red-500 uppercase">
                      Only {medicine.stock} left!
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-red-600 text-sm font-bold flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    This item is currently unavailable
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={medicine.stock <= 0}
                  className="flex-1 bg-white hover:bg-slate-50 border-2 border-emerald-800 text-emerald-800 py-3.5 rounded-lg font-bold text-base transition-all flex items-center justify-center shadow-sm"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={medicine.stock <= 0}
                  className="flex-[1.5] bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 text-white py-3.5 rounded-lg font-bold text-base transition-all flex items-center justify-center shadow-lg shadow-emerald-800/20 disabled:shadow-none"
                >
                  {medicine.stock > 0 ? "Buy Now" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-12">
            <div className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-700" />
                Product Description
              </h2>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8">
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {medicine.description || 
                    "This medicine does not have a detailed description yet. Please consult the packaging or your healthcare professional for full usage instructions and safety information."}
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Product Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 border border-slate-100 rounded-xl p-6">
              {medicine.manufacturer && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Manufacturer
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {medicine.manufacturer}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Category
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {medicine.category || "General"}
                </p>
              </div>
              {medicine.unitWeight && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Unit / Weight
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {medicine.unitWeight}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Available Stock
                </p>
                <p className={`text-sm font-bold ${medicine.stock > 0 ? "text-slate-900" : "text-red-600"}`}>
                  {medicine.stock} units
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
