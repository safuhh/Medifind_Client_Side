"use client";

import { useState, useEffect } from "react";
import { getAllDoctorApplications, reviewDoctorApplication } from "@/app/apis/doctor.api";
import AdminNavbar from "../adminnavbar/page";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiX, FiInfo, FiExternalLink, FiClock, FiSearch, FiFileText, FiMapPin } from "react-icons/fi";

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
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminNavbar />

      <main className="flex-1 md:ml-72 p-6 md:p-10 pt-24 md:pt-10">
        <div className="max-w-7xl mx-auto">
          
          <header className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Doctor Verifications</h1>
            <p className="text-slate-500">Review and verify medical credentials of applicants</p>
          </header>

          {/* Filters */}
          <div className="flex gap-4 mb-8 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit shadow-sm">
            {["pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  filter === s ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-slate-900 border-r-2 border-slate-900/20"></div>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-24 flex flex-col items-center text-center">
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
                    className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-200/40 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
<img 
  src={`http://localhost:5000${app.profileImage}`} 
  alt={app.fullName} 
  className="w-full h-full object-cover" 
/>                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{app.fullName}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">{app.specialization}</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1"><FiClock /> {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-8 text-sm">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-300 uppercase">Registration</span>
                        <span className="font-bold text-slate-600">{app.registrationNumber}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-300 uppercase">Experience</span>
                        <span className="font-bold text-slate-600">{app.experienceYears} Years</span>
                      </div>
                    </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => { setSelectedApp(app); setShowDetailsModal(true); }}
                          className="bg-slate-100 text-slate-600 p-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                          title="View Full Details"
                        >
                          <FiInfo size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                          <a 
                            href={`http://localhost:5000${app.qualification.certificateUrl}`} 
                            target="_blank" 
                            className="bg-emerald-50 text-emerald-600 p-3 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                            title="View Certificate"
                          >
                            <FiFileText size={20} />
                          </a>
                          {app.selfieWithId && (
                            <a 
                              href={`http://localhost:5000${app.selfieWithId}`} 
                              target="_blank" 
                              className="bg-amber-50 text-amber-600 p-3 rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                              title="View Selfie ID"
                            >
                              <FiExternalLink size={20} />
                            </a>
                          )}
                        </div>

                      {filter === 'pending' && (
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleReview(app._id, 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                            title="Approve"
                          >
                            <FiCheck size={20} />
                          </button>
                          <button 
                            onClick={() => { setSelectedApp(app); setShowRejectModal(true); }}
                            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all active:scale-95"
                            title="Reject"
                          >
                            <FiX size={20} />
                          </button>
                        </div>
                      )}

                      {filter !== 'pending' && (
                        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 md:p-10 max-w-lg w-full relative z-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-2">Reject Application</h2>
              <p className="text-slate-500 mb-8">Please provide a reason for rejecting Dr. {selectedApp?.fullName}'s application. This will be sent to their email.</p>
              
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Invalid medical registration number..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all min-h-[150px] mb-8"
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleReview(selectedApp._id, 'rejected')}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] max-w-4xl w-full relative z-10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <img src={`http://localhost:5000${selectedApp.profileImage}`} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" />
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{selectedApp.fullName}</h2>
                    <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider">{selectedApp.specialization}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-all">
                  <FiX size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-10">
                {/* Section: Personal */}
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Email</p>
                      <p className="font-bold text-slate-700">{selectedApp.email}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Phone</p>
                      <p className="font-bold text-slate-700">{selectedApp.phone}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Address</p>
                      <p className="font-bold text-slate-700">{selectedApp.address}</p>
                    </div>
                  </div>
                </section>

                {/* Section: Professional */}
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Professional Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Registration No.</p>
                      <p className="font-bold text-slate-700">{selectedApp.registrationNumber}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Medical Council</p>
                      <p className="font-bold text-slate-700">{selectedApp.medicalCouncil}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Experience</p>
                      <p className="font-bold text-slate-700">{selectedApp.experienceYears} Years</p>
                    </div>
                  </div>
                </section>

                {/* Section: Qualification */}
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Academic Background</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Degree</p>
                      <p className="font-bold text-slate-700">{selectedApp.qualification.degree}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">College/University</p>
                      <p className="font-bold text-slate-700">{selectedApp.qualification.collegeName}</p>
                    </div>
                  </div>
                </section>

                {/* Section: Location */}
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Location Data</h3>
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Coordinates</p>
                      <p className="font-bold text-slate-700">
                        LAT: {selectedApp.location.coordinates[1]} | LNG: {selectedApp.location.coordinates[0]}
                      </p>
                    </div>
                    <a 
                      href={`https://www.google.com/maps?q=${selectedApp.location.coordinates[1]},${selectedApp.location.coordinates[0]}`}
                      target="_blank"
                      className="text-xs font-black text-emerald-600 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                    >
                      <FiMapPin /> Open Maps
                    </a>
                  </div>
                </section>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                 <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700 transition-all"
                >
                  Close
                </button>
                {selectedApp.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => { handleReview(selectedApp._id, 'rejected'); setShowDetailsModal(false); }}
                      className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-8 py-3 rounded-xl font-bold transition-all"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => { handleReview(selectedApp._id, 'approved'); setShowDetailsModal(false); }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
                    >
                      Approve Doctor
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
