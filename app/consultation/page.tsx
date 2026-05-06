"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavbarPage from "../navbar/page";
import {
  FiChevronRight,
  FiSearch,
  FiArrowLeft,
  FiActivity,
  FiHeart,
  FiZap,
  FiPlusCircle,
  FiShield,
  FiLock,
  FiUserCheck
} from "react-icons/fi";
import Footer from "../footer/page";
import { useRouter } from "next/navigation";

const SPECIALTIES = [
  { name: "General Physician", icon: <FiActivity /> },
  { name: "Cardiologist", icon: <FiHeart /> },
  { name: "Dermatologist", icon: <FiZap /> },
  { name: "Neurologist", icon: <FiPlusCircle /> },
  { name: "Orthopedic Surgeon", icon: <FiActivity /> },
  { name: "Pediatrician", icon: <FiHeart /> },
  { name: "Gynecologist", icon: <FiZap /> },
  { name: "Psychiatrist", icon: <FiPlusCircle /> },
  { name: "Oncologist", icon: <FiActivity /> },
  { name: "Endocrinologist", icon: <FiHeart /> },
  { name: "Gastroenterologist", icon: <FiZap /> },
];

export default function ConsultationPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectSpecialty = (name: string) => {
    router.push(`/consultation/doctors?specialization=${encodeURIComponent(name)}`);
  };

  const filteredSpecialties = SPECIALTIES.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <NavbarPage />

      <main className="max-w-5xl mx-auto px-6 pt-20 pb-32">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
          <div className="max-w-md">
            <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-6"
            >
                <FiArrowLeft /> Back to Home
            </button>
            <h1 className="text-5xl font-black text-slate-900 leading-tight">
              Medical <br /> <span className="text-emerald-600">Specialists.</span>
            </h1>
          </div>

          <div className="w-full md:w-96 relative">
             <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Filter specialty..."
               className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-3xl shadow-xl shadow-slate-200/50 outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 transition-all focus:ring-2 ring-emerald-100"
             />
          </div>
        </div>

        {/* Small Elegant Grid */}
        <section className="mb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSpecialties.map((specialty, idx) => (
                <motion.button
                  key={specialty.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => handleSelectSpecialty(specialty.name)}
                  className="group flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 border border-transparent hover:border-emerald-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                        {React.cloneElement(specialty.icon as React.ReactElement, { size: 20 })}
                    </div>
                    <span className="font-black text-sm text-slate-800 tracking-tight">{specialty.name}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-transparent transition-all duration-500">
                    <FiChevronRight />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Professional Trust Footer */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 px-12 bg-white rounded-[3rem] shadow-sm border border-slate-50">
            {[
                { title: "HIPAA Compliant", icon: <FiShield />, desc: "Regulatory privacy" },
                { title: "End-to-End Secure", icon: <FiLock />, desc: "Encrypted data" },
                { title: "Verified Experts", icon: <FiUserCheck />, desc: "Manual checks" }
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
                        {item.icon}
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-black text-xs text-slate-900 uppercase tracking-widest">{item.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
                    </div>
                </div>
            ))}
        </section>

      </main>

      <Footer />
    </div>
  );
}