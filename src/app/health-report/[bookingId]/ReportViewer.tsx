import dayjs from "dayjs";
import { FiUser, FiActivity, FiCheckCircle, FiClock, FiExternalLink, FiMinus, FiPlus } from "react-icons/fi";
import { getImageUrl } from "@/utils/imageUrl";

interface ReportViewerProps {
  report: any;
  booking: any;
  patientInfo: any;
  doctorInfo: any;
  isDoctor: boolean;
  onFindBuyWithAI: () => void;
  isOptimizing: boolean;
  selectedQuantities?: Record<string, number>;
  onIncreaseQty?: (medId: string, maxQty: number) => void;
  onDecreaseQty?: (medId: string) => void;
}

export default function ReportViewer({
  report,
  booking,
  patientInfo,
  doctorInfo,
  isDoctor,
  onFindBuyWithAI,
  isOptimizing,
  selectedQuantities = {},
  onIncreaseQty = () => {},
  onDecreaseQty = () => {},
}: ReportViewerProps) {
  const allPurchased = report?.medicines && report.medicines.length > 0 && report.medicines.every((m: any) => m.remainingQty === 0);
  const totalSelected = Object.values(selectedQuantities).reduce((a, b) => a + b, 0);
  const allExcluded = report?.medicines && report.medicines.length > 0 && totalSelected === 0;

  return (
    <>
      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Card */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100/80 hover:border-emerald-100 transition-colors group">
          <div className="w-10 h-10 bg-emerald-50 text-[#0a4d33] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0a4d33] group-hover:text-white transition-colors">
            <FiUser size={20} />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Patient
          </p>
          <p className="font-bold text-slate-900 text-base">
            {patientInfo?.name}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">
            {patientInfo?.email}
          </p>
        </div>

        {/* Doctor Card */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100/80 hover:border-emerald-100 transition-colors group">
          <div className="flex items-center gap-4 mb-4">
            {doctorInfo?.profileImage ? (
              <img
                src={getImageUrl(doctorInfo.profileImage)}
                alt={doctorInfo?.fullName}
                className="w-10 h-10 rounded-xl object-cover bg-slate-100"
              />
            ) : (
              <div className="w-10 h-10 bg-emerald-50 text-[#0a4d33] rounded-xl flex items-center justify-center group-hover:bg-[#0a4d33] group-hover:text-white transition-colors">
                <FiActivity size={20} />
              </div>
            )}
            <div className="w-4 h-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center -ml-6 -mt-6 z-10 border-2 border-white">
              <FiCheckCircle size={10} />
            </div>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Physician
          </p>
          <p className="font-bold text-slate-900 text-base">
            Dr. {doctorInfo?.fullName || "Physician"}
          </p>
          <p className="text-[#0a4d33] text-xs font-semibold mt-0.5">
            {doctorInfo?.specialization}
          </p>
        </div>

        {/* Date Card */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100/80 hover:border-emerald-100 transition-colors group">
          <div className="w-10 h-10 bg-emerald-50 text-[#0a4d33] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0a4d33] group-hover:text-white transition-colors">
            <FiClock size={20} />
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Consultation Date
          </p>
          <p className="font-bold text-slate-900 text-base">
            {dayjs(report?.createdAt || booking?.date).format(
              "DD MMMM, YYYY",
            )}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">
            {dayjs(report?.createdAt || booking?.createdAt).format(
              "h:mm A",
            )}
          </p>
        </div>
      </div>

      {/* Advice Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#0a4d33] rounded-full"></div>
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
            Clinical Observations
          </h2>
        </div>
        <div className="bg-[#fafafa] rounded-2xl p-8 text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap border border-slate-100">
          {report?.notes}
        </div>
      </div>

      {/* Prescription Table */}
      {report?.medicines && report.medicines.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#0a4d33] rounded-full"></div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Prescribed Medication
              </h2>
            </div>
            {!isDoctor && (
              <button
                onClick={onFindBuyWithAI}
                disabled={isOptimizing || allPurchased || allExcluded}
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700 text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 print:hidden shadow-sm"
              >
                {isOptimizing ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5 animate-spin text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span className="text-emerald-600">Finding pharmacies…</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Find &amp; Buy with AI
                  </>
                )}
              </button>
            )}
          </div>

          <div className="overflow-hidden bg-white border border-slate-100 rounded-2xl shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-left border-b border-slate-100">
                  <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider">
                    Dosage
                  </th>
                  <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider">
                    Instructions
                  </th>
                  <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider">
                    Times/Day
                  </th>
                  <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="py-4 px-6 font-bold text-[11px] uppercase tracking-wider text-right">
                    Acquisition
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {report.medicines.map((med: any, idx: number) => {
                  const selectedQty = med.medicineId ? (selectedQuantities[med.medicineId.toString()] ?? (med.remainingQty !== undefined ? med.remainingQty : med.quantity)) : med.quantity;
                  return (
                    <tr
                      key={idx}
                      className="text-slate-700 hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="py-5 px-6 font-bold text-slate-900">
                        {med.name}
                      </td>
                      <td className="py-5 px-6 text-slate-600 font-medium">
                        {med.dosage || "As directed"}
                      </td>
                      <td className="py-5 px-6 text-slate-500 text-xs leading-relaxed">
                        {med.instructions || "N/A"}
                      </td>
                      <td className="py-5 px-6 text-slate-500 text-xs leading-relaxed">
                        {med.timesPerDay || "N/A"}
                      </td>
                      <td className="py-5 px-6 font-medium text-slate-700">
                        {!isDoctor && med.remainingQty > 0 ? (
                          <div className="flex flex-col gap-1.5">
                            <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 w-24">
                              <button
                                onClick={() => onDecreaseQty(med.medicineId)}
                                disabled={selectedQty <= 0}
                                className="p-1 hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
                              >
                                <FiMinus size={12} className="text-slate-600" />
                              </button>
                              <div className="flex-1 text-center font-bold text-xs py-1 bg-white select-none text-slate-800">
                                {selectedQty}
                              </div>
                              <button
                                onClick={() => onIncreaseQty(med.medicineId, med.remainingQty)}
                                disabled={selectedQty >= med.remainingQty}
                                className="p-1 hover:bg-slate-100 disabled:opacity-30 transition-colors cursor-pointer"
                              >
                                <FiPlus size={12} className="text-slate-600" />
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold leading-tight">
                              {med.remainingQty} remaining (prescribed: {med.quantity})
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{med.quantity}</span>
                            {med.remainingQty !== undefined && med.remainingQty !== med.quantity && (
                              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                                ({med.remainingQty} remaining)
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-5 px-6 text-right">
                        {med.remainingQty === 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-500 font-bold text-xs rounded-lg border border-slate-200 shadow-sm cursor-not-allowed">
                            Purchased
                          </span>
                        ) : selectedQty === 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-400 font-bold text-xs rounded-lg border border-slate-100 shadow-sm cursor-not-allowed">
                            Excluded
                          </span>
                        ) : (
                          <a
                            href={`/medicines/${med.medicineId}?prescribedQty=${selectedQty}`}
                            className="bg-[#0a4d33] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#083d28] transition-all shadow-sm hover:shadow-md active:scale-95 inline-flex items-center gap-1.5"
                          >
                            Purchase <FiExternalLink size={12} />
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
