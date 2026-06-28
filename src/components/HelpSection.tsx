"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ChatCircleText, Lifebuoy, ArrowUpRight } from "@phosphor-icons/react";

const FAQItem = ({ question, answer, isOpen, onClick, index }: any) => {
  return (
    <div className="mb-4">
      <button
        suppressHydrationWarning
        onClick={onClick}
        className={`w-full text-left p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] transition-all duration-500 flex items-start gap-4 sm:gap-6 outline-none border ${
          isOpen 
            ? "bg-emerald-50/40 border-emerald-100 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)]" 
            : "bg-white border-slate-100 hover:border-emerald-200 hover:shadow-sm"
        }`}
      >
        {/* Creative Numbering */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-black transition-all duration-500 ${
          isOpen ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-emerald-50"
        }`}>
          {index < 9 ? `0${index + 1}` : index + 1}
        </div>

        <div className="flex-grow pt-1.5">
          <span className={`text-lg sm:text-xl font-bold tracking-tight transition-colors duration-300 ${
            isOpen ? "text-[#0a4d33]" : "text-slate-800"
          }`}>
            {question}
          </span>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="text-slate-500 leading-relaxed text-base sm:text-lg mt-4 sm:mt-5 pr-0 sm:pr-6 font-medium">
                  {answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimalist Toggle */}
        <div className={`mt-2 flex-shrink-0 transition-all duration-500 ${isOpen ? "rotate-90" : ""}`}>
          {isOpen ? (
            <div className="w-6 h-6 flex items-center justify-center bg-emerald-100 rounded-full">
               <Minus size={14} weight="bold" className="text-emerald-600" />
            </div>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded-full">
               <Plus size={14} weight="bold" className="text-slate-400" />
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

export const HelpSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does real-time inventory tracking work?",
      answer: "We utilize proprietary API connectors that bridge the gap between local pharmacy shelves and our platform, updating stock counts every 60 seconds.",
    },
    {
      question: "Is there a limit to how many medicines I can search?",
      answer: "Absolutely not. Our platform is designed for unlimited searches, allowing patients to build complete medication lists effortlessly.",
    },
    {
      question: "What happens after I upload my prescription?",
      answer: "Your prescription is routed to a secure portal where a licensed pharmacist performs a review before confirming your order availability.",
    },
  ];

  return (
    <section className="w-full py-16 lg:py-32 bg-white relative">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Headline & Floating Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
              <Lifebuoy weight="fill" />
              <span>Help Center</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tighter leading-[1.1] mb-6 lg:mb-8">
              Got <span className="text-emerald-500">questions?</span> <br />
              We have answers.
            </h2>
            
            <p className="text-slate-500 font-medium mb-12 leading-relaxed text-lg">
              Everything you need to know about finding and securing your medications with MediFind.
            </p>
            
            {/* Professional Light Support Card */}
            <div className="group relative p-6 sm:p-8 rounded-[24px] sm:rounded-[40px] bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all duration-500 mb-10 lg:mb-0">
              <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <ChatCircleText size={64} weight="duotone" className="text-emerald-600" />
              </div>
              
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-slate-900 mb-2">Dedicated Support</h4>
                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                  Our pharmacists and support team are available for a live chat.
                </p>
                
                <button 
                  suppressHydrationWarning
                  className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-md transition-all active:scale-95 group/btn"
                >
                  Open Support Chat
                  <ArrowUpRight className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: The Accordion */}
          <div className="lg:col-span-7">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                index={i}
                {...faq}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};