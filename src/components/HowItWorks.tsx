"use client";

import React from "react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Search or Upload",
      desc: "Type the name of your required medicine or securely upload your doctor&apos;s prescription directly into our search system.",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Locate Inventory",
      desc: "Our map shows verified pharmacies in your vicinity that currently have your exact medication in stock right now.",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Reserve & Collect",
      desc: "Secure your medication online and visit the pharmacy to pick it up, or explore local delivery options if available.",
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6"
          >
            How MediFind Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
          >
            We&apos;ve streamlined the process of finding your medication. 
            Just search, locate, and collect.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          {/* Connector Line - Desktop Only */}
          <div className="hidden md:block absolute top-24 left-0 w-full h-[2px] bg-slate-50 -z-0" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 bg-white border-2 border-slate-50 rounded-full flex items-center justify-center mb-8 shadow-sm group-hover:border-emerald-500 transition-colors duration-500">
                <span className="absolute -top-4 -right-4 w-10 h-10 bg-[#0a4d33] text-white text-xs font-black rounded-full flex items-center justify-center shadow-lg">
                  {step.number}
                </span>
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                {step.title}
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
