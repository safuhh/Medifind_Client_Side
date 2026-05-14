"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/apis/api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import NavbarPage from "@/app/navbar/page";
import Footer from "@/app/footer/page";
import { FiArrowLeft, FiDownload, FiExternalLink, FiCheckCircle, FiClock, FiUser } from "react-icons/fi";
import { getImageUrl } from "@/app/utils/imageUrl";
import { motion } from "framer-motion";

export default function HealthReportPage() {
    const { bookingId } = useParams();
    const router = useRouter();
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await api.get(`/health-report/booking/${bookingId}`);
                if (res.data.success) {
                    setReport(res.data.report);
                }
            } catch (err) {
                console.error("Error fetching report:", err);
                toast.error("Failed to load health report");
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchReport();
        }
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#0a4d33] border-r-2 border-[#0a4d33]/30"></div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen flex flex-col bg-[#fafafa]">
                <NavbarPage />
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiClock size={24} className="text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Report Found</h2>
                        <p className="text-slate-500 text-sm mb-6">The doctor hasn't written a health report for this consultation yet.</p>
                        <button 
                            onClick={() => router.back()}
                            className="bg-[#0a4d33] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#083d28] transition-colors inline-flex items-center gap-2"
                        >
                            <FiArrowLeft /> Go Back
                        </button>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <NavbarPage />
            
            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-32 sm:px-8 lg:px-10">
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="mb-8 text-slate-600 hover:text-[#0a4d33] font-semibold text-sm flex items-center gap-2 transition-colors"
                >
                    <FiArrowLeft size={16} /> Back to Dashboard
                </button>

                {/* Premium Medical Report Layout */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
                >
                    
                    {/* Header: Gradient Banner Style */}
                    <div className="bg-gradient-to-r from-[#0a4d33] to-[#0d6b47] p-10 md:p-12 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm border border-emerald-400/20">
                                        Verified Report
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Medical Consultation Summary</h1>
                                <p className="text-emerald-100/80 text-sm mt-2">
                                    Document ID: {report._id.substring(0, 8).toUpperCase()} • Issued on {dayjs(report.createdAt).format("DD MMMM YYYY")}
                                </p>
                            </div>
                            <button 
                                onClick={() => window.print()}
                                className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl active:scale-95"
                            >
                                <FiDownload size={16} /> Print Report
                            </button>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-10">
                        
                        {/* Info Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Patient Card */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100/80 hover:border-emerald-100 transition-colors group">
                                <div className="w-10 h-10 bg-emerald-50 text-[#0a4d33] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0a4d33] group-hover:text-white transition-colors">
                                    <FiUser size={20} />
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient</p>
                                <p className="font-bold text-slate-900 text-base">{report.patientId?.name}</p>
                                <p className="text-slate-500 text-xs mt-0.5">{report.patientId?.email}</p>
                            </div>

                            {/* Doctor Card */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100/80 hover:border-emerald-100 transition-colors group">
                                <div className="flex items-center gap-4 mb-4">
                                    <img 
                                        src={report.doctorId?.profileImage ? getImageUrl(report.doctorId.profileImage) : null} 
                                        alt={report.doctorId?.fullName}
                                        className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                                    />
                                    <div className="w-4 h-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center -ml-6 -mt-6 z-10 border-2 border-white">
                                        <FiCheckCircle size={10} />
                                    </div>
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Physician</p>
                                <p className="font-bold text-slate-900 text-base">Dr. {report.doctorId?.fullName}</p>
                                <p className="text-[#0a4d33] text-xs font-semibold mt-0.5">{report.doctorId?.specialization}</p>
                            </div>

                            {/* Date Card */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100/80 hover:border-emerald-100 transition-colors group">
                                <div className="w-10 h-10 bg-emerald-50 text-[#0a4d33] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0a4d33] group-hover:text-white transition-colors">
                                    <FiClock size={20} />
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Consultation Date</p>
                                <p className="font-bold text-slate-900 text-base">{dayjs(report.createdAt).format("DD MMMM, YYYY")}</p>
                                <p className="text-slate-500 text-xs mt-0.5">{dayjs(report.createdAt).format("h:mm A")}</p>
                            </div>
                        </div>

                        {/* Diagnosis & Advice */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#0a4d33] rounded-full"></div>
                                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">Clinical Observations</h2>
                            </div>
                            <div className="bg-[#fafafa] rounded-2xl p-8 text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap border border-slate-100">
                                {report.notes}
                            </div>
                        </div>

                        {/* Prescription Table */}
                        {report.medicines && report.medicines.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-5 bg-[#0a4d33] rounded-full"></div>
                                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">Prescribed Medication</h2>
                                </div>
                                
                                <div className="overflow-hidden bg-white border border-slate-100 rounded-2xl">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-100">
                                                <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider">Medicine</th>
                                                <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider">Dosage</th>
                                                <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider">Instructions</th>
                                                <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider">Times/Day</th>
                                                <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider">Qty</th>
                                                <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider text-right">Acquisition</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {report.medicines.map((med: any, idx: number) => (
                                                <tr key={idx} className="text-slate-700 hover:bg-[#fafafa] transition-colors">
                                                    <td className="py-5 px-6 font-bold text-slate-900">{med.name}</td>
                                                    <td className="py-5 px-6 text-slate-600 font-medium">{med.dosage || "As directed"}</td>
                                                    <td className="py-5 px-6 text-slate-500 text-xs leading-relaxed">{med.instructions || "N/A"}</td>
                                                    <td className="py-5 px-6 text-slate-500 text-xs leading-relaxed">{med.timesPerDay || "N/A"}</td>
                                                    {/* this is the medicine quantity that is given by the doctor */}
                                                    <td className="py-5 px-6 text-slate-600 font-medium">{med.quantity || 1}</td>
                                                    <td className="py-5 px-6 text-right">
                                                        <a 
                                                            // this is for sending the medicine quantity to the medicine page
                                                            href={`/medicines/${med.medicineId}?prescribedQty=${med.quantity}`}
                                                            className="bg-[#0a4d33] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#083d28] transition-all shadow-sm hover:shadow-md active:scale-95 inline-flex items-center gap-1.5"
                                                        >
                                                            Purchase <FiExternalLink size={12} />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Footer / Disclaimer */}
                        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <FiCheckCircle className="text-emerald-500" size={14} />
                                <p>This is a digitally verified medical document and does not require a physical signature.</p>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">MediFind Healthcare Platform</p>
                        </div>
                    </div>
                </motion.div>
            </main>
            
            <Footer />
        </div>
    );
}
