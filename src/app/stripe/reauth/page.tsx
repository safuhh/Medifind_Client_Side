"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function StripeReauthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-amber-100 backdrop-blur-sm">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-amber-600 animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Onboarding Incomplete</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          It seems you didn't finish the Stripe onboarding process. Please try again to connect your account.
        </p>

        <div className="space-y-3">
          <Link 
            href="/delivery/dashboard"
            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg w-full"
          >
            Try Again from Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
