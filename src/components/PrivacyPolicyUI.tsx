"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PolicySection } from "@/app/privacy-policy/page";

interface PrivacyPolicyUIProps {
  sections: PolicySection[];
  lastUpdated: string;
}

export default function PrivacyPolicyUI({ sections, lastUpdated }: PrivacyPolicyUIProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the intersection entry that is most visible
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -85% 0px" }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for the sticky header if you have one, otherwise standard scroll
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] selection:bg-emerald-100 selection:text-emerald-900">
      {/* Subtle Ambient Background Gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40rem] w-[40rem] rounded-full bg-emerald-400/5 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[30rem] w-[30rem] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/50 px-4 py-1.5 text-sm font-medium text-emerald-800 backdrop-blur-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Last updated: {lastUpdated}
          </div>
          <h1 className="text-4xl font-light tracking-tight text-slate-900 sm:text-6xl">
            Data Privacy & <span className="font-medium  text-emerald-700 bg-clip-text bg-gradient-to-r from-emerald-700 to-forest-900">Security</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
            Transparency is the foundation of our healthcare marketplace. Discover how we protect, manage, and secure your personal medical information.
          </p>
        </motion.div>

        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          {/* Sidebar Navigation - Glassmorphism Elegance */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block lg:w-[280px] shrink-0"
          >
            <div className="sticky top-32 rounded-3xl border border-white/60 bg-white/40 p-6 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                On this page
              </h3>
              <nav className="relative flex flex-col space-y-1">
                {/* Vertical Line track */}
                <div className="absolute bottom-0 left-[11px] top-0 w-[2px] bg-slate-100 rounded-full" />
                
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={`nav-${section.id}`}
                      onClick={() => scrollToSection(section.id)}
                      className="group relative flex items-center py-2.5 pl-8 pr-4 text-left text-sm transition-colors duration-300"
                    >
                      {/* Active Indicator Dot & Line */}
                      <div className="absolute left-0 flex items-center justify-center w-6">
                        <div 
                          className={`h-1.5 w-1.5 rounded-full transition-all duration-300 z-10 ${
                            isActive ? "bg-emerald-600 scale-100" : "bg-slate-300 scale-0 group-hover:scale-100"
                          }`} 
                        />
                        {isActive && (
                          <motion.div
                            layoutId="activeLine"
                            className="absolute left-[11px] h-full w-[2px] bg-emerald-600 rounded-full"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </div>

                      <span className={`transition-all duration-300 ${
                        isActive 
                          ? "font-medium text-emerald-800 translate-x-1" 
                          : "text-slate-500 group-hover:text-slate-800 group-hover:translate-x-1"
                      }`}>
                        {section.title}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.aside>

          {/* Main Content Area */}
          <div className="lg:w-full lg:max-w-3xl">
            <div className="space-y-12">
              {sections.map((section, index) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="scroll-mt-32 rounded-3xl border border-slate-100/50 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-12"
                >
                  <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
                    {section.title}
                  </h2>
                  <div className="prose prose-slate prose-emerald max-w-none text-slate-600 leading-loose">
                    {/* Render content - assuming basic string for now, could be MDX/HTML */}
                    <p>{section.content}</p>
                  </div>
                </motion.section>
              ))}
            </div>
            
            {/* Bottom Contact CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-16 rounded-3xl bg-[#115E3D] p-8 text-center sm:p-12"
            >
              <h3 className="text-xl font-medium text-white mb-3">Have questions about your data?</h3>
              <p className="text-emerald-100 mb-6 max-w-md mx-auto">
                Our privacy team is available to help clarify any details regarding how we handle your information.
              </p>
              <button className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-emerald-900 transition-transform hover:scale-105 hover:bg-emerald-50">
                Contact Privacy Team
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}