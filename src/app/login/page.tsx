

"use client";

import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/redux/authSlice";
import { googleAuth } from "@/services/apis/googleapi";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineBadgeCheck, HiOutlineSparkles, HiOutlineShieldCheck } from "react-icons/hi";

const GoogleLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    flow: "implicit",
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse?.access_token;
        if (!accessToken) return;
        const res = await googleAuth({ accessToken });
        dispatch(setCredentials({
          user: res.data.user,
        }));

        if(res.data.user.role === "admin") {
          router.push("/admin");
        }
        else if (res.data.user.role === "seller") {
          router.push("/seller");
        }
        else if(res.data.user.role === "delivery_boy") {
          router.push("/delivery/dashboard");
        }
        else if(res.data.user.role === "doctor") {
          router.push("/doctor/dashboard");
        }
        else {
          router.push("/");
        }

      } catch (err) {
        console.error("Login error:", err);
      }
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f3] p-4 md:p-6 relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[20rem] md:w-[40rem] h-[20rem] md:h-[40rem] bg-emerald-200/30 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col md:flex-row w-full max-w-4xl bg-white/80 backdrop-blur-2xl rounded-[32px] md:rounded-[40px] shadow-[0_32px_64px_-16px_rgba(10,77,51,0.15)] border border-white overflow-hidden z-10"
      >
        
        {/* --- LEFT: THE "EXPERIENCE" SIDE --- */}
        <div className="w-full md:w-[42%] bg-[#0a4d33] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            {/* BRAND LOGO */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-[#0a4d33]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tighter leading-none">MediFind</h1>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-400/80">Premium Care</p>
              </div>
            </div>

            <div className="mt-10 md:mt-20 space-y-6 md:space-y-8">
              <h2 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
                Healthcare <br className="hidden md:block" /> <span className="italic font-light opacity-80">reinvented</span> for you.
              </h2>
              
              <div className="space-y-4 md:space-y-5">
                {[
                  { icon: <HiOutlineBadgeCheck />, text: "Verified Assets" },
                  { icon: <HiOutlineSparkles />, text: "AI-Powered Search" },
                  { icon: <HiOutlineShieldCheck />, text: "HIPAA Compliant" },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-3 text-xs md:text-sm font-medium text-emerald-100/70"
                  >
                    <span className="text-lg md:text-xl text-emerald-400">{item.icon}</span>
                    {item.text}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex mt-8 relative z-10 items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.3em] text-emerald-500 uppercase">Trusted by 10k+ Clinics</span>
          </div>
        </div>

        {/* --- RIGHT: THE "ACTION" SIDE --- */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white/50 relative">
          <div className="w-full max-w-[320px] mx-auto">
            <header className="mb-8 md:mb-12 text-center md:text-left">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Secure Access
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mt-4">Welcome.</h2>
              <p className="text-gray-500 mt-2 md:mt-3 text-sm font-medium">Continue to your personal health dashboard.</p>
            </header>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => login()}
              className="w-full relative group"
            >
              <div className="relative flex items-center justify-between px-5 py-4 md:px-6 md:py-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-emerald-500 transition-all">
                <div className="flex items-center gap-3 md:gap-4">
                  <FcGoogle className="text-xl md:text-2xl" />
                  <span className="text-sm font-bold text-gray-800">Sign in with Google</span>
                </div>
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </motion.button>

            <div className="mt-10 md:mt-16 text-center">
              <p className="text-[11px] text-gray-400 font-medium">
                New to MediFind? <span className="text-emerald-700 font-bold cursor-pointer hover:underline">Create an account</span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer info for mobile */}
      <div className="absolute bottom-4 md:bottom-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-400/60 text-center w-full px-4">
        Global Healthcare Standard • 2024
      </div>
    </div>
  );
};

export default GoogleLogin;