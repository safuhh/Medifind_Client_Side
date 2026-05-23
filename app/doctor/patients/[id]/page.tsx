"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPatientDetails } from "@/app/apis/doctor.api";
import DoctorNavbar from "../../navbar/page";
import { 
    User, 
    Calendar, 
    Clock, 
    FileText, 
    Mail, 
    Phone, 
    MapPin, 
    Activity,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    ShieldCheck,
    Stethoscope,
    Plus,
    Download,
    History
} from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

export default function PatientDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getPatientDetails(id as string);
                if (res.data.success) {
                    setData(res.data);
                }
            } catch (err) {
                console.error("Error fetching patient details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Accessing Medical Database...</p>
                </div>
            </div>
        );
    }

    if (!data?.patient) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center max-w-sm w-full shadow-xl shadow-slate-200/50">
                    <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Record Error</h2>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">The clinical file you are attempting to retrieve is either encrypted or does not exist.</p>
                    <button onClick={() => router.back()} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                        Return to Directory
                    </button>
                </div>
            </div>
        );
    }

    const { patient, history } = data;

    return (
        <div className="min-h-screen bg-white">
            <DoctorNavbar />
            
            <div className="flex-1 md:ml-64 transition-all duration-300">
                <main className="max-w-7xl mx-auto px-6 pt-28 pb-20 md:pt-16">
                    
                    {/* Professional Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                        <div className="flex items-center gap-6">
                            <button 
                                onClick={() => router.back()}
                                className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center shadow-sm"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{patient.name}</h1>
                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Clinical Verified</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                                    <span>PID: #{patient._id.slice(-8).toUpperCase()}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        Member since {dayjs(patient.createdAt).format("MMM YYYY")}
                                    </span>
                                </div>
                            </div>
                        </div>

                      
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Left Column: Summary & Contact */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
                                <div className="flex flex-col items-center mb-8">
                                    <h3 className="text-2xl font-black text-slate-900 text-center">{patient.name}</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Verified Patient File</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-5 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group hover:border-emerald-100 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Email Contact</p>
                                            <p className="text-sm font-bold text-slate-800 truncate">{patient.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group hover:border-emerald-100 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Mobile Number</p>
                                            <p className="text-sm font-bold text-slate-800">{patient.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group hover:border-emerald-100 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
                                            <p className="text-sm font-bold text-slate-800">India (Registered)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Stats Card */}
                            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Consultations</p>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                        <History className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-5xl font-black text-slate-900">{history.length}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Clinical Sessions</p>
                                </div>
                                <div className="mt-6 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-emerald-500 rounded-full"
                                        />
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600">COMPLETE</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Medical History Timeline */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm shadow-slate-200/30">
                                <div className="flex items-center justify-between mb-12">
                                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                                        <FileText className="w-8 h-8 text-emerald-600" />
                                     Consultation Logs
                                    </h3>
                                    <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                                        Latest Session: {dayjs(history[0]?.date).format("MMM DD, YYYY")}
                                    </div>
                                </div>

                                <div className="space-y-12 relative">
                                    {/* Timeline spine */}
                                    <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gradient-to-b from-emerald-100 via-slate-100 to-transparent"></div>

                                    {history.map((booking: any, index: number) => (
                                        <motion.div 
                                            key={booking._id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="relative pl-20 group/log"
                                        >
                                            {/* Node */}
                                            <div className="absolute left-0 top-1 w-14 h-14 rounded-2xl bg-white border-4 border-slate-50 flex items-center justify-center z-10 shadow-sm group-hover/log:border-emerald-50 transition-all">
                                                <div className={`w-3.5 h-3.5 rounded-full ${booking.status === 'confirmed' ? 'bg-emerald-600 animate-pulse' : 'bg-slate-300'}`}></div>
                                            </div>

                                            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden group-hover/log:border-emerald-500/30 group-hover/log:shadow-2xl group-hover/log:shadow-emerald-900/5 transition-all duration-500">
                                                {/* Card Header: Date & Status */}
                                                <div className="px-8 py-6 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-900 shadow-sm">
                                                            <span className="text-[10px] font-black uppercase leading-none text-emerald-600 mb-0.5">{dayjs(booking.date).format("MMM")}</span>
                                                            <span className="text-lg font-black leading-none">{dayjs(booking.date).format("DD")}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-bold text-slate-900">{dayjs(booking.date).format("dddd, YYYY")}</h4>
                                                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                Scheduled: {booking.timeSlot}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                            booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                        <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                            ID: {booking._id.slice(-6).toUpperCase()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-8 space-y-8">
                                                    {/* Subjective Analysis */}
                                                    {booking.reason && (
                                                        <div className="relative pl-6 border-l-2 border-slate-100">
                                                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                 <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                                                 Primary Complaint
                                                             </div>
                                                            <p className="text-slate-700 text-sm leading-relaxed font-medium">{booking.reason}</p>
                                                        </div>
                                                    )}

                                                    {/* Clinical Assessment */}
                                                    {booking.report ? (
                                                        <div className="space-y-8">
                                                            <div className="relative p-6 rounded-2xl bg-emerald-50/20 border border-emerald-50 shadow-sm">
                                                                <Stethoscope className="absolute right-4 top-4 w-12 h-12 text-emerald-100/50" />
                                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Doctor's Clinical Assessment</p>
                                                                <div className="relative">
                                                                    <span className="absolute -left-2 -top-2 text-4xl text-emerald-200 font-serif leading-none">"</span>
                                                                    <p className="text-slate-800 text-base leading-relaxed font-serif italic font-medium px-4">
                                                                        {booking.report.notes}
                                                                    </p>
                                                                    <span className="absolute -right-2 bottom-0 text-4xl text-emerald-200 font-serif leading-none translate-y-2">"</span>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Prescription Plan */}
                                                            {booking.report.medicines && booking.report.medicines.length > 0 && (
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-4">
                                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Therapeutic Plan / Medications</p>
                                                                        <div className="h-px flex-1 bg-slate-100 mx-4"></div>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        {booking.report.medicines.map((med: any, mIdx: number) => (
                                                                            <div key={mIdx} className="p-5 bg-white rounded-2xl border border-slate-100 flex items-center justify-between group/med hover:border-emerald-200 transition-all shadow-sm">
                                                                                <div>
                                                                                    <p className="font-bold text-slate-900 text-sm">{med.name}</p>
                                                                                    <div className="flex items-center gap-3 mt-1">
                                                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{med.dosage}</span>
                                                                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{med.timesPerDay} Sessions</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
                                                                                    <CheckCircle2 size={18} />
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-12 px-8 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/30 text-center">
                                                            <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                                                                <AlertCircle className="w-6 h-6 text-slate-300" />
                                                            </div>
                                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Report Pending</p>
                                                            <p className="text-xs text-slate-300 font-medium">Detailed clinical summary for this session has not been finalized yet.</p>
                                                        </div>
                                                    )}

                                                    {/* Footer Info */}
                                                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Payment Status: {booking.paymentStatus}</p>
                                                        </div>
                                                        <p className="text-[10px] font-black text-slate-900">NET AMOUNT: ₹{booking.amount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
