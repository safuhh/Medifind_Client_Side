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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <NavbarPage />

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-32">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="max-w-xl">
            <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-4 hover:text-emerald-700 transition-colors"
            >
                <FiArrowLeft /> Back to Home
            </button>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
              Find the Right <br /> <span className="text-emerald-600 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Medical Specialist</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Select a specialty to find verified doctors available for consultation.</p>
          </div>

          <div className="w-full md:w-96 relative">
             <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search specialties..."
               className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-300 transition-all focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200"
             />
          </div>
        </div>

        {/* Small Elegant Grid */}
        <section className="mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSpecialties.map((specialty, idx) => (
                <motion.div
                  key={specialty.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleSelectSpecialty(specialty.name)}
                >
                  <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors duration-300">
                          {React.cloneElement(specialty.icon as React.ReactElement, { size: 20 })}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 group-hover:text-emerald-600 transition-colors">{specialty.name}</h3>
                        <p className="text-xs text-slate-400 font-medium">Consult online or in-person</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <FiChevronRight size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Professional Trust Footer */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
            {[
                { title: "HIPAA Compliant", icon: <FiShield />, desc: "Highest privacy standards" },
                { title: "End-to-End Secure", icon: <FiLock />, desc: "Fully encrypted consultations" },
                { title: "Verified Experts", icon: <FiUserCheck />, desc: "Every doctor is verified" }
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {item.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                    </div>
                </div>
            ))}
        </section>

      </main>

      <Footer />
    </div>
  );
}