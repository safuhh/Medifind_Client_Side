"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useAppSelector } from "@/store/redux/hooks";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const NavbarPage = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  // Animation Variants for Mobile Sidebar
  const backdropVariants: Variants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: { opacity: 1, backdropFilter: "blur(8px)", transition: { duration: 0.25 } },
    exit: { opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.2 } },
  };

  const sidebarVariants: Variants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "tween",
        ease: [0.16, 1, 0.3, 1],
        duration: 0.35,
        staggerChildren: 0.04,
        delayChildren: 0.05
      }
    },
    exit: {
      x: "100%",
      transition: {
        type: "tween",
        ease: [0.16, 1, 0.3, 1],
        duration: 0.25
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        ease: [0.16, 1, 0.3, 1],
        duration: 0.3
      }
    }
  };

  // Handle hydration mismatch and body scroll lock
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMounted && user && user._id) {
      const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api");
      
      socket.emit("join_doctor_private_room", user._id);
      
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
          <Link href="/notifications" className="text-sm font-medium text-gray-600 hover:text-[#0a4d33] transition-colors relative">
            Medical Updates
            <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </Link>

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <Link href="/orders" className="text-sm font-medium text-gray-600 hover:text-[#0a4d33] transition-colors mr-2">
              Orders
            </Link>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0118 0z" />
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          
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
          <div className="hidden lg:flex flex-1 items-center justify-center gap-7 px-4">
            <Link href="/medicines" className="text-sm font-medium text-gray-600 hover:text-[#0a4d33] transition-colors">
              Find Medicine
            </Link>
            <Link href="/family-health" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Family Health
            </Link>
            <Link href="/consultation" className="text-sm font-medium text-gray-600 hover:text-[#0a4d33] transition-colors">
              Consultation
            </Link>
             <Link href="/cart" className="text-sm font-medium text-gray-600 hover:text-[#0a4d33] transition-colors">
              Cart
            </Link>
            <Link 
              href={user?.role === "doctor" ? "/doctor/dashboard" : "/doctor/apply"}
              className="text-sm font-medium text-gray-600 hover:text-[#0a4d33] transition-colors"
            >
              {user?.role === "doctor" ? "Doctor Dashboard" : "Doctor Portal"}
            </Link>
            <Link href="/partner" className="text-sm font-medium text-gray-600 hover:text-[#0a4d33] transition-colors">
              Partners
            </Link>
          </div>

          {/* Right Side Actions - Desktop */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            {renderAuthUI()}
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            suppressHydrationWarning
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#0a4d33]/20 cursor-pointer"
            aria-label="Open Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </nav>

      {/* 3. MOBILE SIDEBAR MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 z-[60] lg:hidden"
            />

            {/* Sidebar Drawer */}
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-[100dvh] w-full max-w-[320px] sm:max-w-sm bg-white/90 backdrop-blur-xl border-l border-white/20 shadow-2xl z-[70] lg:hidden flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="px-6 h-20 flex items-center justify-between border-b border-slate-100/60 bg-white/50">
                <span className="text-lg font-black tracking-tight text-[#0a4d33]">MediFind Menu</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100/50 hover:bg-slate-100 rounded-full transition-all focus:outline-none cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Scrollable Links Section */}
              <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5">
                {[
                  { label: "Home", href: "/" },
                  { label: "Find Medicine", href: "/medicines" },
                  { label: "Consultation", href: "/consultation" },
                  { label: "About Us", href: "/about" },
                  { label: "Help & Support", href: "/help" },
                  { label: "Partners", href: "/partner" },
                  { label: "Medical Updates", href: "/notifications" },
                  { label: "Cart", href: "/cart" }
                ].map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link
                        onClick={() => setIsMobileMenuOpen(false)}
                        href={link.href}
                        className={`py-3 px-4 rounded-xl flex items-center justify-between text-sm font-bold transition-all group ${
                          isActive
                            ? "bg-emerald-50 text-[#0a4d33] border-l-4 border-[#0a4d33] shadow-sm"
                            : "text-slate-700 hover:bg-slate-50/50 hover:text-[#0a4d33]"
                        }`}
                      >
                        <span>{link.label}</span>
                        <svg 
                          className={`w-4 h-4 text-emerald-600 transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                            isActive ? "opacity-100 translate-x-0.5" : "translate-x-0 group-hover:translate-x-0.5"
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div variants={itemVariants} className="w-full h-px bg-slate-100/80 my-2.5"></motion.div>

                {[
                  { label: "My Profile", href: "/profile" },
                  { label: "Family Health Hub", href: "/family-health" },
                  { label: "My Orders", href: "/orders" },
                  { label: "Terms & Conditions", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy-policy" }
                ].map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link
                        onClick={() => setIsMobileMenuOpen(false)}
                        href={link.href}
                        className={`py-2.5 px-4 rounded-xl flex items-center justify-between text-xs font-semibold transition-all group ${
                          isActive
                            ? "bg-emerald-50/30 text-[#0a4d33] font-bold"
                            : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-800"
                        }`}
                      >
                        <span>{link.label}</span>
                        <svg 
                          className={`w-3.5 h-3.5 text-emerald-600 transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                            isActive ? "opacity-100 translate-x-0.5" : "translate-x-0 group-hover:translate-x-0.5"
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sticky Bottom Actions */}
              <motion.div 
                variants={itemVariants}
                className="p-6 border-t border-slate-100/60 bg-slate-50/50 flex flex-col gap-4"
              >
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
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarPage;