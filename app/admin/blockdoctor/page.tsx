"use client";

import { useEffect, useState } from "react";
import {
  blockDoctorApi,
  unblockDoctorApi,
  getAllDoctorsApi,
} from "@/app/apis/blockdoctorapi";
import { FiSearch, FiMail, FiShield, FiShieldOff, FiRefreshCw } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/app/admin/adminnavbar/page";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
}

export default function AdminDoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await getAllDoctorsApi();
      setDoctors(res.data.doctors || res.data);
    } catch (error) {
      console.log("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleBlock = async (id: string) => {
    try {
      await blockDoctorApi(id);
      setDoctors((prev) =>
        prev.map((doctor) =>
          doctor._id === id ? { ...doctor, isBlocked: true } : doctor
        )
      );
    } catch (error) {
      console.log("Block failed");
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      await unblockDoctorApi(id);
      setDoctors((prev) =>
        prev.map((doctor) =>
          doctor._id === id ? { ...doctor, isBlocked: false } : doctor
        )
      );
    } catch (error) {
      console.log("Unblock failed");
    }
  };

  const filtered = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      <AdminSidebar />
      
      {/* 
        Added w-full and adjusted mobile paddings (p-4, sm:p-6) 
        pt-24 accounts for mobile top-navs, while md:p-10 creates spacious desktop layout 
      */}
      <main className="flex-1 w-full md:ml-72 p-4 sm:p-6 pt-24 md:pt-10 md:p-10 max-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Doctor Management</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Manage doctor access and block/unblock accounts</p>
            </div>
            
            <button 
              onClick={fetchDoctors}
              className="flex items-center justify-center sm:justify-start gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors py-2 sm:py-0 w-full sm:w-auto bg-emerald-50 sm:bg-transparent rounded-lg sm:rounded-none"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full md:max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="w-full">
              <table className="w-full text-left border-collapse">
                
                {/* Desktop Header - Hidden on mobile */}
                <thead className="hidden md:table-header-group bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Doctor</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                
                {/* Body changes from flex-col (mobile) to table-row-group (desktop) */}
                <tbody className="flex flex-col md:table-row-group divide-y divide-gray-100 md:divide-gray-50">
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="block md:table-cell p-8 w-full text-center text-gray-500 text-sm">
                          <div className="flex justify-center items-center gap-2">
                            <div className="h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            Loading doctors...
                          </div>
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="block md:table-cell p-8 w-full text-center text-gray-500 text-sm">
                          No doctors found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((doctor) => (
                        <motion.tr 
                          key={doctor._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          // Row becomes a stacked flex-box card on mobile, standard row on desktop
                          className="flex flex-col md:table-row p-4 md:p-0 gap-3 md:gap-0 hover:bg-gray-50/50 transition-colors"
                        >
                          {/* Doctor Info */}
                          <td className="md:p-4 flex justify-between md:table-cell items-center w-full">
                            <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Doctor</span>
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm shrink-0">
                                {doctor.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900 text-sm truncate max-w-[150px] sm:max-w-xs">{doctor.name}</span>
                            </div>
                          </td>
                          
                          {/* Email */}
                          <td className="md:p-4 flex justify-between md:table-cell items-center text-sm text-gray-600 w-full">
                            <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Email</span>
                            <div className="flex items-center gap-2 truncate">
                              <FiMail className="text-gray-400 shrink-0" />
                              <span className="truncate">{doctor.email}</span>
                            </div>
                          </td>
                          
                          {/* Status */}
                          <td className="md:p-4 flex justify-between md:table-cell items-center w-full">
                            <span className="md:hidden text-xs font-bold text-gray-400 uppercase">Status</span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                doctor.isBlocked
                                  ? "bg-red-50 text-red-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${doctor.isBlocked ? "bg-red-600" : "bg-emerald-600"}`} />
                              {doctor.isBlocked ? "Blocked" : "Active"}
                            </span>
                          </td>
                          
                          {/* Actions */}
                          <td className="md:p-4 flex justify-end md:table-cell items-center w-full md:text-right mt-2 md:mt-0 pt-3 md:pt-4 border-t border-gray-50 md:border-t-0">
                            {doctor.isBlocked ? (
                              <button
                                onClick={() => handleUnblock(doctor._id)}
                                className="inline-flex items-center justify-center gap-1.5 w-full md:w-auto px-4 md:px-3 py-2 md:py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                              >
                                <FiShield className="text-emerald-600" />
                                Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlock(doctor._id)}
                                className="inline-flex items-center justify-center gap-1.5 w-full md:w-auto px-4 md:px-3 py-2 md:py-1.5 bg-white border border-gray-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                              >
                                <FiShieldOff />
                                Block
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
