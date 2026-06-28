"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/redux/hooks";
import { logout } from "@/store/redux/authSlice";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiShield, 
  FiFileText, 
  FiLogOut, 
  FiEdit3, 
  FiActivity, 
  FiClock, 
  FiCheckCircle, 
  FiSearch, 
  FiTrendingUp, 
  FiFolder,
  FiVideo,
  FiChevronRight,
  FiSettings,
  FiPlus,
  FiSave,
  FiX,
  FiStar
} from "react-icons/fi";
import { toast } from "react-toastify";
import NavbarPage from "../navbar/page";
import Footer from "../footer/page";
import api from "@/services/apis/api";
import dayjs from "dayjs";

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  // Interactive States
  const [activeTab, setActiveTab] = useState<"consultations" | "prescriptions" | "lab_reports" | "follow_ups" | "searches">("consultations");
  const [isEditing, setIsEditing] = useState(false);
  
  // Editable fields state (with premium default values if not present on user object)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra, India",
    dob: "14 November 1995",
    emergencyContact: "Rahul Sharma (Spouse) - +91 99887 76655",
  });

  // Fetch patient consultations history dynamically
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  
  // Search History Dynamic States
  const [dbSearches, setDbSearches] = useState<any[]>([]);
  const [loadingDbSearches, setLoadingDbSearches] = useState(true);
  const [dbSearchesTotal, setDbSearchesTotal] = useState(0);
  const [dbSearchesPage, setDbSearchesPage] = useState(1);
  const [dbSearchesFilterCategory, setDbSearchesFilterCategory] = useState("");
  const [dbSearchesFilterStatus, setDbSearchesFilterStatus] = useState("");
  const [dbSearchesFilterFavorite, setDbSearchesFilterFavorite] = useState(false);
  const [dbSearchesQuery, setDbSearchesQuery] = useState("");
  const [dbSearchesSort, setDbSearchesSort] = useState("newest");
  const [selectedSearchItem, setSelectedSearchItem] = useState<any>(null);
  const [rawSearches, setRawSearches] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    if (!user || !user._id) {
      router.push("/login");
    } else {
      setProfileData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user, router]);

  useEffect(() => {
    if (!user || !user._id) return;

    const fetchAppointments = async () => {
      try {
        const res = await api.get("/booking/patient-appointments");
        if (res.data.success) {
          setAppointments(res.data.bookings);
        }
      } catch (err) {
        console.error("Error fetching patient appointments:", err);
      } finally {
        setLoadingAppointments(false);
      }
    };
    fetchAppointments();
  }, [user]);

  const fetchDbSearches = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoadingDbSearches(true);
      const params: any = {
        page: pageNum,
        limit: 6,
        category: dbSearchesFilterCategory,
        status: dbSearchesFilterStatus,
        isFavorite: dbSearchesFilterFavorite ? "true" : "false",
        q: dbSearchesQuery,
        sortBy: dbSearchesSort,
      };

      const res = await api.get("/search-history", { params });
      if (res.data.success) {
        if (append) {
          setDbSearches(prev => [...prev, ...res.data.searchRecords]);
        } else {
          setDbSearches(res.data.searchRecords);
        }
        setDbSearchesTotal(res.data.pagination.total);
        setDbSearchesPage(res.data.pagination.page);
      }
    } catch (err) {
      console.error("Error loading database searches:", err);
    } finally {
      setLoadingDbSearches(false);
    }
  };

  const fetchRawHistory = async () => {
    try {
      const res = await api.get("/search-history", { params: { limit: 100 } });
      if (res.data.success) {
        setRawSearches(res.data.searchRecords);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user || !user._id) return;
    fetchDbSearches(1, false);
    fetchRawHistory();
  }, [user, dbSearchesFilterCategory, dbSearchesFilterStatus, dbSearchesFilterFavorite, dbSearchesQuery, dbSearchesSort]);

  const handleDeleteSearchRecord = async (id: string) => {
    try {
      const res = await api.delete(`/search-history/${id}`);
      if (res.data.success) {
        toast.success("Search entry deleted.");
        setDbSearches(prev => prev.filter(item => item._id !== id));
        setDbSearchesTotal(prev => prev - 1);
        setRawSearches(prev => prev.filter(item => item._id !== id));
        if (selectedSearchItem?._id === id) {
          setSelectedSearchItem(null);
        }
      }
    } catch (err) {
      toast.error("Failed to delete search record.");
    }
  };

  const handleToggleFavoriteSearch = async (id: string) => {
    try {
      const res = await api.put(`/search-history/${id}/favorite`);
      if (res.data.success) {
        const isFav = res.data.isFavorite;
        toast.success(isFav ? "Saved to favorites!" : "Removed from favorites.");
        setDbSearches(prev => prev.map(item => item._id === id ? { ...item, isFavorite: isFav } : item));
        setRawSearches(prev => prev.map(item => item._id === id ? { ...item, isFavorite: isFav } : item));
        if (selectedSearchItem?._id === id) {
          setSelectedSearchItem((prev: any) => ({ ...prev, isFavorite: isFav }));
        }
      }
    } catch (err) {
      toast.error("Failed to toggle favorite status.");
    }
  };

  const getMostSearched = () => {
    const counts: any = {};
    rawSearches.forEach(item => {
      const name = item.medicineName;
      if (!counts[name]) {
        counts[name] = { name, count: 0, category: item.medicineCategory, lastItem: item };
      }
      counts[name].count += 1;
    });
    return Object.values(counts)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 4);
  };
  const mostSearched = getMostSearched();

  if (!isMounted || !user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success("Profile information updated successfully!");
  };

  const handleSignOut = () => {
    dispatch(logout());
    router.push("/");
    toast.info("Logged out from MediFind console.");
  };

  const stats = [
    { label: "Total Consultations", value: loadingAppointments ? "..." : String(appointments.length), icon: <FiVideo className="w-5 h-5 text-emerald-600" />, desc: "Booked sessions" },
    { label: "Completed Sessions", value: loadingAppointments ? "..." : String(appointments.filter(app => app.consultationStatus === "completed").length), icon: <FiFileText className="w-5 h-5 text-teal-600" />, desc: "Health reports issued" },
    { label: "Medicine Searches", value: String(rawSearches.length), icon: <FiSearch className="w-5 h-5 text-emerald-700" />, desc: "Lifetime query logs" },
  ];

  const labReports = [
    { testName: "Complete Blood Count (CBC)", lab: "MediFind Central Laboratory", date: "14 June 2026", result: "Normal range" },
    { testName: "Lipid Profile Panel", lab: "Dr. Lal PathLabs", date: "15 April 2026", result: "Borderline High cholesterol" },
    { testName: "HbA1c Diagnostic Report", lab: "MediFind Central Laboratory", date: "10 January 2026", result: "Normal (5.4%)" },
  ];

  const activities = [
    { title: "Prescription verification released", time: "3 hours ago", icon: <FiFileText className="text-emerald-600" />, details: "Dr. Emily White verified your digital Rx refill request." },
    { title: "Consultation Completed", time: "12 June 2026", icon: <FiVideo className="text-teal-600" />, details: "Attended video consultation with Dr. Emily White." },
    { title: "Fulfillment plan optimized by AI", time: "28 May 2026", icon: <FiActivity className="text-blue-600" />, details: "Split your order across 2 pharmacies for maximum availability." },
    { title: "Profile security verified", time: "01 January 2026", icon: <FiShield className="text-emerald-700" />, details: "Completed standard email verification process." },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <NavbarPage />

      <main className="max-w-7xl mx-auto py-28 px-6 space-y-8 md:py-32">
        
        {/* 1. Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-emerald-950 via-[#0a4d33] to-emerald-900 rounded-3xl p-6 md:p-8 text-white overflow-hidden shadow-lg border border-emerald-800/40"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* User Identity Details */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative">
                <div className="w-24 h-24 bg-white/10 text-white rounded-3xl flex items-center justify-center text-3xl font-black border border-white/20 backdrop-blur-md shadow-lg">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6.5 h-6.5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  <FiCheckCircle size={12} />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-black tracking-tight">{profileData.name}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-400/20 text-emerald-300 rounded-full text-[9px] font-black tracking-wide border border-emerald-400/20 uppercase">
                    Verified Account
                  </span>
                </div>
                <p className="text-emerald-100/70 text-xs font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                  <FiMail className="shrink-0 text-emerald-400" />
                  {profileData.email}
                </p>
                <p className="text-emerald-200/50 text-[10px] font-bold uppercase tracking-wider">
                  Member since Jan 2026
                </p>
              </div>
            </div>

            {/* Profile Completion Circular Metrics */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4.5 backdrop-blur-md max-w-sm self-center lg:self-auto w-full sm:w-auto shadow-inner">
              <div className="relative w-12 h-12 flex items-center justify-center bg-white/10 rounded-full shrink-0">
                <span className="text-xs font-black text-emerald-300">85%</span>
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider">Profile Status</p>
                <p className="text-[10px] text-emerald-200/70 font-semibold leading-relaxed mt-0.5">
                  Complete emergency details and recovery goals to reach 100%.
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap justify-center items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white hover:bg-emerald-50 text-[#0a4d33] px-5 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/20 cursor-pointer"
              >
                <FiEdit3 size={13} /> {isEditing ? "View Details" : "Edit Profile"}
              </button>
              
              <button
                onClick={handleSignOut}
                className="bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 border border-white/10 backdrop-blur-md cursor-pointer"
              >
                <FiLogOut size={13} /> Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        {/* 2. Statistical Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:border-emerald-100 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 transition-colors">
                {stat.icon}
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                <span className="text-xl font-black text-slate-800 tracking-tight block mt-0.5">{stat.value}</span>
                <span className="text-[9px] text-slate-400 font-semibold leading-none">{stat.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. Main Dashboard Body columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Personal Information & Quick Actions */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Personal Details Form/Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-emerald-100 transition-all duration-300">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 bg-emerald-50 text-[#0a4d33] rounded-xl flex items-center justify-center">
                  <FiUser size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase leading-none">Personal details</h3>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Medical Record info</span>
                </div>
              </div>

              {!isEditing ? (
                // Read-only Details
                <div className="space-y-4 text-xs font-semibold text-slate-500">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Primary Full Name</label>
                    <p className="text-slate-800 font-bold text-sm">{profileData.name}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Registered Email</label>
                    <p className="text-slate-800 font-bold text-sm truncate">{profileData.email}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Phone Number</label>
                    <p className="text-slate-800 font-bold text-sm">{profileData.phone}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">General Residence</label>
                    <p className="text-slate-800 font-bold text-sm">{profileData.location}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Date of Birth</label>
                    <p className="text-slate-800 font-bold text-sm">{profileData.dob}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Emergency Contact Details</label>
                    <p className="text-slate-800 font-bold text-xs leading-relaxed">{profileData.emergencyContact}</p>
                  </div>
                </div>
              ) : (
                // Editable Form
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full border border-slate-200 focus:border-[#0a4d33] rounded-xl p-2.5 text-xs outline-none font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Email (Read Only)</label>
                    <input
                      type="email"
                      disabled
                      value={profileData.email}
                      className="w-full border border-slate-100 bg-slate-50 text-slate-400 rounded-xl p-2.5 text-xs outline-none cursor-not-allowed font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Phone Number</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full border border-slate-200 focus:border-[#0a4d33] rounded-xl p-2.5 text-xs outline-none font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">General Residence</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full border border-slate-200 focus:border-[#0a4d33] rounded-xl p-2.5 text-xs outline-none font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Date of Birth</label>
                    <input
                      type="text"
                      value={profileData.dob}
                      onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                      className="w-full border border-slate-200 focus:border-[#0a4d33] rounded-xl p-2.5 text-xs outline-none font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Emergency Contact</label>
                    <input
                      type="text"
                      value={profileData.emergencyContact}
                      onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                      className="w-full border border-slate-200 focus:border-[#0a4d33] rounded-xl p-2.5 text-xs outline-none font-semibold text-slate-800"
                    />
                  </div>

                  <div className="flex gap-2 pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2.5 border border-slate-200 text-slate-500 rounded-xl font-bold uppercase hover:bg-slate-50 tracking-wider text-[10px] cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#0a4d33] text-white rounded-xl font-black uppercase hover:bg-[#083d28] tracking-wider text-[10px] flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <FiSave /> Save
                    </button>
                  </div>
                </form>
              )}
            </div></div>

          {/* Right Column: Medical Records & Recent Activities */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Medical Records Tab Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-emerald-100 transition-all duration-300">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-emerald-50 text-[#0a4d33] rounded-xl flex items-center justify-center">
                    <FiFolder size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase leading-none">Medical history records</h3>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Manage verified records</span>
                  </div>
                </div>

                {/* Tab selector buttons */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl p-1 text-[10px] font-black uppercase tracking-wider">
                  <button
                    onClick={() => setActiveTab("consultations")}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${activeTab === "consultations" ? "bg-white text-[#0a4d33] shadow-sm font-black" : "text-slate-500 hover:text-slate-950 font-bold"}`}
                  >
                    Consults
                  </button>
                  <button
                    onClick={() => setActiveTab("prescriptions")}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${activeTab === "prescriptions" ? "bg-white text-[#0a4d33] shadow-sm font-black" : "text-slate-500 hover:text-slate-950 font-bold"}`}
                  >
                    Rx List
                  </button>
                  <button
                    onClick={() => setActiveTab("lab_reports")}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${activeTab === "lab_reports" ? "bg-white text-[#0a4d33] shadow-sm font-black" : "text-slate-500 hover:text-slate-950 font-bold"}`}
                  >
                    Lab Reports
                  </button>
                  <button
                    onClick={() => setActiveTab("follow_ups")}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${activeTab === "follow_ups" ? "bg-white text-[#0a4d33] shadow-sm font-black" : "text-slate-500 hover:text-slate-950 font-bold"}`}
                  >
                    Follow-ups
                  </button>
                  <button
                    onClick={() => setActiveTab("searches")}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${activeTab === "searches" ? "bg-white text-[#0a4d33] shadow-sm font-black" : "text-slate-500 hover:text-slate-950 font-bold"}`}
                  >
                    Searches
                  </button>
                </div>
              </div>

              {/* Tab Display Window */}
              <div className="min-h-56">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "consultations" && (
                      <div className="space-y-8">
                        {loadingAppointments ? (
                          <div className="space-y-3 py-4">
                            <div className="h-32 bg-slate-100 rounded-3xl animate-pulse w-full" />
                            <div className="h-32 bg-slate-100 rounded-3xl animate-pulse w-full" />
                          </div>
                        ) : appointments.length > 0 ? (
                          <>
                            {/* Upcoming Consultations */}
                            <div>
                              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Upcoming Consultations
                              </h3>
                              <div className="space-y-4">
                                {appointments.filter(item => {
                                  const appStatus = item.consultationStatus || item.status || "confirmed";
                                  return appStatus !== 'completed' && appStatus !== 'cancelled';
                                }).length > 0 ? appointments.filter(item => {
                                  const appStatus = item.consultationStatus || item.status || "confirmed";
                                  return appStatus !== 'completed' && appStatus !== 'cancelled';
                                }).map((item, idx) => {
                                  const appStatus = item.consultationStatus || item.status || "confirmed";
                                  return (
                                    <div key={idx} className={`bg-white border ${idx === 0 ? 'border-emerald-300 ring-4 ring-emerald-50' : 'border-slate-200'} shadow-sm rounded-3xl p-5 hover:border-emerald-200 transition-all space-y-4 relative`}>
                                      {idx === 0 && (
                                        <div className="absolute -top-3 -right-3 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
                                          <FiStar size={10} /> Next Appointment
                                        </div>
                                      )}
                                      {/* Header Info */}
                                      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                                        <div className="flex gap-4 items-center">
                                          <img src={item.doctorId?.profileImage || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} alt="Doctor" className="w-12 h-12 rounded-full border-2 border-emerald-50 object-cover" />
                                          <div>
                                            <p className="font-extrabold text-slate-900 text-sm sm:text-base">Dr. {item.doctorId?.fullName || "Physician"}</p>
                                            <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">{item.doctorId?.specialization || "General Medicine"}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">Patient: <span className="font-bold text-slate-700">{item.familyMemberId ? `${item.familyMemberId.name} (${item.familyMemberId.relationship})` : "Self"}</span></p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className={`inline-flex items-center gap-1.5 text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-wider ${
                                            appStatus === 'active' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                            'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                          }`}>
                                            {appStatus}
                                          </span>
                                          <p className="text-[10px] text-slate-400 font-bold mt-2">ID: {item._id?.substring(0,8).toUpperCase()}</p>
                                        </div>
                                      </div>

                                      {/* Time & Details */}
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-2xl p-4">
                                        <div>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Date</p>
                                          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><FiCalendar className="text-emerald-500"/> {dayjs(item.date).format("DD MMM YYYY")}</p>
                                        </div>
                                        <div>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Time</p>
                                          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><FiClock className="text-emerald-500"/> {item.timeSlot}</p>
                                        </div>
                                        <div>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Type</p>
                                          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5"><FiVideo className="text-emerald-500"/> {item.consultationType || "Video Call"}</p>
                                        </div>
                                        <div>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Booked On</p>
                                          <p className="text-xs font-bold text-slate-800">{dayjs(item.createdAt).format("DD MMM YYYY")}</p>
                                        </div>
                                      </div>

                                      {/* Video Call Section */}
                                      {(appStatus === 'scheduled' || appStatus === 'active') && item.roomId && (
                                        <div className="bg-gradient-to-r from-emerald-900 to-[#0a4d33] rounded-2xl p-4 text-white flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden">
                                          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                                          <div className="z-10 w-full">
                                            <div className="flex items-center gap-2 mb-1">
                                              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                              <p className="text-xs font-bold tracking-wider uppercase text-emerald-300">Live Video Consultation</p>
                                            </div>
                                            <p className="text-sm font-medium text-emerald-50">Meeting ID: <span className="font-mono tracking-wider bg-black/20 px-2 py-0.5 rounded ml-1">{item.roomId}</span></p>
                                          </div>
                                          
                                          <div className="z-10 w-full sm:w-auto shrink-0">
                                            {(() => {
                                              let isJoinable = false;
                                              let minutesDiff = 999;
                                              
                                              // Use precise _sortTimestamp from backend if available, else fallback
                                              const timestamp = item._sortTimestamp || (item.scheduledAt ? new Date(item.scheduledAt).getTime() : dayjs(`${dayjs(item.date).format("YYYY-MM-DD")} ${item.timeSlot}`, "YYYY-MM-DD hh:mm A").valueOf());
                                              
                                              const scheduledTime = dayjs(timestamp);
                                              const now = dayjs();
                                              minutesDiff = scheduledTime.diff(now, 'minute');
                                              isJoinable = minutesDiff <= 15 && minutesDiff >= -60;

                                              let timeString = '';
                                              if (minutesDiff > 60 * 24) {
                                                timeString = scheduledTime.format("MMM D [at] h:mm A");
                                              } else if (minutesDiff > 60) {
                                                timeString = `in ${Math.floor(minutesDiff/60)} hrs`;
                                              } else if (minutesDiff > 0) {
                                                timeString = `in ${minutesDiff} mins`;
                                              } else {
                                                timeString = 'soon';
                                              }

                                              return isJoinable ? (
                                                <button onClick={() => router.push(`/consultation/${item.roomId}`)} className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-emerald-50 px-6 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                                                  <FiVideo size={14} /> Join Consultation
                                                </button>
                                              ) : (
                                                <button disabled className="w-full sm:w-auto bg-emerald-800/50 text-emerald-200/50 px-6 py-2.5 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2">
                                                  <FiVideo size={14} /> Starts {timeString}
                                                </button>
                                              );
                                            })()}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* Quick Actions */}
                                      <div className="flex flex-wrap items-center gap-2 pt-2">
                                        <button onClick={() => router.push(`/doctor/${item.doctorId?._id}`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer">
                                          <FiCalendar size={12} /> Book Follow-up
                                        </button>
                                      </div>
                                    </div>
                                  );
                                }) : (
                                  <div className="text-center py-6 text-slate-400 font-medium text-sm bg-slate-50/50 rounded-2xl border border-slate-100/50 border-dashed">
                                    No upcoming appointments.
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Consultation History */}
                            <div className="pt-6">
                              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FiFolder className="text-slate-400" />
                                Consultation History
                              </h3>
                              <div className="space-y-4">
                                {appointments.filter(item => {
                                  const appStatus = item.consultationStatus || item.status || "confirmed";
                                  return appStatus === 'completed' || appStatus === 'cancelled';
                                }).length > 0 ? appointments.filter(item => {
                                  const appStatus = item.consultationStatus || item.status || "confirmed";
                                  return appStatus === 'completed' || appStatus === 'cancelled';
                                }).map((item, idx) => {
                                  const appStatus = item.consultationStatus || item.status || "confirmed";
                                  return (
                                    <div key={idx} className="bg-slate-50 border border-slate-100 rounded-3xl p-5 hover:border-slate-300 transition-all space-y-4 opacity-90">
                                      {/* Header Info */}
                                      <div className="flex justify-between items-start border-b border-slate-200/60 pb-4">
                                        <div className="flex gap-4 items-center">
                                          <img src={item.doctorId?.profileImage || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} alt="Doctor" className="w-10 h-10 rounded-full border-2 border-white object-cover grayscale-[0.2]" />
                                          <div>
                                            <p className="font-bold text-slate-700 text-sm">Dr. {item.doctorId?.fullName || "Physician"}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.doctorId?.specialization || "General Medicine"}</p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className={`inline-flex items-center gap-1.5 text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-wider ${
                                            appStatus === 'completed' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                                            'bg-red-50 text-red-700 border border-red-100'
                                          }`}>
                                            {appStatus}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Time & Details */}
                                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
                                        <div className="flex items-center gap-1.5"><FiCalendar /> {dayjs(item.date).format("DD MMM YYYY")}</div>
                                        <div className="flex items-center gap-1.5"><FiClock /> {item.timeSlot}</div>
                                        <div className="flex items-center gap-1.5"><FiUser /> {item.familyMemberId ? `${item.familyMemberId.name}` : "Self"}</div>
                                      </div>

                                      {/* Quick Actions */}
                                      <div className="flex flex-wrap items-center gap-2 pt-2">
                                        {item.healthReportId && (
                                          <>
                                            <button onClick={() => router.push(`/health-report/${item.healthReportId}`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer">
                                              <FiFileText size={12} /> View Health Report
                                            </button>
                                            <button onClick={() => router.push(`/health-report/${item.healthReportId}`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer">
                                              <FiActivity size={12} /> Start Fulfillment
                                            </button>
                                          </>
                                        )}
                                        <button onClick={() => router.push(`/doctor/${item.doctorId?._id}`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer">
                                          <FiCalendar size={12} /> Book Follow-up
                                        </button>
                                      </div>
                                    </div>
                                  );
                                }) : (
                                  <div className="text-center py-6 text-slate-400 font-medium text-sm bg-slate-50/50 rounded-2xl border border-slate-100/50 border-dashed">
                                    No past consultations.
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-10 text-slate-400 font-semibold text-xs bg-slate-50/50 rounded-2xl border border-slate-100/50 border-dashed">
                            No consultation sessions recorded.
                          </div>
                        )}
                      </div>
                    )}
                    {activeTab === "prescriptions" && (
                      <div className="space-y-3.5">
                        {loadingAppointments ? (
                          <div className="space-y-2 py-4">
                            <div className="h-10 bg-slate-100 rounded-xl animate-pulse w-full" />
                          </div>
                        ) : appointments.filter(app => app.consultationStatus === "completed").length > 0 ? (
                          appointments.filter(app => app.consultationStatus === "completed").map((item, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 flex justify-between items-center hover:border-emerald-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-teal-600">
                                  <FiFileText size={16} />
                                </div>
                                <div>
                                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                                    Prescription from Dr. {item.doctorId?.fullName || "Physician"}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-semibold">
                                    Reference ID: RX-{item._id?.substring(0, 6).toUpperCase()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-black text-slate-800">
                                  {dayjs(item.date).format("DD MMM YYYY")}
                                </p>
                                <button
                                  onClick={() => router.push(`/health-report/${item._id}`)}
                                  className="text-[9px] bg-white border border-slate-200 hover:bg-slate-150 px-2.5 py-1.5 rounded-lg font-black uppercase tracking-wider mt-1 transition-colors cursor-pointer text-slate-700 hover:text-emerald-800"
                                >
                                  Open Prescription
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 text-slate-400 font-semibold text-xs bg-slate-50/50 rounded-2xl border border-slate-100/50">
                            No prescriptions issued yet. Attend a completed consultation to receive your digital Rx.
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "lab_reports" && (
                      <div className="space-y-3.5">
                        {labReports.map((item, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 flex justify-between items-center hover:border-emerald-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600">
                                <FiActivity size={16} />
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{item.testName}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">{item.lab}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black text-slate-800">{item.date}</p>
                              <span className="inline-flex items-center gap-1.5 text-[9px] text-blue-800 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-black uppercase tracking-wider mt-1">
                                {item.result}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "follow_ups" && (
                      <div className="space-y-3.5">
                        {loadingAppointments ? (
                          <div className="space-y-2 py-4">
                            <div className="h-10 bg-slate-100 rounded-xl animate-pulse w-full" />
                          </div>
                        ) : appointments.filter(app => app.consultationStatus === "completed").length > 0 ? (
                          appointments.filter(app => app.consultationStatus === "completed").map((item, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 hover:border-emerald-100 transition-colors space-y-2.5">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">Follow-up with Dr. {item.doctorId?.fullName || "Physician"}</p>
                                </div>
                                <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                                  {dayjs(item.date).add(14, 'day').format("DD MMM YYYY")}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-white border border-slate-100 p-3 rounded-xl">
                                Care Directive: Review active symptoms and check vitals before next call.
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 text-slate-400 font-semibold text-xs bg-slate-50/50 rounded-2xl border border-slate-100/50">
                            No follow-up schedules recorded.
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "searches" && (
                      <div className="space-y-6">
                        {/* Top Widgets: Recently & Most Searched */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          {/* Recently Searched Widget */}
                          <div className="bg-[#fcfdfd] border border-slate-100 rounded-2xl p-4 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                              Recently Searched
                            </h4>
                            {rawSearches.length > 0 ? (
                              <div className="space-y-2">
                                {rawSearches.slice(0, 3).map((item, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-b-0">
                                    <div>
                                      <p className="font-extrabold text-slate-700 truncate max-w-40">{item.medicineName}</p>
                                      <p className="text-[9px] text-slate-400 font-semibold">{dayjs(item.timestamp).format("DD MMM, hh:mm A")}</p>
                                    </div>
                                    <button
                                      onClick={() => router.push(`/medicines?search=${encodeURIComponent(item.searchQuery)}`)}
                                      className="text-[9px] font-black text-[#0a4d33] hover:underline uppercase tracking-wider cursor-pointer"
                                    >
                                      Re-search
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-slate-400 font-semibold py-2">No recent queries.</p>
                            )}
                          </div>

                          {/* Most Searched Widget */}
                          <div className="bg-[#fcfdfd] border border-slate-100 rounded-2xl p-4 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Most Searched
                            </h4>
                            {mostSearched.length > 0 ? (
                              <div className="space-y-2">
                                {mostSearched.slice(0, 3).map((item: any, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-b-0">
                                    <div>
                                      <p className="font-extrabold text-slate-700 truncate max-w-40">{item.name}</p>
                                      <p className="text-[9px] text-slate-400 font-semibold">Searched {item.count} times</p>
                                    </div>
                                    <button
                                      onClick={() => router.push(`/medicines?search=${encodeURIComponent(item.lastItem.searchQuery)}`)}
                                      className="text-[9px] font-black text-[#0a4d33] hover:underline uppercase tracking-wider cursor-pointer"
                                    >
                                      Re-search
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-slate-400 font-semibold py-2">No recurrent queries.</p>
                            )}
                          </div>
                        </div>

                        {/* Filters & Sorting controls */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-2 space-y-3.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="relative">
                              <FiSearch className="absolute left-3 top-3 text-slate-400" size={12} />
                              <input
                                type="text"
                                placeholder="Search history..."
                                value={dbSearchesQuery}
                                onChange={(e) => setDbSearchesQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 text-[11px] border border-slate-200 focus:border-[#0a4d33] rounded-xl outline-none font-semibold text-slate-750 bg-white"
                              />
                            </div>

                            <select
                              value={dbSearchesFilterCategory}
                              onChange={(e) => setDbSearchesFilterCategory(e.target.value)}
                              className="px-3 py-2 text-[11px] border border-slate-200 focus:border-[#0a4d33] rounded-xl outline-none font-semibold text-slate-650 bg-white"
                            >
                              <option value="">All Categories</option>
                              <option value="pain relief">Pain Relief</option>
                              <option value="antibiotics">Antibiotics</option>
                              <option value="diabetes">Diabetes</option>
                              <option value="cardiology">Cardiology</option>
                              <option value="skin care">Skin Care</option>
                              <option value="vitamins">Vitamins</option>
                              <option value="baby care">Baby Care</option>
                              <option value="respiratory">Respiratory</option>
                              <option value="other">Other</option>
                            </select>

                            <select
                              value={dbSearchesFilterStatus}
                              onChange={(e) => setDbSearchesFilterStatus(e.target.value)}
                              className="px-3 py-2 text-[11px] border border-slate-200 focus:border-[#0a4d33] rounded-xl outline-none font-semibold text-slate-650 bg-white"
                            >
                              <option value="">All Statuses</option>
                              <option value="available">Available Nearby</option>
                              <option value="low_stock">Low Stock</option>
                              <option value="unavailable">Unavailable</option>
                            </select>

                            <select
                              value={dbSearchesSort}
                              onChange={(e) => setDbSearchesSort(e.target.value)}
                              className="px-3 py-2 text-[11px] border border-slate-200 focus:border-[#0a4d33] rounded-xl outline-none font-semibold text-slate-650 bg-white"
                            >
                              <option value="newest">Sort: Newest</option>
                              <option value="oldest">Sort: Oldest</option>
                              <option value="alphabetical">Sort: A-Z</option>
                              <option value="pharmacies">Sort: Most Pharmacies</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="favOnlyCheck"
                              checked={dbSearchesFilterFavorite}
                              onChange={(e) => setDbSearchesFilterFavorite(e.target.checked)}
                              className="w-3.5 h-3.5 rounded border-slate-350 text-emerald-800 focus:ring-emerald-700 cursor-pointer"
                            />
                            <label htmlFor="favOnlyCheck" className="text-[9px] font-black text-slate-500 uppercase tracking-wider cursor-pointer select-none">
                              Show Starred Favorites Only
                            </label>
                          </div>
                        </div>

                        {/* List cards */}
                        <div className="space-y-4">
                          {loadingDbSearches ? (
                            <div className="space-y-2 py-4">
                              <div className="h-10 bg-slate-100 rounded-xl animate-pulse w-full" />
                              <div className="h-10 bg-slate-100 rounded-xl animate-pulse w-full" />
                            </div>
                          ) : dbSearches.length > 0 ? (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {dbSearches.map((item, idx) => {
                                  const isAvailable = item.searchResultStatus === "available";
                                  const isLowStock = item.searchResultStatus === "low_stock";
                                  return (
                                    <div
                                      key={idx}
                                      className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-150 transition-all duration-300 group hover:shadow-sm"
                                    >
                                      <div>
                                        <div className="flex items-start justify-between gap-2">
                                          <span className="text-[8px] bg-white border border-slate-150 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                            {item.medicineCategory || "General"}
                                          </span>
                                          
                                          <div className="flex items-center gap-1.5">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleFavoriteSearch(item._id);
                                              }}
                                              className={`p-1.5 rounded-lg border bg-white transition-colors cursor-pointer ${item.isFavorite ? "border-amber-250 text-amber-500 hover:bg-amber-50" : "border-slate-150 text-slate-350 hover:text-amber-500 hover:bg-slate-50"}`}
                                            >
                                              <FiStar size={11} fill={item.isFavorite ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSearchRecord(item._id);
                                              }}
                                              className="p-1.5 rounded-lg border border-slate-150 bg-white text-slate-350 hover:text-red-655 hover:bg-red-50 hover:border-red-100 transition-colors cursor-pointer"
                                            >
                                              <FiX size={11} />
                                            </button>
                                          </div>
                                        </div>

                                        <div
                                          onClick={() => setSelectedSearchItem(item)}
                                          className="mt-2.5 cursor-pointer"
                                        >
                                          <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-800 transition-colors leading-tight">
                                            {item.medicineName}
                                          </h4>
                                          {item.genericName && item.genericName !== item.medicineName && (
                                            <p className="text-[9px] text-slate-400 font-semibold mt-0.5 italic truncate">{item.genericName}</p>
                                          )}
                                          
                                          <div className="mt-3 space-y-2 border-t border-slate-100/50 pt-2.5 text-[10px] font-semibold text-slate-500">
                                            <div className="flex justify-between">
                                              <span className="text-slate-400 font-medium">Location:</span>
                                              <span className="text-slate-700 font-bold max-w-28 truncate">{item.searchLocation}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-slate-400 font-medium">Pharmacies:</span>
                                              <span className="text-slate-700 font-black">{item.availablePharmaciesFound} found</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-slate-400 font-medium">Status:</span>
                                              <span className={`font-black uppercase tracking-wider text-[8px] px-1.5 py-0.5 rounded ${isAvailable ? "bg-emerald-50 text-emerald-700" : isLowStock ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                                                {item.searchResultStatus === "available" ? "Available" : item.searchResultStatus === "low_stock" ? "Low Stock" : "Unavailable"}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-slate-400 font-medium">Time:</span>
                                              <span className="text-slate-700 font-medium">{dayjs(item.timestamp).format("DD MMM, hh:mm A")}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="mt-4 flex gap-2 pt-2 border-t border-slate-100/50">
                                        <button
                                          onClick={() => router.push(`/medicines?search=${encodeURIComponent(item.searchQuery)}`)}
                                          className="flex-1 text-[9px] bg-[#0a4d33] hover:bg-[#083d28] text-white py-2 rounded-lg font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                                        >
                                          Re-search
                                        </button>
                                        <button
                                          onClick={() => setSelectedSearchItem(item)}
                                          className="text-[9px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 px-2.5 py-2 rounded-lg font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                        >
                                          Details
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {dbSearchesTotal > dbSearches.length && (
                                <div className="flex justify-center pt-2">
                                  <button
                                    onClick={() => fetchDbSearches(dbSearchesPage + 1, true)}
                                    className="px-4 py-2 border border-slate-200 hover:border-emerald-700 text-emerald-800 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer bg-white"
                                  >
                                    Load More
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-center py-12 text-slate-400 font-semibold text-xs bg-slate-50/50 rounded-2xl border border-slate-100/50">
                              No recent searches matched your filter options.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Interactive Details Modal Backdrop */}
      {selectedSearchItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedSearchItem(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <FiX size={16} />
            </button>

            <div className="border-b border-slate-100 pb-4 mb-5 pr-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] bg-emerald-50 text-emerald-800 font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-100">
                  {selectedSearchItem.medicineCategory || "General"}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${selectedSearchItem.searchResultStatus === "available" ? "bg-emerald-80 text-[#0a4d33] border-emerald-100" : selectedSearchItem.searchResultStatus === "low_stock" ? "bg-amber-50 text-amber-800 border-amber-100" : "bg-red-50 text-red-800 border-red-100"}`}>
                  {selectedSearchItem.searchResultStatus === "available" ? "Available" : selectedSearchItem.searchResultStatus === "low_stock" ? "Low Stock" : "Unavailable"}
                </span>
              </div>
              
              <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                {selectedSearchItem.medicineName}
              </h3>
              
              <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-[11px] text-slate-400 font-semibold mt-2">
                {selectedSearchItem.brandName && (
                  <span>Brand: <strong className="text-slate-700">{selectedSearchItem.brandName}</strong></span>
                )}
                {selectedSearchItem.genericName && (
                  <span>• Generic: <strong className="text-slate-700">{selectedSearchItem.genericName}</strong></span>
                )}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Clinical Description</h4>
                <p className="font-semibold text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  {selectedSearchItem.medicineDescription || "No detailed description logged for this query."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dosage Details</h4>
                  <p className="font-semibold text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                    {selectedSearchItem.dosageInformation || "Check packaging specs."}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Usage Instructions</h4>
                  <p className="font-semibold text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                    {selectedSearchItem.usageInstructions || "Take with water."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Possible Side Effects</h4>
                  <p className="font-semibold text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                    {selectedSearchItem.sideEffects || "None recorded."}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Warnings &amp; Precautions</h4>
                  <p className="font-semibold text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                    {selectedSearchItem.warningsPrecautions || "Take under professional guidance."}
                  </p>
                </div>
              </div>

              {selectedSearchItem.alternativeMedicines && selectedSearchItem.alternativeMedicines.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Alternative Compositions</h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedSearchItem.alternativeMedicines.map((alt: string, idx: number) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full text-[10px]">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pharmacy Availability Details</h4>
                {selectedSearchItem.nearbyPharmacyResults && selectedSearchItem.nearbyPharmacyResults.length > 0 ? (
                  <div className="space-y-2">
                    {selectedSearchItem.nearbyPharmacyResults.map((pharm: any, index: number) => (
                      <div key={index} className="flex justify-between items-center bg-emerald-50/10 border border-emerald-100/20 p-2.5 rounded-xl">
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{pharm.name}</p>
                          <p className="text-[9px] text-slate-400 font-semibold">{pharm.address}</p>
                        </div>
                        {pharm.distance !== null && (
                          <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg shrink-0">
                            📍 {pharm.distance} km
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                    No active pharmacy mappings available.
                  </p>
                )}
              </div>

              <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider pt-3 border-t border-slate-50">
                <span>Location: {selectedSearchItem.searchLocation}</span>
                <span>Logged: {dayjs(selectedSearchItem.timestamp).format("DD MMM YYYY, hh:mm A")}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => handleToggleFavoriteSearch(selectedSearchItem._id)}
                className={`flex-1 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer transition-colors ${selectedSearchItem.isFavorite ? "border-amber-250 bg-amber-50 text-amber-700 hover:bg-amber-100" : "border-slate-200 bg-white text-slate-650 hover:bg-slate-50"}`}
              >
                <FiStar fill={selectedSearchItem.isFavorite ? "currentColor" : "none"} />
                {selectedSearchItem.isFavorite ? "Favorited" : "Save to Favorites"}
              </button>
              <button
                onClick={() => {
                  setSelectedSearchItem(null);
                  router.push(`/medicines?search=${encodeURIComponent(selectedSearchItem.searchQuery)}`);
                }}
                className="flex-1 py-2.5 bg-[#0a4d33] text-white hover:bg-[#083d28] rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer"
              >
                Re-search
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
    