"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import { getAvailableSlots, bookSlot } from "../apis/booking.api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://newmedifinddeploy-env.eba-pp6njqrd.eu-north-1.elasticbeanstalk.com/api");

interface BookingSectionProps {
    doctorId: string;
}

export default function BookingSection({ doctorId }: BookingSectionProps) {
    const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [slots, setSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isBooking, setIsBooking] = useState(false);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const res = await getAvailableSlots(doctorId, selectedDate);
            if (res.data.success) {
                setSlots(Array.from(new Set(res.data.slots as string[])));
            }
        } catch (err) {
            console.error("Error fetching slots:", err);
            toast.error("Failed to fetch available slots");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();

        // Join doctor's room for live updates
        socket.emit("join_doctor_room", doctorId);

        // Listen for live booking updates
        socket.on("slot_booked", (data) => {
            if (data.doctorId === doctorId && data.date === selectedDate) {
                setSlots((prev) => prev.filter((slot) => slot !== data.timeSlot));
                if (selectedSlot === data.timeSlot) {
                    setSelectedSlot(null);
                    toast.info("Someone just booked the slot you were looking at!");
                }
            }
        });

        return () => {
            socket.off("slot_booked");
        };
    }, [doctorId, selectedDate]);

    const handleBooking = async () => {
        if (!selectedSlot) return;
        
        setIsBooking(true);
        try {
            const res = await bookSlot({
                doctorId,
                date: selectedDate,
                timeSlot: selectedSlot,
                reason: "General Consultation"
            });

            if (res.data.success) {
                toast.success("Proceeding to secure payment... ðŸ’³");
                if (res.data.clientSecret) {
                    window.location.href = `/booking/payment?client_secret=${res.data.clientSecret}&doctorId=${doctorId}&amount=${res.data.booking.amount}`;
                } else {
                    toast.success("Appointment booked successfully! âœ¨");
                    setSelectedSlot(null);
                }
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Booking failed");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Date</p>
                <input 
                    type="date" 
                    min={dayjs().format("YYYY-MM-DD")}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                />
            </div>

            <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Slots</p>
                
                {loading ? (
                    <div className="flex justify-center py-6">
                        <div className="w-6 h-6 border-2 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : slots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {slots.map((slot) => (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                                    selectedSlot === slot 
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm" 
                                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-lg p-6 text-center space-y-2 border border-slate-100">
                        <FiAlertCircle className="mx-auto text-slate-400" size={20} />
                        <p className="text-xs font-medium text-slate-500">No slots available for this date.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedSlot && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="pt-2"
                    >
                        <button 
                            disabled={isBooking}
                            onClick={handleBooking}
                            className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isBooking ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <><FiCheckCircle /> Book for {selectedSlot}</>
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
