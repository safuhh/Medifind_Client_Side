"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/authSlice";

const NavbarPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderAuthUI = () => {
    if (!isMounted) return <div className="h-10 w-24" />;
    
    if (user && user._id) {
      return (
        <div className="flex items-center gap-5">
          {/* Notification Icon */}
          <div className="relative cursor-pointer group p-2 hover:bg-slate-50 rounded-xl transition-all">
            <svg className="w-6 h-6 text-slate-400 group-hover:text-[#0a4d33] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </div>

          <div className="w-[1px] h-8 bg-slate-100 mx-1"></div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-[#eaf4f0] rounded-xl flex items-center justify-center text-[#0a4d33] font-bold border border-emerald-100 group-hover:border-emerald-300 transition-all">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <Link href="/profile" className="hidden xl:block text-left hover:opacity-70 transition-opacity">
              <p className="text-[11px] font-black text-[#0a4d33] uppercase leading-none">{user.name}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">View Profile</p>
            </Link>
            <button 
              onClick={() => dispatch(logout())}
              className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl transition-all"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <Link href="/login" className="px-6 py-3 bg-[#0a4d33] text-white font-bold text-[15px] rounded-2xl hover:bg-[#083d28] shadow-lg shadow-emerald-900/10 transition-all active:scale-95">
          Join MediFind
        </Link>
      </div>
    );
  };

  return (
    <div className="w-full font-sans fixed top-0 z-50">
      {/* 1. SUB NAVBAR (Top Bar) */}
      <div className="w-full bg-[#0a4d33] py-2 px-6 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] font-bold text-emerald-100 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +1 (800) MEDI-FIND
            </span>
            <span className="flex items-center gap-2 opacity-60">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              24/7 Support
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">terms-conditions</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#0a4d33] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/10 transition-transform group-hover:scale-105">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tighter text-[#0a4d33]">MediFind</span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 mt-0.5">Healthcare</span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-[14px] font-black text-[#0a4d33] hover:opacity-70 transition-opacity uppercase tracking-widest">Home</Link>
            <Link href="#" className="text-[14px] font-black text-slate-400 hover:text-[#0a4d33] transition-colors uppercase tracking-widest">Find Medicine</Link>
            <Link href="/about" className="text-[14px] font-black text-slate-400 hover:text-[#0a4d33] transition-colors uppercase tracking-widest">About</Link>
            <Link href="/help" className="text-[14px] font-black text-slate-400 hover:text-[#0a4d33] transition-colors uppercase tracking-widest">Help</Link>
            <Link href="/partner" className="text-[14px] font-black text-slate-400 hover:text-[#0a4d33] transition-colors uppercase tracking-widest">Partners</Link>

          </div>

          {/* Right Side Actions - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <button className="px-5 py-2.5 bg-[#eaf4f0] text-[#0a4d33] font-bold text-[13px] rounded-xl hover:bg-[#dcede5] transition-all uppercase tracking-widest border border-emerald-100">
              Upload Rx
            </button>
            {renderAuthUI()}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-50 overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                <Link href="/" className="text-xl font-bold text-[#0a4d33]">Home</Link>
                <Link href="#" className="text-xl font-bold text-slate-600">Find Medicine</Link>
                <Link href="/about" className="text-xl font-bold text-slate-600">About</Link>
                <Link href="/help" className="text-xl font-bold text-slate-600">Help</Link>
                <Link href="/partner" className="text-xl font-bold text-slate-600">Partners</Link>
                                <Link href="/profile" className="text-xl font-bold text-slate-600">Profile</Link>
                    <Link href="/terms" className="text-xl font-bold text-slate-600">Terms & Conditions</Link>
                                <Link href="/privacy-policy" className="text-xl font-bold text-slate-600">Privacy Policy</Link>                

                <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                  <button className="w-full py-4 bg-[#eaf4f0] text-[#0a4d33] font-bold rounded-xl text-lg">Upload Rx</button>
                  {isMounted && user && user._id ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 bg-[#0a4d33] text-white rounded-lg flex items-center justify-center font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400">Patient Account</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => dispatch(logout())}
                        className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-xl text-lg text-center"
                      >
                        Logout
                      </button>
                    </div>
                  ) : isMounted ? (
                    <>
                      <Link href="/login" className="w-full py-4 bg-[#0a4d33] text-white font-bold rounded-xl text-center text-lg shadow-lg shadow-emerald-900/10">Join MediFind</Link>
                    </>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default NavbarPage;
