"use client";

import { motion } from "framer-motion";
import { Storefront, ChartLineUp, ShieldCheck, ArrowUpRight } from "@phosphor-icons/react";

const features = [
  {
    title: "Inventory Control",
    desc: "Full medicine inventory table with add, edit, and delete functionality for seamless management.",
    icon: Storefront
  },
  {
    title: "Admin Dashboard",
    desc: "Pharmacy approval workflow with detailed revenue and demand analytics at your fingertips.",
    icon: ChartLineUp
  },
  {
    title: "Verified Network",
    desc: "Performance metrics and trend analysis for all partners within our trusted healthcare network.",
    icon: ShieldCheck
  }
];

export const FeatureGrid = () => {
  return (
    /* flex and justify-center ensures the entire grid is horizontally centered on the page */
    <section className="w-full flex justify-center items-center py-20 px-6 bg-transparent">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              /* h-full and min-h ensures cards stay the same height. 
                 flex flex-col ensures content inside is balanced. 
              */
              className="relative group p-8 lg:p-10 min-h-[340px] flex flex-col justify-between rounded-[40px] bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_-20px_rgba(10,77,51,0.15)] hover:border-emerald-100 transition-all duration-500 overflow-hidden"
            >
              {/* Creative background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-100 transition-colors" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-10 group-hover:bg-[#0a4d33] group-hover:text-white transition-all duration-500 shadow-inner">
                  <feature.icon size={32} weight="duotone" className="group-hover:text-white text-[#0a4d33] transition-colors" />
                </div>

                <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-[#0a4d33] transition-colors">
                  {feature.title}
                </h4>
                
                <p className="text-slate-500 font-medium leading-relaxed text-sm lg:text-base">
                  {feature.desc}
                </p>
              </div>

              {/* Minimalist footer indicator */}
              <div className="relative z-10 mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-[#0a4d33] transition-colors">
                <span>View Insights</span>
                <ArrowUpRight size={14} weight="bold" className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};