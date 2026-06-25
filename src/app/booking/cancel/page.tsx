"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiXCircle, FiRefreshCw, FiArrowLeft } from "react-icons/fi";
import Navbar from "../../navbar/page";
import Footer from "../../footer/page";

export default function BookingCancelPage() {
    const router = useRouter();

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
                        <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50"></div>
                        <div className="relative bg-red-50 text-red-500 p-8 rounded-full border-4 border-white shadow-xl shadow-red-200/30">
                            <FiXCircle size={64} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            Payment <span className="text-red-500">Cancelled.</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            The booking process was interrupted or cancelled. No funds were charged from your account.
                        </p>
                    </div>

                    <div className="pt-8 flex flex-col gap-3">
                        <button 
                            onClick={() => router.back()}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            <FiRefreshCw /> Try Booking Again
                        </button>
                        <button 
                            onClick={() => router.push("/")}
                            className="w-full bg-slate-50 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                        >
                            <FiArrowLeft /> Back to Home
                        </button>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
