"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCheck, FiStar, FiShield, FiTrendingUp, FiClock, 
  FiChevronDown, FiLock, FiAward, FiZap
} from "react-icons/fi";
import {
  getPlans,
  getSubscriptionStatus,
  createCheckoutSession,
  type Plan,
  type Subscription,
} from "@/services/apis/subcription.api";

// ─── Static data ─────────────────────────────────────────────────────────────

const FEATURES = [
  { label: "Listings allowed",       free: "20 sec (trial)",  pro: "Unlimited"    },
  { label: "Priority in search",     free: "✗",          pro: "✓"            },
  { label: "Analytics dashboard",    free: "Basic",       pro: "Advanced"     },
  { label: "Support",                free: "Community",   pro: "Priority 24h" },
  { label: "Stripe earnings payout", free: "✗",          pro: "✓"            },
  { label: "Verified Pro badge",     free: "✗",          pro: "✓"            },
];

const FAQS = [
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. Your plan stays active until the end of your current billing period, after which you won't be charged again. No hidden fees or surprise charges.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We securely process all major credit and debit cards through Stripe. Support for UPI and local wallets is coming soon.",
  },
  {
    q: "What happens when my plan expires?",
    a: "Your account will safely revert to the free tier. Your data remains completely secure, but premium features and public listings will be temporarily locked until you resubscribe.",
  },
  {
    q: "How does the free trial work?",
    a: "Every new seller and doctor receives a 20-second automated trial upon their first platform action, giving you a quick glimpse of the premium experience before requiring a plan.",
  },
];

const PLAN_FEATURES: Record<string, string[]> = {
  PRO_MONTHLY: [
    "Unlimited product/slot listings",
    "Priority search ranking",
    "Advanced sales analytics",
    "24/7 priority support",
    "Verified Professional badge",
  ],
  PRO_YEARLY: [
    "Unlimited product/slot listings",
    "Priority search ranking",
    "Advanced sales analytics",
    "24/7 priority support",
    "Verified Professional badge",
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);

  const [plans, setPlans]                     = useState<Plan[]>([]);
  const [subscription, setSubscription]       = useState<Subscription | null>(null);
  const [isLoading, setIsLoading]             = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError]                     = useState<string | null>(null);
  const [openFaq, setOpenFaq]                 = useState<number | null>(0); // First open by default

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const plansRes = await getPlans();
        setPlans(plansRes.plans || []);

        if (user) {
          try {
            const statusRes = await getSubscriptionStatus();
            setSubscription(statusRes.subscription || null);
          } catch {
            setSubscription(null);
          }
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load plans. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const handleSubscribe = async (planId: string) => {
    if (!user) { router.push("/login"); return; }
    try {
      setCheckoutLoading(planId);
      setError(null);
      const res = await createCheckoutSession(planId);
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        setError("Failed to generate checkout URL. Please try again.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to initiate checkout securely.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : null;

  const daysLeft = (d?: string) =>
    d ? Math.max(0, Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)) : null;

  const isCurrentPlan = (planId: string) =>
    !!(subscription?.isPro && subscription?.planType === planId);

  // Animation variants
  const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#fafcfa] text-slate-900 font-sans selection:bg-emerald-200 relative overflow-hidden">
      
      {/* Dynamic Premium Background */}
      <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-emerald-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[70%] bg-teal-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 w-full h-[100px] bg-gradient-to-t from-[#fafcfa] to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 lg:py-12 pb-12">
        
        {/* Header */}
        <motion.header 
          initial="hidden" 
          animate="visible" 
          variants={fadeUp}
          className="text-center mb-8 max-w-3xl mx-auto"
        >
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-[1.2] tracking-tight mb-4 whitespace-nowrap">
            Unlock your full potential with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              MediFind Pro
            </span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Get priority rankings, unlimited listings, and powerful analytics. Join thousands of top healthcare professionals growing their network today.
          </p>
        </motion.header>

        {/* Status Banner */}
        {!isLoading && subscription && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl mx-auto mb-8"
          >
            <div className={`p-4 md:p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl transition-all shadow-md
              ${subscription.isPro 
                ? "bg-white/80 border-emerald-200 shadow-emerald-100/40 ring-1 ring-white" 
                : "bg-white/80 border-slate-200 shadow-slate-100/50"}
            `}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-inner
                  ${subscription.isPro ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white" : "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600"}`}>
                  {subscription.isPro ? <FiShield /> : <FiClock />}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-0.5">
                    {subscription.isPro ? `Active Plan: ${subscription.planType.replace("_", " ")}` : "Free Trial Mode"}
                  </h3>
                  {subscription.isPro && subscription.expiryDate ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-slate-500 text-sm font-medium">
                        Renews on <span className="text-slate-700 font-semibold">{formatDate(subscription.expiryDate)}</span>
                      </p>
                      {daysLeft(subscription.expiryDate) !== null && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          {daysLeft(subscription.expiryDate)} days left
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm font-medium">
                      Trial Duration: <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded ml-1">20 seconds max</span>
                    </p>
                  )}
                </div>
              </div>
              
              {subscription.isPro && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  Pro Active
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-3xl mx-auto mb-10 overflow-hidden"
            >
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4 text-red-700 shadow-sm">
                <div className="bg-red-100 p-2 rounded-full"><FiShield size={20} /></div>
                <p className="flex-1 font-medium">{error}</p>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700 transition-colors p-1">✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plans Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-14 h-14 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin mb-6 shadow-sm" />
            <p className="text-slate-500 font-semibold animate-pulse">Loading premium plans...</p>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto mb-12 items-stretch lg:items-center justify-center"
          >
            {plans.map((plan) => {
              const yearly      = plan.durationMonths === 12;
              const active      = isCurrentPlan(plan.id);
              const processing  = checkoutLoading === plan.id;
              const features    = PLAN_FEATURES[plan.id] ?? [];
              const monthlyEquivalent = yearly ? Math.round(plan.price / 12) : plan.price;

              return (
                <motion.div 
                  variants={fadeUp}
                  key={plan.id}
                  whileHover={{ y: active ? 0 : -6 }}
                  className={`relative rounded-[2rem] p-6 transition-all duration-300 flex-none
                    ${yearly 
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-2xl shadow-emerald-900/20 lg:w-[55%] text-white" 
                      : "bg-white border border-slate-200 shadow-xl shadow-slate-200/50 lg:w-[40%] text-slate-900"}
                    ${active ? (yearly ? "ring-4 ring-emerald-300/50" : "ring-4 ring-slate-300/50") : ""}
                  `}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className={`px-5 py-2 rounded-full font-bold text-sm shadow-sm
                      ${yearly ? "bg-white text-emerald-700" : "bg-emerald-100 text-emerald-700"}
                    `}>
                      {plan.name}
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                      ${yearly ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}
                    `}>
                      {yearly ? "Most Value" : "Most Popular"}
                    </div>
                  </div>

                  <p className={`text-sm font-medium mb-4 ${yearly ? "text-emerald-50" : "text-slate-500"}`}>
                    {plan.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-end gap-1">
                      <span className={`text-3xl font-bold ${yearly ? "text-emerald-100" : "text-slate-400"}`}>₹</span>
                      <span className="text-5xl font-black tracking-tighter leading-none">
                        {monthlyEquivalent.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className={`flex flex-col text-xs font-medium leading-tight ${yearly ? "text-emerald-100" : "text-slate-400"}`}>
                      <span>Billed {yearly ? "annually" : "monthly"}</span>
                      <span>Plus taxes</span>
                    </div>
                  </div>

                  <div className={`w-full h-px mb-5 ${yearly ? "bg-emerald-400/50" : "bg-slate-100"}`} />

                  <ul className={`grid gap-y-3 gap-x-4 mb-6 ${yearly ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                    {features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <FiCheck size={16} strokeWidth={3} className={`shrink-0 ${yearly ? "text-emerald-100" : "text-emerald-500"}`} />
                        <span className={`text-sm font-medium ${yearly ? "text-emerald-50" : "text-slate-700"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => !active && handleSubscribe(plan.id)}
                    disabled={active || !!checkoutLoading}
                    className={`w-full py-3 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-md
                      ${active
                        ? (yearly ? "bg-emerald-700 text-emerald-200 cursor-not-allowed shadow-none" : "bg-slate-50 text-slate-400 cursor-not-allowed border-2 border-slate-200 shadow-none")
                        : yearly
                        ? "bg-white text-emerald-700 hover:bg-emerald-50 hover:shadow-lg hover:-translate-y-1"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg hover:-translate-y-1"
                      }`}
                  >
                    {processing ? (
                      <><div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${yearly ? "border-emerald-700" : "border-white"}`} /> Processing...</>
                    ) : active ? (
                      "Current Plan"
                    ) : (
                      <>Subscribe Now <FiTrendingUp /></>
                    )}
                  </button>
                  
                  {/* Current Plan Indicator Pin */}
                  {active && (
                    <div className="absolute -top-3 -right-3 z-20">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg
                        ${yearly ? "bg-white text-emerald-600" : "bg-slate-800 text-white"}
                      `}>
                        <FiCheck strokeWidth={3} size={16} />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

      </div>
    </div>
  );
}
