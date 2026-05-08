"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../navbar/page";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import api from "../../apis/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiUser, FiCheckCircle, FiBell } from "react-icons/fi";
import { useRouter } from "next/navigation";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export default function DoctorAppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [doctorId, setDoctorId] = useState("");
    const [selectedApp, setSelectedApp] = useState<any>(null);

    const fetchAppointments = async () => {
        try {
            const res = await api.get("/api/v1/booking/doctor-appointments");
            if (res.data.success) {
                setAppointments(res.data.bookings);
            }
        } catch (err) {
            console.error("Error fetching appointments:", err);
            toast.error("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    const handleNotifyPatient = (patientId: string, roomId: string) => {
        console.log("Notifying patient:", patientId, "for room:", roomId);
        if (!patientId || !roomId) {
            toast.error("Missing patient ID or room ID");
            return;
        }
        socket.emit("notify_patient", {
            patientId,
            roomId,
            doctorName: "Doctor" 
        });
        toast.success("Notification sent to patient!");
    };

    const handleCompleteConsultation = async (roomId: string) => {
        try {
            const res = await api.post(`/api/v1/consultation/${roomId}/complete`);
            if (res.data.success) {
                toast.success("Consultation marked as completed!");
                setSelectedApp(null);
                fetchAppointments(); 
            }
        } catch (err) {
            console.error("Error completing consultation:", err);
            toast.error("Failed to complete consultation");
        }
    };

    useEffect(() => {
        const fetchDoctorInfo = async () => {
            try {
                const { getApplicationStatus } = await import("../../apis/doctor.api");
                const res = await getApplicationStatus();
                if (res.data.application) {
                    const dId = res.data.application._id;
                    setDoctorId(dId);
                    socket.emit("join_doctor_room", dId);
                }
            } catch (err) {
                console.log("Error fetching doctor info");
            }
        };

        fetchDoctorInfo();
        fetchAppointments();

        socket.on("slot_booked", (data) => {
            toast.info(`New appointment booked: ${data.timeSlot} by ${data.patientName || "a patient"}`);
            fetchAppointments(); // Refresh list
        });

        socket.on("payment_confirmed", (data) => {
            setAppointments((prev) => 
                prev.map(app => app._id === data.bookingId ? { ...app, paymentStatus: data.status } : app)
            );
            toast.success("Payment received for an appointment! 💰");
        });

        return () => {
            socket.off("slot_booked");
            socket.off("payment_confirmed");
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600 border-r-2 border-emerald-600/30"></div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-50 font-sans flex relative">
            <Sidebar />
            
            <main className="flex-1 max-w-6xl mx-auto pt-32 pb-20 px-6 ml-0 md:ml-64">
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 leading-[1.1] mb-2">
                            Patient <span className="text-emerald-600">Appointments</span>
                        </h1>
                        <p className="text-slate-500">Track and manage your upcoming consultations.</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Live Updates Active</span>
                    </div>
                </div>

                {appointments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {appointments.map((app, index) => (
                                <motion.div 
                                    key={app._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col md:flex-row items-center gap-6"
                                >
                                    <div className="bg-emerald-50 text-emerald-600 p-5 rounded-[1.5rem]">
                                        <FiCalendar size={24} />
                                    </div>
                                    
                                    <div className="flex-1 space-y-1 text-center md:text-left">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appointment Date</p>
                                        <p className="font-bold text-lg text-slate-900">{dayjs(app.date).format("DD MMM YYYY")}</p>
                                    </div>

                                    <div className="flex-1 space-y-1 text-center md:text-left">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slot</p>
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 font-black">
                                            <FiClock /> {app.timeSlot}
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-1 text-center md:text-left">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Name</p>
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-900 font-bold">
                                            <FiUser /> {app.userId?.name || "Patient Name"}
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-1 text-center md:text-left">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                            app.paymentStatus === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                        }`}>
                                            {app.paymentStatus}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setSelectedApp(app)}
                                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-emerald-600 transition-all"
                                        >
                                            View Details
                                        </button>
                                        {app.roomId && (
                                            <>
                                                <button 
                                                    onClick={() => router.push(`/consultation/${app.roomId}`)}
                                                    className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all"
                                                >
                                                    Join Room
                                                </button>
                                                <button 
                                                    onClick={() => handleNotifyPatient(app.userId?._id, app.roomId)}
                                                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all"
                                                >
                                                    Notify Patient
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl shadow-slate-200/40 border border-slate-100">
                        <FiBell className="mx-auto text-slate-100 mb-6" size={80} />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No Appointments Yet</h3>
                        <p className="text-slate-400 max-w-sm mx-auto font-medium">When patients book slots, they will appear here in real-time.</p>
                    </div>
                )}

                {/* Details Modal */}
                <AnimatePresence>
                    {selectedApp && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedApp(null)}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                            />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8">
                                    <button 
                                        onClick={() => setSelectedApp(null)}
                                        className="text-slate-300 hover:text-slate-900 transition-colors"
                                    >
                                        <FiBell size={24} className="rotate-45" />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl">
                                            <FiUser size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900">{selectedApp.userId?.name}</h2>
                                            <p className="text-slate-500 font-medium">Patient Details</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</p>
                                            <p className="font-bold text-slate-900">{dayjs(selectedApp.date).format("DD MMM")}, {selectedApp.timeSlot}</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</p>
                                            <p className={`font-bold capitalize ${selectedApp.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-orange-600'}`}>
                                                {selectedApp.paymentStatus}
                                            </p>
                                        </div>
                                    </div>

                                    {selectedApp.roomId && (
                                        <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Room ID</p>
                                            <p className="font-bold text-emerald-600 font-mono text-sm break-all">{selectedApp.roomId}</p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <FiClock className="text-emerald-600" />
                                            <span className="text-sm font-bold">{selectedApp.userId?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <FiCheckCircle className="text-emerald-600" />
                                            <span className="text-sm font-bold">{selectedApp.userId?.phone || "No phone provided"}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Reason for Visit</p>
                                        <p className="text-slate-600 font-medium italic">"{selectedApp.reason || "General Consultation"}"</p>
                                    </div>

                                    {selectedApp.roomId && (
                                        <>
                                            {selectedApp.consultationStatus === "completed" ? (
                                                <button 
                                                    disabled
                                                    className="w-full bg-slate-100 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed mb-3 flex items-center justify-center gap-2"
                                                >
                                                    Call Completed
                                                </button>
                                            ) : dayjs().isAfter(dayjs(selectedApp.scheduledAt).add(15, "minute")) ? (
                                                <button 
                                                    disabled
                                                    className="w-full bg-slate-100 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed mb-3 flex items-center justify-center gap-2"
                                                >
                                                    Video call time expired. You cannot join.
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => router.push(`/consultation/${selectedApp.roomId}`)}
                                                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl mb-3 flex items-center justify-center gap-2"
                                                >
                                                    Join Consultation Room
                                                </button>
                                            )}
                                            
                                            {selectedApp.consultationStatus !== "completed" && (
                                                <button 
                                                    onClick={() => handleCompleteConsultation(selectedApp.roomId)}
                                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl mb-3 flex items-center justify-center gap-2"
                                                >
                                                    Mark as Completed
                                                </button>
                                            )}
                                        </>
                                    )}
                                    <button 
                                        onClick={() => setSelectedApp(null)}
                                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
