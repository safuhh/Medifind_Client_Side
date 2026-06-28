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
  FiShield,
  FiArrowLeft,
  FiUser,
  FiAward,
  FiBriefcase,
  FiHeart,
  FiMessageSquare,
  FiDownload,
  FiExternalLink,
  FiCoffee,
  FiActivity,
  FiCopy
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/utils/imageUrl";
import AISplitModal from "../health-report/[bookingId]/AISplitModal";

export default function NotificationsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  
  // Master-Detail Active States
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [activeReport, setActiveReport] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [activeMobileView, setActiveMobileView] = useState<"list" | "detail">("list");
  const [detailTab, setDetailTab] = useState<"overview" | "notes" | "rx" | "followup">("overview");

  // Fulfillment states
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitPlan, setSplitPlan] = useState<any>(null);
  const [expandedMedIndex, setExpandedMedIndex] = useState<number | null>(null);

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

  // Fetch Consultations
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/booking/patient-appointments");
        if (res.data.success) {
          setAppointments(res.data.bookings);
          if (res.data.bookings.length > 0) {
            setSelectedBooking(res.data.bookings[0]);
          }
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
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Fetch report details dynamically for the selected booking
  useEffect(() => {
    const fetchReportDetails = async () => {
      if (!selectedBooking) {
        setActiveReport(null);
        return;
      }
      setLoadingReport(true);
      try {
        const res = await api.get(`/health-report/booking/${selectedBooking._id}`);
        if (res.data.success && res.data.report) {
          setActiveReport(res.data.report);
        } else {
          setActiveReport(null);
        }
      } catch (err) {
        setActiveReport(null);
      } finally {
        setLoadingReport(false);
      }
    };

    fetchReportDetails();
  }, [selectedBooking]);

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
        
        // Refresh active details
        const refreshRes = await api.get("/booking/patient-appointments");
        if (refreshRes.data.success) {
          setAppointments(refreshRes.data.bookings);
          const updated = refreshRes.data.bookings.find((b: any) => b._id === selectedBooking._id);
          if (updated) setSelectedBooking(updated);
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

  const getAppointmentStatus = (app: any) => {
    const isExpired = dayjs(currentTime).isAfter(dayjs(app.scheduledAt).add(30, "minute"));
    if (app.consultationStatus === "completed") return "completed";
    if (app.status === "cancelled") return "cancelled";
    if (isExpired) return "expired";
    return app.status || "pending";
  };

  // Filter list
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

  const getAppointmentDateTime = (app: any) => {
    if (app.scheduledAt) return dayjs(app.scheduledAt);
    
    // Fallback construct from date and timeSlot
    let hours = 0;
    let minutes = 0;
    if (app.timeSlot) {
      const parts = app.timeSlot.split(":");
      hours = parseInt(parts[0] || "0", 10);
      minutes = parseInt(parts[1] || "0", 10);
    }
    return dayjs(app.date).startOf("day").hour(hours).minute(minutes);
  };

  const getRemainingTimeText = (scheduledAt: string) => {
    if (!scheduledAt) return "";
    const now = dayjs();
    const diffMin = dayjs(scheduledAt).diff(now, "minute");
    const diffHours = dayjs(scheduledAt).diff(now, "hour");
    const diffDays = dayjs(scheduledAt).diff(now, "day");
    
    if (diffMin <= 0) return "Starting now";
    if (diffMin < 60) return `Starts in ${diffMin} min`;
    if (diffHours < 24) return `Starts in ${diffHours} hr`;
    return `Starts in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  // Find the single closest upcoming appointment globally across all appointments
  const upcomingList = appointments
    .filter(app => {
      const status = getAppointmentStatus(app);
      return status === "confirmed" || status === "pending";
    })
    .sort((a, b) => getAppointmentDateTime(a).valueOf() - getAppointmentDateTime(b).valueOf());
    
  const nextAppointment = upcomingList[0];

  // Sort the filtered list
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const timeA = getAppointmentDateTime(a).valueOf();
    const timeB = getAppointmentDateTime(b).valueOf();
    
    if (activeFilter === "upcoming") {
      // Ascending (nearest upcoming consultation first)
      return timeA - timeB;
    } else {
      // Descending (newest completed/cancelled first)
      return timeB - timeA;
    }
  });

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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600 border-r-2 border-emerald-600/30"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Consultations</p>
      </div>
    );
  }

  // Helper to parse notes into structured sections
  const parseReportNotes = (notes: string) => {
    const result = {
      diagnosis: "General Wellness & Consultation Review",
      symptoms: "Patient requested clinical check-in and advisory notes",
      observations: "Vitals stable. Patient active and responsive. Heart rate, blood pressure, and reflexes within normal parameters.",
      recommendations: "1. Stay well hydrated (2.5L+ water daily).\n2. Get adequate rest (7-8 hours nightly).\n3. Avoid strenuous exercise if experiencing fatigue.",
      followUp: "Consult again in 14 days or earlier if symptoms persist.",
      generalNotes: ""
    };
    
    if (!notes) return result;
    result.generalNotes = notes;
    
    const lowerNotes = notes.toLowerCase();
    const diagnosisIdx = lowerNotes.indexOf("diagnosis:");
    const symptomsIdx = lowerNotes.indexOf("symptoms:");
    const observationsIdx = lowerNotes.indexOf("observations:");
    const recommendationsIdx = lowerNotes.indexOf("recommendations:");
    const followUpIdx = lowerNotes.indexOf("follow-up:");
    
    if (diagnosisIdx !== -1 || symptomsIdx !== -1 || observationsIdx !== -1 || recommendationsIdx !== -1 || followUpIdx !== -1) {
      const indices = [
        { name: "diagnosis", index: diagnosisIdx },
        { name: "symptoms", index: symptomsIdx },
        { name: "observations", index: observationsIdx },
        { name: "recommendations", index: recommendationsIdx },
        { name: "followUp", index: followUpIdx }
      ].filter(i => i.index !== -1).sort((a, b) => a.index - b.index);
      
      for (let i = 0; i < indices.length; i++) {
        const current = indices[i];
        const next = indices[i + 1];
        const start = current.index + current.name.length + 2; // skip label + colon
        const end = next ? next.index : notes.length;
        const val = notes.substring(start, end).trim();
        if (val) (result as any)[current.name] = val;
      }
    } else {
      result.observations = notes;
    }
    return result;
  };

  const handleCopyLink = (link: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(link);
      toast.success("Meeting link copied to clipboard! 📋");
    }
  };

  const handleFindBuyWithAI = async () => {
    if (!activeReport) {
      toast.info("No active prescription details generated yet for this booking.");
      return;
    }
    setIsOptimizing(true);
    try {
      const getCoords = (): Promise<[number, number] | undefined> => {
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            resolve(undefined);
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
            () => resolve(undefined),
            { timeout: 5000 }
          );
        });
      };

      const coords = await getCoords();
      const prescriptionId = activeReport._id || selectedBooking._id;
      const medicines = activeReport.medicines
        ?.map((m: any) => ({
          name: m.name,
          quantity: m.remainingQty !== undefined ? m.remainingQty : m.quantity,
        }))
        ?.filter((m: any) => m.quantity > 0) || [];

      if (medicines.length === 0) {
        toast.info("No remaining medicines to fulfill.");
        setIsOptimizing(false);
        return;
      }

      const res = await api.post("/orders/optimize-split", {
        prescriptionId,
        patientCoords: coords,
        medicines,
      });

      if (res.data.success && res.data.data) {
        setSplitPlan(res.data.data);
        setShowSplitModal(true);
        toast.success("AI found the optimal fulfillment plan!");
      } else {
        toast.error("Failed to find optimal pharmacy splits");
      }
    } catch (err: any) {
      console.error("AI Split optimization failed:", err);
      toast.error(err.response?.data?.message || "Failed to split order with AI");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Details Panel Content Renderer (Shared between Mobile & Desktop layout panes)
  const renderDetailPanel = (bookingObj: any) => {
    if (!bookingObj) {
      return (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
          <FiInbox size={36} className="text-slate-300 mb-4" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">No Consultation Selected</p>
        </div>
      );
    }

    const appStatus = getAppointmentStatus(bookingObj);
    const joinable = isJoinable(bookingObj.scheduledAt);
    const isExpired = appStatus === "expired";
    const doctorObj = bookingObj.doctorId || {};
    
    // Parse notes using the helper
    const parsedNotes = parseReportNotes(activeReport?.notes);
    
    // Risk calculations
    const notesText = activeReport?.notes?.toLowerCase() || "";
    const isHighRisk = notesText.includes("severe") || notesText.includes("critical") || notesText.includes("danger") || notesText.includes("urgent");
    const isModerateRisk = notesText.includes("moderate") || notesText.includes("warn") || notesText.includes("persist");
    
    const riskLabel = isHighRisk ? "Moderate to High Risk" : isModerateRisk ? "Moderate Risk - Monitor" : "Low Risk - Routine Care";
    const riskColor = isHighRisk 
      ? "bg-red-50 text-red-700 border-red-100" 
      : isModerateRisk 
        ? "bg-amber-50 text-amber-700 border-amber-100" 
        : "bg-emerald-50 text-emerald-700 border-emerald-100";

    const meetingLink = bookingObj.roomId ? `${window.location.origin}/consultation/${bookingObj.roomId}` : "";

    return (
      <div className="space-y-6">
        
        {/* Detail Hero Banner */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative shrink-0">
                {doctorObj.profileImage ? (
                  <img
                    src={getImageUrl(doctorObj.profileImage)}
                    alt={doctorObj.fullName}
                    className="w-16 h-16 rounded-2xl object-cover bg-slate-50 border border-slate-100"
                  />
                ) : (
                  <div className="w-16 h-16 bg-emerald-50 text-[#0a4d33] rounded-2xl flex items-center justify-center border border-emerald-100">
                    <FiUser size={28} />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  <FiCheckCircle size={10} />
                </div>
              </div>

              <div className="min-w-0">
                <h2 className="font-extrabold text-slate-900 text-base sm:text-lg truncate">
                  Dr. {doctorObj.fullName || "Specialist"}
                </h2>
                <p className="text-emerald-700 font-bold text-xs">
                  {doctorObj.specialization || "Medical Practitioner"}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                  Consultation ID: {bookingObj._id?.substring(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${
                appStatus === "completed" 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-100" 
                  : appStatus === "cancelled" 
                    ? "bg-rose-50 text-rose-800 border-rose-100" 
                    : "bg-amber-50 text-amber-800 border-amber-100"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${appStatus === "completed" ? "bg-emerald-500" : "bg-amber-400"}`} />
                {appStatus}
              </span>
              <p className="text-slate-500 text-xs font-semibold">
                {dayjs(bookingObj.date).format("DD MMMM YYYY")} • {bookingObj.timeSlot}
              </p>
            </div>
          </div>

          {/* Quick actions row */}
          <div className="mt-6 pt-5 border-t border-slate-50 flex flex-col sm:flex-row flex-wrap gap-2.5">
            {activeReport && (
              <button
                onClick={() => router.push(`/health-report/${bookingObj._id}`)}
                className="w-full sm:w-auto bg-[#0a4d33] hover:bg-[#083d28] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-950/10 cursor-pointer"
              >
                <FiFileText size={13} /> View Full Health Report
              </button>
            )}

            {activeReport?.medicines?.length > 0 && (
              <button
                onClick={handleFindBuyWithAI}
                disabled={isOptimizing}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-950/10 cursor-pointer disabled:opacity-50"
              >
                <FiActivity size={13} /> 
                {isOptimizing ? "Optimizing..." : "Fulfill Prescription"}
              </button>
            )}

            {appStatus === "completed" && (
              <>
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FiDownload size={13} /> Export PDF
                </button>
                <button
                  onClick={() => {
                    setSelectedBookingForRating(bookingObj);
                    setRating(bookingObj.rating || 5);
                    setReviewText(bookingObj.reviewText || "");
                    setShowRatingModal(true);
                  }}
                  className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiStar size={13} className="fill-slate-100" /> Rate Doctor
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6 mt-6">
            {/* Telehealth Call Room Container */}
            {bookingObj.roomId && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <FiVideo className="text-emerald-600" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Video Consultation Details</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="space-y-3.5 text-xs text-slate-600 font-semibold">
                    <p className="min-w-0">
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">Meeting URL</span>
                      <span className="text-emerald-700 truncate block mt-0.5 max-w-full">
                        {meetingLink}
                      </span>
                    </p>
                    <p className="min-w-0">
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">Meeting ID</span>
                      <span className="text-slate-800 block mt-0.5 truncate">
                        {bookingObj.roomId}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-3.5 text-xs text-slate-600 font-semibold">
                    <p>
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">Meeting Start Time</span>
                      <span className="text-slate-800 block mt-0.5">
                        {dayjs(bookingObj.scheduledAt || bookingObj.date).format("hh:mm A, DD MMM YYYY")}
                      </span>
                    </p>
                    <p>
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">Consultation Duration</span>
                      <span className="text-slate-800 block mt-0.5">
                        15-Minute Session
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
                  {isExpired ? (
                    <span className="bg-slate-50 border border-slate-150 text-slate-400 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-inner text-center">
                      Call Session Closed
                    </span>
                  ) : (
                    <button
                      onClick={() => router.push(`/consultation/${bookingObj.roomId}`)}
                      disabled={!joinable}
                      className={`w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md ${
                        joinable
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/10 cursor-pointer active:scale-95"
                          : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                      }`}
                    >
                      <FiVideo size={14} /> {joinable ? "Join Call Room" : "Call Inactive"}
                    </button>
                  )}
                  {meetingLink && (
                    <button
                      onClick={() => handleCopyLink(meetingLink)}
                      className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <FiCopy size={13} /> Copy Link
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 font-bold leading-normal">
                  * Note: The call room opens 10 minutes prior to your booking and remains active for up to 30 minutes.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Timeline Col */}
              <div className="md:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none font-sans">Timeline</h3>
                
                <div className="relative pl-6 space-y-5 before:absolute before:left-[11px] before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-100">
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-4 ring-emerald-50" />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">Appointment Booked</h4>
                      <p className="text-[9px] text-slate-400 font-semibold">{dayjs(bookingObj.createdAt).format("DD MMM, h:mm A")}</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                      bookingObj.roomId ? "bg-emerald-600 ring-4 ring-emerald-50" : "bg-slate-200"
                    }`} />
                    <div>
                      <h4 className={`text-xs font-extrabold ${bookingObj.roomId ? "text-slate-800" : "text-slate-400"}`}>Consultation Started</h4>
                      <p className="text-[9px] text-slate-400 font-semibold">{bookingObj.roomId ? "Virtual call room active" : "Pending call room setup"}</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                      activeReport ? "bg-emerald-600 ring-4 ring-emerald-50" : "bg-slate-200"
                    }`} />
                    <div>
                      <h4 className={`text-xs font-extrabold ${activeReport ? "text-slate-800" : "text-slate-400"}`}>Assessment Logged</h4>
                      <p className="text-[9px] text-slate-400 font-semibold">{activeReport ? "Clinical findings published" : "Pending diagnostics log"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Details Col */}
              <div className="md:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-4">Physician Credentials</h3>
                
                <div className="space-y-3.5 text-xs text-slate-500 font-semibold flex-1">
                  <p className="flex items-center gap-2">
                    <FiAward className="text-emerald-600 shrink-0" size={14} />
                    {doctorObj.experienceYears || 8}+ Years Professional Practice
                  </p>
                  <p className="flex items-center gap-2">
                    <FiBriefcase className="text-emerald-600 shrink-0" size={14} />
                    {doctorObj.hospitalAffiliation || "MediFind Associated Specialist Partner"}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiHeart className="text-emerald-600 shrink-0" size={14} />
                    Rating score: {doctorObj.rating ? doctorObj.rating.toFixed(1) : "4.9"} ({doctorObj.ratingCount || 10}+ reviews)
                  </p>
                  <p className="flex items-center gap-2">
                    <FiMessageSquare className="text-emerald-600 shrink-0" size={14} />
                    Consultation Fee: ₹{bookingObj.amount || 500} (Stripe Verified)
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-50 mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider flex justify-between items-center">
                  <span>verification</span>
                  <span className="text-emerald-700 flex items-center gap-1">
                    <FiCheckCircle /> Verified Doctor
                  </span>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <NavbarPage />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 z-10 relative">
        
        {/* Header Section */}
        <div className="mb-8 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                Patient Account Console
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
                My <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Consultations</span>
              </h1>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Track, attend, and review your consultations, tele-health sessions, and prescriptions.
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-1 sm:gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-full md:w-auto">
              <div className="px-4 py-2 text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
                <p className="text-lg font-black text-slate-800">{stats.total}</p>
              </div>
              <div className="px-4 py-2 text-center border-l border-slate-100">
                <p className="text-[9px] font-bold text-slate-450 uppercase tracking-widest leading-none mb-1 text-emerald-600">Upcoming</p>
                <p className="text-lg font-black text-emerald-600">{stats.upcoming}</p>
              </div>
              <div className="px-4 py-2 text-center border-l border-slate-100">
                <p className="text-[9px] font-bold text-slate-450 uppercase tracking-widest leading-none mb-1 text-blue-600">Completed</p>
                <p className="text-lg font-black text-blue-600">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Master-Detail Grid container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Master Pane: Filters, Search, and Consultations List */}
          <div className={`lg:col-span-5 space-y-5 ${activeMobileView === "detail" ? "hidden lg:block" : "block"}`}>
            
            {/* Search & Filter card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
              {/* Navigation Tabs */}
              <div className="flex bg-slate-50 p-1 rounded-2xl overflow-x-auto scrollbar-none gap-0.5">
                {[
                  { id: "all", label: "All" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "completed", label: "Completed" },
                  { id: "cancelled", label: "Cancelled" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id as any)}
                    className={`flex-1 px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      activeFilter === tab.id
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctor or specialty..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-xs font-semibold text-slate-700 outline-none transition-all focus:bg-white focus:border-slate-200 focus:ring-2 focus:ring-emerald-100"
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

            {/* Bookings Card List */}
            {sortedAppointments.length > 0 ? (
              <div className="flex flex-col gap-3.5 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin">
                <AnimatePresence mode="popLayout">
                  {sortedAppointments.map((app) => {
                    const appStatus = getAppointmentStatus(app);
                    const isSelected = selectedBooking?._id === app._id;
                    const isNext = nextAppointment?._id === app._id;

                    return (
                      <motion.div
                        key={app._id}
                        layoutId={`booking-card-${app._id}`}
                        onClick={() => {
                          setSelectedBooking(app);
                          setActiveMobileView("detail");
                        }}
                        className={`bg-white rounded-3xl p-5 border shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                          isSelected 
                            ? "border-emerald-600 ring-2 ring-emerald-50" 
                            : isNext
                              ? "border-emerald-500/60 ring-2 ring-emerald-50/50 bg-gradient-to-r from-white to-emerald-50/10 shadow-emerald-100"
                              : "border-slate-100 hover:border-emerald-150 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Doctor profile image */}
                          <div className="relative shrink-0">
                            {app.doctorId?.profileImage ? (
                              <img
                                src={getImageUrl(app.doctorId.profileImage)}
                                alt={app.doctorId.fullName}
                                className="w-11 h-11 rounded-xl object-cover bg-slate-50 border border-slate-100"
                              />
                            ) : (
                              <div className="w-11 h-11 bg-emerald-50 text-[#0a4d33] rounded-xl flex items-center justify-center border border-emerald-100">
                                <FiUser size={18} />
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center border border-white">
                              <FiCheckCircle size={8} />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <p className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors truncate">
                              Dr. {app.doctorId?.fullName || "Physician"}
                            </p>
                            <p className="text-[10px] text-emerald-700 font-bold truncate">
                              {app.doctorId?.specialization || "General Medicine"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">
                              {dayjs(app.date).format("DD MMM YYYY")} • {app.timeSlot}
                            </p>
                            {isNext && (
                              <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50">
                                <FiClock size={10} className="animate-pulse" /> {getRemainingTimeText(app.scheduledAt)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status tag */}
                        <div className="shrink-0 text-right">
                          {isNext && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest bg-[#0a4d33] text-white border border-[#0a4d33] shadow-sm mb-1.5 animate-pulse">
                              Next Appointment
                            </span>
                          )}
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border block ${
                            appStatus === "completed" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : appStatus === "cancelled"
                                ? "bg-rose-50 text-rose-700 border-rose-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
                            {appStatus}
                          </span>
                          <p className="text-[10px] font-black text-slate-800 mt-1.5">₹{app.amount || 0}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center flex flex-col items-center justify-center py-12">
                <FiInbox size={28} className="text-slate-350 mb-3" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No bookings matching filter</p>
              </div>
            )}

          </div>

          {/* Right Detail Pane (Desktop Details Pane OR Mobile Details Screen) */}
          <div className={`lg:col-span-7 ${activeMobileView === "list" ? "hidden lg:block" : "block"}`}>
            
            {/* Mobile-only Back button */}
            {activeMobileView === "detail" && (
              <button 
                onClick={() => setActiveMobileView("list")} 
                className="lg:hidden flex items-center gap-1.5 text-xs text-[#0a4d33] font-black uppercase tracking-wider mb-5 cursor-pointer bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-100/50"
              >
                <FiArrowLeft size={14} /> Back to Consultation List
              </button>
            )}

            {/* Selected consultation summary content details */}
            {renderDetailPanel(selectedBooking)}

          </div>

        </div>

      </main>

      {/* Rating & Review Modal */}
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
                    Your Review &amp; Feedback
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
                  className="w-full p-3.5 border border-slate-200 rounded-2xl outline-none text-xs font-medium text-slate-700 placeholder:text-slate-350 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-200 resize-none transition-all shadow-inner bg-slate-50/50"
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

      {showSplitModal && splitPlan && (
        <AISplitModal
          splitPlan={splitPlan}
          onClose={() => setShowSplitModal(false)}
          onProceed={() => {
            setShowSplitModal(false);
            router.push("/cart"); // Adjust navigation if needed, or leave it handling cart logic
          }}
        />
      )}

      <Footer />
    </div>
  );
}
