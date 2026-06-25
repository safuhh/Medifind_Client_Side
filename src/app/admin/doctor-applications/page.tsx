"use client";

import { useState, useEffect } from "react";
import { getAllDoctorApplications, reviewDoctorApplication } from "@/services/apis/doctor.api";
import AdminNavbar from "../adminnavbar/page";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiInfo, FiExternalLink, FiClock, FiSearch, FiFileText, FiMapPin } from "react-icons/fi";
import { getImageUrl } from "@/utils/imageUrl";

export default function AdminDoctorApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState("pending");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getAllDoctorApplications();
      setApplications(res.data.applications);
    } catch (err: any) {
      console.error("ERROR DETAILS:", err.response?.data || err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load requests";
      const currentRole = err.response?.data?.currentRole;
      alert(`${errorMsg}${currentRole ? ` (Current Role: ${currentRole})` : ""}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (id: string, status: string) => {
    if (status === 'rejected' && !rejectionReason) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      await reviewDoctorApplication(id, status, status === 'rejected' ? rejectionReason : undefined);
      setShowRejectModal(false);
      setRejectionReason("");
      fetchApplications();
    } catch (err) {
      alert("Action failed");
    }
  };

  const filteredApps = applications.filter(app => app.status === filter);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <AdminNavbar />

      <main className="flex-1 md:ml-72 p-4 sm:p-6 md:p-10 pt-24 md:pt-10">
        <div className="max-w-7xl mx-auto">
          
          <header className="mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Doctor Verifications</h1>
            <p className="text-sm sm:text-base text-slate-500">Review and verify medical credentials of applicants</p>
          </header>

          {/* Filters - Scrollable on mobile */}
          <div className="w-full overflow-x-auto pb-2 mb-8 no-scrollbar">
            <div className="flex gap-2 sm:gap-4 bg-white p-1.5 rounded-2xl border border-slate-200 w-max shadow-sm">
              {["pending", "approved", "rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all ${
                    filter === s ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-slate-900 border-r-2 border-slate-900/20"></div>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-20 sm:py-24 flex flex-col items-center text-center px-4">
               <FiFileText size={48} className="text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No {filter} applications</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredApps.map((app) => (
                  <motion.div
                    key={app._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-200/40 transition-all group"
                  >
                    {/* Left: Avatar + Name + Specialization */}
                    <div className="flex items-center gap-4 sm:gap-5 w-full lg:w-auto">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                        <img 
                          src={getImageUrl(app.profileImage)} 
                          alt={app.fullName} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate">{app.fullName}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
                          <span className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">{app.specialization}</span>
                          <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1 shrink-0"><FiClock /> {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Brief details row */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-8 text-sm w-full lg:w-auto border-y border-slate-50 py-4 lg:py-0 lg:border-none">
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-wider">Registration</span>
                        <span className="font-bold text-slate-600 text-xs sm:text-sm truncate">{app.registrationNumber}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-wider">Experience</span>
                        <span className="font-bold text-slate-600 text-xs sm:text-sm">{app.experienceYears} Years</span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between sm:justify-start lg:justify-end">
                      
                      {/* Sub-group: Info & Docs */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => { setSelectedApp(app); setShowDetailsModal(true); }}
                          className="bg-slate-100 text-slate-600 p-2.5 sm:p-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                          title="View Full Details"
                        >
                          <FiInfo size={18} />
                        </button>
                        <a 
                          href={getImageUrl(app.qualification.certificateUrl)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-emerald-50 text-emerald-600 p-2.5 sm:p-3 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                          title="View Certificate"
                        >
                          <FiFileText size={18} />
                        </a>
                        {app.selfieWithId && (
                          <a 
                            href={getImageUrl(app.selfieWithId)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-amber-50 text-amber-600 p-2.5 sm:p-3 rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                            title="View Selfie ID"
                          >
                            <FiExternalLink size={18} />
                          </a>
                        )}
                      </div>

                      {/* Sub-group: Review Decisions */}
                      {filter === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleReview(app._id, 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 sm:p-3 rounded-xl shadow-md shadow-emerald-600/10 transition-all active:scale-95 flex items-center justify-center"
                            title="Approve"
                          >
                            <FiCheck size={18} />
                          </button>
                          <button 
                            onClick={() => { setSelectedApp(app); setShowRejectModal(true); }}
                            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2.5 sm:p-3 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                            title="Reject"
                          >
                            <FiX size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          filter === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {filter}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Rejection Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Reject Application</h2>
              <p className="text-sm text-slate-500 mb-6">Please provide a reason for rejecting Dr. {selectedApp?.fullName}'s application. This will be emailed to them.</p>
              
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Invalid medical registration number..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all min-h-[120px] mb-6 text-sm text-slate-700"
              />

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="w-full sm:flex-1 py-3.5 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleReview(selectedApp._id, 'rejected')}
                  className="w-full sm:flex-1 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-red-500/10 text-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-3xl w-full relative z-10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <img src={getImageUrl(selectedApp.profileImage)} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border-2 border-white shadow-sm shrink-0" />
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate">{selectedApp.fullName}</h2>
                    <p className="text-emerald-600 font-bold text-xs uppercase tracking-wider truncate">{selectedApp.specialization}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-all shrink-0">
                  <FiX size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Scrollable details */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-8 flex-1">
                {/* Section: Personal */}
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3.5">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Email</p>
                      <p className="font-bold text-slate-700 text-xs sm:text-sm break-all">{selectedApp.email}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Phone</p>
                      <p className="font-bold text-slate-700 text-xs sm:text-sm">{selectedApp.phone}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl sm:col-span-2 md:col-span-1">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Address</p>
                      <p className="font-bold text-slate-700 text-xs sm:text-sm leading-relaxed">{selectedApp.address}</p>
                    </div>
                  </div>
                </section>

                {/* Section: Professional */}
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3.5">Professional Credentials</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Registration No.</p>
                      <p className="font-bold text-slate-700 text-xs sm:text-sm">{selectedApp.registrationNumber}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Medical Council</p>
                      <p className="font-bold text-slate-700 text-xs sm:text-sm">{selectedApp.medicalCouncil}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Experience</p>
                      <p className="font-bold text-slate-700 text-xs sm:text-sm">{selectedApp.experienceYears} Years</p>
                    </div>
                  </div>
                </section>

                {/* Section: Qualification */}
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3.5">Academic Background</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">Degree</p>
                      <p className="font-bold text-slate-700 text-xs sm:text-sm">{selectedApp.qualification.degree}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1">College/University</p>
                      <p className="font-bold text-slate-700 text-xs sm:text-sm leading-relaxed">{selectedApp.qualification.collegeName}</p>
                    </div>
                  </div>
                </section>

                {/* Section: Location */}
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3.5">Location Data</h3>
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-bold text-emerald-600 uppercase mb-1">Coordinates</p>
                      <p className="font-bold text-slate-700 text-xs sm:text-sm">
                        LAT: {selectedApp.location.coordinates[1]} | LNG: {selectedApp.location.coordinates[0]}
                      </p>
                    </div>
                    <a 
                      href={`https://www.google.com/maps?q=${selectedApp.location.coordinates[1]},${selectedApp.location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-black text-emerald-600 bg-white px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 border border-emerald-100/30"
                    >
                      <FiMapPin /> Open Maps
                    </a>
                  </div>
                </section>
              </div>

              {/* Modal Footer */}
              <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
                 <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700 transition-all text-sm w-full sm:w-auto"
                >
                  Close
                </button>
                {selectedApp.status === 'pending' && (
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => { handleReview(selectedApp._id, 'rejected'); setShowDetailsModal(false); }}
                      className="flex-1 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl font-bold transition-all text-sm"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => { handleReview(selectedApp._id, 'approved'); setShowDetailsModal(false); }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-emerald-600/10 text-sm"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
