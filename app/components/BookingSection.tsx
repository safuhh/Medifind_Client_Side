"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import { getAvailableSlots, bookSlot } from "../apis/booking.api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

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
                setSlots(res.data.slots);
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
                toast.success("Proceeding to secure payment... 💳");
                if (res.data.clientSecret) {
                    window.location.href = `/booking/payment?client_secret=${res.data.clientSecret}&doctorId=${doctorId}&amount=${res.data.booking.amount}`;
                } else {
                    toast.success("Appointment booked successfully! ✨");
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
        <div className="space-y-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <FiCalendar className="text-emerald-600" /> Book a Slot
                </h3>
                <input 
                    type="date" 
                    min={dayjs().format("YYYY-MM-DD")}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
            </div>

            <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Times</p>
                
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : slots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {slots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-3 rounded-2xl text-xs font-black transition-all border-2 ${
                                    selectedSlot === slot 
                                    ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                                    : "bg-slate-50 border-transparent text-slate-600 hover:border-emerald-600/30"
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-2xl p-8 text-center space-y-2">
                        <FiAlertCircle className="mx-auto text-slate-300" size={24} />
                        <p className="text-xs font-bold text-slate-400">No slots available for this date.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedSlot && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="pt-4"
                    >
                        <button 
                            disabled={isBooking}
                            onClick={handleBooking}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isBooking ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <><FiCheckCircle /> Confirm Booking for {selectedSlot}</>
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
