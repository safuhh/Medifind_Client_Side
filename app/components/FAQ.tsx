"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { JsonLd } from './seo/JsonLd';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How do I find medicines near me?",
    answer: "Simply enter the name of the medicine in the search bar on our homepage. We use your current location to show you verified pharmacies within a 5km radius that have the medicine in stock."
  },
  {
    question: "Are the pharmacies on MediFind verified?",
    answer: "Yes, all pharmacies on our platform undergo a strict verification process. We verify their drug licenses and physical addresses to ensure you get genuine medicines."
  },
  {
    question: "Can I get home delivery for my medicines?",
    answer: "Many of our partner pharmacies offer express home delivery. You can see the delivery options and estimated time on the medicine search results page."
  },
  {
    question: "How do I manage my health records?",
    answer: "Once you create an account, you can upload your prescriptions and medical reports to your secure health vault. You can also share these records with certified doctors for online consultations."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-24 px-6 bg-white border-t border-slate-100">
      <JsonLd data={schemaData} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Common Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between"
              >
                <span className="font-bold text-slate-900 pr-8">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
