"use client";

import { FiDownload } from "react-icons/fi";
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
  return (
    <div className="bg-gradient-to-r from-[#0a4d33] to-[#0d6b47] p-10 md:p-12 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm border border-emerald-400/20">
              {isEditing ? "Drafting Mode" : "Verified Report"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {isEditing
              ? "Consultation Health Report Form"
              : "Medical Consultation Summary"}
          </h1>
          <p className="text-emerald-100/80 text-sm mt-2">
            {report
              ? `Document ID: ${report._id.substring(0, 8).toUpperCase()} • Issued on ${dayjs(report.createdAt).format("DD MMMM YYYY")}`
              : `New Report for Booking Reference #${booking?._id?.substring(0, 8).toUpperCase()}`}
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          {isDoctor && !isEditing && (
            <button
              onClick={onStartEditing}
              className="bg-white hover:bg-emerald-50 text-[#0a4d33] px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              Edit Report
            </button>
          )}
          {!isEditing && (
            <button
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl active:scale-95"
            >
              <FiDownload size={16} /> Print Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
