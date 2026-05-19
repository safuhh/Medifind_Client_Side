"use client";

import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { FiBell, FiUser, FiClock, FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";
import api from "@/app/apis/api";
import { toast } from "react-toastify";

interface AppointmentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    app: any;
    onCompleteSuccess?: () => void;
}

export default function AppointmentDetailsModal({ isOpen, onClose, app, onCompleteSuccess }: AppointmentDetailsModalProps) {
    const router = useRouter();

    const parseLocalSlot = (bookingDate: string | Date, timeSlot: string) => {
        let hours = 0;
        let minutes = 0;

        if (timeSlot) {
            const parts = timeSlot.split(" ");
            const timeParts = parts[0].split(":");
            hours = parseInt(timeParts[0]);
            minutes = parseInt(timeParts[1]);
            const modifier = parts[1];

            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;
        }

        return dayjs(bookingDate)
            .startOf("day")
            .add(hours, "hour")
            .add(minutes, "minute");
    };

    const scheduledTime = app && app.scheduledAt
        ? dayjs(app.scheduledAt)
        : app && app.date && app.timeSlot
            ? parseLocalSlot(app.date, app.timeSlot)
            : app ? dayjs(app.createdAt) : null;
    const now = dayjs();
    const startTime = scheduledTime;
    const endTime = scheduledTime ? scheduledTime.add(30, "minute") : null;
    const isTime = scheduledTime && endTime
        ? now.isAfter(startTime) && now.isBefore(endTime)
        : false;

    const handleCompleteConsultation = async (roomId: string) => {
        try {
            const res = await api.post(`/consultation/${roomId}/complete`);
            if (res.data.success) {
                toast.success("Consultation marked as completed!");
                onClose();
                if (onCompleteSuccess) onCompleteSuccess();
            }
        } catch (err) {
            console.error("Error completing consultation:", err);
            toast.error("Failed to complete consultation");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && app && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
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
                                onClick={onClose}
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
                                    <h2 className="text-3xl font-black text-slate-900">
                                        {app.userId?.name}
                                    </h2>
                                    <p className="text-slate-500 font-medium">
                                        Patient Details
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Date & Time
                                    </p>
                                    <p className="font-bold text-slate-900">
                                        {dayjs(app.date).format("DD MMM")},{" "}
                                        {app.timeSlot}
                                    </p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Payment Status
                                    </p>
                                    <p
                                        className={`font-bold capitalize ${app.paymentStatus === "paid" ? "text-emerald-600" : "text-orange-600"}`}
                                    >
                                        {app.paymentStatus}
                                    </p>
                                </div>
                            </div>

                            {app.roomId && isTime && (
                                <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Consultation Room ID
                                    </p>
                                    <p className="font-bold text-emerald-600 font-mono text-sm break-all">
                                        {app.roomId}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-500">
                                    <FiClock className="text-emerald-600" />
                                    <span className="text-sm font-bold">
                                        {app.userId?.email}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500">
                                    <FiCheckCircle className="text-emerald-600" />
                                    <span className="text-sm font-bold">
                                        {app.userId?.phone || "No phone provided"}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Reason for Visit
                                </p>
                                <p className="text-slate-600 font-medium italic">
                                    "{app.reason || "General Consultation"}"
                                </p>
                            </div>

                            {app.roomId && (() => {
                                return (
                                    <>
                                        {app.consultationStatus === "completed" ? (
                                            <button
                                                disabled
                                                className="w-full bg-slate-100 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed mb-3 flex items-center justify-center gap-2"
                                            >
                                                Call Completed
                                            </button>
                                        ) : scheduledTime && now.isBefore(scheduledTime) ? (
                                            <div className="w-full bg-amber-50 border border-amber-200 text-amber-600 py-5 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed mb-3 flex flex-col items-center justify-center gap-1">
                                                <span>Meeting Scheduled At {scheduledTime.format("hh:mm A")}</span>
                                                <span className="text-[9px] font-bold text-amber-500 font-sans text-center">The video call link will become available exactly when the scheduled time arrives.</span>
                                            </div>
                                        ) : endTime && now.isAfter(endTime) ? (
                                            <button
                                                disabled
                                                className="w-full bg-slate-100 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed mb-3 flex items-center justify-center gap-2"
                                            >
                                                Video call time expired. You cannot join.
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    router.push(`/consultation/${app.roomId}`)
                                                }
                                                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl mb-3 flex items-center justify-center gap-2"
                                            >
                                                Join Consultation Room
                                            </button>
                                        )}

                                        {app.consultationStatus !== "completed" && (
                                            <>
                                                {now.isBefore(scheduledTime || now) ? (
                                                    <div className="w-full bg-amber-50 border border-amber-100 p-4 rounded-2xl flex flex-col items-center gap-2 mb-3">
                                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest text-center">
                                                            Too Early to Complete
                                                        </p>
                                                        <p className="text-[9px] text-amber-500 font-bold text-center">
                                                            This appointment is scheduled for {scheduledTime?.format("hh:mm A")}. 
                                                            You can only mark it as completed once the session time has arrived.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            handleCompleteConsultation(app.roomId)
                                                        }
                                                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl mb-3 flex items-center justify-center gap-2"
                                                    >
                                                        Mark as Completed
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                            <button
                                onClick={onClose}
                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
                            >
                                Close Details
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
