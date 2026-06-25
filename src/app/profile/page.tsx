"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/redux/hooks";
import { logout } from "@/store/redux/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NavbarPage from "../navbar/page";
import Footer from "../footer/page";

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!user || !user._id) {
      router.push("/login");
    }
  }, [user, router]);

  if (!isMounted || !user) return null;

  return (
    <div className="min-h-screen bg-[#fcfdfd] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <NavbarPage />
      <br />
      <br /> 
      <br />
      <br />
      
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 1. Left Column: Professional Identity Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/3 flex flex-col gap-6"
          >
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
              {/* Decorative top bar */}
              <div className="h-2 bg-[#0a4d33]"></div>
              
              <div className="p-10 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 bg-[#eaf4f0] rounded-[2.5rem] flex items-center justify-center text-[#0a4d33] text-5xl font-black shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-4 border-white rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">{user.name}</h1>
                
                <div className="flex flex-col gap-3">
                  <div className="w-full py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl border border-slate-100 text-center text-xs uppercase tracking-[0.2em]">
                    Account Verified
                  </div>
                  <button 
                    onClick={() => {
                      dispatch(logout());
                      router.push("/");
                    }}
                    className="w-full py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl border border-rose-100 hover:bg-rose-100 transition-all text-sm uppercase tracking-widest active:scale-95"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Quick Metrics - Only Status */}
              <div className="border-t border-slate-50 bg-slate-50/50 p-8">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Status</p>
                  <p className="text-sm font-bold text-emerald-600">Active Member</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Right Column: Detailed Information */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-2/3 flex flex-col gap-8"
          >
            {/* Account Information Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-[#0a4d33] rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Account Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="group">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block group-hover:text-emerald-600 transition-colors">Primary Full Name</label>
                    <p className="text-lg font-bold text-slate-800 border-b-2 border-slate-50 pb-2">{user.name}</p>
                  </div>
                  <div className="group">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block group-hover:text-emerald-600 transition-colors">Registered Email</label>
                    <p className="text-lg font-bold text-slate-800 border-b-2 border-slate-50 pb-2">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="group">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block group-hover:text-emerald-600 transition-colors">Verification Status</label>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Member
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
