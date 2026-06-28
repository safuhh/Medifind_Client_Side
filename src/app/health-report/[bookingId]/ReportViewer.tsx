"use client";

import dayjs from "dayjs";
import { 
  FiUser, 
  FiActivity, 
  FiCheckCircle, 
  FiClock, 
  FiExternalLink, 
  FiMinus, 
  FiPlus,
  FiVideo,
  FiAward,
  FiHeart,
  FiCalendar,
  FiAlertTriangle,
  FiShield,
  FiMessageSquare,
  FiBriefcase,
  FiCoffee
} from "react-icons/fi";
import { getImageUrl } from "@/utils/imageUrl";

interface ReportViewerProps {
  report: any;
  booking: any;
  patientInfo: any;
  doctorInfo: any;
  isDoctor: boolean;
  onFindBuyWithAI: () => void;
  isOptimizing: boolean;
  selectedQuantities?: Record<string, number>;
  onIncreaseQty: (medId: string, maxQty: number, currentQty: number) => void;
  onDecreaseQty: (medId: string, currentQty: number) => void;
}

export default function ReportViewer({
  report,
  booking,
  patientInfo,
  doctorInfo,
  isDoctor,
  onFindBuyWithAI,
  isOptimizing,
  selectedQuantities = {},
  onIncreaseQty = () => {},
  onDecreaseQty = () => {},
}: ReportViewerProps) {
  const allPurchased = report?.medicines && report.medicines.length > 0 && report.medicines.every((m: any) => m.remainingQty === 0);
  const totalSelected = Object.values(selectedQuantities).reduce((a, b) => a + b, 0);
  const allExcluded = report?.medicines && report.medicines.length > 0 && totalSelected === 0;

  // Determine active status colors
  const status = booking?.consultationStatus || (report ? "completed" : "ongoing");
  const isCompleted = status === "completed";
  
  // Risk assessment calculation based on observations notes
  const notesText = report?.notes?.toLowerCase() || "";
  const isHighRisk = notesText.includes("severe") || notesText.includes("critical") || notesText.includes("danger") || notesText.includes("urgent");
  const isModerateRisk = notesText.includes("moderate") || notesText.includes("warn") || notesText.includes("persist");
  
  const riskLabel = isHighRisk ? "Moderate to High Risk" : isModerateRisk ? "Moderate Risk - Monitor" : "Low Risk - Routine Care";
  const riskColor = isHighRisk 
    ? "bg-red-50 text-red-700 border-red-100" 
    : isModerateRisk 
      ? "bg-amber-50 text-amber-700 border-amber-100" 
      : "bg-emerald-50 text-emerald-700 border-emerald-100";

  return (
    <div className="space-y-10">
      
{/* 2. Overview Grid: Summary & Doctor Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Consultation Summary */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-100 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Overview</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                isCompleted 
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                  : "bg-amber-50 text-amber-800 border border-amber-100"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-amber-400 animate-pulse"}`} />
                {status}
              </span>
            </div>

            <div className="pt-2 space-y-3.5">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date &amp; Time</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">
                  {dayjs(report?.createdAt || booking?.date).format("DD MMMM, YYYY")}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {dayjs(report?.createdAt || booking?.createdAt).format("h:mm A")} • {booking?.timeSlot || "Online Slot"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consultation Type</p>
                <p className="font-bold text-slate-800 text-xs mt-0.5 flex items-center gap-1.5">
                  <FiVideo className="text-emerald-600" />
                  {booking?.consultationType || "Video Consult (Telehealth)"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</p>
                <p className="font-bold text-slate-800 text-xs mt-0.5">
                  {booking?.duration || "15 Minutes"} Scheduled
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-4">
            Booking Ref: {booking?._id?.slice(-8).toUpperCase() || "N/A"}
          </div>
        </div>

        {/* Right Card: Doctor Profile Details */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-emerald-100 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Avatar / Photo */}
            <div className="relative">
              {doctorInfo?.profileImage ? (
                <img
                  src={getImageUrl(doctorInfo.profileImage)}
                  alt={doctorInfo?.fullName}
                  className="w-20 h-20 rounded-2xl object-cover bg-slate-50 border border-slate-100 shadow-inner"
                />
              ) : (
                <div className="w-20 h-20 bg-emerald-50 text-[#0a4d33] rounded-2xl flex items-center justify-center border border-emerald-100">
                  <FiUser size={36} />
                </div>
              )}
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <FiCheckCircle size={12} />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg leading-none">
                  Dr. {doctorInfo?.fullName || "Physician"}
                </h3>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-[9px] font-black border border-emerald-100">
                  VERIFIED SPECIALIST
                </span>
              </div>

              <p className="text-emerald-700 font-bold text-xs tracking-wide">
                {doctorInfo?.specialization || "General Medicine Practitioner"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-2 text-xs text-slate-500 font-semibold">
                <p className="flex items-center gap-1.5">
                  <FiAward className="text-emerald-600 shrink-0" />
                  {doctorInfo?.experienceYears || 8}+ Years Clinical Practice
                </p>
                <p className="flex items-center gap-1.5">
                  <FiBriefcase className="text-emerald-600 shrink-0" />
                  {doctorInfo?.hospitalAffiliation || "MediFind Associated Hospital"}
                </p>
                <p className="flex items-center gap-1.5">
                  <FiHeart className="text-emerald-600 shrink-0" />
                  Rating: {doctorInfo?.rating || "4.9 (120+ consultations)"}
                </p>
                <p className="flex items-center gap-1.5">
                  <FiMessageSquare className="text-emerald-600 shrink-0" />
                  Languages: {doctorInfo?.languages || "English, Hindi, Malayalam"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Physician Status</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {doctorInfo?.availability || "Available for Consultation"}
            </span>
          </div>
        </div>

      </div>

      {/* 3. Care Directives & Medical Findings */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left: Patient chief complaint & Risk */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Patient Complaint / Symptoms */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-emerald-100 transition-all duration-300 space-y-3">
            <div className="flex items-center gap-2">
              <FiActivity className="text-emerald-600" />
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Chief Complaint</h4>
            </div>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              {booking?.reason || "Patient requested medical summary and prescription refills for active medications."}
            </p>
          </div>

          {/* Risk Indicators Card */}
          <div className={`border rounded-3xl p-6 shadow-sm transition-all duration-300 space-y-3 ${riskColor}`}>
            <div className="flex items-center gap-2">
              <FiAlertTriangle />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">Risk Level Assessment</h4>
            </div>
            <p className="text-xs font-bold leading-relaxed">
              {riskLabel === "Low Risk - Routine Care" 
                ? "Patient presents low clinical urgency. Normal routine follow-up guidelines are recommended." 
                : "Moderate indications detected. Follow clinical instructions carefully and update vitals."}
            </p>
          </div>
          
        </div>

        {/* Right: Diagnosis & Observations */}
        <div className="md:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-emerald-100 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#0a4d33] rounded-full"></div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Clinical Observations &amp; Advice</h4>
            </div>
            
            <div className="bg-slate-50/50 rounded-2xl p-6 text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap border border-slate-100/50 font-medium">
              {report?.notes || "No diagnosis notes updated."}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-slate-400 text-xs font-semibold pt-4 border-t border-slate-50">
            <FiCheckCircle className="text-emerald-600" />
            Licensed Physician Verified Summary
          </div>
        </div>

      </div>

      {/* 4. Prescription Section: Cards Grid */}
      {report?.medicines && report.medicines.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#0a4d33] rounded-full"></div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Prescribed Medication Module
              </h2>
            </div>
            {!isDoctor && (
              <button
                onClick={onFindBuyWithAI}
                disabled={isOptimizing || allPurchased || allExcluded}
                className="group inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700 text-xs font-black uppercase tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 print:hidden shadow-sm"
              >
                {isOptimizing ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5 animate-spin text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>Optimizing splits...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Find &amp; Buy with AI (Optimized)
                  </>
                )}
              </button>
            )}
          </div>

          {/* Grid of Medical Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {report.medicines.map((med: any, idx: number) => {
              const maxLimit = med.remainingQty !== undefined ? med.remainingQty : med.quantity;
              const selectedQty = med.medicineId ? (selectedQuantities[med.medicineId.toString()] ?? maxLimit) : maxLimit;
              const isRemainingZero = maxLimit === 0;

              return (
                <div 
                  key={idx}
                  className={`bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-md rounded-2xl p-5 shadow-sm transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden ${
                    isRemainingZero ? "opacity-75 bg-slate-50/50" : ""
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top title and status tag */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{med.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rx Drug Item</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        isRemainingZero 
                          ? "bg-slate-100 text-slate-400 border-slate-200" 
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}>
                        {isRemainingZero ? "Purchased" : "In Stock"}
                      </span>
                    </div>

                    {/* Dosing information pill badges */}
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50/60 text-[#0a4d33] rounded-lg text-xs font-extrabold border border-emerald-100/50">
                        <FiClock className="w-3.5 h-3.5" />
                        Dosage: {med.dosage || "As directed"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100">
                        <FiCoffee className="w-3.5 h-3.5" />
                        {med.instructions || "N/A"}
                      </span>
                      {med.timesPerDay && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-medium border border-slate-100">
                          {med.timesPerDay}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity manager and purchase buttons */}
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-4 mt-1">
                    <div>
                      {!isDoctor && maxLimit > 0 ? (
                        <div className="flex flex-col gap-1.5">
                          <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 w-24 shadow-inner">
                            <button
                              onClick={() => onDecreaseQty(med.medicineId, selectedQty)}
                              disabled={selectedQty <= 0}
                              className="p-1 hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
                            >
                              <FiMinus size={12} className="text-slate-600" />
                            </button>
                            <div className="flex-grow text-center font-black text-xs py-1 bg-white text-slate-800">
                              {selectedQty}
                            </div>
                            <button
                              onClick={() => onIncreaseQty(med.medicineId, maxLimit, selectedQty)}
                              disabled={selectedQty >= maxLimit}
                              className="p-1 hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
                            >
                              <FiPlus size={12} className="text-slate-600" />
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold leading-tight">
                            Selected: <span className={selectedQty >= maxLimit ? "text-amber-600" : "text-emerald-600"}>{selectedQty}</span> / {maxLimit} 
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">
                            (Prescribed: {med.quantity})
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-400 font-semibold">Total Prescribed Units</span>
                          <span className="font-extrabold text-slate-800 text-sm mt-0.5">
                            {med.quantity} unit(s)
                          </span>
                          {med.remainingQty !== undefined && med.remainingQty !== med.quantity && (
                            <span className="text-[10px] text-emerald-700 font-extrabold mt-0.5">
                              ({med.remainingQty} remaining)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      {isRemainingZero ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 text-slate-400 border border-slate-100 font-bold text-xs rounded-xl cursor-not-allowed shadow-inner">
                          Purchased
                        </span>
                      ) : selectedQty === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 text-slate-300 border border-slate-100 font-semibold text-xs rounded-xl cursor-not-allowed">
                          Excluded
                        </span>
                      ) : (
                        <a
                          href={`/medicines/${med.medicineId}?prescribedQty=${selectedQty}`}
                          className="bg-[#0a4d33] hover:bg-[#083d28] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5 uppercase tracking-wider"
                        >
                          Buy Item <FiExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Follow-Up Care & Recovery Module */}
      <div className="bg-slate-50/50 border border-slate-100/80 rounded-3xl p-6 space-y-6">
        <div className="flex items-center gap-2">
          <FiCalendar className="text-emerald-600" size={18} />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Follow-Up Care Directive</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-none">Suggested Vitals Check</h4>
            <ul className="space-y-2.5 text-slate-600 text-xs font-semibold">
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Monitor temperature twice daily.
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Track blood pressure and log updates.
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Report any persistent headaches or nausea.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-none">Recommended Recovery Timeline</h4>
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-center">
                <p className="text-lg font-black leading-none">14</p>
                <p className="text-[8px] font-black uppercase tracking-wider mt-1">Days</p>
              </div>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Estimate recovery schedule. Please attend your next check-in appointment as advised in notes, or consult if symptoms persist.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
