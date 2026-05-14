"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import api from "@/app/apis/api";
import { toast } from "react-toastify";
import { getImageUrl } from "@/app/utils/imageUrl";

interface HealthReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
    onSaveSuccess?: () => void;
}

export default function HealthReportModal({ isOpen, onClose, booking, onSaveSuccess }: HealthReportModalProps) {
    const [reportNotes, setReportNotes] = useState("");
    const [prescribedMedicines, setPrescribedMedicines] = useState<any[]>([]);
    const [medicineSearch, setMedicineSearch] = useState("");
    const [medicineResults, setMedicineResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchExistingReport = async () => {
            if (!isOpen || !booking?._id) return;
            try {
                const res = await api.get(`/health-report/booking/${booking._id}`);
                if (res.data.success && res.data.report) {
                    setReportNotes(res.data.report.notes || "");
                    setPrescribedMedicines(res.data.report.medicines || []);
                }
            } catch (err: any) {
                if (err.response?.status !== 404) {
                    console.error("Error fetching existing report:", err);
                }
                setReportNotes("");
                setPrescribedMedicines([]);
            }
        };
        fetchExistingReport();
    }, [isOpen, booking?._id]);

    const handleSearchMedicine = async (query: string) => {
        setMedicineSearch(query);
        if (query.length < 2) {
            setMedicineResults([]);
            return;
        }
        try {
            const res = await api.get(`/medicines/all?search=${query}`);
            if (res.data.success) {
                setMedicineResults(res.data.medicines);
            }
        } catch (err) {
            console.error("Error searching medicines:", err);
        }
    };

    const handleAddMedicine = (med: any) => {
        setPrescribedMedicines([...prescribedMedicines, {
            medicineId: med._id,
            name: med.name,
            dosage: "",
            instructions: "",
            timesPerDay: "",
            quantity: 1,
            stock: med.stock
        }]);
        setMedicineSearch("");
        setMedicineResults([]);
    };

    const handleSaveReport = async () => {
        if (!reportNotes) {
            toast.error("Please add notes to the report");
            return;
        }
        try {
            const res = await api.post("/health-report", {
                bookingId: booking._id,
                notes: reportNotes,
                medicines: prescribedMedicines
            });
            if (res.data.success) {
                toast.success("Health report saved!");
                onClose();
                setReportNotes("");
                setPrescribedMedicines([]);
                if (onSaveSuccess) onSaveSuccess();
            }
        } catch (err) {
            console.error("Error saving report:", err);
            toast.error("Failed to save report");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && booking && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative bg-white w-full max-w-2xl rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Create Health Report</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Add diagnosis and prescribe medicines</p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <span className="sr-only">Close</span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6 overflow-y-auto flex-1 pr-2 -mr-2">
                            {/* Patient Info */}
                            <div className="bg-slate-50/70 border border-slate-100 p-4 rounded-lg flex items-center justify-between text-sm">
                                <div>
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Patient</p>
                                    <p className="font-semibold text-slate-900">{booking.userId?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Date</p>
                                    <p className="font-semibold text-slate-900">{dayjs(booking.date).format("DD MMM YYYY")}</p>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Diagnosis & Notes</label>
                                <textarea 
                                    value={reportNotes}
                                    onChange={(e) => setReportNotes(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none h-28 transition-all placeholder:text-slate-300"
                                    placeholder="Write the patient's health condition and advice..."
                                />
                            </div>

                            {/* Medicine Search */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Prescribe Medicines</label>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        value={medicineSearch}
                                        onChange={(e) => handleSearchMedicine(e.target.value)}
                                        className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                                        placeholder="Search medicine by name..."
                                    />
                                    {medicineResults.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 bg-white border border-slate-100 shadow-lg rounded-lg mt-1 z-10 max-h-48 overflow-y-auto">
                                            {medicineResults.map(med => (
                                                <div 
                                                    key={med._id}
                                                    onClick={() => med.stock > 0 && handleAddMedicine(med)}
                                                    className={`p-3 border-b border-slate-50 last:border-b-0 ${med.stock > 0 ? "hover:bg-slate-50 cursor-pointer" : "opacity-50 cursor-not-allowed"} text-sm flex justify-between items-center transition-colors`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <img 
                                                            src={med.images?.[0] ? getImageUrl(med.images[0]) : null} 
                                                            alt={med.name}
                                                            className="w-8 h-8 rounded object-cover bg-slate-50"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-slate-900">{med.name}</p>
                                                            <p className="text-xs text-slate-400">{med.brand} • ₹{med.pricing?.sellingPrice} • Stock: {med.stock}</p>
                                                        </div>
                                                    </div>
                                                    {med.stock > 0 ? (
                                                        <span className="text-emerald-600 text-xs font-semibold hover:text-emerald-700">+ Add</span>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs font-medium">Out of Stock</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Prescribed List */}
                            {prescribedMedicines.length > 0 && (
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Prescribed Medicines</label>
                                    <div className="border border-slate-100 rounded-lg overflow-hidden">
                                        {prescribedMedicines.map((med, idx) => (
                                            <div key={idx} className="border-b border-slate-100 last:border-b-0 p-4 bg-white hover:bg-slate-50/50 transition-colors">
                                                <div className="flex justify-between items-center mb-3">
                                                    <div>
                                                        <p className="font-medium text-slate-900">{med.name}</p>
                                                        <p className="text-xs text-slate-400">Stock: {med.stock}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => setPrescribedMedicines(prescribedMedicines.filter((_, i) => i !== idx))}
                                                        className="text-slate-400 hover:text-red-500 text-xs font-medium transition-colors"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-4 gap-3">
                                                    <div>
                                                        <label className="text-[10px] font-medium text-slate-400 uppercase block mb-1">Dosage</label>
                                                        <input 
                                                            type="text"
                                                            placeholder="e.g. 1-0-1"
                                                            value={med.dosage}
                                                            onChange={(e) => {
                                                                const updated = [...prescribedMedicines];
                                                                updated[idx].dosage = e.target.value;
                                                                setPrescribedMedicines(updated);
                                                            }}
                                                            className="w-full border border-slate-200 rounded p-2 text-xs focus:border-emerald-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-medium text-slate-400 uppercase block mb-1">Instructions</label>
                                                        <input 
                                                            type="text"
                                                            placeholder="e.g. After Food"
                                                            value={med.instructions}
                                                            onChange={(e) => {
                                                                const updated = [...prescribedMedicines];
                                                                updated[idx].instructions = e.target.value;
                                                                setPrescribedMedicines(updated);
                                                            }}
                                                            className="w-full border border-slate-200 rounded p-2 text-xs focus:border-emerald-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-medium text-slate-400 uppercase block mb-1">Times/Day</label>
                                                        <input 
                                                            type="text"
                                                            placeholder="e.g. 3 times"
                                                            value={med.timesPerDay || ""}
                                                            onChange={(e) => {
                                                                const updated = [...prescribedMedicines];
                                                                updated[idx].timesPerDay = e.target.value;
                                                                setPrescribedMedicines(updated);
                                                            }}
                                                            className="w-full border border-slate-200 rounded p-2 text-xs focus:border-emerald-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-medium text-slate-400 uppercase block mb-1">Qty</label>
                                                        <input 
                                                            type="number"
                                                            placeholder="Qty"
                                                            value={med.quantity}
                                                            onChange={(e) => {
                                                                const updated = [...prescribedMedicines];
                                                                const val = Number(e.target.value);
                                                                updated[idx].quantity = val > med.stock ? med.stock : val;
                                                                setPrescribedMedicines(updated);
                                                            }}
                                                            className="w-full border border-slate-200 rounded p-2 text-xs focus:border-emerald-500 outline-none transition-all"
                                                            min="1"
                                                            max={med.stock}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3 text-sm">
                            <button 
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveReport}
                                className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/10"
                            >
                                Save Report
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
