"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Target, 
  RocketLaunch, 
  Globe,
  PlusCircle,
  ShieldCheck,
  TrendUp
} from "@phosphor-icons/react";

const AboutSectionClient = () => {
  const stats = [
    { label: "Active Users", value: "50K+", icon: <Users size={28} weight="duotone" /> },
    { label: "Pharmacies", value: "1,000+", icon: <MapPin size={28} weight="duotone" /> },
    { label: "Support", value: "24/7", icon: <Clock size={28} weight="duotone" /> },
    { label: "Verified", value: "100%", icon: <CheckCircle size={28} weight="duotone" /> },
  ];

  const focusAreas = [
    {
      title: "Current Tasks",
      desc: "Expanding our verified pharmacy network and improving database sync speed.",
      items: ["Pharmacy Onboarding", "Real-time Sync", "Mobile App Launch"],
      icon: <Target size={28} weight="duotone" />
    },
    {
      title: "Future Mission",
      desc: "Extending MediFind's reach to rural areas for global healthcare connectivity.",
      items: ["Rural Expansion", "AI Health Insights", "Global Connectivity"],
      icon: <RocketLaunch size={28} weight="duotone" />
    },
    {
      title: "Vision",
      desc: "Reaching 1 million active users by 2027 with a zero-paper digital initiative.",
      items: ["1M+ User Base", "Zero-Paper Initiative", "#1 Health platform"],
      icon: <Globe size={28} weight="duotone" />
    }
  ];

  return (
    <div id="about" className="w-full bg-slate-50 py-16 md:py-24 overflow-hidden font-sans">
      {/* 1. Header Section */}
      <div className="bg-[#0a4d33] pt-16 pb-40 md:pt-24 md:pb-52 px-6 text-center rounded-[32px] md:rounded-[56px] max-w-[95%] md:max-w-6xl lg:max-w-7xl mx-auto shadow-2xl shadow-emerald-900/20 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 md:mb-8"
        >
          <TrendUp size={14} weight="bold" />
          Company Roadmap
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-[1.1]"
        >
          Building the Future of <br className="hidden md:block" />
          <span className="text-emerald-400">Healthcare Access.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-emerald-100/70 text-sm md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-medium px-4"
        >
          MediFind is connecting patients, pharmacies, and healthcare providers through real-time technology.
        </motion.p>
      </div>

      {/* 2. Main Stats & Mission Card */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-24 md:-mt-32 mb-16 md:mb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[24px] md:rounded-[40px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] p-6 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-8 md:gap-12 border border-slate-100"
        >
          {/* Left Column: Core Mission */}
          <div className="flex-1">
            <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight italic">Our Core Mission</h3>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-6 md:mb-8 font-semibold">
              To ensure no one has to run from pharmacy to pharmacy looking for critical medicines. 
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {[
                { text: "Real-time tracking", icon: <PlusCircle size={18} weight="fill" /> },
                { text: "Verified Partners", icon: <ShieldCheck size={18} weight="fill" /> },
                { text: "Emergency Alerts", icon: <CheckCircle size={18} weight="fill" /> },
                { text: "Digital Rx Uploads", icon: <PlusCircle size={18} weight="fill" /> }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100 group hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                  <div className="text-emerald-600 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-slate-800 font-bold text-sm tracking-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Key Metrics */}
          <div className="lg:w-[40%] grid grid-cols-2 gap-3 md:gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-50/50 rounded-[20px] md:rounded-[28px] p-4 md:p-6 text-center border border-slate-100 flex flex-col items-center justify-center hover:bg-white hover:shadow-xl transition-all group">
                <div className="text-[#0a4d33] mb-2 md:mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-xl md:text-3xl font-black text-[#0a4d33] mb-1">{stat.value}</div>
                <div className="text-slate-400 font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 3. Future Roadmap Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {focusAreas.map((area, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 md:p-12 bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 group relative overflow-hidden"
          >
            <div className="mb-8 w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
              {area.icon}
            </div>

            <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight">
              {area.title}
            </h4>
            
            <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 font-medium">
              {area.desc}
            </p>
            
            <div className="space-y-3">
              {area.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-150 transition-transform" />
                  <span className="text-slate-800 font-black text-[10px] md:text-xs uppercase tracking-widest">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AboutSectionClient;