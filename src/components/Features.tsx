"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

interface CounterProps {
  value: number;
  suffix?: string;
  decimals?: number;
}

// Upgraded Helper component for a buttery-smooth counting animation
function Counter({ value, suffix = "", decimals = 0 }: CounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  
  const displayValue = useTransform(motionValue, (latest) => {
    // Math.max prevents any weird floating point negative zeros
    return Math.max(0, latest).toFixed(decimals) + suffix;
  });

  useEffect(() => {
    if (inView) {
      animate(motionValue, value, { 
        duration: 2.5, 
        // A custom cubic-bezier curve for a fast start and a beautifully slow, smooth finish
        ease: [0.16, 1, 0.3, 1] 
      });
    }
  }, [inView, motionValue, value]);

  return (
    <motion.span 
      ref={ref} 
      // tabular-nums is the magic Tailwind class that stops the text from jumping left and right!
      className="tabular-nums tracking-tight"
    >
      {displayValue}
    </motion.span>
  );
}

const Features = () => {
  const features = [
    {
      title: "AI Medicine Fulfillment",
      desc: "Our RAG-powered engine resolves generic equivalents and applies a greedy set-cover algorithm to route your prescription across the fewest, nearest pharmacies — automatically.",
      bullets: ["RAG generic-name resolution", "Greedy set-cover optimisation", "Multi-pharmacy split ordering"],
      icon: (
        <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
        </svg>
      ),
      bg: "bg-violet-50",
      border: "group-hover:border-violet-200",
    },
    {
      title: "Doctor Video Consultations",
      desc: "Find certified doctors by specialization, book slots, and enter secure virtual consultation rooms.",
      bullets: ["Real-time countdown timer", "Jitsi video call integrations", "Live Socket.io notifications"],
      icon: (
        <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      bg: "bg-rose-50",
      border: "group-hover:border-rose-200",
    },
    {
      title: "Digital Health Reports",
      desc: "Centralized medical diagnostics and prescription summaries generated after consultations.",
      bullets: ["Linked to booking records", "Easily downloadable for patients", "Encrypted clinical data"],
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bg: "bg-teal-50",
      border: "group-hover:border-teal-200",
    },
    {
      title: "Live Delivery GPS Tracking",
      desc: "Dedicated delivery agent portal with order acceptance, routing, and live coordinates tracking.",
      bullets: ["Leaflet map route navigation", "Live location coordination", "Real-time socket updates"],
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      bg: "bg-indigo-50",
      border: "group-hover:border-indigo-200",
    },
    {
      title: "Medicine Search & Ordering",
      desc: "Search, filter, and buy medicines from local pharmacies with integrated payment flow.",
      bullets: ["Interactive shopping cart", "Secure Stripe checkout", "Detailed order history"],
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      bg: "bg-emerald-50",
      border: "group-hover:border-emerald-200",
    },
    {
      title: "Become a MediFind Partner",
      desc: "Join our growing network as a verified pharmacy or certified doctor. Expand your reach, manage your listings, and grow your practice on MediFind.",
      bullets: ["Verified pharmacy onboarding", "Doctor profile & slot management", "Commission-based revenue model"],
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      bg: "bg-blue-50",
      border: "group-hover:border-blue-200",
    },
  ];

  // Animation variants for staggered rendering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-24 px-6 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-20">
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            A Complete Ecosystem for <br />
            <span className="text-emerald-600">Smarter Healthcare.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            We bridge the gap between patients, doctors, and local pharmacies. Experience a unified platform designed for speed, security, and convenience.
          </motion.p>
        </div>

        {/* Detailed Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={`p-6 md:p-8 bg-white rounded-[24px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group ${feature.border}`}
            >
              {/* Header: Icon & Title */}
              <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-5 mb-6">
                <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 ${feature.bg} rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-slate-100 mb-6 group-hover:bg-slate-200 transition-colors" />

              {/* Detailed Sub-features */}
              <ul className="space-y-3">
                {feature.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Professional Trust Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 md:mt-20 py-12 md:py-16 bg-[#105e3f] w-screen relative left-1/2 -translate-x-1/2 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-10 md:gap-24 px-6"
        >
          <div className="text-center">
            <h4 className="text-3xl md:text-4xl font-black text-white mb-1">
              <Counter value={50} suffix="+" />
            </h4>
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Pharmacies</span>
          </div>
          <div className="text-center">
            <h4 className="text-3xl md:text-4xl font-black text-white mb-1">
              <Counter value={100} suffix="+" />
            </h4>
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Verified Doctors</span>
          </div>
          <div className="text-center">
            <h4 className="text-3xl md:text-4xl font-black text-white mb-1">
              <Counter value={99.9} decimals={1} suffix="%" />
            </h4>
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-widest">Uptime SLA</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Features;