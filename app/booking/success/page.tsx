"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiCheckCircle, FiCalendar, FiArrowRight } from "react-icons/fi";
import Navbar from "../../navbar/page";
import Footer from "../../footer/page";
import api from "../../apis/api";

export default function BookingSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [verifying, setVerifying] = useState(true);
    const [roomId, setRoomId] = useState<string | null>(null);
    
    // Stripe returns payment_intent for real payments
    // My custom mock flow returns session_id or mock=true
    const paymentIntent = searchParams.get("payment_intent") || searchParams.get("session_id");

    useEffect(() => {
        const confirmWithBackend = async () => {
            if (paymentIntent) {
                try {
                    const res = await api.post("/booking/confirm-payment", {
                        paymentIntentId: paymentIntent
                    });
                    if (res.data.success && res.data.roomId) {
                        setRoomId(res.data.roomId);
                    }
                } catch (err) {
                    console.error("Verification error:", err);
                } finally {
                    setVerifying(false);
                }
            } else {
                setVerifying(false);
            }
        };

        confirmWithBackend();
    }, [paymentIntent]);

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col">
            <Navbar />
            
            <main className="flex-1 flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-emerald-100 rounded-full blur-2xl animate-pulse"></div>
                        <div className="relative bg-emerald-50 text-emerald-600 p-8 rounded-full border-4 border-white shadow-xl shadow-emerald-200/50">
                            <FiCheckCircle size={64} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            {verifying ? "Verifying..." : <>Booking <span className="text-emerald-600">Confirmed!</span></>}
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            {verifying 
                                ? "We are finalizing your payment details..." 
                                : "Your appointment has been successfully scheduled and paid for. We've sent the details to your email."
                            }
                        </p>
                    </div>

                    {!verifying && (
                        <div className="pt-8 flex flex-col gap-3">
                            {roomId && (
                                <button 
                                    onClick={() => router.push(`/consultation/${roomId}`)}
                                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl flex items-center justify-center gap-3"
                                >
                                    Join Consultation Room <FiArrowRight />
                                </button>
                            )}
                            <button 
                                onClick={() => router.push("/notifications")} // Updated path
                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3"
                            >
                                <FiCalendar /> View My Appointments <FiArrowRight />
                            </button>
                            <button 
                                onClick={() => router.push("/")}
                                className="w-full bg-slate-50 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                            >
                                Back to Home
                            </button>
                        </div>
                    )}
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
