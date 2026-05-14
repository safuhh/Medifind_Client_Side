"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../navbar/page";
import { saveAvailability } from "../../apis/doctor.api"; // I'll add this to doctor.api
import { getApplicationStatus } from "../../apis/doctor.api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiSave, FiClock, FiCalendar } from "react-icons/fi";
import api from "../../apis/api";

export default function AvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [doctorId, setDoctorId] = useState("");

  const [weeklyAvailability, setWeeklyAvailability] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [dailyAvailability, setDailyAvailability] = useState({
    morning: { from: "09:00", to: "13:00" },
    evening: { from: "16:00", to: "20:00" },
  });

  const [slotDuration, setSlotDuration] = useState(15);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getApplicationStatus();
        if (res.data.application) {
          setDoctorId(res.data.application._id);

          // Fetch current availability if it exists
          const availRes = await api.get(
            `/availability/slots?doctorId=${res.data.application._id}&date=${new Date().toISOString().split("T")[0]}`,
          );



          // Actually, I should have a direct endpoint for availability config
          const configRes = await api.get(
            `/availability/config?doctorId=${res.data.application._id}`,
          );
          if (configRes.data.success && configRes.data.availability) {
            const av = configRes.data.availability;
            setWeeklyAvailability(av.weeklyavailability);
            setDailyAvailability(av.dailyavailability);
            setSlotDuration(av.slotDuration);
          }
        }
      } catch (err) {
        console.log("No existing availability found or error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!doctorId) return;
    setSaving(true);
    try {
      const res = await api.post("/availability/save", {
        doctor_id: doctorId,
        weeklyavailability: weeklyAvailability,
        dailyavailability: dailyAvailability,
        slotDuration,
      });

      if (res.data.success) {
        toast.success("Availability updated successfully! ✨");
      }
    } catch (err) {
      toast.error("Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600 border-r-2 border-emerald-600/30"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Availability Settings</h1>
            <p className="text-slate-500 text-sm">Configure your weekly schedule and consultation time slots.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Days */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Weekly Schedule</h2>
                    <p className="text-xs text-slate-500">Select the days you are available for consultation.</p>
                  </div>
                  <FiCalendar className="text-slate-400" size={20} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(weeklyAvailability).map(([day, available]) => (
                    <button
                      key={day}
                      onClick={() =>
                        setWeeklyAvailability((prev) => ({
                          ...prev,
                          [day]: !available,
                        }))
                      }
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                        available
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm shadow-emerald-100"
                          : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="font-semibold text-sm capitalize">{day.slice(0, 3)}</span>
                      <span className="text-xs mt-1 font-medium">{available ? "Active" : "Off"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Times */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Consultation Hours</h2>
                    <p className="text-xs text-slate-500">Set your morning and evening session timings.</p>
                  </div>
                  <FiClock className="text-slate-400" size={20} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Morning */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                      <span className="text-sm font-semibold text-slate-700">Morning Session</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">From</label>
                        <input
                          type="time"
                          value={dailyAvailability.morning.from}
                          onChange={(e) =>
                            setDailyAvailability((prev) => ({
                              ...prev,
                              morning: { ...prev.morning, from: e.target.value },
                            }))
                          }
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-sm font-medium text-black focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">To</label>
                        <input
                          type="time"
                          value={dailyAvailability.morning.to}
                          onChange={(e) =>
                            setDailyAvailability((prev) => ({
                              ...prev,
                              morning: { ...prev.morning, to: e.target.value },
                            }))
                          }
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-sm font-medium text-black focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Evening */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                      <span className="text-sm font-semibold text-slate-700">Evening Session</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">From</label>
                        <input
                          type="time"
                          value={dailyAvailability.evening.from}
                          onChange={(e) =>
                            setDailyAvailability((prev) => ({
                              ...prev,
                              evening: { ...prev.evening, from: e.target.value },
                            }))
                          }
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-sm font-medium text-black focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">To</label>
                        <input
                          type="time"
                          value={dailyAvailability.evening.to}
                          onChange={(e) =>
                            setDailyAvailability((prev) => ({
                              ...prev,
                              evening: { ...prev.evening, to: e.target.value },
                            }))
                          }
                          className="w-full bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-sm font-medium text-black focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Duration & Save */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
                  <p className="text-xs text-slate-500">Set your consultation slot duration.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Slot Duration</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[15, 20, 30, 45, 60].map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => setSlotDuration(duration)}
                        className={`py-2.5 px-3 text-xs font-bold rounded-lg border transition-all ${
                          slotDuration === duration
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                            : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {duration} Min
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                disabled={saving}
                onClick={handleSave}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
