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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  },
};

export const Hero = () => {
  const router = useRouter();
  const [medicine, setMedicine] = useState("");
  const [location, setLocation] = useState("Detecting location...");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(true);

  const getLocation = () => {
    setLoadingLoc(true);
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
  };

  useEffect(() => {
    getLocation();
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
    <main className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 py-20 overflow-hidden bg-white">
      {/* Background blobs (Safely inside overflow-hidden to prevent horizontal scrolling) */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-7xl mx-auto text-center relative z-10"
      >
        {/* Title */}
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl md:text-[90px] lg:text-[100px] font-black text-slate-900 leading-[1.1] md:leading-[0.9] tracking-tighter mb-8">
          The Digital Core Of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a4d33] to-[#10b981]">
            Medicine Search
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p variants={itemVariants} className="text-slate-500 text-base sm:text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16 font-medium">
          Find verified pharmacies, compare medicine availability, and manage your health network in one platform.
        </motion.p>

        {/* Search Box */}
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto relative group">
          {/* Enhanced glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#0a4d33] to-[#10b981] rounded-[32px] blur-lg opacity-20 group-hover:opacity-40 transition duration-500 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center bg-white border border-slate-200 rounded-[28px] shadow-xl p-2 md:p-3">
            {/* Medicine Input */}
            <div className="flex-1 flex items-center w-full px-4 md:px-6 py-3 border-b md:border-b-0 md:border-r border-slate-200">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                type="text"
                placeholder="Search medicine or pharmacy..."
                className="w-full h-10 text-base md:text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            {/* Location Button */}
            <button
              type="button"
              onClick={getLocation}
              className="flex-1 flex items-center w-full px-4 md:px-6 py-3 hover:bg-slate-50 transition-colors rounded-xl md:rounded-none group/loc"
              title="Click to detect your current location"
            >
              <MapPin className={`w-5 h-5 ${loadingLoc ? "text-emerald-400 animate-pulse" : "text-emerald-500"} mr-3 shrink-0 group-hover/loc:scale-110 transition-transform`} />
              <div className="flex flex-col items-start overflow-hidden w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Nearby (5KM) - Click to detect
                </span>
                <span className="text-sm md:text-base font-bold text-slate-900 truncate w-full text-left">
                  {loadingLoc ? (
                    <span className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-3 h-3 animate-spin" /> Detecting...
                    </span>
                  ) : location}
                </span>
              </div>
            </button>

            {/* Button */}
            <button
              onClick={handleSearch}
              className="w-full md:w-auto mt-2 md:mt-0 px-8 py-4 bg-[#0a4d33] hover:bg-[#083d28] text-white rounded-[20px] font-black text-sm uppercase tracking-[0.1em] transition-all shadow-lg active:scale-95 flex items-center justify-center shrink-0"
            >
              Search Now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
};
