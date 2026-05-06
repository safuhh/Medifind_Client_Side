"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getDoctorsBySpecialization } from "@/app/apis/doctor.api";
import NavbarPage from "../../navbar/page";
import Footer from "../../footer/page";
import { 
  FiArrowLeft, 
  FiStar, 
  FiClock, 
  FiMapPin, 
  FiChevronRight,
  FiSearch,
  FiCheckCircle
} from "react-icons/fi";

export default function DoctorsListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const specialization = searchParams.get("specialization");
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await getDoctorsBySpecialization(specialization || "");
        setDoctors(res.data.doctors || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    if (specialization) fetchDoctors();
  }, [specialization]);

  const filteredDoctors = doctors.filter(doc => 
    doc.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <NavbarPage />

      <main className="max-w-5xl mx-auto px-6 pt-16 pb-32">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 pb-12 border-b border-slate-50">
          <div className="flex-1">
            <button 
                onClick={() => router.push('/consultation')}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-[0.2em] transition-all mb-8"
            >
                <FiArrowLeft /> Back
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              {specialization}s.
            </h1>
            <p className="text-slate-400 font-medium mt-2">
              Showing {filteredDoctors.length} verified professionals available for consultation.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name..."
              className="w-full pl-6 py-2 bg-transparent border-b border-slate-100 focus:border-emerald-600 outline-none transition-all text-xs font-bold uppercase tracking-widest placeholder:text-slate-200"
            />
          </div>
        </div>

        {/* Specialists List */}
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="w-6 h-6 border-2 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="space-y-16">
            <AnimatePresence>
              {filteredDoctors.map((doc, idx) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 pb-16 border-b border-slate-50 last:border-0"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img 
                      src={doc.profileImage?.startsWith('http') ? doc.profileImage : `http://localhost:5000${doc.profileImage}`} 
                      alt={doc.fullName}
                      className="w-24 h-24 rounded-2xl object-cover bg-slate-50 shadow-sm group-hover:shadow-xl transition-all duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {doc.fullName}
                        </h3>
                        <FiCheckCircle className="text-emerald-500" />
                    </div>
                    
                    <div className="flex flex-wrap gap-x-10 gap-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <FiClock className="text-emerald-500" /> {doc.experienceYears} Years Experience
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <FiMapPin className="text-emerald-500" /> {doc.address?.split(',')[0]}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <FiStar className="text-amber-400" /> 4.9 Verified Rating
                        </div>
                    </div>
                  </div>

                  {/* Action */}
                  <button 
                    onClick={() => router.push(`/consultation/doctor/${doc._id}`)}
                    className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] group-hover:text-emerald-600 transition-all"
                  >
                    View Profile <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-40 border-t border-slate-50">
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Results.</h3>
            <p className="text-slate-400 font-medium mb-12">No specialists found matching your search criteria.</p>
            <button 
                onClick={() => router.push('/consultation')}
                className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-b-2 border-slate-900 pb-1"
            >
                Back to Specialties
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
