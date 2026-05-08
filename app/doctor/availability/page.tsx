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
                    const availRes = await api.get(`/api/v1/availability/slots?doctorId=${res.data.application._id}&date=${new Date().toISOString().split('T')[0]}`);
                    // Actually, I should have a direct endpoint for availability config
                    const configRes = await api.get(`/api/v1/availability/config?doctorId=${res.data.application._id}`);
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
            const res = await api.post("/api/v1/availability/save", {
                doctor_id: doctorId,
                weeklyavailability: weeklyAvailability,
                dailyavailability: dailyAvailability,
                slotDuration
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
        <div className="min-h-screen bg-slate-50 font-sans flex">
            <Sidebar />
            
            <main className="flex-1 max-w-5xl mx-auto pt-32 pb-20 px-6 ml-0 md:ml-64">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 leading-[1.1] mb-2">
                        Manage <span className="text-emerald-600">Availability</span>
                    </h1>
                    <p className="text-slate-500">Set your weekly schedule and consultation hours.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Weekly Schedule */}
                    <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><FiCalendar size={20} /></div>
                            <h3 className="text-lg font-black text-slate-900">Weekly Schedule</h3>
                        </div>

                        <div className="space-y-3">
                            {Object.entries(weeklyAvailability).map(([day, available]) => (
                                <button
                                    key={day}
                                    onClick={() => setWeeklyAvailability(prev => ({ ...prev, [day]: !available }))}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                        available 
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-900" 
                                        : "bg-slate-50 border-transparent text-slate-400"
                                    }`}
                                >
                                    <span className="font-bold capitalize">{day}</span>
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${available ? "bg-emerald-600 text-white" : "bg-slate-200"}`}>
                                        {available && <span className="text-[10px] font-black">✓</span>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Slots & Duration */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><FiClock size={20} /></div>
                                <h3 className="text-lg font-black text-slate-900">Consultation Hours</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Morning Session</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="time" 
                                            value={dailyAvailability.morning.from}
                                            onChange={(e) => setDailyAvailability(prev => ({ ...prev, morning: { ...prev.morning, from: e.target.value } }))}
                                            className="bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"
                                        />
                                        <input 
                                            type="time" 
                                            value={dailyAvailability.morning.to}
                                            onChange={(e) => setDailyAvailability(prev => ({ ...prev, morning: { ...prev.morning, to: e.target.value } }))}
                                            className="bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Evening Session</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="time" 
                                            value={dailyAvailability.evening.from}
                                            onChange={(e) => setDailyAvailability(prev => ({ ...prev, evening: { ...prev.evening, from: e.target.value } }))}
                                            className="bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"
                                        />
                                        <input 
                                            type="time" 
                                            value={dailyAvailability.evening.to}
                                            onChange={(e) => setDailyAvailability(prev => ({ ...prev, evening: { ...prev.evening, to: e.target.value } }))}
                                            className="bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Slot Duration (Min)</p>
                                    <select 
                                        value={slotDuration}
                                        onChange={(e) => setSlotDuration(Number(e.target.value))}
                                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"
                                    >
                                        <option value={15}>15 Minutes</option>
                                        <option value={20}>20 Minutes</option>
                                        <option value={30}>30 Minutes</option>
                                        <option value={45}>45 Minutes</option>
                                        <option value={60}>60 Minutes</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={saving}
                            onClick={handleSave}
                            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-3"
                        >
                            {saving ? "Saving..." : <><FiSave /> Save Configuration</>}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
