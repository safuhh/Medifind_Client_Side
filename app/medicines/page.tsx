"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAllMedicines } from "@/app/apis/medicineapi";
import { MapPin, Search, Loader2, Activity, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NavbarPage from "@/app/navbar/page";
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
  shop?: {
    name: string;
    address: string;
    distance: number | null;
  };
}

function MedicinesList() {
  const searchParams = useSearchParams();
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

  const categoriesList = Array.from(new Set(medicines.map(m => m.category).filter(Boolean))).sort();

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

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          const urlLat = searchParams.get("lat");
          const urlLng = searchParams.get("lng");
          if (urlLat && urlLng) {
            setCoords({ lat: Number(urlLat), lng: Number(urlLng) });
          } else {
            fetchData(null);
          }
        }
      );
    } else {
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
        radius
      );
      setMedicines(res.data.medicines || []);
    } catch (err: any) {
      console.error("Error fetching medicines:", err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/no-image.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000/uploads/${imagePath.replace(/^\/?uploads\//, "")}`;
  };

  useEffect(() => {
    const s = searchParams.get("search") || "";
    const r = searchParams.get("radius") ? Number(searchParams.get("radius")) : undefined;
    setSearch(s);
    setRadius(r);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [coords, search, radius]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const filteredMedicines = medicines.filter(med => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(c => med.category?.toLowerCase() === c.toLowerCase());
    const matchesPrice = (med.pricing?.sellingPrice || 0) <= maxPrice;
    return matchesCategory && matchesPrice;
  });
return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      <NavbarPage />
      {/* Minimal Hero Section */}
      <div className="pt-20 pb-16 border-b border-slate-100">
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
            className="w-full max-w-2xl mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center bg-white border border-slate-300 p-1.5 rounded-xl shadow-sm focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all gap-2 sm:gap-0">
              <div className="flex-grow flex items-center w-full px-4">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by medicine name, brand..."
                  className="w-full bg-transparent border-none text-slate-900 placeholder:text-slate-400 py-3 focus:ring-0 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-800 text-white hover:bg-emerald-900 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center shrink-0"
              >
                Search
              </button>
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
                        
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-lg font-bold text-slate-900">₹{med.pricing.sellingPrice}</span>
                          {med.pricing.mrp > med.pricing.sellingPrice && (
                            <span className="text-sm text-slate-400 line-through">₹{med.pricing.mrp}</span>
                          )}
                        </div>

                        {/* Pharmacy Info */}
                        <div className="mt-auto pt-4 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 pr-3 min-w-0">
                              <p className="text-[11px] font-medium text-slate-700 truncate mb-0.5">
                                {med.shop?.name || "Premium Pharmacy"}
                              </p>
                              <div className="flex items-center text-slate-500">
                                <MapPin className="w-3 h-3 mr-1 shrink-0" />
                                <span className="text-[10px] truncate">{med.shop?.address || "Available Locally"}</span>
                              </div>
                            </div>
                            
                            {med.shop?.distance !== null && (
                              <div className="shrink-0 bg-slate-50 text-slate-600 text-[10px] font-semibold px-2 py-1 rounded border border-slate-200">
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