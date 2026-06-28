"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const PartnerBanner = () => {
  const router = useRouter();

  return (
   <div>
    
    <br/>
    <br/>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-5xl mx-auto bg-[#0a4d33] py-12 px-6 md:py-16 md:px-10 rounded-[30px] md:rounded-[40px] text-center relative overflow-hidden shadow-2xl shadow-emerald-900/10"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -mr-20 -mt-20" />
     
      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tighter leading-tight">
          Join the MediFind <br className="hidden md:block" /> Healthcare Network
        </h2>
        <p className="text-emerald-100/70 text-base md:text-lg mb-8 font-medium leading-relaxed">
          Whether you are a healthcare professional or a pharmacy owner, join our platform to digitize your services and provide better care to patients everywhere.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            suppressHydrationWarning
            onClick={() => router.push("/seller/sellerform")}
            className="group px-8 py-4 bg-white text-[#0a4d33] rounded-2xl font-bold text-base shadow-xl hover:bg-emerald-50 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Register as Seller
            <div className="bg-[#0a4d33]/10 p-1 rounded-full group-hover:translate-x-1 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </div>
          </button>

          <button
            suppressHydrationWarning
            onClick={() => router.push("/delivery/apply")}
            className="group px-8 py-4 bg-emerald-600/30 backdrop-blur-md border border-emerald-400/30 text-white rounded-2xl font-bold text-base shadow-xl hover:bg-emerald-600/50 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Apply as DeliveryBoy
            <div className="bg-white/10 p-1 rounded-full group-hover:translate-x-1 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
   </div>
  );
};