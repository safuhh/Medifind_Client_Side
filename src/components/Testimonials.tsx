"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const Testimonials = () => {
  const reviews = [
    {
      initials: "MS",
      name: "Marcus Sterling",
      role: "Chronic Patient (Type 2 Diabetes)",
      quote: "Before MediFind, I would visit three different pharmacies just to fill my monthly insulin and metformin. Now I search generics, locate stock instantly, and checkout in one click."
    },
    {
      initials: "EL",
      name: "Elena Rostova",
      role: "Caregiver & Family Health Coordinator",
      quote: "Managing prescriptions for my elderly parents was a weekly logistical headache. The secure prescription routing has cut my coordinator workload in half."
    },
    {
      initials: "DK",
      name: "Dr. David Kincaid",
      role: "Lead Pharmacist, Apollo Care Network",
      quote: "As a seller, integrating our live API inventory into MediFind has boosted our patient outreach. We fill orders faster and help patients avoid out-of-stock disappointments."
    }
  ];

  return (
    <section className="bg-surface py-20 lg:py-32 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink tracking-tight mb-4">
            Trusted by Patients & Providers
          </h2>
          <p className="text-ink-muted text-base sm:text-lg font-medium leading-relaxed">
            See how the MediFind ecosystem is streamlining medication logistics for everyone.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Card className="h-full flex flex-col justify-between p-8 relative hover:border-primary/20 hover:shadow-md transition-all duration-200">
                <Quote className="w-8 h-8 text-primary/10 absolute top-6 right-6" />
                
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-ink-muted leading-relaxed">
                    "{review.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-border pt-6 mt-6">
                  {/* Initials Circle */}
                  <div className="w-10 h-10 rounded-full bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink">{review.name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink-faint mt-0.5">{review.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
