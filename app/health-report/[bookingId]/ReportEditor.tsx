import dayjs from "dayjs";
import { FiSearch, FiActivity, FiTrash2 } from "react-icons/fi";
import { getImageUrl } from "@/app/utils/imageUrl";

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
      {/* Patient / Booking Header */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Consulting Patient
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            {patientInfo?.name}
          </h3>
          <p className="text-xs text-slate-500">
            {patientInfo?.email} • {patientInfo?.phone || "No phone listed"}
          </p>
        </div>
        <div className="text-right md:text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Booking Details
          </span>
          <p className="text-sm font-semibold text-slate-900 mt-0.5">
            {dayjs(booking?.date).format("DD MMMM YYYY")}
          </p>
          <p className="text-xs text-[#0a4d33] font-medium">
            {booking?.timeSlot}
          </p>
        </div>
      </div>

      {/* Diagnosis Details */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Diagnosis, Advice & Notes
        </label>
        <textarea
          value={reportNotes}
          onChange={(e) => setReportNotes(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none h-32 transition-all placeholder:text-slate-300 shadow-sm"
          placeholder="Provide details about the patient's medical condition, diagnoses, instructions, and general clinical advice..."
        />
      </div>

      {/* Search and Add Medicines */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Prescribe Medicines
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiSearch size={18} />
          </div>
          <input
            type="text"
            value={medicineSearch}
            onChange={(e) => handleSearchMedicine(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300 shadow-sm"
            placeholder="Type medicine name to search inventory..."
          />

          {/* Search Result Overlay */}
          {medicineResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-slate-100 shadow-2xl rounded-2xl mt-2 z-30 max-h-60 overflow-y-auto overflow-hidden divide-y divide-slate-50">
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
                      <p className="font-bold text-slate-900">{med.name}</p>
                      <p className="text-xs text-slate-500">
                        {med.brand} • Price: ₹{med.pricing?.sellingPrice} • Available Stock: {med.stock}
                      </p>
                    </div>
                  </div>
                  {med.stock > 0 ? (
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">
                      + Add
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescribed Medicines List */}
      {prescribedMedicines.length > 0 && (
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Prescription List ({prescribedMedicines.length})
          </label>
          <div className="space-y-4">
            {prescribedMedicines.map((med, idx) => (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-2xl p-5 bg-white shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-extrabold text-slate-950 text-base">
                      {med.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Stock: {med.stock}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setPrescribedMedicines(
                        prescribedMedicines.filter((_, i) => i !== idx),
                      )
                    }
                    className="text-slate-400 hover:text-red-500 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <FiTrash2 size={14} /> Remove
                  </button>
                </div>

                {/* Standard prescription params */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
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
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:border-emerald-500 outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
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
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:border-emerald-500 outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
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
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:border-emerald-500 outline-none transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
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
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:border-emerald-500 outline-none transition-all shadow-inner"
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

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 text-sm">
        {report ? (
          <button
            onClick={() => setIsEditing(false)}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={() => router.back()}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Exit Form
          </button>
        )}
        <button
          onClick={handleSaveReport}
          disabled={saving}
          className="bg-[#0a4d33] hover:bg-[#083d28] text-white px-7 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            "Save Report"
          )}
        </button>
      </div>
    </div>
  );
}
