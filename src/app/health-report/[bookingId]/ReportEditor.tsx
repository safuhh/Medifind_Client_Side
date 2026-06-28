"use client";

import dayjs from "dayjs";
import { FiSearch, FiActivity, FiTrash2, FiUser, FiCalendar, FiPlus, FiCheck } from "react-icons/fi";
import { getImageUrl } from "@/utils/imageUrl";
import { motion } from "framer-motion";

interface ReportEditorProps {
  report: any;
  booking: any;
  patientInfo: any;
  reportNotes: string;
  setReportNotes: (notes: string) => void;
  prescribedMedicines: any[];
  setPrescribedMedicines: (meds: any[]) => void;
  medicineSearch: string;
  handleSearchMedicine: (query: string) => void;
  medicineResults: any[];
  handleAddMedicine: (med: any) => void;
  saving: boolean;
  handleSaveReport: () => void;
  setIsEditing: (editing: boolean) => void;
  router: any;
}

export default function ReportEditor({
  report,
  booking,
  patientInfo,
  reportNotes,
  setReportNotes,
  prescribedMedicines,
  setPrescribedMedicines,
  medicineSearch,
  handleSearchMedicine,
  medicineResults,
  handleAddMedicine,
  saving,
  handleSaveReport,
  setIsEditing,
  router,
}: ReportEditorProps) {
  return (
    <div className="space-y-8">
      
      {/* Consulting Patient details */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0a4d33] flex items-center justify-center border border-emerald-100/50 shadow-sm">
            <FiUser size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Consulting Patient</span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
              {patientInfo?.name}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              {patientInfo?.email} {patientInfo?.phone ? `• ${patientInfo?.phone}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:border-l md:border-slate-200 md:pl-6">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200/50 shadow-sm">
            <FiCalendar size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Booking Details</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {dayjs(booking?.date).format("DD MMMM YYYY")}
            </p>
            <p className="text-xs text-[#0a4d33] font-bold">
              {booking?.timeSlot || "Online Session"}
            </p>
          </div>
        </div>
      </div>

      {/* Diagnosis Notes Textbox */}
      <div className="space-y-2.5">
        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
          Clinical Diagnosis, Advice &amp; Notes
        </label>
        <textarea
          value={reportNotes}
          onChange={(e) => setReportNotes(e.target.value)}
          className="w-full border border-slate-200 focus:border-[#0a4d33] rounded-2xl p-4 text-sm outline-none h-40 transition-all placeholder:text-slate-300 shadow-sm focus:ring-4 focus:ring-emerald-500/5 leading-relaxed"
          placeholder="Provide details about the patient's medical condition, diagnoses, instructions, and general clinical advice..."
        />
      </div>

      {/* Search Medicines to Prescribe */}
      <div className="space-y-3 relative">
        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
          Search &amp; Add Prescribed Medicines
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <FiSearch size={18} />
          </div>
          <input
            type="text"
            value={medicineSearch}
            onChange={(e) => handleSearchMedicine(e.target.value)}
            className="w-full border border-slate-200 focus:border-[#0a4d33] rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none transition-all placeholder:text-slate-300 shadow-sm focus:ring-4 focus:ring-emerald-500/5 font-semibold"
            placeholder="Search medicine name to add to prescription list..."
          />

          {/* Autocomplete list */}
          {medicineResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-slate-100 shadow-2xl rounded-2xl mt-2.5 z-50 max-h-60 overflow-y-auto divide-y divide-slate-50 overflow-hidden border-t-0">
              {medicineResults.map((med) => (
                <div
                  key={med._id}
                  onClick={() => med.stock > 0 && handleAddMedicine(med)}
                  className={`p-4 ${med.stock > 0 ? "hover:bg-slate-50 cursor-pointer" : "opacity-50 cursor-not-allowed"} text-sm flex justify-between items-center transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    {med.images?.[0] ? (
                      <img
                        src={getImageUrl(med.images[0])}
                        alt={med.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400">
                        <FiActivity />
                      </div>
                    )}
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{med.name}</p>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                        {med.brand} • Selling: ₹{med.pricing?.sellingPrice} • Stock: {med.stock} units
                      </p>
                    </div>
                  </div>
                  {med.stock > 0 ? (
                    <span className="bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-100 transition-colors flex items-center gap-1">
                      <FiPlus /> Add
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                      Out of Stock
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Added Prescription Card Items */}
      {prescribedMedicines.length > 0 && (
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
            Medication Prescribed Checklist ({prescribedMedicines.length})
          </label>
          
          <div className="space-y-4">
            {prescribedMedicines.map((med, idx) => (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl p-5 bg-white shadow-sm space-y-4 hover:border-emerald-200 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{med.name}</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Prescribed Drug</span>
                  </div>
                  
                  <button
                    onClick={() =>
                      setPrescribedMedicines(
                        prescribedMedicines.filter((_, i) => i !== idx),
                      )
                    }
                    className="text-slate-400 hover:text-red-500 text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <FiTrash2 size={13} /> Remove
                  </button>
                </div>

                {/* Grid layout for schedules */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                      Dosage Schedule
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1-0-1"
                      value={med.dosage}
                      onChange={(e) => {
                        const updated = [...prescribedMedicines];
                        updated[idx].dosage = e.target.value;
                        setPrescribedMedicines(updated);
                      }}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:border-[#0a4d33] outline-none transition-all shadow-inner font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                      Instructions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. After Food"
                      value={med.instructions}
                      onChange={(e) => {
                        const updated = [...prescribedMedicines];
                        updated[idx].instructions = e.target.value;
                        setPrescribedMedicines(updated);
                      }}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:border-[#0a4d33] outline-none transition-all shadow-inner font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                      Times/Day
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3 times"
                      value={med.timesPerDay || ""}
                      onChange={(e) => {
                        const updated = [...prescribedMedicines];
                        updated[idx].timesPerDay = e.target.value;
                        setPrescribedMedicines(updated);
                      }}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:border-[#0a4d33] outline-none transition-all shadow-inner font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                      Prescribed Qty
                    </label>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={med.quantity}
                      onChange={(e) => {
                        const updated = [...prescribedMedicines];
                        const val = parseInt(e.target.value, 10);
                        updated[idx].quantity = isNaN(val) || val < 1 ? 1 : (val > med.stock ? med.stock : val);
                        setPrescribedMedicines(updated);
                      }}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:border-[#0a4d33] outline-none transition-all shadow-inner font-black"
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

      {/* Editor save/cancel actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 text-sm">
        {report ? (
          <button
            onClick={() => setIsEditing(false)}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50 uppercase tracking-wider text-xs cursor-pointer"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={() => router.back()}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50 uppercase tracking-wider text-xs cursor-pointer"
          >
            Exit Form
          </button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSaveReport}
          disabled={saving}
          className="bg-[#0a4d33] hover:bg-[#083d28] text-white px-7 py-3 rounded-xl font-black transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-wider text-xs cursor-pointer"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <FiCheck /> Save Health Report
            </>
          )}
        </motion.button>
      </div>

    </div>
  );
}
