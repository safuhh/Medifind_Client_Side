"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FiCheck, FiStar, FiShield, FiTrendingUp, FiClock } from "react-icons/fi";
import {
  getPlans,
  getSubscriptionStatus,
  createCheckoutSession,
  type Plan,
  type Subscription,
} from "../apis/subcription.api";

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
    q: "Can I cancel anytime?",
    a: "Yes — your plan stays active until the billing period ends. No surprise charges.",
  },
  {
    q: "What payment methods are accepted?",
    a: "All major credit/debit cards via Stripe. UPI support coming soon.",
  },
  {
    q: "What happens when my plan expires?",
    a: "Your account reverts to the free tier and will be locked until you subscribe. No data is lost.",
  },
  {
    q: "Is there a free trial?",
    a: "Every seller/doctor gets a 20-second free trial upon first action to explore before a plan is required.",
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
  const [openFaq, setOpenFaq]                 = useState<number | null>(null);

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
        setError(err?.response?.data?.message || "Failed to load plans.");
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
        setError("Failed to get checkout URL. Please try again.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to initiate checkout.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : null;

  const daysLeft = (d?: string) =>
    d ? Math.max(0, Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)) : null;

  const isCurrentPlan = (planId: string) =>
    !!(subscription?.isPro && subscription?.planType === planId);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-200 relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-emerald-50 via-[#f8fafc] to-[#f8fafc] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 pb-32">
        
        {/* Header */}
        <header className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm border border-emerald-200">
            <FiStar size={14} />
            Premium Plans
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
            Grow your practice with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Pro Features
            </span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Upgrade your account to remove limits, boost your visibility, and unlock advanced tools tailored for healthcare professionals.
          </p>
        </header>

        {/* Status Banner */}
        {!isLoading && subscription && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className={`p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm transition-all
              ${subscription.isPro 
                ? "bg-white border-emerald-200 shadow-emerald-100/50" 
                : "bg-white border-slate-200"}
            `}>
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0
                  ${subscription.isPro ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"}`}>
                  {subscription.isPro ? <FiShield size={28} /> : <FiClock size={28} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {subscription.isPro ? `Active Plan: ${subscription.planType.replace("_", " ")}` : "Free Trial Mode"}
                  </h3>
                  {subscription.isPro && subscription.expiryDate ? (
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-slate-500 font-medium">
                        Renews on {formatDate(subscription.expiryDate)}
                      </p>
                      {daysLeft(subscription.expiryDate) !== null && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-md">
                          {daysLeft(subscription.expiryDate)} days left
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 font-medium mt-1">
                      Trial Duration: <span className="text-amber-600 font-bold">20 seconds maximum</span>
                    </p>
                  )}
                </div>
              </div>
              
              {subscription.isPro && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold px-6 py-3 rounded-xl flex items-center gap-2">
                  <FiCheck size={18} /> Pro Active
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="max-w-3xl mx-auto mb-10 bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4 text-red-700">
            <div className="bg-red-100 p-2 rounded-full"><FiShield size={20} /></div>
            <p className="flex-1 font-medium">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-700 transition-colors">✕</button>
          </div>
        )}

        {/* Plans Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading pricing options...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
            {plans.map((plan) => {
              const yearly      = plan.durationMonths === 12;
              const active      = isCurrentPlan(plan.id);
              const processing  = checkoutLoading === plan.id;
              const features    = PLAN_FEATURES[plan.id] ?? [];
              const saving      = 999 * 12 - plan.price;

              return (
                <div 
                  key={plan.id}
                  className={`relative bg-white rounded-3xl p-8 lg:p-10 transition-all duration-300
                    ${yearly 
                      ? "border-2 border-emerald-500 shadow-xl shadow-emerald-100/60 lg:scale-[1.02] z-10" 
                      : "border border-slate-200 shadow-sm hover:shadow-md"}
                    ${active ? "ring-4 ring-emerald-500/20" : ""}
                  `}
                >
                  {/* Badge */}
                  {yearly && !active && (
                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                      <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold uppercase tracking-wider px-6 py-2 rounded-full shadow-lg shadow-emerald-500/25">
                        Most Popular Choice
                      </span>
                    </div>
                  )}
                  {active && (
                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                      <span className="bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-2 rounded-full shadow-lg">
                        Your Current Plan
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                      <p className="text-slate-500 text-sm font-medium">{plan.description}</p>
                    </div>
                    <div className={`p-4 rounded-2xl ${yearly ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"}`}>
                      {yearly ? <FiTrendingUp size={28} /> : <FiShield size={28} />}
                    </div>
                  </div>

                  <div className="mb-8 border-b border-slate-100 pb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-400">₹</span>
                      <span className="text-5xl font-black text-slate-900 tracking-tight">
                        {plan.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-slate-500 font-medium ml-1">/ {yearly ? "year" : "month"}</span>
                    </div>
                    {yearly && (
                      <p className="mt-3 text-emerald-600 text-sm font-bold flex items-center gap-1.5 bg-emerald-50 inline-flex px-3 py-1.5 rounded-lg">
                        <FiCheck /> Save ₹{saving.toLocaleString("en-IN")} annually
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-10">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 bg-emerald-100 text-emerald-600 rounded-full p-1 shrink-0">
                          <FiCheck size={14} strokeWidth={3} />
                        </div>
                        <span className="text-slate-600 font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => !active && handleSubscribe(plan.id)}
                    disabled={active || !!checkoutLoading}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200
                      ${active
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200"
                        : yearly
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-200/80 hover:-translate-y-0.5"
                        : "bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5"
                      }`}
                  >
                    {processing ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Redirecting...</>
                    ) : active ? (
                      "Current Plan"
                    ) : (
                      `Upgrade to ${yearly ? 'Yearly' : 'Monthly'}`
                    )}
                  </button>
                  {!active && (
                    <p className="text-center text-slate-400 text-xs font-medium mt-4">
                      Cancel anytime. Secure checkout via Stripe.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Comparison & Trust */}
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-12 items-start">
          
          {/* FAQ */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-emerald-200">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center bg-white"
                  >
                    <span className="font-bold text-slate-800">{faq.q}</span>
                    <span className={`text-xl text-emerald-500 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 pt-1 text-slate-500 font-medium leading-relaxed bg-slate-50/50 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feature Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Feature Comparison</h2>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Features</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Free Trial</th>
                  <th className="px-8 py-5 text-xs font-bold text-emerald-600 uppercase tracking-wider text-center bg-emerald-50/50">Pro Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {FEATURES.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-sm font-bold text-slate-700">{row.label}</td>
                    <td className={`px-8 py-4 text-sm font-medium text-center ${row.free === "✗" ? "text-slate-300" : "text-slate-500"}`}>
                      {row.free}
                    </td>
                    <td className={`px-8 py-4 text-sm font-bold text-center bg-emerald-50/20 ${row.pro === "✓" ? "text-emerald-500" : "text-emerald-700"}`}>
                      {row.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
