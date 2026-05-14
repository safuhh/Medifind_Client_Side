"use client";

import React, { useState, useEffect } from "react";
import NavbarPage from "../navbar/page";
import Footer from "../footer/page";
import api from "../apis/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiVideo, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/app/utils/imageUrl";

export default function NotificationsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/booking/patient-appointments");
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600 border-r-2 border-emerald-600/30"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <NavbarPage />

      {/* Added pt-28 to account for fixed navbars and removed <br/> tags */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-28 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              My <span className="text-emerald-600">Consultations</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium">
              View and join your scheduled video calls.
            </p>
          </div>
         
        </div>

        {/* Appointments List */}
        {appointments.length > 0 ? (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {appointments.map((app, index) => {
                const joinable = isJoinable(app.scheduledAt);
                const isExpired = dayjs(currentTime).isAfter(
                  dayjs(app.scheduledAt).add(30, "minute"),
                );

                return (
                  <motion.div
                    key={app._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200 flex flex-col md:flex-row gap-5 md:items-center"
                  >
                    {/* Doctor Info */}
                    <div className="flex items-center gap-4 md:w-1/3">
                      <div className="relative shrink-0">
                        <img
                          src={
                            app.doctorId?.profileImage
                              ? getImageUrl(app.doctorId.profileImage)
                              : null
                          }
                          alt={app.doctorId?.fullName || "Doctor"}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-50"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm md:text-base line-clamp-1">
                          Dr. {app.doctorId?.fullName || "Doctor"}
                        </p>
                        <p className="text-emerald-600 text-xs font-medium">
                          {app.doctorId?.specialization || "Specialist"}
                        </p>
                      </div>
                    </div>

                    {/* Grid for Date & Status on Mobile, Flex on Desktop */}
                    <div className="grid grid-cols-2 gap-4 md:flex md:flex-1 md:justify-between w-full">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Date & Time
                        </p>
                        <p className="font-semibold text-slate-800 text-sm">
                          {dayjs(app.date).format("DD MMM YYYY")},{" "}
                          {app.timeSlot}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Fee
                        </p>
                        <p className="font-bold text-slate-900 text-sm">
                          ₹{app.amount || 0}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Payment
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                            app.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          {app.paymentStatus === "paid" ? "Paid" : "Pending"}
                        </span>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Status
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                            app.consultationStatus === "completed"
                              ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
                              : app.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                : app.status === "cancelled"
                                  ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                                  : "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20"
                          }`}
                        >
                          {app.consultationStatus === "completed"
                            ? "Completed"
                            : app.status
                              ? app.status.charAt(0).toUpperCase() +
                                app.status.slice(1)
                              : "Pending"}
                        </span>
                      </div>
                    </div>

                    {/* Call to Action Container */}
                    <div className="w-full md:w-auto pt-4 md:pt-0 border-t border-slate-100 md:border-none mt-2 md:mt-0 flex justify-end">
                      {app.consultationStatus === "completed" ? (
                        <button
                          onClick={() => router.push(`/health-report/${app._id}`)}
                          className="w-full md:w-auto bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20"
                        >
                          View Report <FiArrowRight className="text-emerald-100" />
                        </button>
                      ) : app.roomId ? (
                        isExpired ? (
                          <div className="w-full md:w-auto bg-slate-50 border border-slate-200 text-slate-400 px-5 py-2.5 rounded-xl font-bold text-sm text-center">
                            Video Call Time Expired
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              router.push(`/consultation/${app.roomId}`)
                            }
                            className="w-full md:w-auto bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20"
                          >
                            Join Call{" "}
                            <FiArrowRight className="text-emerald-100" />
                          </button>
                        )
                      ) : (
                        <div className="w-full md:w-auto bg-slate-50 border border-slate-200 text-slate-400 px-5 py-2.5 rounded-xl font-bold text-sm text-center">
                          No Room Assigned
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Refined Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center text-center shadow-sm border border-slate-200"
          >
            <div className="bg-slate-50 h-24 w-24 rounded-full flex items-center justify-center mb-6">
              <FiCalendar className="text-slate-300" size={40} />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">
              No Consultations Scheduled
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm md:text-base">
              When you book an appointment with a doctor, your video call
              details will appear here.
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
