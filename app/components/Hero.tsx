"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2 } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const Hero = () => {
  const router = useRouter();
  const [medicine, setMedicine] = useState("");
  const [location, setLocation] = useState("Detecting location...");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("Location not supported");
      setLoadingLoc(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setCoords({ lat, lng });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            {
              headers: {
                "Accept-Language": "en",
              },
            }
          );
          const data = await res.json();

          setLocation(
            data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.display_name ||
              "Current Location"
          );
        } catch {
          setLocation("Current Location");
        }

        setLoadingLoc(false);
      },
      () => {
        setLocation("Location permission denied");
        setLoadingLoc(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const handleSearch = () => {
    let url = "/medicines?";
    if (medicine) url += `search=${encodeURIComponent(medicine)}&`;
    if (coords) {
      url += `lat=${coords.lat}&lng=${coords.lng}&radius=5`; // 5km radius as requested
    }
    router.push(url);
  };

  return (
    <main className="pt-24 pb-40 px-6 relative">
      {/* Background */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[140px] opacity-60 -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-[120px] opacity-40 -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto text-center relative z-10"
      >
        {/* Title */}
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl md:text-[100px] font-black text-slate-900 leading-[0.9] tracking-tighter mb-10">
          The Digital Core of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a4d33] to-[#10b981]">
            Medicine Search.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p variants={itemVariants} className="text-slate-500 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-16 font-medium">
          Find verified pharmacies, compare medicine availability, and manage your health network in one platform.
        </motion.p>

        {/* Search Box */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#0a4d33] to-[#10b981] rounded-[32px] blur-xl opacity-0 group-hover:opacity-10 transition duration-1000" />

          <div className="relative flex flex-col md:flex-row items-center bg-white border border-slate-100 rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-3">

            {/* Medicine Input */}
            <div className="flex-1 flex items-center w-full px-6 py-2 border-b md:border-b-0 md:border-r border-slate-50">
              <Search className="w-6 h-6 text-slate-300 mr-4" />
              <input
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                type="text"
                placeholder="Search medicine or pharmacy..."
                className="w-full h-12 text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* Location (AUTO FILLED) */}
            <div className="flex-1 flex items-center w-full px-6 py-2">
              <MapPin className="w-6 h-6 text-emerald-500 mr-4" />
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Nearby (5KM)</span>
                <span className="text-lg font-bold text-slate-900 truncate w-full text-left">
                  {loadingLoc ? (
                    <span className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin" /> Detecting...
                    </span>
                  ) : location}
                </span>
              </div>
            </div>

            {/* Button */}
            <button 
              onClick={handleSearch}
              className="w-full md:w-auto px-10 py-5 bg-[#0a4d33] hover:bg-[#083d28] text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              Search Now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
};
