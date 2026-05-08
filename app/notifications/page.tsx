"use client";

import React, { useState, useEffect } from "react";
import NavbarPage from "../navbar/page";
import Footer from "../footer/page";
import api from "../apis/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiUser, FiBell, FiVideo, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(dayjs());

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await api.get("/api/v1/booking/patient-appointments");
                if (res.data.success) {
                    setAppointments(res.data.bookings);
                }
            } catch (err) {
                console.error("Error fetching appointments:", err);
                toast.error("Failed to fetch notifications");
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

    const isJoinable = (scheduledAt: string) => {
        if (!scheduledAt) return false;
        const scheduledTime = dayjs(scheduledAt);
        const startTime = scheduledTime.subtract(10, "minute");
        const endTime = scheduledTime.add(30, "minute");
        return currentTime.isAfter(startTime) && currentTime.isBefore(endTime);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600 border-r-2 border-emerald-600/30"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfdfd] font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <NavbarPage />
            <br /><br /><br /><br />
            
            <main className="max-w-6xl mx-auto py-12 px-6">
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 leading-[1.1] mb-2">
                            My <span className="text-emerald-600">Consultations</span>
                        </h1>
                        <p className="text-slate-500">View and join your scheduled video calls.</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Live Updates</span>
                    </div>
                </div>

                {appointments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {appointments.map((app, index) => {
                                const joinable = isJoinable(app.scheduledAt);
                                return (
                                    <motion.div 
                                        key={app._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col md:flex-row items-center gap-6"
                                    >
                                        <div className="bg-emerald-50 text-emerald-600 p-5 rounded-[1.5rem]">
                                            <FiVideo size={24} />
                                        </div>
                                        
                                        <div className="flex-1 space-y-1 text-center md:text-left">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</p>
                                            <p className="font-bold text-lg text-slate-900">{app.doctorId?.name || "Doctor"}</p>
                                        </div>

                                        <div className="flex-1 space-y-1 text-center md:text-left">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</p>
                                            <p className="font-bold text-slate-900">
                                                {dayjs(app.date).format("DD MMM YYYY")}, {app.timeSlot}
                                            </p>
                                        </div>

                                        <div className="flex-1 space-y-1 text-center md:text-left">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                app.paymentStatus === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                            }`}>
                                                {app.paymentStatus === 'paid' ? 'Confirmed' : 'Pending Payment'}
                                            </span>
                                        </div>

                                        <div>
                                            {app.consultationStatus === "completed" ? (
                                                <button 
                                                    disabled
                                                    className="bg-slate-100 text-slate-400 px-6 py-3 rounded-xl font-bold text-xs cursor-not-allowed"
                                                >
                                                    Call Completed
                                                </button>
                                            ) : app.roomId && joinable ? (
                                                <button 
                                                    onClick={() => router.push(`/consultation/${app.roomId}`)}
                                                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all flex items-center gap-2"
                                                >
                                                    Join Call <FiArrowRight />
                                                </button>
                                            ) : app.roomId ? (
                                                <button 
                                                    disabled
                                                    className="bg-slate-100 text-slate-400 px-6 py-3 rounded-xl font-bold text-xs cursor-not-allowed"
                                                    title={dayjs(currentTime).isAfter(dayjs(app.scheduledAt).add(30, "minute")) ? "Video call time expired. You cannot join." : "You can join 10 minutes before the scheduled time."}
                                                >
                                                    {dayjs(currentTime).isAfter(dayjs(app.scheduledAt).add(30, "minute")) ? "Video call time expired. You cannot join." : "Not Time Yet"}
                                                </button>
                                            ) : (
                                                <span className="text-slate-400 text-xs font-bold">No Room Assigned</span>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl shadow-slate-200/40 border border-slate-100">
                        <FiBell className="mx-auto text-slate-100 mb-6" size={80} />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No Consultations Scheduled</h3>
                        <p className="text-slate-400 max-w-sm mx-auto font-medium">When you book an appointment with a doctor, it will appear here.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
