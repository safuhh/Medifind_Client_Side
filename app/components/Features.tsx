"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

// Upgraded Helper component for a buttery-smooth counting animation
function Counter({ value, suffix = "", decimals = 0 }) {
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
      title: "Location Based Search",
      desc: "Discover pharmacies near you with exactly what you need in stock.",
      bullets: ["GPS-enabled routing", "Filter by 24/7 availability", "Skip multiple store visits"],
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      bg: "bg-emerald-50",
      border: "group-hover:border-emerald-200",
    },
    {
      title: "Real-Time Inventory",
      desc: "Our network syncs directly with local pharmacies for accurate availability.",
      bullets: ["Live stock level updates", "Alternative brand suggestions", "Price comparison tools"],
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      bg: "bg-blue-50",
      border: "group-hover:border-blue-200",
    },
    {
      title: "Doctor Consultation",
      desc: "Connect with certified specialists online and get expert advice from home.",
      bullets: ["HD Video consultations", "Verified top-tier specialists", "Instant digital prescriptions"],
      icon: (
        <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      bg: "bg-rose-50",
      border: "group-hover:border-rose-200",
    },
    {
      title: "Digital Prescriptions",
      desc: "Upload, manage, and refill your prescriptions seamlessly through the app.",
      bullets: ["Smart OCR upload", "Automated refill reminders", "Direct pharmacy forwarding"],
      icon: (
        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bg: "bg-amber-50",
      border: "group-hover:border-amber-200",
    },
    {
      title: "Express Delivery",
      desc: "Get critical medications delivered right to your doorstep within hours.",
      bullets: ["Under 2-hour delivery", "Temperature-controlled transit", "Live GPS tracking"],
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bg: "bg-indigo-50",
      border: "group-hover:border-indigo-200",
    },
    {
      title: "Secure Health Records",
      desc: "A centralized, encrypted vault for all your medical history and test results.",
      bullets: ["End-to-End Encryption", "Share securely with doctors", "Timeline view of health"],
      icon: (
        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      bg: "bg-teal-50",
      border: "group-hover:border-teal-200",
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
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-widest mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Platform Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6"
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
              className={`p-8 bg-white rounded-[24px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group ${feature.border}`}
            >
              {/* Header: Icon & Title */}
              <div className="flex items-start gap-5 mb-6">
                <div className={`w-14 h-14 shrink-0 ${feature.bg} rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
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
          className="mt-20 py-16 bg-[#105e3f] w-screen relative left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-12 md:gap-24"
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