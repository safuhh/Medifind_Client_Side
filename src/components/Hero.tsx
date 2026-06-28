"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Pill,
  Heart,
  Activity,
  Truck,
  Shield,
  Clock,
  Sparkles,
  Navigation,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";

const LocationModal = dynamic(() => import("./LocationModal"), {
  ssr: false,
});


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
};

const floatingVariants1: Variants = {
  animate: {
    y: [0, -10, 0],
    x: [0, 4, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const floatingVariants2: Variants = {
  animate: {
    y: [0, -8, 0],
    x: [0, -6, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const floatingVariants3: Variants = {
  animate: {
    y: [0, -12, 0],
    x: [0, 5, 0],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const SkeletonLoader = () => (
  <div className="space-y-3 py-2">
    {[1, 2].map((i) => (
      <div key={i} className="bg-surface/60 border border-border/40 rounded-md p-3.5 space-y-2.5 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-1.5 w-1/2">
            <div className="h-3.5 bg-ink-faint/15 rounded-sm w-3/4" />
            <div className="h-2 bg-ink-faint/10 rounded-sm w-1/2" />
          </div>
          <div className="h-4 bg-ink-faint/15 rounded-sm w-12" />
        </div>
        <div className="flex justify-between items-center pt-1.5">
          <div className="h-3 bg-primary-subtle rounded-sm w-16" />
          <div className="h-3 bg-ink-faint/10 rounded-sm w-12" />
        </div>
      </div>
    ))}
  </div>
);

export const Hero = () => {
  const router = useRouter();
  const [medicine, setMedicine] = useState("");
  const [location, setLocation] = useState("Detecting location...");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [locInput, setLocInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);

  const handleSelectLocation = (lat: number, lng: number, address: string) => {
    setCoords({ lat, lng });
    setLocation(address);
    setLoadingLoc(false);
  };

  useEffect(() => {
    if (location && location !== "Detecting location...") {
      setLocInput(location);
    }
  }, [location]);

  // Debounce autocomplete search
  useEffect(() => {
    if (!locInput || locInput === location) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setFetchingSuggestions(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locInput)}&format=json&limit=5`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [locInput]);

  // Simulated browser states
  const [displayText, setDisplayText] = useState("");
  const fullText = "Metformin 500mg ER";
  const [typingIndex, setTypingIndex] = useState(0);
  const [simulatedState, setSimulatedState] = useState<"typing" | "matching" | "results">("typing");

  // Simulated typing workflow loop
  useEffect(() => {
    const timer = setInterval(() => {
      if (typingIndex < fullText.length) {
        setDisplayText((prev) => prev + fullText[typingIndex]);
        setTypingIndex((prev) => prev + 1);
      } else {
        // Pause at results, then cycle back
        const timeout = setTimeout(() => {
          setDisplayText("");
          setTypingIndex(0);
        }, 5000);
        return () => clearTimeout(timeout);
      }
    }, 120);

    return () => clearInterval(timer);
  }, [typingIndex]);

  useEffect(() => {
    if (typingIndex === fullText.length) {
      setSimulatedState("matching");
      const t = setTimeout(() => {
        setSimulatedState("results");
      }, 1200);
      return () => clearTimeout(t);
    } else if (typingIndex === 0) {
      setSimulatedState("typing");
    }
  }, [typingIndex]);

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
    if (medicine && medicine.trim()) {
      try {
        const stored = localStorage.getItem("medifind_searched_medicines");
        let searches = stored ? JSON.parse(stored) : [];
        searches = [
          { query: medicine.trim(), timestamp: new Date().toISOString() },
          ...searches.filter((s: any) => s.query.toLowerCase() !== medicine.trim().toLowerCase())
        ].slice(0, 50);
        localStorage.setItem("medifind_searched_medicines", JSON.stringify(searches));
      } catch (e) {
        console.error("Error saving search history:", e);
      }
    }

    let url = "/medicines?";
    if (medicine) url += `search=${encodeURIComponent(medicine)}&`;
    if (coords) {
      url += `lat=${coords.lat}&lng=${coords.lng}&radius=5`;
    }
    router.push(url);
  };

  return (
    <main className="relative w-full min-h-[85dvh] flex items-center justify-center px-4 sm:px-6 md:px-8 pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-white">
    
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,77,83,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,77,83,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Soft Ambient Light Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/2 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Decorative Network Grid Background */}
      <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-30">
        
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          {/* Animated data lines */}
          <motion.path
            d="M 100 150 Q 350 80 600 200 T 1100 150"
            stroke="url(#flowGradient1)"
            strokeWidth="1.5"
            strokeDasharray="10 30"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 200 650 Q 550 500 900 650"
            stroke="url(#flowGradient2)"
            strokeWidth="1.5"
            strokeDasharray="15 45"
            animate={{ strokeDashoffset: [0, 120] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <defs>
            <linearGradient id="flowGradient1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0a4d33" stopOpacity="0" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0a4d33" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="flowGradient2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#0a4d33" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
 
      {/* Mobile-Only Premium Hero Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="md:hidden w-full max-w-[480px] space-y-6 relative z-10 flex flex-col items-center text-center mx-auto"
      >
        {/* Soft Healthcare Glows specific to mobile */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-primary/8 rounded-full blur-[80px] pointer-events-none -z-10 animate-pulse" />
        <div className="absolute bottom-10 right-0 w-[180px] h-[180px] bg-emerald-400/5 rounded-full blur-[60px] pointer-events-none -z-10" />

      

     

        {/* Premium Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-subtle text-primary border border-primary/10 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: "3s" }} />
          <span>Intelligent Healthcare Platform</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-[34px] font-extrabold tracking-tight text-ink leading-[1.1] pt-1.5"
        >
          The <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">Smarter Way</span> <br />
          to Manage <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">Healthcare</span>.
        </motion.h1>

        {/* Subtitle / Description */}
        <motion.p
          variants={itemVariants}
          className="text-ink-muted text-sm font-semibold leading-relaxed max-w-[340px]"
        >
          Discover real-time medicine stock, generic alternatives, and local pharmacist networks near you instantly.
        </motion.p>

        {/* Glassmorphic Mobile Search Experience Card */}
        <motion.div
          variants={itemVariants}
          className="w-full bg-white/95 backdrop-blur-md border border-border shadow-[0_20px_40px_rgba(15,23,42,0.08)] rounded-2xl p-3.5 space-y-3 z-10"
        >
          {/* Search input field */}
          <div className="flex items-center bg-surface border border-border/80 rounded-xl px-3.5 py-3 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/30 transition-all">
            <Search className="w-4.5 h-4.5 text-primary mr-2.5 shrink-0" />
            <input
              suppressHydrationWarning
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              type="text"
              placeholder="Search medicine or pharmacy..."
              className="w-full text-xs font-bold text-ink placeholder:text-ink-faint bg-transparent focus:outline-none"
            />
          </div>

          {/* Location input / detector with autocomplete */}
          <div className="relative flex items-center bg-surface border border-border/80 rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/30 transition-all">
            <MapPin className={`w-4.5 h-4.5 text-primary mr-2.5 shrink-0 ${loadingLoc ? "animate-pulse" : ""}`} />
            <div className="flex flex-col flex-1 overflow-hidden text-left">
              <span className="text-[8px] font-extrabold text-emerald-800 uppercase tracking-widest leading-none">Detection Area (5KM)</span>
              <input
                suppressHydrationWarning
                type="text"
                value={locInput}
                onChange={(e) => setLocInput(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Set location..."
                className="w-full text-xs font-bold text-ink placeholder:text-ink-faint bg-transparent focus:outline-none pt-0.5"
              />
            </div>

            {/* Suggestions Dropdown for Mobile */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50 max-h-[200px] overflow-y-auto">
                {/* Option: Current Location */}
                <button
                  suppressHydrationWarning
                  onClick={getLocation}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-surface text-xs font-bold text-primary border-b border-border/50 flex items-center gap-2"
                >
                  <Navigation className="w-3.5 h-3.5 fill-primary/10" />
                  Use Current Location
                </button>

                {/* Option: Map Pin */}
                <button
                  suppressHydrationWarning
                  onClick={() => setIsMapModalOpen(true)}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-surface text-xs font-bold text-emerald-600 border-b border-border/50 flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Select from Map
                </button>

                {/* Loader */}
                {fetchingSuggestions && (
                  <div className="px-4 py-3 text-xs text-ink-muted font-semibold flex items-center gap-2 bg-surface/50">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    Searching areas...
                  </div>
                )}

                {/* Suggestions mapping */}
                {!fetchingSuggestions && suggestions.map((item, idx) => (
                  <button
                    suppressHydrationWarning
                    key={idx}
                    onClick={() => {
                      handleSelectLocation(parseFloat(item.lat), parseFloat(item.lon), item.display_name);
                    }}
                    type="button"
                    className="w-full text-left px-4 py-2.5 hover:bg-surface text-xs font-semibold text-ink truncate border-b border-border/30 last:border-b-0 cursor-pointer"
                  >
                    {item.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search CTA */}
          <Button
            suppressHydrationWarning
            onClick={handleSearch}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-[0.98] uppercase tracking-wider"
          >
            Search Now
          </Button>
        </motion.div>

        {/* Premium MediFind Benefit Pill Badges */}
        <motion.div
          variants={itemVariants}
          className="w-full space-y-3 pt-2 text-left animate-fade-in"
        >
          <span className="text-[9px] font-extrabold text-ink-faint uppercase tracking-widest block text-center">INTELLIGENT MEDIFIND NETWORK</span>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/80 text-emerald-800 border border-emerald-100/50 rounded-full text-[11px] font-extrabold shadow-sm">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Real-Time Availability
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/80 text-emerald-800 border border-emerald-100/50 rounded-full text-[11px] font-extrabold shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Smart Discovery
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/80 text-emerald-800 border border-emerald-100/50 rounded-full text-[11px] font-extrabold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Generic Alternatives
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Desktop-Only Premium Hero Layout */}
      <div className="hidden md:grid w-full max-w-7xl mx-auto grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Heading, Search & CTAs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-6 sm:space-y-8 text-left"
        >
          {/* Trust Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary-subtle text-primary border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 animate-pulse text-primary" />
            <span>Healthcare Marketplace Infrastructure</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-[1.1] sm:leading-[1.05]"
          >
            The <span className="text-emerald-700">Smarter Way</span><br className="hidden sm:inline" /> to Manage <span className="text-emerald-700">Healthcare</span>.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-ink-muted text-sm sm:text-base md:text-lg max-w-[650px] leading-relaxed font-medium"
          >
            From doctor consultations to medicine delivery, MediFind brings
            every healthcare service together in one connected and intelligent
            platform.
          </motion.p>

          {/* Interactive Search Console */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-[620px] bg-white border border-border shadow-md rounded-md p-2 flex flex-col md:flex-row items-center gap-2 focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/40 transition-all duration-300"
          >
            {/* Search Input */}
            <div className="flex-1 flex items-center w-full px-3.5 py-3 md:py-2 border-b md:border-b-0 md:border-r border-border">
              <Search className="w-4 h-4 text-ink-faint mr-2.5 shrink-0" />
              <input
                suppressHydrationWarning
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                type="text"
                placeholder="Search medicine or pharmacy..."
                className="w-full text-sm font-semibold text-ink placeholder:text-ink-faint bg-transparent focus:outline-none"
              />
            </div>

            {/* Location input / detector with autocomplete */}
            <div className="flex-1 relative w-full px-3.5 py-3 md:py-2 border-b md:border-b-0 md:border-r border-border flex items-center">
              <MapPin className={`w-4.5 h-4.5 text-primary mr-2.5 shrink-0 ${loadingLoc ? "animate-pulse" : ""}`} />
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-[10px] font-bold text-ink-faint uppercase tracking-wider">Detection Area (5KM)</span>
                <input
                  suppressHydrationWarning
                  type="text"
                  value={locInput}
                  onChange={(e) => setLocInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Set location..."
                  className="w-full text-xs font-bold text-ink placeholder:text-ink-faint bg-transparent focus:outline-none"
                />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-border rounded-md shadow-lg overflow-hidden z-50 max-h-[250px] overflow-y-auto">
                  
                  {/* Option: Current Location */}
                  <button
                    suppressHydrationWarning
                    onClick={getLocation}
                    type="button"
                    className="w-full text-left px-4 py-2.5 hover:bg-surface text-xs font-bold text-primary border-b border-border/50 flex items-center gap-2"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-primary/10" />
                    Use Current Location
                  </button>

                  {/* Option: Map Pin */}
                  <button
                    suppressHydrationWarning
                    onClick={() => setIsMapModalOpen(true)}
                    type="button"
                    className="w-full text-left px-4 py-2.5 hover:bg-surface text-xs font-bold text-emerald-600 border-b border-border/50 flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Select from Map
                  </button>

                  {/* Loader */}
                  {fetchingSuggestions && (
                    <div className="px-4 py-3 text-xs text-ink-muted font-semibold flex items-center gap-2 bg-surface/50">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      Searching areas...
                    </div>
                  )}

                  {/* Suggestions mapping */}
                  {!fetchingSuggestions && suggestions.map((item, idx) => (
                    <button
                      suppressHydrationWarning
                      key={idx}
                      onClick={() => {
                        handleSelectLocation(parseFloat(item.lat), parseFloat(item.lon), item.display_name);
                      }}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-surface text-xs font-semibold text-ink truncate border-b border-border/30 last:border-b-0 cursor-pointer"
                    >
                      {item.display_name}
                    </button>
                  ))}

                  {!fetchingSuggestions && suggestions.length === 0 && locInput && locInput !== location && (
                    <div className="px-4 py-3 text-xs text-ink-faint font-medium text-center">
                      No matching addresses found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search CTA */}
            <Button suppressHydrationWarning onClick={handleSearch} className="w-full md:w-auto px-6 h-12 md:h-[44px] shadow-sm hover:shadow-md transition-shadow text-sm font-bold">
              Search Now
            </Button>
          </motion.div>

          {/* Core metrics / Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-ink-muted font-semibold pt-1"
          >
            <div className="flex items-center gap-1.5 group cursor-default">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary transition-transform group-hover:scale-110" />
              <span>100% HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 group cursor-default">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary transition-transform group-hover:scale-110" />
              <span>Verified Pharmacist Network</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: High-Fidelity Interactive Mockup Platform Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:block lg:col-span-5 relative"
        >
          {/* Glassmorphism Ambient Glow Backing */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/5 via-emerald-500/10 to-transparent rounded-2xl blur-xl opacity-80 -z-10 animate-pulse" />

         


          

          {/* Dashboard Preview Browser Chrome Frame */}
          <div className="w-full bg-white/80 backdrop-blur-md border border-border/60 rounded-lg shadow-lg overflow-hidden relative">
            
            {/* Header bar */}
            <div className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-400 rounded-full" />
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-ink-faint uppercase tracking-widest bg-white border border-border/40 px-3 py-1 rounded-full">
                <Shield className="w-3 h-3 text-primary" />
                <span>medifind.io/search</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: "3s" }} />
            </div>

            {/* Simulated app interface */}
            <div className="p-5 space-y-4 min-h-[360px] relative overflow-hidden">
              
              {/* Active Scanner Line overlay for Matching state */}
              {simulatedState === "matching" && (
                <div className="absolute inset-x-0 h-0.5 bg-primary/40 shadow-[0_0_8px_var(--color-primary)] animate-scan-loop pointer-events-none z-10" />
              )}

              {/* Query input simulation box */}
              <div className="flex items-center gap-2.5 border border-border bg-white px-3.5 py-3 rounded-md shadow-sm">
                <Search className="w-4 h-4 text-primary shrink-0 animate-pulse" />
                <div className="text-xs font-bold text-ink flex items-center">
                  <span>{displayText}</span>
                  {simulatedState === "typing" && (
                    <span className="w-1.5 h-3.5 ml-0.5 bg-primary animate-pulse inline-block" />
                  )}
                </div>
                {simulatedState !== "typing" && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[10px] bg-primary-subtle text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold ml-auto uppercase"
                  >
                    Generic
                  </motion.span>
                )}
              </div>

              {/* Real-time search status indicator */}
              <div className="flex justify-between items-center text-[10px] font-extrabold text-ink-muted uppercase tracking-wider">
                <span>Real-Time Offers Found (5KM)</span>
                <span className="flex items-center gap-1 font-extrabold text-primary">
                  {simulatedState === "typing" && "Waiting for input..."}
                  {simulatedState === "matching" && (
                    <>
                      <Clock className="w-3 h-3 animate-spin" /> Querying Network...
                    </>
                  )}
                  {simulatedState === "results" && "3 Stores Verified"}
                </span>
              </div>

              {/* Content logic states */}
              {simulatedState === "typing" && <SkeletonLoader />}
              {simulatedState === "matching" && <SkeletonLoader />}
              
              {simulatedState === "results" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                  className="space-y-3"
                >
                  {/* Offer 1: Apollo */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-2 border-primary/30 shadow-[0_0_12px_rgba(10,77,51,0.05)] rounded-md p-3.5 space-y-2 hover:border-primary transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-bl">
                      Cheapest
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-ink">Apollo Pharmacy Network</h4>
                        <p className="text-[10px] text-ink-faint font-semibold mt-0.5">0.8 km away • Open 24/7</p>
                      </div>
                      <span className="text-xs font-black text-primary">$4.50</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/30">
                      <span className="text-[9px] bg-primary-subtle text-primary px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">In Stock</span>
                      <span className="text-[10px] text-primary font-bold hover:underline cursor-pointer flex items-center gap-1 group">
                        Select <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </motion.div>

                  {/* Offer 2: City Care */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-border rounded-md p-3.5 space-y-2 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-ink">City Care Clinics</h4>
                        <p className="text-[10px] text-ink-faint font-semibold mt-0.5">1.4 km away • Closes 9 PM</p>
                      </div>
                      <span className="text-xs font-bold text-ink">$5.20</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/30">
                      <span className="text-[9px] bg-primary-subtle text-primary px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">In Stock</span>
                      <span className="text-[10px] text-primary font-bold hover:underline cursor-pointer flex items-center gap-1 group">
                        Select <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </motion.div>

                  {/* Offer 3: Green Cross */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-border rounded-md p-3.5 space-y-2 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-ink">Green Cross Pharma</h4>
                        <p className="text-[10px] text-ink-faint font-semibold mt-0.5">2.1 km away • Delivery Available</p>
                      </div>
                      <span className="text-xs font-bold text-ink">$4.10</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border/30">
                      <span className="text-[9px] bg-warning/10 text-warning px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">Low Stock</span>
                      <span className="text-[10px] text-primary font-bold hover:underline cursor-pointer flex items-center gap-1 group">
                        Select <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

            </div>
          </div>

        
        </motion.div>
        
      </div>

      {/* Interactive Map Picker Modal */}
      <LocationModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onSelectLocation={handleSelectLocation}
        initialCoords={coords}
        initialAddress={location}
      />
    </main>
  );
};
