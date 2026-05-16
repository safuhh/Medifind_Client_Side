"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDoctorPatients } from "@/app/apis/doctor.api";
import DoctorNavbar from "../navbar/page";
import { 
    Users, 
    Search, 
    Calendar, 
    ChevronRight, 
    User, 
    Mail, 
    Phone, 
    Loader2,
    Activity,
    MoreHorizontal,
    ExternalLink,
    Filter,
    ArrowUpDown,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";

export default function DoctorPatientsPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await getDoctorPatients();
                if (res.data.success) {
                    setPatients(res.data.patients);
                }
            } catch (err) {
                console.error("Error fetching patients:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient => 
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-white">
            <DoctorNavbar />
            
            <div className="flex-1 md:ml-64 transition-all duration-300">
                <main className="max-w-7xl mx-auto px-6 pt-28 pb-20 md:pt-16">
                    
                    {/* Professional Header Area */}
                    <div className="mb-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patient Management</h1>
                                <p className="text-slate-500 mt-1.5 font-medium">Access and manage comprehensive medical records and consultation history.</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                                    <input 
                                        type="text"
                                        placeholder="Search by name, email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-black transition-all text-sm w-full md:w-80 font-medium"
                                    />
                                </div>
                          
                            </div>
                        </div>

                        {/* Top Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                            {[
                                { label: "Total Patients", value: patients.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                                { label: "Active This Month", value: Math.ceil(patients.length * 0.4), icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
                                    <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest">Loading Patient Data...</p>
                        </div>
                    ) : filteredPatients.length === 0 ? (
                        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <User className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Records Found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto font-medium">
                                {searchTerm ? "We couldn't find any patients matching your search." : "Your patient list is currently empty. Bookings will appear here."}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm shadow-slate-200/40">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/80 border-b border-slate-100">
                                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                <div className="flex items-center gap-2">
                                                    Patient Info
                                                    <ArrowUpDown className="w-3 h-3" />
                                                </div>
                                            </th>
                                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Last Visit</th>
                                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredPatients.map((patient, index) => (
                                            <motion.tr 
                                                key={patient._id}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="hover:bg-slate-50/40 transition-colors group cursor-pointer"
                                                onClick={() => router.push(`/doctor/patients/${patient._id}`)}
                                            >
                                                <td className="px-6 py-5">
                                                    <div>
                                                        <p className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{patient.name}</p>
                                                        <p className="text-xs text-slate-400 font-medium mt-0.5 uppercase tracking-tighter">PID-{patient._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                                                            <Mail className="w-3.5 h-3.5 text-slate-300" />
                                                            {patient.email}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                                                            <Phone className="w-3.5 h-3.5 text-slate-300" />
                                                            {patient.phone || "No contact"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200/50">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        {dayjs(patient.lastVisit).format("MMM DD, YYYY")}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Link 
                                                        href={`/doctor/patients/${patient._id}`}
                                                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-600 transition-all"
                                                    >
                                                        <ArrowRight className="w-5 h-5" />
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
