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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <NavbarPage />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-semibold text-sm transition-all mb-8 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to List
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-8 space-y-6">
                {/* Hero Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative shrink-0 mx-auto md:mx-0"
                        >
                            <img 
                            src={doctor.profileImage ? getImageUrl(doctor.profileImage) : undefined} 
                            alt={doctor.fullName}
                            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-2xl bg-slate-50"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                                <FiCheckCircle size={18} />
                            </div>
                        </motion.div>

                        <div className="flex-1 text-center md:text-left">
                            <span className="inline-block text-xs font-semibold text-emerald-600 mb-2 bg-emerald-50 px-3 py-1 rounded-full">
                                {doctor.specialization}
                            </span>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Dr. {doctor.fullName}
                            </h1>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-500 text-sm font-medium mb-4">
                                <div className="flex items-center gap-1.5">
                                    <FiMapPin className="text-slate-400" /> {doctor.address?.split(',')[0]}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FiAward className="text-slate-400" /> {doctor.experienceYears} Years Experience
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Registration</p>
                                    <p className="font-semibold text-slate-700 text-xs">{doctor.registrationNumber}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Medical Council</p>
                                    <p className="font-semibold text-slate-700 text-xs">{doctor.medicalCouncil}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About & Summary */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FiActivity className="text-emerald-600" /> Professional Summary
                        </h3>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            Dr. {doctor.fullName} is a highly accomplished {doctor.specialization} with a deep commitment to patient care. 
                            Holding a {doctor.qualification?.degree} from {doctor.qualification?.collegeName}, 
                            they have spent over {doctor.experienceYears} years refining their medical expertise.
                        </p>
                    </section>
                </div>

                {/* Services & Expertise */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FiActivity className="text-emerald-600" /> Services & Expertise
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                General Consultation
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                Diagnostic Reviews
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                Treatment Planning
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                Follow-up Care
                            </div>
                        </div>
                    </section>
                </div>

            
            </div>

            {/* Right Column - Booking & Contact */}
            <div className="lg:col-span-4 space-y-6">
                {/* Consultation Fee & Contact */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="mb-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Consultation Fee</p>
                        <p className="text-3xl font-bold text-slate-900">₹{doctor.consultationFee || 0}</p>
                    </div>

                    <div className="space-y-4 border-t border-slate-50 pt-4">
                        <div className="flex items-center gap-3 text-slate-600 text-sm">
                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                <FiPhone size={14} />
                            </div>
                            <span className="font-medium">{doctor.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 text-sm">
                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                <FiMail size={14} />
                            </div>
                            <span className="font-medium">{doctor.email}</span>
                        </div>
                    </div>
                </div>

                {/* Booking Section */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <FiCalendar className="text-emerald-600" /> Book Appointment
                    </h3>
                    <BookingSection doctorId={id as string} />
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
