"use client";

import React, { useState, useEffect } from "react";
import NavbarPage from "../navbar/page";
import Footer from "../footer/page";
import api from "@/services/apis/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCalendar, 
  FiVideo, 
  FiArrowRight, 
  FiStar, 
  FiAlertCircle, 
  FiClock, 
  FiSearch, 
  FiDollarSign, 
  FiCheckCircle, 
  FiXCircle, 
  FiInbox,
  FiX,
  FiFileText,
  FiShield
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/utils/imageUrl";

export default function NotificationsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  
  // Rating states
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/booking/patient-appointments");
        if (res.data.success) {
          setAppointments(res.data.bookings);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        toast.error("Failed to fetch consultations");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSubmitRating = async () => {
    if (!selectedBookingForRating) return;
    try {
      setSubmittingRating(true);
      const res = await api.post("/doctor/review", {
        doctorId: selectedBookingForRating.doctorId._id || selectedBookingForRating.doctorId,
        rating,
        reviewText,
        bookingId: selectedBookingForRating._id,
      });

      if (res.data.success) {
        toast.success("Thank you for your rating and feedback!");
        setShowRatingModal(false);
        setRating(5);
        setReviewText("");
        
        // Refresh appointments
        const refreshRes = await api.get("/booking/patient-appointments");
        if (refreshRes.data.success) {
          setAppointments(refreshRes.data.bookings);
        }
      }
    } catch (err: any) {
      console.error("Error submitting rating:", err);
      toast.error(err.response?.data?.message || "Failed to submit rating.");
    } finally {
      setSubmittingRating(false);
    }
  };

  const isJoinable = (scheduledAt: string) => {
    if (!scheduledAt) return false;
    const scheduledTime = dayjs(scheduledAt);
    const startTime = scheduledTime.subtract(10, "minute");
    const endTime = scheduledTime.add(30, "minute");
    return currentTime.isAfter(startTime) && currentTime.isBefore(endTime);
  };

  // Helper status checks
  const getAppointmentStatus = (app: any) => {
    const isExpired = dayjs(currentTime).isAfter(dayjs(app.scheduledAt).add(30, "minute"));
    if (app.consultationStatus === "completed") return "completed";
    if (app.status === "cancelled") return "cancelled";
    if (isExpired) return "expired";
    return app.status || "pending";
  };

  // Filtering Logic
  const filteredAppointments = appointments.filter((app) => {
    const status = getAppointmentStatus(app);
    const docName = (app.doctorId?.fullName || "").toLowerCase();
    const specialty = (app.doctorId?.specialization || "").toLowerCase();
    const matchesSearch = docName.includes(searchQuery.toLowerCase()) || specialty.includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "all") return true;
    if (activeFilter === "completed") return status === "completed";
    if (activeFilter === "cancelled") return status === "cancelled";
    if (activeFilter === "upcoming") {
      return status === "confirmed" || status === "pending";
    }
    return true;
  });

  // Calculate statistics
  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(app => {
      const status = getAppointmentStatus(app);
      return status === "confirmed" || status === "pending";
    }).length,
    completed: appointments.filter(app => getAppointmentStatus(app) === "completed").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600 border-r-2 border-emerald-600/30"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Consultations</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <NavbarPage />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-24 sm:px-6 lg:px-8 z-10 relative">
        
        {/* Header Section */}
        <div className="mb-8 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                Patient Account Panel
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
                My <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Consultations</span>
              </h1>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Track, attend, and review your consultations, tele-health sessions, and prescriptions.
              </p>
            </div>

            {/* Quick Stat Badges - Responsive Grid/Flex layout */}
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-1 sm:gap-3 bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-100 shadow-sm w-full md:w-auto">
              <div className="px-2 sm:px-4 py-2 text-center">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
                <p className="text-base sm:text-lg font-black text-slate-800">{stats.total}</p>
              </div>
              <div className="px-2 sm:px-4 py-2 text-center border-l border-slate-100 sm:border-l">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1 text-emerald-600">Upcoming</p>
                <p className="text-base sm:text-lg font-black text-emerald-600">{stats.upcoming}</p>
              </div>
              <div className="px-2 sm:px-4 py-2 text-center border-l border-slate-100 sm:border-l">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1 text-blue-600">Completed</p>
                <p className="text-base sm:text-lg font-black text-blue-600">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Navigation Tabs - Horizontal Scrollable on Mobile */}
          <div className="flex bg-slate-50 p-1 rounded-2xl w-full md:w-auto overflow-x-auto scrollbar-none gap-0.5 shrink-0">
            {[
              { id: "all", label: "All Sessions" },
              { id: "upcoming", label: "Upcoming" },
              { id: "completed", label: "Completed" },
              { id: "cancelled", label: "Cancelled" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar - Full Width on Mobile */}
          <div className="relative w-full md:w-80 shrink-0">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor or specialty..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-slate-200 focus:ring-2 focus:ring-emerald-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Consultations List */}
        {filteredAppointments.length > 0 ? (
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {filteredAppointments.map((app, index) => {
                const joinable = isJoinable(app.scheduledAt);
                const appStatus = getAppointmentStatus(app);
                const isExpired = appStatus === "expired";

                return (
                  <motion.div
                    key={app._id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100/40 transition-all flex flex-col lg:flex-row gap-5 lg:items-center justify-between group"
                  >
                    {/* Left: Doctor Profile & Specialty - Layout scales avatar size and labels */}
                    <div className="flex items-center gap-4 lg:w-[28%] min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={
                            app.doctorId?.profileImage
                              ? getImageUrl(app.doctorId.profileImage)
                              : undefined
                          }
                          alt={app.doctorId?.fullName || "Doctor"}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover bg-slate-50 border border-slate-100 shadow-sm transition-transform group-hover:scale-105 duration-300"
                        />
                        {app.doctorId?.isAvailable && (
                          <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
                            <span className="flex h-2.5 w-2.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight group-hover:text-emerald-700 transition-colors truncate">
                          Dr. {app.doctorId?.fullName || "Doctor"}
                        </p>
                        <span className="inline-block text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 uppercase tracking-wide truncate max-w-full">
                          {app.doctorId?.specialization || "General Physician"}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Details Grid - Adaptable columns, overflow-safe labels and break words */}
                    <div className="grid grid-cols-3 gap-4 lg:gap-6 flex-1 text-slate-600 text-[11px] sm:text-xs font-semibold w-full">
                      {/* Date & Time */}
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                          <FiCalendar size={11} className="shrink-0 text-slate-400" /> Schedule
                        </p>
                        <p className="text-slate-800 font-bold leading-tight truncate">{dayjs(app.date).format("DD MMM YYYY")}</p>
                        <p className="text-slate-400 font-medium mt-0.5 text-[10px] sm:text-[11px] leading-tight truncate">{app.timeSlot}</p>
                      </div>

                      {/* Fee */}
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                          <FiDollarSign size={11} className="shrink-0 text-slate-400" /> Fee
                        </p>
                        <p className="text-slate-800 font-black text-xs sm:text-sm leading-tight">₹{app.amount || 0}</p>
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-bold mt-0.5 uppercase tracking-wider ${
                            app.paymentStatus === "paid" ? "text-emerald-600" : "text-orange-500"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${app.paymentStatus === "paid" ? "bg-emerald-500" : "bg-orange-500"}`}></span>
                          {app.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </div>

                      {/* Status Badges */}
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Status
                        </p>
                        <div className="flex items-center">
                          {appStatus === "completed" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                              <FiCheckCircle size={10} className="shrink-0" /> Completed
                            </span>
                          ) : appStatus === "cancelled" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100">
                              <FiXCircle size={10} className="shrink-0" /> Cancelled
                            </span>
                          ) : isExpired ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                              <FiClock size={10} className="shrink-0" /> Expired
                            </span>
                          ) : appStatus === "confirmed" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <FiCheckCircle size={10} className="shrink-0" /> Confirmed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                              <FiClock size={10} className="shrink-0" /> Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions Container - flex-row on mobile (full width side-by-side buttons), lg:flex-col lg:w-36 */}
                    <div className="flex flex-row lg:flex-col gap-2 shrink-0 border-t border-slate-50 lg:border-none pt-4 lg:pt-0 justify-end w-full lg:w-36">
                      {appStatus === "completed" ? (
                        <>
                          <button
                            onClick={() => router.push(`/health-report/${app._id}`)}
                            className="flex-1 lg:w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/10 cursor-pointer active:scale-95 whitespace-nowrap"
                          >
                            <FiFileText size={12} /> View Report
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBookingForRating(app);
                              setRating(app.rating || 5);
                              setReviewText(app.reviewText || "");
                              setShowRatingModal(true);
                            }}
                            className="flex-1 lg:w-full border border-emerald-100 text-emerald-700 bg-emerald-50/20 hover:bg-emerald-50/50 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                          >
                            <FiStar size={12} className="fill-emerald-100" /> Rate Doctor
                          </button>
                        </>
                      ) : app.roomId ? (
                        isExpired ? (
                          <div className="w-full bg-slate-50 border border-slate-100 text-slate-400 py-2.5 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest text-center whitespace-nowrap">
                            Session Ended
                          </div>
                        ) : (
                          <button
                            onClick={() => router.push(`/consultation/${app.roomId}`)}
                            disabled={!joinable}
                            className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-md whitespace-nowrap ${
                              joinable
                                ? "bg-slate-900 text-white hover:bg-emerald-600 shadow-emerald-900/10 cursor-pointer active:scale-95"
                                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                            }`}
                          >
                            <FiVideo size={12} /> {joinable ? "Join Call" : "Call Inactive"}
                          </button>
                        )
                      ) : (
                        <div className="w-full bg-slate-50 border border-slate-100 text-slate-400 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center whitespace-nowrap">
                          Waiting for Room
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Elegant Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-10 sm:p-16 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100"
          >
            <div className="bg-slate-50 h-20 w-20 rounded-2xl flex items-center justify-center mb-6 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-300">
              <FiInbox size={32} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
              No Consultations Found
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm font-medium mb-8 leading-relaxed">
              We couldn't find any medical consultations matching your active filters or search parameters.
            </p>
            <button
              onClick={() => router.push("/consultation")}
              className="bg-slate-900 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              Book New Appointment <FiArrowRight />
            </button>
          </motion.div>
        )}
      </main>

      {/* Rating & Review Modal - Responsive Padding and Widths */}
      <AnimatePresence>
        {showRatingModal && selectedBookingForRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setRating(5);
                  setReviewText("");
                }}
                className="absolute right-4 top-4 sm:right-5 sm:top-5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiX size={18} />
              </button>

              <div className="text-center space-y-3 pt-3">
                <div className="inline-block relative">
                  <img
                    src={
                      selectedBookingForRating.doctorId?.profileImage
                        ? getImageUrl(selectedBookingForRating.doctorId.profileImage)
                        : undefined
                    }
                    alt={selectedBookingForRating.doctorId?.fullName || "Doctor"}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-50 border border-slate-100 shadow-sm mx-auto"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white">
                    <FiStar size={10} className="fill-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Dr. {selectedBookingForRating.doctorId?.fullName}</h3>
                  <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider mt-0.5">
                    {selectedBookingForRating.doctorId?.specialization || "Medical Specialist"}
                  </p>
                </div>
                <div className="h-px bg-slate-100 w-full max-w-[120px] mx-auto"></div>
                <p className="text-slate-500 text-[13px] sm:text-sm font-medium px-2">
                  How would you rate your medical consultation and communication?
                </p>
              </div>

              {/* Stars Selector */}
              <div className="flex justify-center items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isGold = star <= (hoverRating !== null ? hoverRating : rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                    >
                      <FiStar
                        size={32}
                        className={`transition-colors duration-150 ${
                          isGold ? "text-amber-400 fill-amber-400" : "text-slate-200"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Review Text Area */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Your Review & Feedback
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {reviewText.length}/500 chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={500}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about the doctor's explanation of diagnostics, prescription advice, friendliness..."
                  className="w-full p-3.5 border border-slate-200 rounded-2xl outline-none text-xs font-medium text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200 resize-none transition-all shadow-inner bg-slate-50/50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowRatingModal(false);
                    setRating(5);
                    setReviewText("");
                  }}
                  className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold rounded-2xl border border-slate-100 transition-all text-xs uppercase tracking-widest cursor-pointer active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitRating}
                  disabled={submittingRating}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/10 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {submittingRating ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
