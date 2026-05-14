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
import { getImageUrl } from "@/app/utils/imageUrl";

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <NavbarPage />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <button 
              onClick={() => router.push('/consultation')}
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-semibold text-sm transition-all mb-4"
          >
              <FiArrowLeft /> Back to Specialties
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                {specialization}s
              </h1>
              <p className="text-slate-500 text-sm">
                Showing {filteredDoctors.length} verified professionals available for consultation.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by doctor name..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Specialists List */}
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredDoctors.map((doc, idx) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-5">
                      <div className="relative shrink-0">
                        <img 
                          src={doc.profileImage ? getImageUrl(doc.profileImage) : null} 
                          alt={doc.fullName}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-50"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                          <FiCheckCircle className="text-emerald-500 fill-white" size={16} />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Dr. {doc.fullName}
                        </h3>
                        <p className="text-emerald-600 text-sm font-medium">{specialization}</p>
                        
                        <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                          <FiMapPin size={14} className="text-slate-400" />
                          <span className="truncate max-w-[150px]">{doc.address?.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-5">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                        <p className="font-semibold text-slate-700 text-sm">{doc.experienceYears} Years</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consultation Fee</p>
                        <p className="font-bold text-slate-900 text-sm">₹{doc.consultationFee || 500}</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => router.push(`/consultation/doctor/${doc._id}`)}
                    className="w-full bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    View Profile <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-slate-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">No Doctors Found</h3>
            <p className="text-slate-500 text-sm mb-6">We couldn't find any specialists matching your search.</p>
            <button 
                onClick={() => router.push('/consultation')}
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all shadow-sm"
            >
                View All Specialties
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
