import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Pill, Calendar, Clock, Stethoscope, Download } from "lucide-react";

interface Props {
  report: any | null;
  onClose: () => void;
}

export default function HealthReportModal({ report, onClose }: Props) {
  if (!report) return null;

  const doctorName = report.doctorId?.fullName || "Doctor";
  const specialization = report.doctorId?.specialization || "General Practice";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-[18px] flex items-center justify-center border border-emerald-100">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">Health Report</h2>
                <p className="text-sm text-slate-500 font-medium">
                  {new Date(report.createdAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-8 flex-1">
            
            {/* Doctor Info */}
            <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-blue-200 shadow-sm text-blue-600">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Dr. {doctorName}</h3>
                <p className="text-sm text-slate-600 font-medium">{specialization}</p>
              </div>
            </div>

            {/* Diagnosis */}
            {report.diagnosisText && (
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Diagnosis</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-800 text-sm leading-relaxed">
                  {report.diagnosisText}
                </div>
              </div>
            )}

            {/* Doctor's Notes */}
            {report.notes && (
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Doctor's Notes</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {report.notes}
                </div>
              </div>
            )}

            {/* Prescriptions */}
            {report.medicines && report.medicines.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-slate-400" /> Prescribed Medicines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.medicines.map((med: any, idx: number) => (
                    <div key={idx} className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl flex flex-col gap-1">
                      <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                      <span className="text-xs text-emerald-700 font-semibold">{med.dosage} · {med.timesPerDay || "As directed"}</span>
                      {med.instructions && (
                        <p className="text-xs text-slate-500 mt-2 bg-white p-2 rounded-lg border border-slate-100">
                          {med.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0a4d33] hover:bg-emerald-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
