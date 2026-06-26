"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Scale, FileText, Navigation, CheckCircle2, MapPin } from "lucide-react";

export const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState<"search" | "compare" | "prescription" | "track">("search");

  const tabs = [
    { id: "search", label: "AI Search", icon: <Search className="w-4 h-4" />, desc: "Instantly translate queries and suggest generic substitutes." },
    { id: "compare", label: "Live Compare", icon: <Scale className="w-4 h-4" />, desc: "Review price, stock, and location side-by-side." },
    { id: "prescription", label: "Prescription Routing", icon: <FileText className="w-4 h-4" />, desc: "Submit Rx files securely to closest verified pharmacies." },
    { id: "track", label: "GPS Tracking", icon: <Navigation className="w-4 h-4" />, desc: "Track courier coordinates live on interactive maps." }
  ] as const;

  const renderMockup = () => {
    switch (activeTab) {
      case "search":
        return (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 border border-border bg-white px-3 py-2.5 rounded-sm">
              <span className="text-xs text-ink-faint font-semibold">Query:</span>
              <span className="text-xs font-bold text-ink italic">Amoxcilin 500</span>
              <span className="text-[10px] bg-red-50 text-danger border border-danger/10 px-1.5 py-0.5 rounded-full font-bold ml-auto">Typo Detected</span>
            </div>

            <div className="bg-primary-subtle border border-primary/20 rounded-md p-3 flex items-center gap-2">
              <span className="text-xs font-bold text-primary">AI Resolved:</span>
              <span className="text-xs font-bold text-ink">Amoxicillin 500mg (Oral Capsule)</span>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Suggested Substitutes</span>
              <div className="bg-white border border-border p-3 rounded-md flex justify-between items-center hover:border-primary/20 transition-all">
                <div>
                  <span className="text-xs font-bold text-ink">Amoxil (Brand Name)</span>
                  <p className="text-[10px] text-ink-faint font-semibold mt-0.5">Average price: $18.50</p>
                </div>
                <span className="text-xs font-bold text-ink-muted">Reference</span>
              </div>
              <div className="bg-white border border-border p-3 rounded-md flex justify-between items-center border-primary/30 bg-primary/5">
                <div>
                  <span className="text-xs font-bold text-ink">Amoxicillin Generic</span>
                  <p className="text-[10px] text-ink-faint font-semibold mt-0.5">Average price: $6.20</p>
                </div>
                <span className="text-xs font-bold text-primary">Save 66%</span>
              </div>
            </div>
          </motion.div>
        );
      case "compare":
        return (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border-2 border-primary/30 bg-primary/5 rounded-md p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-ink">Apollo Pharma</span>
                  <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded-full font-bold uppercase">Best Price</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xl font-bold text-ink">$14.20</span>
                  <p className="text-[10px] text-ink-faint font-semibold">0.8 km • In Stock</p>
                </div>
                <div className="text-[10px] font-semibold text-ink-muted border-t border-border/80 pt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Ready in 15 mins
                </div>
              </div>

              <div className="bg-white border border-border rounded-md p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-ink">City Care Clinics</span>
                  <span className="text-[9px] bg-surface text-ink-faint border border-border px-1.5 py-0.5 rounded-full font-bold uppercase">Standard</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xl font-bold text-ink">$18.90</span>
                  <p className="text-[10px] text-ink-faint font-semibold">1.4 km • In Stock</p>
                </div>
                <div className="text-[10px] font-semibold text-ink-muted border-t border-border/80 pt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Delivery in 1 hour
                </div>
              </div>
            </div>
          </motion.div>
        );
      case "prescription":
        return (
          <motion.div
            key="prescription"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="border border-dashed border-border p-6 rounded-md text-center bg-white flex flex-col items-center justify-center gap-2">
              <FileText className="w-8 h-8 text-primary" />
              <span className="text-xs font-bold text-ink">rx_prescription_final.pdf</span>
              <span className="text-[10px] text-ink-faint font-semibold">2.4 MB • Uploaded successfully</span>
            </div>

            <div className="bg-surface rounded-md p-3.5 border border-border flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-warning rounded-full animate-pulse" />
              <div>
                <span className="text-xs font-bold text-ink">Verifying with Pharmacist</span>
                <p className="text-[10px] text-ink-faint font-semibold mt-0.5">Average verification time: 4 minutes</p>
              </div>
            </div>
          </motion.div>
        );
      case "track":
        return (
          <motion.div
            key="track"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Map representation */}
            <div className="bg-surface border border-border rounded-md h-[160px] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
              
              {/* Route line */}
              <div className="absolute w-[180px] h-[2px] bg-primary/20 rotate-12" />
              <div className="absolute w-[90px] h-[2px] bg-primary rotate-12 -translate-x-[45px] -translate-y-[10px]" />

              {/* Courier position */}
              <div className="absolute flex flex-col items-center translate-x-[5px] -translate-y-[15px]">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md animate-bounce">
                  <Navigation className="w-3.5 h-3.5 text-white rotate-45" />
                </div>
                <span className="text-[9px] bg-ink text-white font-bold px-1.5 py-0.5 rounded-sm mt-1 shadow-sm uppercase tracking-wider">Courier</span>
              </div>

              {/* Pharmacy Node */}
              <div className="absolute left-[30px] top-[40px] flex items-center gap-1">
                <MapPin className="w-4 h-4 text-ink-muted" />
                <span className="text-[8px] font-bold text-ink-muted uppercase">Pharmacy</span>
              </div>

              {/* Patient Node */}
              <div className="absolute right-[30px] bottom-[40px] flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-[8px] font-bold text-primary uppercase">You</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-ink-muted">
              <span>ETA: 12 minutes</span>
              <span className="text-primary font-bold">Status: Out for Delivery</span>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <section className="bg-surface py-20 lg:py-32 border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Description & Tabs */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink tracking-tight">
              Engineered for speed.<br />
              <span className="text-primary">Built for trust.</span>
            </h2>
            <p className="text-ink-muted text-base sm:text-lg font-medium leading-relaxed">
              We design workflows around critical operational outcomes. Verify, comparison match, and fulfill prescriptions through one clean console.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-col gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-start gap-4 p-4 rounded-sm border transition-all text-left group ${
                  activeTab === tab.id
                    ? "bg-white border-primary/20 shadow-sm"
                    : "bg-transparent border-transparent hover:bg-white/50"
                }`}
              >
                <div className={`p-2 rounded-sm shrink-0 transition-colors ${
                  activeTab === tab.id ? "bg-primary-subtle text-primary" : "bg-surface text-ink-muted group-hover:bg-primary-subtle"
                }`}>
                  {tab.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">{tab.label}</h4>
                  <p className="text-xs font-semibold text-ink-muted mt-1 leading-relaxed">{tab.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Platform Simulator Mockup */}
        <div className="lg:col-span-7">
          <div className="w-full bg-white border border-border rounded-lg shadow-lg overflow-hidden max-w-[640px] mx-auto">
            {/* Mock Browser Header */}
            <div className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-border rounded-full" />
                <span className="w-2 h-2 bg-border rounded-full" />
                <span className="w-2 h-2 bg-border rounded-full" />
              </div>
              <span className="text-[10px] font-bold text-ink-faint uppercase tracking-wider">Interface Simulator v1.0.0</span>
              <span className="w-4" />
            </div>

            {/* App Console Mock Content */}
            <div className="p-6 bg-surface min-h-[300px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {renderMockup()}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
