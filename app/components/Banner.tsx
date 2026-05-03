"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const PartnerBanner = () => {
  const router = useRouter();

  return (

    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-7xl mx-auto bg-[#0a4d33] py-20 px-8 rounded-[40px] md:rounded-[60px] text-center relative overflow-hidden shadow-2xl shadow-emerald-900/10"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -mr-20 -mt-20" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter leading-tight">
          Become a <br className="hidden md:block" /> MediFind Partner
        </h2>
        <p className="text-emerald-100/70 text-lg md:text-xl mb-12 font-medium leading-relaxed">
          Are you a pharmacist or pharmacy owner? Join our verified network to digitalize your inventory and reach a wider patient base instantly.
        </p>

        <button
          onClick={() => router.push("/seller/sellerform")}
          className="group px-12 py-5 bg-white text-[#0a4d33] rounded-full font-bold text-lg shadow-xl hover:bg-emerald-50 transition-all active:scale-95 flex items-center gap-3 mx-auto"
        >
          Get Started as Seller
          <div className="bg-[#0a4d33]/10 p-1 rounded-full group-hover:translate-x-1 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
          </div>
        </button>
      </div>
      <br />
      <br />
      <br />
    </motion.div>
  );
};