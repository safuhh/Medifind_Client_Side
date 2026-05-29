"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getAllMedicines } from "@/app/apis/medicineapi";
import { MapPin, Search, Loader2, Activity, ArrowRight, ShieldCheck, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  visibility?: string;
  shop?: {
    name: string;
    address: string;
    distance: number | null;
  };
}

function MedicinesList() {
  const searchParams = useSearchParams();
  const user = useSelector((state: any) => state.auth.user);
  const isDoctor = user?.role === "doctor";
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>(searchParams.get("search") || "");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number | undefined>(
    searchParams.get("radius") ? Number(searchParams.get("radius")) : undefined
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sliderMax, setSliderMax] = useState<number>(10000);
  const [locating, setLocating] = useState(false);
  const [locationName, setLocationName] = useState<string>("");

  const categoriesList = [
    "Pain Relief",
    "Antibiotics",
    "Diabetes",
    "Cardiology",
    "Skin Care",
    "Vitamins",
    "Baby Care",
    "Respiratory",
    "Other"
  ];

  useEffect(() => {
    if (medicines.length > 0) {
      const highest = Math.max(...medicines.map(m => m.pricing?.sellingPrice || 0));
      const roundedMax = Math.ceil(Math.max(highest, 100) / 100) * 100;
      setSliderMax(roundedMax);
      setMaxPrice(roundedMax);
    }
  }, [medicines]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/locations/reverse?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      
      if (data && data.shortName) {
        setLocationName(data.shortName);
      } else if (data && data.address) {
        setLocationName(data.address.split(",").slice(0, 2).join(", "));
      } else {
        setLocationName(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
      }
    } catch (err) {
      console.warn("Reverse geocoding warning:", err instanceof Error ? err.message : String(err));
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
        async (error) => {
          console.error("Error getting location:", error);
          const urlLat = searchParams.get("lat");
          const urlLng = searchParams.get("lng");
          if (urlLat && urlLng) {
            const lat = Number(urlLat);
            const lng = Number(urlLng);
            setCoords({ lat, lng });
            await reverseGeocode(lat, lng);
          } else {
            fetchData(null);
          }
          setLocating(false);
        }
      );
    } else {
      setLocating(false);
      fetchData(null);
    }
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async (currentCoords: { lat: number; lng: number } | null = coords) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await getAllMedicines(
        currentCoords?.lat || (searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined),
        currentCoords?.lng || (searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined),
        search,
        radius,
        100,
        selectedCategories.length > 0 ? selectedCategories.join(',') : undefined
      );
      setMedicines(res.data.medicines || []);
    } catch (err: any) {
      console.error("Error fetching medicines:", err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      setErrorMsg(msg + " (URL: " + err.config?.url + ")");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    const s = searchParams.get("search") || "";
    const r = searchParams.get("radius") ? Number(searchParams.get("radius")) : undefined;
    setSearch(s);
    setRadius(r);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [coords, search, radius, selectedCategories]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const filteredMedicines = medicines.filter(med => {
    // Backend already filters categories accurately, including legacy db value mapping.
    const matchesPrice = (med.pricing?.sellingPrice || 0) <= maxPrice;
    const matchesVisibility = isDoctor || med.visibility !== "restricted";
    return matchesPrice && matchesVisibility;
  });
return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      <NavbarPage />
      {/* Increased padding-top to avoid overlap with fixed navbar */}
      <div className="pt-28 md:pt-36 pb-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide mb-6"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Trusted Healthcare Marketplace</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4"
          >
            Find Medicines <br className="hidden md:block" />
            <span className="text-emerald-800">Near You Instantly</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-base md:text-lg text-slate-500 max-w-2xl mb-10"
          >
            {radius 
              ? `Showing essential medicines available within a ${radius}km radius of your current location.` 
              : "Search thousands of medicines from verified local pharmacies and get them delivered to your doorstep."}
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            onSubmit={handleSearch} 
            className="w-full max-w-5xl mb-12"
          >
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-900/10 to-emerald-500/10 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
              
              <div className="relative flex flex-col md:flex-row items-center bg-white border border-slate-100 rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-3">
                
                {/* Medicine Search Group */}
                <div className="flex-1 flex items-center w-full px-6 py-2 border-b md:border-b-0 md:border-r border-slate-50">
                  <Search className="w-6 h-6 text-slate-300 mr-4" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search medicines, pharmacy or brands..."
                    className="w-full h-12 text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                </div>

                {/* Auto Location Display (Mimicking Hero style) */}
                <button 
                  type="button"
                  onClick={getLocation}
                  className="flex-1 flex items-center w-full px-6 py-2 hover:bg-slate-50/50 transition-colors group/loc"
                >
                  <MapPin className={`w-6 h-6 ${locating ? "text-emerald-400" : "text-emerald-600"} mr-4 shrink-0 group-hover/loc:scale-110 transition-transform`} />
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">
                      {radius ? `Nearby (${radius}KM)` : "Detecting Range"}
                    </span>
                    <span className="text-lg font-bold text-slate-900 truncate w-full text-left">
                      {locating ? (
                        <span className="flex items-center gap-2 text-slate-400">
                          <Loader2 className="w-4 h-4 animate-spin" /> Detecting...
                        </span>
                      ) : locationName || "Set Location"}
                    </span>
                  </div>
                </button>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-10 py-5 bg-[#0a4d33] hover:bg-[#083d28] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  Search
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <div className="lg:w-1/4 shrink-0">
          <div className="bg-white rounded-xl p-6 border border-slate-200 sticky top-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Filters</h3>
            
            {/* Category Filter */}
            <div className="mb-8">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Categories</h4>
              <div className="space-y-3">
                {categoriesList.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 transition-colors cursor-pointer"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Max Price</h4>
                <span className="text-sm font-medium text-emerald-800">₹{maxPrice}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={sliderMax}
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-700 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>₹0</span>
                <span>₹{sliderMax}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:w-3/4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
            <div className="relative w-12 h-12 flex items-center justify-center mb-4">
              <div className="absolute inset-0 border-2 border-emerald-100 rounded-full" />
              <div className="absolute inset-0 border-2 border-emerald-700 rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-slate-500 font-medium text-sm">Loading medicines...</p>
          </div>
        ) : errorMsg ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Connection Error</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6 text-sm">{errorMsg}</p>
            <button onClick={() => fetchData()} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              Try Again
            </button>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Medicines Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm mb-6">
              We couldn't find any exact matches for your search. Try adjusting your filters.
            </p>
            <button onClick={() => { setSearch(""); setSelectedCategories([]); setMaxPrice(sliderMax); fetchData(); }} className="text-emerald-700 font-medium hover:text-emerald-800 flex items-center justify-center mx-auto gap-2">
              Clear Filters <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredMedicines.map((med, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={med._id}
                >
                  <Link href={`/medicines/${med._id}`} className="block h-full group">
                    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                      
                      {/* Image Container */}
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100">
                        <img
                          src={med.images && med.images[0] ? getImageUrl(med.images[0]) : "/no-image.png"}
                          alt={med.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Tags */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          <span className="bg-white/90 backdrop-blur text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm border border-emerald-100/50">
                            {med.category}
                          </span>
                          {med.unitWeight && (
                            <span className="bg-emerald-800 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm self-start">
                              {med.unitWeight}
                            </span>
                          )}
                        </div>
                        
                        {med.pricing.offer && (
                          <div className="absolute top-3 right-3 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                            {med.pricing.offer}
                          </div>
                        )}
                      </div>
                      
                      {/* Content Container */}
                      <div className="p-5 flex-grow flex flex-col">
                        <h2 className="text-base font-semibold text-slate-900 line-clamp-2 mb-1 group-hover:text-emerald-700 transition-colors">
                          {med.name}
                        </h2>
                        <div className="flex items-center gap-2 mb-3">
                          <p className="text-xs text-slate-500">{med.brand || "Generic"}</p>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${med.stock > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                            {med.stock > 0 ? `${med.stock} units` : "Out of Stock"}
                          </span>
                        </div>
                        
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-lg font-bold text-slate-900">₹{med.pricing.sellingPrice}</span>
                          {med.pricing.mrp > med.pricing.sellingPrice && (
                            <span className="text-sm text-slate-400 line-through">₹{med.pricing.mrp}</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mb-4 font-medium">
                          + {med.pricing.gst || 0}% GST (₹{((med.pricing.sellingPrice * (med.pricing.gst || 0)) / 100).toFixed(2)})
                        </p>

                        <div className="mt-auto pt-4 border-t border-slate-100">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-bold text-slate-900 truncate mb-1">
                                {med.shop?.name || "Premium Pharmacy"}
                              </p>
                              <div className="flex items-start text-slate-500 gap-1">
                                <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-emerald-600" />
                                <span className="text-[10px] line-clamp-2 leading-relaxed">
                                  {(med.shop as any)?.location?.fullAddress || med.shop?.address || "Address details not available"}
                                </span>
                              </div>
                            </div>
                            
                            {med.shop?.distance !== null && (
                              <div className="shrink-0 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-emerald-100 whitespace-nowrap">
                                {med.shop?.distance} km
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default function MedicinesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-emerald-100 rounded-full" />
          <div className="absolute inset-0 border-2 border-emerald-700 rounded-full border-t-transparent animate-spin" />
        </div>
      </div>
    }>
      <MedicinesList />
    </Suspense>
  );
}