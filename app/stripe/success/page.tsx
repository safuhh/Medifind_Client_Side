"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function StripeSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-emerald-100 backdrop-blur-sm">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Account Linked!</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Your Stripe account has been successfully connected to our platform. You are now ready to receive automated payouts.
        </p>

        <div className="space-y-3">
          <Link 
            href="/delivery/dashboard"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg w-full"
          >
            Go to Delivery Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link 
            href="/seller/Earnings"
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all duration-200 border border-slate-200 w-full"
          >
            Go to Seller Earnings
          </Link>
        </div>
      </div>
    </div>
  );
}
