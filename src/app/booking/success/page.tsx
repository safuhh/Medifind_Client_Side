"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiCheck, FiCalendar, FiArrowRight, FiVideo, FiHome } from "react-icons/fi";
import Navbar from "../../navbar/page";
import Footer from "../../footer/page";
import api from "@/services/apis/api";

function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);

  const paymentIntent = searchParams.get("payment_intent") || searchParams.get("session_id");

  useEffect(() => {
    const confirmWithBackend = async () => {
      if (paymentIntent) {
        try {
          const res = await api.post("/booking/confirm-payment", {
            paymentIntentId: paymentIntent,
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
   

      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
    
        <div className="max-w-md w-full">
          {verifying ? (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 text-center space-y-4">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-[#0a4d33] rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Verifying payment details...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-slate-100 rounded-3xl shadow-sm p-8 text-center"
            >
              {/* Minimal Check Icon */}
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                <FiCheck size={24} className="stroke-[3]" />
              </div>

              {/* Title & Description */}
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Booking confirmed
              </h1>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Your appointment has been successfully scheduled. We've emailed you the calendar invite and details.
              </p>

              {/* Minimal Detail List */}
              <div className="my-8 border-y border-slate-100 py-4 text-left space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Consultation Channel</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1.5">
                    <FiVideo size={14} className="text-slate-400" /> Video Call
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Booking Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    Confirmed
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {roomId && (
                  <button
                    onClick={() => router.push(`/consultation/${roomId}`)}
                    className="w-full bg-[#0a4d33] hover:bg-[#083d28] text-white py-3 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 group"
                  >
                    Join Consultation Room
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                <button
                  onClick={() => router.push("/notifications")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <FiCalendar size={16} />
                  View Appointments
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 py-3 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <FiHome size={15} />
                  Back to Home
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingSuccessContent />
    </React.Suspense>
  );
}
