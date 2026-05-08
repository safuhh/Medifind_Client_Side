"use client";

import React, { useState, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "../../navbar/page";
import Footer from "../../footer/page";
import api from "../../apis/api";
import { FiCreditCard, FiUser, FiGlobe, FiMapPin, FiCheckCircle } from "react-icons/fi";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "pk_test_placeholder",
);

// --- Professional Mock Form ---
const MockCheckoutForm = ({ clientSecret, amount }: { clientSecret: string; amount: string }) => {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleMockSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        setTimeout(async () => {
            const paymentIntentId = clientSecret.replace("mock_secret_", "mock_intent_");
            try {
                await api.post("/api/v1/booking/confirm-payment", {
                    paymentIntentId: paymentIntentId,
                });
                toast.success("Payment successful! ");
                router.push(`/booking/success?payment_intent=${paymentIntentId}`);
            } catch (err) {
                toast.error("Payment failed");
                setIsProcessing(false);
            }
        }, 2000);
    };

    return (
        <form onSubmit={handleMockSubmit} className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl mb-4 flex flex-col items-center gap-4">
                <FiCheckCircle className="text-emerald-600" size={32} />
                <p className="text-sm font-bold text-emerald-700 uppercase tracking-widest text-center">Secure Mock Payment Gateway</p>
                <p className="text-xs text-slate-500 text-center">This is a simulation. No real money will be charged.</p>
            </div>

            <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-800">Payment Details</h2>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Amount to Pay</span>
                        <span className="text-lg font-bold text-slate-800">₹{amount}.00</span>
                    </div>
                </div>
            </div>

            <button
                disabled={isProcessing}
                className="w-full bg-[#0070f3] hover:bg-[#0062d1] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-200 active:scale-[0.98] disabled:opacity-50 mt-4"
            >
                {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing Mock Payment...</span>
                    </div>
                ) : (
                    `Pay ₹${amount}.00 (Mock)`
                )}
            </button>
            <MockFooter />
        </form>
    );
};

const MockFooter = () => (
    <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 font-medium">Powered by <span className="font-bold text-slate-500">stripe</span></p>
        <div className="h-3 w-[1px] bg-slate-200"></div>
        <button type="button" className="text-xs text-slate-400 font-medium hover:text-slate-600">Terms</button>
        <button type="button" className="text-xs text-slate-400 font-medium hover:text-slate-600">Privacy</button>
    </div>
);

// --- Real Stripe Components ---
const CheckoutForm = ({
  clientSecret,
  amount,
}: {
  clientSecret: string;
  amount: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success`,
        receipt_email: email,
      },
    });

    if (result.error) {
      toast.error(result.error.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-800">Pay with card</h2>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-600">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3] outline-none transition-all text-slate-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-800">Payment method</h2>
        <div className="p-1">
          <PaymentElement options={{ layout: "tabs" }} />
        </div>
      </div>

      <button
        disabled={isProcessing || !stripe}
        className="w-full bg-[#0070f3] hover:bg-[#0062d1] text-white py-4 rounded-lg font-bold text-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          `Pay ₹${amount}`
        )}
      </button>

      <MockFooter />
    </form>
  );
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get("client_secret");
  const amount = searchParams.get("amount") || "0";

  if (!clientSecret) return null;

  const isMock = clientSecret.startsWith("mock_");

  return (
    <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
      <div className="p-8 md:p-12">
        {isMock ? (
            <MockCheckoutForm clientSecret={clientSecret} amount={amount} />
        ) : (
            <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: { theme: "stripe" } }}
            >
                <CheckoutForm clientSecret={clientSecret} amount={amount} />
            </Elements>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-[#F6F9FC] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 py-24">
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0070f3] rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Initialising Secure Session
              </p>
            </div>
          }
        >
          <PaymentContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
