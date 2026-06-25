"use client";

import { motion } from "framer-motion";
import { FiArrowLeft, FiCheckCircle, FiClock } from "react-icons/fi";
import NavbarPage from "@/app/navbar/page";
import Footer from "@/app/footer/page";
import ReportViewer from "./ReportViewer";
import ReportEditor from "./ReportEditor";
import ReportHeader from "./ReportHeader";
import AISplitModal from "./AISplitModal";
import { useHealthReport } from "./useHealthReport";

export default function HealthReportPage() {
  const {
    router,
    isDoctor,
    report,
    booking,
    loading,
    patientInfo,
    doctorInfo,
    isEditing,
    setIsEditing,
    reportNotes,
    setReportNotes,
    prescribedMedicines,
    setPrescribedMedicines,
    medicineSearch,
    medicineResults,
    saving,
    handleSearchMedicine,
    handleAddMedicine,
    handleSaveReport,
    isOptimizing,
    showSplitModal,
    setShowSplitModal,
    splitPlan,
    handleFindBuyWithAI,
    selectedQuantities,
    handleIncreaseQty,
    handleDecreaseQty,
  } = useHealthReport();

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading || (isDoctor && !booking)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#0a4d33] border-r-2 border-[#0a4d33]/30" />
      </div>
    );
  }

  // ── No report found (patient view) ──────────────────────────────────────────
  if (!report && !isDoctor) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafafa]">
        <NavbarPage />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiClock size={24} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No Report Found
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              The doctor hasn't written a health report for this consultation
              yet.
            </p>
            <button
              onClick={() => router.back()}
              className="bg-[#0a4d33] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#083d28] transition-colors inline-flex items-center gap-2"
            >
              <FiArrowLeft /> Go Back
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Main page ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <NavbarPage />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-32 sm:px-8 lg:px-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 text-slate-600 hover:text-[#0a4d33] font-semibold text-sm flex items-center gap-2 transition-colors print:hidden"
        >
          <FiArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Report Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          {/* Green header banner */}
          <ReportHeader
            isEditing={isEditing}
            isDoctor={isDoctor}
            report={report}
            booking={booking}
            onStartEditing={() => setIsEditing(true)}
          />

          <div className="p-8 md:p-12 space-y-10">
            {/* View / Edit switcher */}
            {!isEditing ? (
              <ReportViewer
                report={report}
                booking={booking}
                patientInfo={patientInfo}
                doctorInfo={doctorInfo}
                isDoctor={isDoctor}
                onFindBuyWithAI={handleFindBuyWithAI}
                isOptimizing={isOptimizing}
                selectedQuantities={selectedQuantities}
                onIncreaseQty={handleIncreaseQty}
                onDecreaseQty={handleDecreaseQty}
              />
            ) : (
              <ReportEditor
                report={report}
                booking={booking}
                patientInfo={patientInfo}
                reportNotes={reportNotes}
                setReportNotes={setReportNotes}
                prescribedMedicines={prescribedMedicines}
                setPrescribedMedicines={setPrescribedMedicines}
                medicineSearch={medicineSearch}
                handleSearchMedicine={handleSearchMedicine}
                medicineResults={medicineResults}
                handleAddMedicine={handleAddMedicine}
                saving={saving}
                handleSaveReport={handleSaveReport}
                setIsEditing={setIsEditing}
                router={router}
              />
            )}

            {/* Footer disclaimer */}
            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FiCheckCircle className="text-emerald-500" size={14} />
                <p>
                  This is a digitally verified medical document and does not
                  require a physical signature.
                </p>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                MediFind Healthcare Platform
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* AI Split-Order Optimization Modal */}
      {showSplitModal && splitPlan && (
        <AISplitModal
          splitPlan={splitPlan}
          onClose={() => setShowSplitModal(false)}
          onProceed={() => {
            setShowSplitModal(false);
            router.push(`/deliveryDetails?splitFulfillmentId=${splitPlan._id}`);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
