"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/authSlice";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const NavbarPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Handle hydration mismatch and body scroll lock
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && user && user._id) {
      const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");
      
      socket.emit("join_doctor_room", user._id);
      
      socket.on("consultation_started", (data) => {
        console.log("Received consultation_started notification:", data);
        toast.info(`Doctor ${data.doctorName || ""} is ready! Click here to join the room.`, {
          onClick: () => window.location.href = `/consultation/${data.roomId}`,
          autoClose: false,
        });
      });
      
      return () => {
        socket.off("consultation_started");
        socket.disconnect();
      };
    }
  }, [isMounted, user]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const renderAuthUI = () => {
    if (!isMounted) return <div className="h-10 w-24 animate-pulse bg-gray-100 rounded-lg" />;

    if (user && user._id) {
      return (
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <Link href="/notifications" className="relative p-2 text-gray-500 hover:text-[#0a4d33] hover:bg-gray-100 rounded-full transition-all focus:outline-none">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </Link>

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <Link href="/profile" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#eaf4f0] rounded-full flex items-center justify-center text-[#0a4d33] font-semibold border border-[#dcede5] group-hover:border-[#0a4d33] transition-all">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-[#0a4d33] transition-colors">
                  {user.name}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  View Profile
                </span>
              </div>
            </Link>
            
            <button
              onClick={() => dispatch(logout())}
              className="ml-2 p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
              title="Logout"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      );
    }

    return (
      <Link
        href="/login"
        className="px-5 py-2.5 bg-[#0a4d33] text-white font-medium text-sm rounded-lg hover:bg-[#083d28] shadow-md hover:shadow-lg transition-all active:scale-95"
      >
        Join MediFind
      </Link>
    );
  };

  return (
    <div className="w-full font-sans fixed top-0 z-50">
      {/* 1. SUB NAVBAR (Top Bar) */}
      <div className="w-full bg-[#073b27] py-2 px-6 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-medium text-emerald-100/90 tracking-wide">
          <div className="flex items-center gap-6">
            <a href="tel:+1800MEDIFIND" className="flex items-center gap-2 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +1 (800) MEDI-FIND
            </a>
            <span className="flex items-center gap-2 opacity-75">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              24/7 Support Available
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/help" className="hover:text-white transition-colors">Help</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <nav className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#0a4d33] rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:-translate-y-0.5">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-[#0a4d33] transition-colors">
                MediFind
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 mt-1">
                Healthcare
              </span>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/medicines" className="text-sm font-medium text-gray-600 hover:text-[#0a4d33] transition-colors">
              Find Medicine
            </Link>
            <Link href="/consultation" className="text-sm font-medium text-gray-600 hover:text-[#0a4d33] transition-colors">
              Consultation
            </Link>
            <Link 
              href={user?.role === "doctor" ? "/doctor/dashboard" : "/doctor/apply"}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {user?.role === "doctor" ? "Doctor Dashboard" : "Doctor Portal"}
            </Link>
            <Link href="/partner" className="text-sm font-medium text-gray-600 hover:text-[#0a4d33] transition-colors">
              Partners
            </Link>
          </div>

          {/* Right Side Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-5">
            <button className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold text-sm rounded-lg hover:bg-emerald-100 transition-all border border-emerald-100">
              Upload Rx
            </button>
            {renderAuthUI()}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all focus:outline-none"
            aria-label="Open Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* 3. MOBILE SIDEBAR MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] lg:hidden"
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-[100dvh] w-full max-w-sm bg-white shadow-2xl z-[70] lg:hidden flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="px-6 h-20 flex items-center justify-between border-b border-gray-100">
                <span className="text-lg font-bold text-gray-900">Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-gray-50 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all focus:outline-none"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Links Section */}
              <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-5">
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="text-base font-semibold text-gray-800 hover:text-[#0a4d33]">Home</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/medicines" className="text-base font-semibold text-gray-600 hover:text-[#0a4d33]">Find Medicine</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/consultation" className="text-base font-semibold text-gray-600 hover:text-[#0a4d33]">Consultation</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className="text-base font-semibold text-gray-600 hover:text-[#0a4d33]">About Us</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/help" className="text-base font-semibold text-gray-600 hover:text-[#0a4d33]">Help & Support</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/partner" className="text-base font-semibold text-gray-600 hover:text-[#0a4d33]">Partners</Link>

                <div className="w-full h-px bg-gray-100 my-2"></div>

                <Link onClick={() => setIsMobileMenuOpen(false)} href="/profile" className="text-base font-medium text-gray-500 hover:text-[#0a4d33]">My Profile</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/terms" className="text-base font-medium text-gray-500 hover:text-[#0a4d33]">Terms & Conditions</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/privacy-policy" className="text-base font-medium text-gray-500 hover:text-[#0a4d33]">Privacy Policy</Link>
              </div>

              {/* Sticky Bottom Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
                <button className="w-full py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-lg text-sm border border-emerald-100 hover:bg-emerald-100 transition-colors">
                  Upload Prescription (Rx)
                </button>

                {isMounted && user && user._id ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="w-10 h-10 bg-[#0a4d33] text-white rounded-full flex items-center justify-center font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {user.role === "doctor" ? "Doctor Account" : "Patient Account"}
                        </p>
                      </div>
                    </div>
                    {user.role === "doctor" && (
                      <Link
                        onClick={() => setIsMobileMenuOpen(false)}
                        href="/doctor/dashboard"
                        className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg text-sm text-center hover:bg-emerald-700 transition-colors"
                      >
                        Doctor Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 bg-white border border-red-200 text-red-600 font-semibold rounded-lg text-sm text-center hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : isMounted ? (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 bg-[#0a4d33] text-white font-semibold rounded-lg text-center text-sm hover:bg-[#083d28] transition-colors shadow-md"
                  >
                    Join MediFind
                  </Link>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarPage;