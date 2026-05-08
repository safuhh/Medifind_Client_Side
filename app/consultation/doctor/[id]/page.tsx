"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getSingleDoctor } from "@/app/apis/doctor.api";
import NavbarPage from "../../../navbar/page";
import Footer from "../../../footer/page";
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiAward, 
  FiCalendar, 
  FiCheckCircle, 
  FiPhone,
  FiMail,
  FiChevronRight,
  FiActivity
} from "react-icons/fi";
import { getImageUrl } from "@/app/utils/imageUrl";
import BookingSection from "../../../components/BookingSection";

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await getSingleDoctor(id as string);
        setDoctor(res.data.doctor);
      } catch (err) {
        console.error("Error fetching doctor:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 font-sans">
        <div className="w-8 h-8 border-2 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Profile</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <h1 className="text-2xl font-black mb-2 tracking-tight">Expert Not Found</h1>
        <p className="text-slate-400 text-sm mb-8 font-medium">The profile you are looking for does not exist.</p>
        <button 
          onClick={() => router.back()}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <NavbarPage />

      <main className="max-w-5xl mx-auto px-6 pt-16 pb-32">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-[0.2em] transition-all mb-16 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start mb-24">
            <div className="md:col-span-4 lg:col-span-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                    <img 
                    src={getImageUrl(doctor.profileImage)} 
                    alt={doctor.fullName}
                    className="w-full aspect-[4/5] object-cover rounded-[2rem] bg-slate-50 border border-slate-100 shadow-xl shadow-slate-200/50"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-emerald-600 text-white p-3 rounded-2xl shadow-xl border-4 border-white">
                        <FiCheckCircle size={20} />
                    </div>
                </motion.div>
            </div>

            <div className="md:col-span-8 lg:col-span-9 space-y-8">
                <div>
                    <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4 bg-emerald-50 px-3 py-1 rounded-full">
                        {doctor.specialization}
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
                        {doctor.fullName}.
                    </h1>
                    <div className="flex items-center gap-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest pt-2">
                        <div className="flex items-center gap-2">
                            <FiMapPin className="text-emerald-600" /> {doctor.address?.split(',')[0]}
                        </div>
                        <div className="flex items-center gap-2">
                            <FiAward className="text-emerald-600" /> {doctor.experienceYears} Years Experience
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 border border-slate-50 rounded-2xl bg-slate-50/30">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration</p>
                        <p className="font-bold text-slate-900">{doctor.registrationNumber}</p>
                    </div>
                    <div className="p-6 border border-slate-50 rounded-2xl bg-slate-50/30">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Medical Council</p>
                        <p className="font-bold text-slate-900">{doctor.medicalCouncil}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Details & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-slate-50 pt-24">
            {/* Left: About */}
            <div className="lg:col-span-7 space-y-12">
                <section className="space-y-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        <FiActivity className="text-emerald-600" /> Professional Summary
                    </h3>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                        Dr. {doctor.fullName} is a highly accomplished {doctor.specialization} with a deep commitment to patient care. 
                        Holding a {doctor.qualification?.degree} from {doctor.qualification?.collegeName}, 
                        they have spent over {doctor.experienceYears} years refining their medical expertise.
                    </p>
                </section>

                <section className="grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Connect</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium hover:text-emerald-600 transition-colors">
                                <FiPhone /> {doctor.phone}
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium hover:text-emerald-600 transition-colors">
                                <FiMail /> {doctor.email}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Consultation</h4>
                        <div className="flex items-center gap-3 text-emerald-600 text-xl font-black">
                            ₹{doctor.consultationFee || 0}
                        </div>
                    </div>
                </section>
                <div className="pt-10">
                    <BookingSection doctorId={id as string} />
                </div>
            </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
