"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../navbar/page";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import api from "../../apis/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiBell,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import HealthReportModal from "@/app/components/HealthReportModal";
import AppointmentDetailsModal from "@/app/components/AppointmentDetailsModal";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://medifind-env.eba-6rdig2er.eu-north-1.elasticbeanstalk.com");

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

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedBookingForReport, setSelectedBookingForReport] =
    useState<any>(null);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/booking/doctor-appointments");
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
      doctorName: "Doctor",
    });
    toast.success("Notification sent to patient!");
  };

  const handleCompleteConsultation = async (roomId: string) => {
    try {
      const res = await api.post(`/consultation/${roomId}/complete`);
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
      toast.info(
        `New appointment booked: ${data.timeSlot} by ${data.patientName || "a patient"}`,
      );
      fetchAppointments(); // Refresh list
    });

    socket.on("payment_confirmed", (data) => {
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === data.bookingId
            ? { ...app, paymentStatus: data.status }
            : app,
        ),
      );
      toast.success("Payment received for an appointment! ");
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
    <div className="min-h-screen bg-[#f8fafc] font-sans flex relative text-slate-900">
      <Sidebar />

      <main className="flex-1 max-w-6xl mx-auto pt-24 pb-20 px-6 ml-0 md:ml-64">
        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
              Patient <span className="text-emerald-600">Appointments</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Track and manage your upcoming consultations.
            </p>
          </div>
          <div className="bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 w-fit">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse ring-4 ring-emerald-500/20"></div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
              Live Updates Active
            </span>
          </div>
        </div>

        {/* Appointments List */}
        {appointments.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {appointments.map((app, index) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col lg:flex-row gap-6 lg:items-center justify-between"
                >
                  {/* Patient & Date Info */}
                  <div className="flex items-center gap-4 lg:w-1/3">
                    <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-xl flex-shrink-0">
                      <FiCalendar size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm md:text-base line-clamp-1">
                        {app.userId?.name || "Patient Name"}
                      </p>
                      <div className="flex items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <FiClock className="text-slate-400" /> {app.timeSlot}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{dayjs(app.date).format("DD MMM YYYY")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 md:flex md:flex-1 md:justify-around w-full lg:w-auto">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Fee
                      </p>
                      <p className="font-semibold text-slate-800 text-sm">
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
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                            : "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20"
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

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 lg:w-1/3 lg:justify-end border-t border-slate-50 pt-4 lg:pt-0 lg:border-none">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-slate-600 hover:text-emerald-600 text-xs font-semibold px-4 py-2 transition-all"
                    >
                      Details
                    </button>

                    {app.roomId && (() => {
                      const scheduledTime = app.scheduledAt
                        ? dayjs(app.scheduledAt)
                        : app.date && app.timeSlot
                          ? parseLocalSlot(app.date, app.timeSlot)
                          : dayjs(app.createdAt);
                      const now = dayjs();
                      const startTime = scheduledTime;
                      const endTime = scheduledTime.add(30, "minute");
                      const isTime = now.isAfter(startTime) && now.isBefore(endTime);

                      return (
                        <>
                          {app.consultationStatus !== "completed" ? (
                            <>
                              {isTime && (
                                <button
                                  onClick={() =>
                                    router.push(`/consultation/${app.roomId}`)
                                  }
                                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-xs hover:bg-emerald-700 transition-all shadow-sm"
                                >
                                  Join
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleNotifyPatient(app.userId?._id, app.roomId)
                                }
                                className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-semibold text-xs hover:bg-slate-50 transition-all"
                              >
                                Notify
                              </button>
                              <button
                                disabled={now.isBefore(scheduledTime)}
                                onClick={() =>
                                  handleCompleteConsultation(app.roomId)
                                }
                                className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-sm ${
                                  now.isBefore(scheduledTime)
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-red-500 text-white hover:bg-red-600"
                                }`}
                                title={now.isBefore(scheduledTime) ? "You cannot end a call before it starts" : ""}
                              >
                                {now.isBefore(scheduledTime) ? "Scheduled" : "End Call"}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedBookingForReport(app);
                                setReportModalOpen(true);
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-xs hover:bg-blue-700 transition-all shadow-sm"
                            >
                              Write Report
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 shadow-sm">
            <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBell className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              No Appointments Yet
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">
              When patients book slots, they will appear here in real-time.
            </p>
          </div>
        )}

        {/* Details Modal */}
        <AppointmentDetailsModal 
            isOpen={!!selectedApp}
            onClose={() => setSelectedApp(null)}
            app={selectedApp}
            onCompleteSuccess={() => fetchAppointments()}
        />

        <HealthReportModal 
            isOpen={reportModalOpen}
            onClose={() => setReportModalOpen(false)}
            booking={selectedBookingForReport}
            onSaveSuccess={() => fetchAppointments()}
        />
      </main>
    </div>
  );
}
