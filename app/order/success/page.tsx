"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Package, ArrowRight, AlertCircle } from "lucide-react";
import NavbarPage from "@/app/navbar/page";
import Footer from "@/app/footer/page";

export default function OrderSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setError("Invalid session ID");
            setLoading(false);
            return;
        }

        const confirmPayment = async () => {
            try {
                const { default: api } = await import("../../apis/api");
                
                const res = await api.post("/orders/confirm-payment", { sessionId });

                if (!res.data.success) {
                    setError(res.data.message || "Failed to confirm payment");
                }
            } catch (err: any) {
                console.error("Payment confirmation error:", err);
                setError(err.response?.data?.message || "An error occurred while confirming payment");
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
            <NavbarPage />
                   <br/>
      <br/>
      
            
            <div className="flex-1 flex items-center justify-center p-6 py-24 sm:py-32">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
                    
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
                                <div className="relative w-20 h-20 bg-white rounded-full border border-emerald-100 flex items-center justify-center shadow-lg">
                                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-slate-800">Confirming Payment...</h2>
                                <p className="text-sm text-slate-500">Please do not close this window.</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-6">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-slate-800">Verification Failed</h2>
                                <p className="text-sm text-slate-500">{error}</p>
                            </div>
                            <button
                                onClick={() => router.push("/cart")}
                                className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors"
                            >
                                Return to Cart
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                            {/* Success Icon */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 text-white">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-md">
                                    <span className="text-[10px]">✨</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-10">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Order Confirmed!</h2>
                                <p className="text-slate-500 text-sm leading-relaxed px-2">
                                    Your payment was successful and your order has been sent to the sellers. 
                                    A delivery partner will be assigned shortly.
                                </p>
                            </div>

                            <div className="w-full space-y-3">
                                <button 
                                    onClick={() => router.push("/")}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Package className="w-4 h-4" />
                                    Continue Shopping
                                </button>
                                
                                <button 
                                    onClick={() => router.push("/orders")}
                                    className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm tracking-wide hover:bg-slate-50 hover:text-emerald-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Track Order Status
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
