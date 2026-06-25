"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Loader2, XCircle } from "lucide-react";
import { confirmSubscriptionPayment } from "@/services/apis/subcription.api";
import { useDispatch, useSelector } from "react-redux";
// Import your fetchUser or auth action here if you have one, or we can just window.location.reload() to refresh state.

function StripeSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useSelector((state: any) => state.auth?.user);
  
  const sessionId = searchParams.get("session_id");
  const type = searchParams.get("type"); // "subscription" or "connect"
  const planId = searchParams.get("plan_id") || ""; // Used for mock test sessions

  const [loading, setLoading] = useState(type === "subscription");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait until Redux has loaded the user so the API call has the auth token
    if (type === "subscription" && sessionId && user) {
      const confirmPayment = async () => {
        try {
          const res = await confirmSubscriptionPayment(sessionId, planId);
          if (res.success) {
            // Subscription confirmed successfully!
            setLoading(false);
          } else {
            setError(res.message || "Failed to verify subscription payment.");
            setLoading(false);
          }
        } catch (err: any) {
          setError(err.response?.data?.message || "Error verifying subscription payment.");
          setLoading(false);
        }
      };
      confirmPayment();
    }
  }, [sessionId, type, planId, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 font-sans">
        <Loader2 className="w-16 h-16 text-emerald-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-slate-800">Verifying Payment...</h2>
        <p className="text-slate-500 mt-2">Please wait while we activate your subscription.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-50 font-sans">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Verification Failed</h1>
          <p className="text-slate-600 mb-8">{error}</p>
          <Link href="/subcription" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl w-full block transition-colors">
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-emerald-100 backdrop-blur-sm">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          {type === "subscription" ? "Subscription Active!" : "Account Linked!"}
        </h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          {type === "subscription"
            ? "Your payment was successful and your Pro features have been unlocked."
            : "Your Stripe account has been successfully connected to our platform. You are now ready to receive automated payouts."}
        </p>

        <div className="space-y-3">
          {type === "subscription" ? (
            <button 
              onClick={() => {
                if (user?.role === "seller") {
                  window.location.href = "/seller/add-medicine";
                } else if (user?.role === "doctor") {
                  window.location.href = "/doctor/availability";
                } else {
                  window.location.href = "/";
                }
              }}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg w-full"
            >
              {user?.role === "seller" ? "Go to Seller Dashboard" : user?.role === "doctor" ? "Go to Doctor Dashboard" : "Go to Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              {user?.role === "delivery_boy" && (
                <Link 
                  href="/delivery/dashboard"
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg w-full"
                >
                  Go to Delivery Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              
              {user?.role === "seller" && (
                <Link 
                  href="/seller/Earnings"
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg w-full"
                >
                  Go to Seller Earnings
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              
              {(!user || (user.role !== "delivery_boy" && user.role !== "seller")) && (
                <Link 
                  href="/"
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg w-full"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StripeSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
      </div>
    }>
      <StripeSuccessContent />
    </Suspense>
  );
}
