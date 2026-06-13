"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getMedicine } from "@/app/apis/medicineapi";
import { addToCart, getCart } from "@/app/apis/cart.api";
import { toast } from "react-toastify";
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
import { useSelector } from "react-redux";

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  pricing: {
    sellingPrice: number;
    mrp: number;
    offer?: string;
    gst?: number;
  };
  images?: string[];
  description?: string;
  category: string;
  unitWeight?: string;
  stock: number;
  manufacturer?: string;
  sellerId?: string;
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

export default function MedicineDetailClient({ initialData }: { initialData?: Medicine | null }) {
  const { id } = useParams();
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);
  const searchParams = useSearchParams();
  const prescribedQty = searchParams.get("prescribedQty");
  
  const [medicine, setMedicine] = useState<Medicine | null>(initialData || null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [quantity, setQuantity] = useState<number>(initialData?.stock && initialData.stock > 0 ? 1 : 0);
  const [cartQty, setCartQty] = useState<number>(0);
  const [locationName, setLocationName] = useState<string>("");
  const [locating, setLocating] = useState<boolean>(false);

  const [selectableMax, setSelectableMax] = useState<number>(0);

  useEffect(() => {
    if (medicine) {
      const remainingStock = Math.max(0, medicine.stock - cartQty);
      const remainingPrescribed = prescribedQty 
        ? Math.max(0, Number(prescribedQty) - cartQty) 
        : Infinity;
      
      const max = Math.min(remainingStock, remainingPrescribed);
      setSelectableMax(max);
      
      // Reset quantity if it exceeds new max
      if (quantity > max) {
        setQuantity(max > 0 ? 1 : 0);
      }
    }
  }, [medicine, cartQty, prescribedQty]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://newmedifinddeploy-env.eba-pp6njqrd.eu-north-1.elasticbeanstalk.com/api";
      const res = await fetch(`${apiUrl}/locations/reverse?lat=${lat}&lng=${lng}`);
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
          if (!initialData) fetchMedicine(null);
        },
      );
    } else {
      setLocating(false);
      if (!initialData) fetchMedicine(null);
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
      if (!initialData) setQuantity(med.stock > 0 ? 1 : 0);
    } catch (err) {
      console.error("Error fetching medicine:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!medicine) return;
    try {
      const res = await addToCart({ medicineId: medicine._id, quantity, prescribedQty: prescribedQty ? Number(prescribedQty) : undefined });
      if (res.data.success) {
        toast.success(`${quantity} units of ${medicine.name} added to cart!`);
        await fetchCartData(); // Update cartQty and selectableMax immediately
      } else {
        toast.error(res.data.message || "Failed to add to cart");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    if (!medicine) return;
    if (!user) {
      toast.info("Please login to purchase medicines.");
      router.push(`/login?redirect=/medicines/${medicine._id}`);
      return;
    }
    router.push(`/deliveryDetails?buyNowMedicineId=${medicine._id}&buyNowQuantity=${quantity}${prescribedQty ? `&prescribedQty=${prescribedQty}` : ""}`);
  };

  useEffect(() => {
    getLocation();
  }, [id]);

  useEffect(() => {
    if (coords) {
      fetchMedicine(coords);
    }
  }, [coords]);

  const fetchCartData = async () => {
    try {
      const res = await getCart();
      if (res.data.success) {
        const item = res.data.cart.items.find((item: any) => {
          const medId = item.medicineId?._id || item.medicineId;
          return medId === id;
        });
        if (item) {
          setCartQty(item.quantity);
        }
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [id]);

  if (loading && !medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading medicine details...</p>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Medicine Not Found</h1>
          <Link href="/medicines" className="inline-flex items-center justify-center bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:bg-emerald-800 w-full mt-4">
            Back to Medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <NavbarPage />
      <div className="py-12 px-6 md:px-10 mt-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
     
<br/>
<br/>
          {/* Location Banner */}
          <div className="mb-8 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <MapPin className={`w-4 h-4 ${locating ? "text-emerald-400" : "text-emerald-600"}`} />
            <span className="text-xs font-medium text-emerald-800">
              {locating ? "Updating location..." : `Showing results for ${locationName || "Current Location"}`}
            </span>
            {!locating && (
              <button onClick={getLocation} className="ml-auto text-[10px] font-bold uppercase tracking-wider text-emerald-700 hover:underline">
                Refresh
              </button>
            )}
          </div>
               <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 text-slate-500 hover:text-emerald-700 font-semibold text-sm mb-8 transition-all"
          >
            <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-emerald-50 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to medicines
          </button>

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
                <div className="flex gap-3 overflow-x-auto py-4 scrollbar-hide">
                  {medicine.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${
                        activeImageIndex === idx 
                          ? "border-emerald-600 shadow-sm" 
                          : "border-slate-100 hover:border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img 
                        src={getImageUrl(img)} 
                        alt={`${medicine.name} view ${idx + 1}`} 
                        className="w-full h-full object-contain p-2 mix-blend-multiply" 
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
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${medicine.stock > 0 ? "bg-slate-50 text-slate-700 border-slate-200" : "bg-red-50 text-red-600 border-red-100"}`}>
                  {medicine.stock > 0 ? `In Stock (${medicine.stock} units)` : "Out of Stock"}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 leading-tight tracking-tight">
                {medicine.name}
                {medicine.unitWeight && <span className="text-lg md:text-xl text-slate-400 font-medium ml-3">({medicine.unitWeight})</span>}
              </h1>
              <p className="text-base text-slate-500 mb-6 font-medium">By {medicine.brand}</p>

              <div className="flex flex-col gap-1 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold text-slate-900">₹{medicine.pricing.sellingPrice}</p>
                  {medicine.pricing.mrp > medicine.pricing.sellingPrice && (
                    <p className="text-base text-slate-400 line-through">MRP ₹{medicine.pricing.mrp}</p>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-500">+ {medicine.pricing.gst || 0}% GST</p>
              </div>

              <div className="mb-8">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                  <p className="text-base font-semibold text-slate-900 mb-2">{medicine.shop?.name || "Premium Pharmacy"}</p>
                  <div className="flex items-start text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">{medicine.shop?.location?.fullAddress || medicine.shop?.address || "Address details not available"}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-emerald-700 w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">100% Genuine</p>
                    <p className="text-xs text-slate-500">Quality Assured</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="text-emerald-700 w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Fast Delivery</p>
                    <p className="text-xs text-slate-500">Secure Transit</p>
                  </div>
                </div>
              </div>

              {medicine.stock > 0 ? (
                <div className="mb-8">
                  <div className="flex items-center gap-6 mb-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))} 
                        disabled={quantity <= 1}
                        className="p-2.5 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="w-12 text-center font-bold py-2 bg-white">{quantity}</div>
                      <button 
                        onClick={() => setQuantity(prev => Math.min(selectableMax, prev + 1))} 
                        disabled={quantity >= selectableMax || selectableMax === 0}
                        className="p-2.5 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {cartQty > 0 && (
                    <p className="text-xs text-emerald-600 font-medium">
                      ({cartQty} units already in your cart. Max total: {medicine.stock})
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold">Item currently unavailable</div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={selectableMax <= 0 || user?.id === medicine.sellerId}
                  className="flex-1 bg-white hover:bg-slate-50 border-2 border-emerald-800 text-emerald-800 py-3.5 rounded-lg font-bold text-base transition-all disabled:opacity-50"
                >
                  {user?.id === medicine.sellerId ? "Your Product" : selectableMax <= 0 ? "Limit Reached" : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={user ? (selectableMax <= 0 || user.id === medicine.sellerId) : medicine.stock <= 0}
                  className="flex-[1.5] bg-emerald-800 hover:bg-emerald-900 text-white py-3.5 rounded-lg font-bold text-base transition-all shadow-lg shadow-emerald-800/20 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {user?.id === medicine.sellerId ? "Your Product" : (user && selectableMax <= 0) ? "Limit Reached" : "Buy Now"}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-700" />Product Description</h2>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 prose prose-slate max-w-none text-slate-600 leading-relaxed">
              {medicine.description || "Description coming soon..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
