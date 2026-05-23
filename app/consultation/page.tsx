"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  FiUserCheck,
  FiAlertCircle,
  FiStar,
  FiMapPin,
  FiCalendar
} from "react-icons/fi";
import Footer from "../footer/page";
import { useRouter } from "next/navigation";
import api from "../apis/api";
import { getNearbyDoctors } from "@/app/apis/doctor.api";
import { getImageUrl } from "@/app/utils/imageUrl";

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
  const { user, accessToken } = useSelector((state: any) => state.auth);
  
  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken, router]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [nearbyDoctors, setNearbyDoctors] = useState<any[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  useEffect(() => {
    const checkConsent = async () => {
      try {
        const res = await api.get("/auth/current");
        if (res.data.user?.hasAgreedToConsultationTerms) {
          setShowModal(false);
          setHasConsented(true);
        } else {
          setShowModal(true);
        }
      } catch (err) {
        console.error("Failed to check consent", err);
        setShowModal(true);
      }
    };
    if (accessToken) {
      checkConsent();
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !hasConsented) return;

    const fetchNearby = async (lat?: number, lng?: number) => {
      try {
        setNearbyLoading(true);
        const res = await getNearbyDoctors(lat, lng);
        if (res.data.success) {
          setNearbyDoctors(res.data.doctors || []);
        }
      } catch (err) {
        console.error("Error fetching nearby doctors:", err);
      } finally {
        setNearbyLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchNearby(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          fetchNearby();
        },
        { timeout: 5000 }
      );
    } else {
      fetchNearby();
    }
  }, [accessToken, hasConsented]);

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
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              First-level consultation platform
            </div>
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

        {/* Consent Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-slate-100 space-y-6"
              >
                <div className="bg-orange-50 text-orange-600 p-3 rounded-full inline-block">
                  <FiAlertCircle size={32} />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900">Important Notice</h2>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    First-level consultation platform
                  </div>
                </div>
                
                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  This platform is designed <strong>only for first-level consultations</strong> and general medical advice. It is suitable for non-emergency conditions, wellness checks, follow-ups, and preliminary health guidance.
                </p>
                
                <div className="text-slate-600 text-sm font-medium space-y-2">
                  <p className="font-bold text-slate-700">What we provide:</p>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-slate-500">
                    <li>Initial assessments and general guidance.</li>
                    <li>Advice on minor ailments and lifestyle wellness.</li>
                    <li>Referrals to specialists if further care is needed.</li>
                  </ul>
                </div>

                <div className="text-slate-600 text-sm font-medium space-y-2">
                  <p className="font-bold text-slate-700">What we do NOT provide:</p>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-slate-500">
                    <li>Emergency medical care for life-threatening situations.</li>
                    <li>Prescriptions for controlled substances.</li>
                    <li>Intensive care or complex surgical procedures.</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                  <p className="text-orange-700 text-xs font-semibold leading-relaxed">
                    <strong>EMERGENCY NOTICE:</strong> In case of a major medical emergency, severe injury, or life-threatening condition, please visit the nearest hospital or contact emergency services immediately.
                  </p>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <input 
                    type="checkbox" 
                    id="agree" 
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="w-5 h-5 accent-emerald-600 rounded"
                  />
                  <label htmlFor="agree" className="text-sm font-semibold text-slate-700 cursor-pointer">
                    I understand and agree to these terms.
                  </label>
                </div>
                
                <button 
                  onClick={async () => {
                    if (isAgreed) {
                      try {
                        await api.put("/auth/consent");
                        setShowModal(false);
                        setHasConsented(true);
                      } catch (err) {
                        console.error("Failed to save consent", err);
                      }
                    }
                  }}
                  disabled={!isAgreed}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                    isAgreed 
                      ? "bg-slate-900 text-white hover:bg-emerald-600" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Continue to Consultation
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Small Elegant Grid */}
        {hasConsented && (
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
                            {React.cloneElement(specialty.icon as any, { size: 20 })}
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
        )}

        {/* Recommended Nearby Doctors Section */}
        {hasConsented && (
          <section className="mb-24">
            <div className="flex flex-col mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <FiMapPin className="text-emerald-600" /> Recommended Nearby Doctors
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Find available medical practitioners closest to your current location.
              </p>
            </div>

            {nearbyLoading ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
              </div>
            ) : nearbyDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyDoctors.slice(0, 6).map((doc, idx) => (
                  <motion.div
                    key={doc._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all p-6 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start gap-4 mb-5">
                        <div className="relative shrink-0">
                          <img
                            src={doc.profileImage ? getImageUrl(doc.profileImage) : undefined}
                            alt={doc.fullName}
                            className="w-16 h-16 rounded-2xl object-cover bg-slate-50 border border-slate-100 shadow-sm"
                          />
                          {doc.isAvailable && (
                            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                              <span className="flex h-3.5 w-3.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {doc.specialization}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors mt-1.5 truncate">
                            Dr. {doc.fullName}
                          </h3>
                          
                          {/* Rating & Distance */}
                          <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-slate-500">
                            <div className="flex items-center gap-1">
                              <FiStar className="text-amber-500 fill-amber-500" size={13} />
                              <span className="text-slate-800">{doc.rating ? doc.rating.toFixed(1) : "0.0"}</span>
                              <span className="text-slate-400 font-medium">({doc.ratingCount || 0})</span>
                            </div>
                            {doc.distance !== null && (
                              <div className="flex items-center gap-1">
                                <FiMapPin className="text-slate-400" size={13} />
                                <span>{doc.distance} km away</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-5 text-xs font-semibold text-slate-600">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Experience</p>
                          <p className="text-slate-800">{doc.experienceYears} Years</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Consultation Fee</p>
                          <p className="text-slate-900 font-bold">₹{doc.consultationFee}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/consultation/doctor/${doc._id}`)}
                      className="w-full bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      Book Consultation <FiChevronRight />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <FiMapPin className="text-slate-300 mx-auto mb-3" size={32} />
                <h4 className="text-base font-bold text-slate-800">No Doctors Nearby</h4>
                <p className="text-slate-400 text-xs mt-1">We couldn't find any medical practitioners in your proximity right now.</p>
              </div>
            )}
          </section>
        )}

        {/* Detailed Info Section */}
        {hasConsented && (
          <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 text-orange-600 p-2 rounded-full">
                <FiAlertCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Platform Scope & Usage</h2>
            </div>

            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              This platform is designed <strong>only for first-level consultations</strong> and general medical advice. It is suitable for non-emergency conditions, wellness checks, follow-ups, and preliminary health guidance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-slate-600 text-sm font-medium space-y-2">
                <p className="font-bold text-slate-700">What we provide:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-500">
                  <li>Initial assessments and general guidance.</li>
                  <li>Advice on minor ailments and lifestyle wellness.</li>
                  <li>Referrals to specialists if further care is needed.</li>
                </ul>
              </div>

              <div className="text-slate-600 text-sm font-medium space-y-2">
                <p className="font-bold text-slate-700">What we do NOT provide:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-500">
                  <li>Emergency medical care for life-threatening situations.</li>
                  <li>Prescriptions for controlled substances.</li>
                  <li>Intensive care or complex surgical procedures.</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
              <p className="text-orange-700 text-xs font-semibold leading-relaxed">
                <strong>EMERGENCY NOTICE:</strong> In case of a major medical emergency, severe injury, or life-threatening condition, please visit the nearest hospital or contact emergency services immediately.
              </p>
            </div>
          </section>
        )}

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