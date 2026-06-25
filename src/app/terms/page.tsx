"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Scale, Printer, ChevronRight, FileText, ShieldCheck, AlertCircle, CreditCard, Lock, Scale as ScaleIcon, Building2 } from "lucide-react";
import Navbar from "../navbar/page";

interface Section {
  id: string;
  title: string;
  icon: React.ElementType<{ className?: string }>;
  content: React.ReactNode;
}

// REAL-WORLD, DEEP LEGAL CONTENT
const defaultSections: Section[] = [
  {
    id: "acceptance",
    title: "1. Agreement to Terms",
    icon: FileText,
    content: (
      <>
        <p>
          By accessing or using our platform, website, and associated services (collectively, the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
        </p>
        <p>
          These Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and our company ("we," "us," or "our"), concerning your access to and use of the platform. You agree that by accessing the Service, you have read, understood, and agree to be bound by all of these Terms.
        </p>
      </>
    ),
  },
  {
    id: "user-accounts",
    title: "2. Account Responsibilities",
    icon: Lock,
    content: (
      <>
        <p>
          To access certain features of the Service, you may be required to register for an account. You agree to provide true, accurate, current, and complete information about yourself as prompted by the registration form.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Security:</strong> You are strictly responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
          <li><strong>Notification:</strong> You must immediately notify us of any unauthorized use of your account or any other breach of security.</li>
          <li><strong>Identity:</strong> You may not use as a username the name of another person or entity or that is not lawfully available for use, or a name or trademark that is subject to any rights of another person or entity without appropriate authorization.</li>
        </ul>
      </>
    ),
  },
  {
    id: "transactions",
    title: "3. Purchases and Payment",
    icon: CreditCard,
    content: (
      <>
        <p>
          If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
        </p>
        <p>
          You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct, and complete.
        </p>
        <p>
          We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order, or suspected fraud or unauthorized or illegal transaction.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "4. Intellectual Property",
    icon: ShieldCheck,
    content: (
      <>
        <p>
          The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of our company and its licensors. The Service is protected by copyright, trademark, and other laws of both local and international jurisdictions.
        </p>
        <p>
          Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of our legal department. You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service strictly in accordance with these Terms.
        </p>
      </>
    ),
  },
  {
    id: "prohibited-uses",
    title: "5. Prohibited Activities",
    icon: AlertCircle,
    content: (
      <>
        <p>You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>In any way that violates any applicable national or international law or regulation.</li>
          <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
          <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
          <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
          <li>To engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
        </ul>
      </>
    ),
  },
  {
    id: "limitation-liability",
    title: "6. Limitation of Liability",
    icon: ScaleIcon,
    content: (
      <>
        <p className="font-semibold text-slate-900 uppercase text-sm tracking-wider mb-2">Please read this section carefully</p>
        <p>
          In no event shall the Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Your access to or use of or inability to access or use the Service;</li>
          <li>Any conduct or content of any third party on the Service;</li>
          <li>Any content obtained from the Service; and</li>
          <li>Unauthorized access, use or alteration of your transmissions or content.</li>
        </ul>
        <p className="mt-4">
          This limitation applies whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "7. Governing Law",
    icon: Building2,
    content: (
      <>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions.
        </p>
        <p>
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have had between us regarding the Service.
        </p>
      </>
    ),
  },
];

interface TermsUIProps {
  sections?: Section[];
  lastUpdated?: string;
  version?: string;
}

export default function TermsUI({ 
  sections = defaultSections, 
  lastUpdated = "April 30, 2026",
}: TermsUIProps) {
  
  const [activeSection, setActiveSection] = useState<string>(sections?.[0]?.id || "");
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!sections || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const sorted = visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveSection(sorted[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.4, 1] }
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
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      window.scrollTo({
        top: elementRect - bodyRect - offset,
        behavior: "smooth",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      <Navbar />
      <br />
      <br />

      {/* Premium Ambient Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 print:hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-400/5 blur-[100px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-600/5 blur-[120px]" />
      </div>

      {/* Reading Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-forest-600 origin-left z-50 print:hidden"
        style={{ scaleX }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 max-w-4xl"
        >
          <div className="flex flex-wrap items-center gap-4 mb-8 print:hidden">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50/80 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-emerald-800 shadow-sm">
              <Scale className="h-4 w-4" />
              Legal Agreement
            </span>
           
            <button 
              onClick={handlePrint}
              className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm hover:border-emerald-200"
            >
              <Printer className="h-4 w-4" />
              Download PDF
            </button>
          </div>
          
          <h1 className="text-5xl font-light tracking-tight text-slate-900 sm:text-7xl mb-8">
            Terms & <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">Conditions</span>
          </h1>
          <p className="text-xl leading-relaxed text-slate-500 max-w-2xl">
            Please read these terms carefully. This document outlines the rules, guidelines, and strict legal agreements applicable to your use of our premium services and infrastructure.
          </p>
          <p className="mt-6 text-sm text-slate-400 font-medium uppercase tracking-wider">
            Effective Date: {lastUpdated}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
          
          {/* Glassmorphic Navigation Sidebar */}
          {sections.length > 0 && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block lg:w-[320px] shrink-0 print:hidden"
            >
              <div className="sticky top-32 rounded-3xl border border-white/60 bg-white/40 p-6 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 ml-4">
                  Document Outline
                </h3>
                <nav className="relative flex flex-col space-y-1">
                  {/* Vertical Line track */}
                  <div className="absolute bottom-0 left-[19px] top-0 w-[2px] bg-slate-100/80 rounded-full" />
                  
                  {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={`nav-${section.id}`}
                        onClick={() => scrollToSection(section.id)}
                        className="group relative flex items-center py-3 pl-12 pr-4 text-left text-sm transition-all duration-300 rounded-xl hover:bg-white/50"
                      >
                        {/* Active Indicator Dot */}
                        <div className="absolute left-4 flex items-center justify-center w-3 h-3">
                          <div 
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 z-10 ${
                              isActive ? "bg-emerald-600 scale-100 ring-4 ring-emerald-100" : "bg-slate-300 scale-100 group-hover:bg-emerald-400"
                            }`} 
                          />
                          {isActive && (
                            <motion.div
                              layoutId="activeLine"
                              className="absolute left-[1.5px] h-[40px] w-[2px] bg-emerald-500 rounded-full"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </div>
                        
                        <span className={`transition-all duration-300 ${
                          isActive ? "font-semibold text-emerald-900" : "text-slate-500 group-hover:text-slate-900"
                        }`}>
                          {section.title}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          )}

          {/* Deep Legal Content */}
          <div className="lg:w-full lg:max-w-4xl">
            <div className="space-y-16">
              {sections.length === 0 ? (
                <div className="animate-pulse space-y-12">
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="space-y-4">
                       <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
                       <div className="h-4 bg-slate-100 rounded w-full"></div>
                       <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                       <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                     </div>
                   ))}
                </div>
              ) : (
                sections.map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <motion.section
                      key={section.id}
                      id={section.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="scroll-mt-32 relative rounded-3xl border border-slate-200/50 bg-white p-8 sm:p-12 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                          {section.title}
                        </h2>
                      </div>
                      <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-loose prose-strong:text-slate-900 prose-a:text-emerald-600 hover:prose-a:text-emerald-500">
                        {section.content}
                      </div>
                    </motion.section>
                  );
                })
              )}
            </div>

            {/* Bottom Premium Contact Card */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-20 overflow-hidden rounded-3xl bg-[#115E3D] relative print:hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-transparent z-0" />
              <div className="relative z-10 p-10 sm:p-16 text-center">
                <ShieldCheck className="h-10 w-10 text-emerald-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">Questions about these terms?</h3>
                <p className="text-slate-300 mb-8 max-w-lg mx-auto text-lg">
                  If you require legal clarification regarding your rights and responsibilities, our compliance team is ready to assist.
                </p>
                <button className="rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-bold tracking-wide text-white transition-all hover:bg-emerald-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  Contact Legal Support
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}