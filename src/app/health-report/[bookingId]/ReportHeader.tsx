"use client";

import { FiDownload, FiEdit2, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";
import dayjs from "dayjs";

interface ReportHeaderProps {
  isEditing: boolean;
  isDoctor: boolean;
  report: any;
  booking: any;
  onStartEditing: () => void;
}

export default function ReportHeader({
  isEditing,
  isDoctor,
  report,
  booking,
  onStartEditing,
}: ReportHeaderProps) {
  const documentId = report?._id?.substring(0, 8).toUpperCase() || booking?._id?.substring(0, 8).toUpperCase();
  const dateFormatted = report?.createdAt 
    ? dayjs(report.createdAt).format("DD MMMM YYYY") 
    : dayjs(booking?.date).format("DD MMMM YYYY");

  return (
    <div className="relative bg-gradient-to-r from-emerald-950 via-[#0a4d33] to-emerald-900 p-8 md:p-10 text-white overflow-hidden border-b border-emerald-800/40">
      {/* Decorative High-Tech Grid Backing */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md shadow-sm ${
              isEditing 
                ? "bg-amber-500/10 text-amber-300 border-amber-500/30" 
                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isEditing ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
              {isEditing ? "Drafting Report" : "Verified Clinical Document"}
            </span>
            
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-200/80 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md font-bold uppercase tracking-wider">
              <FiShield className="text-emerald-400" />
              HIPAA COMPLIANT
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            {isEditing
              ? "Consultation Health Report Form"
              : "Medical Consultation Summary"}
          </h1>

          <p className="text-emerald-100/70 text-xs font-semibold tracking-wide">
            {report
              ? `DOC-ID: ${documentId} • Issued on ${dateFormatted}`
              : `Reference Booking #${documentId} • Pending Physician Write-up`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 print:hidden">
          {isDoctor && !isEditing && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onStartEditing}
              className="bg-white hover:bg-emerald-50 text-[#0a4d33] px-5 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 cursor-pointer"
            >
              <FiEdit2 size={13} /> Edit Report
            </motion.button>
          )}
          {!isEditing && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-white/10 backdrop-blur-md shadow-md cursor-pointer"
            >
              <FiDownload size={14} /> Print / Export
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
