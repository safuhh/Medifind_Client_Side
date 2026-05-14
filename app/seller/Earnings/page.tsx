"use client";

import { getSellerEarnings, connectStripe } from "../../apis/seller.api";
import { useEffect, useState } from "react";
import SellerBar from "../SellerBar/page";
import { toast } from "react-toastify";
import { Wallet, Calendar, TrendingUp, Package, ArrowUpRight } from "lucide-react";

export default function SellerEarnings() {
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [thisMonthEarnings, setThisMonthEarnings] = useState(0);
  const [thisMonthOrders, setThisMonthOrders] = useState(0);
  const [thisYearEarnings, setThisYearEarnings] = useState(0);
  const [thisYearOrders, setThisYearOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSellerEarnings()
      .then((res) => {
        setTodayEarnings(res.data.today.earnings);
        setTodayOrders(res.data.today.count);
        setThisMonthEarnings(res.data.thisMonth.earnings);
        setThisMonthOrders(res.data.thisMonth.count);
        setThisYearEarnings(res.data.thisYear.earnings);
        setThisYearOrders(res.data.thisYear.count);
      })
      .catch((err) => {
        console.error("Failed to fetch earnings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const data = [
    {
      title: "Today",
      value: todayEarnings,
      count: todayOrders,
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      accent: "border-emerald-200 bg-emerald-50/50",
      textColor: "text-emerald-700"
    },
    {
      title: "This Month",
      value: thisMonthEarnings,
      count: thisMonthOrders,
      icon: <Calendar className="w-5 h-5 text-sky-500" />,
      accent: "border-sky-200 bg-sky-50/50",
      textColor: "text-sky-700"
    },
    {
      title: "This Year",
      value: thisYearEarnings,
      count: thisYearOrders,
      icon: <Wallet className="w-5 h-5 text-purple-500" />,
      accent: "border-purple-200 bg-purple-50/50",
      textColor: "text-purple-700"
    },
  ];

  return (
    <div className="flex h-screen bg-white">
      <SellerBar />

      <main className="flex-1 overflow-y-auto md:ml-72 transition-all duration-300">
        <div className="p-8 max-w-5xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Earnings Overview</h1>
              <p className="text-slate-500 mt-1">Track your store's performance and payouts</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Stripe Connect Button */}
              <button
                onClick={async () => {
                  try {
                    toast.info("Redirecting to Stripe...");
                    const res = await connectStripe();
                    if (res.data.success && res.data.url) {
                      window.location.href = res.data.url;
                    } else {
                      toast.error("Failed to get onboarding link");
                    }
                  } catch (err: any) {
                    console.error(err);
                    toast.error(err.response?.data?.message || "Failed to start Stripe onboarding");
                  }
                }}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 shadow-sm"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Connect Stripe
              </button>

              <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-slate-700">Live Updates</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <span className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                <p className="text-sm font-medium">Calculating earnings...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-center mb-6">
                    <p className={`text-xs font-bold uppercase tracking-wider ${item.textColor}`}>{item.title}</p>
                    <div className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-colors ${item.accent}`}>
                      {item.icon}
                    </div>
                  </div>
                  
                  <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                    {formatCurrency(item.value)}
                  </h2>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>{item.count} orders</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400 group-hover:text-slate-600 flex items-center gap-0.5 transition-colors">
                      View details <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Info / Help Card */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mt-8">
            <h3 className="text-sm font-bold text-slate-800 mb-1">About Your Payouts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Earnings are calculated after deducting the platform fee (10%) from the base product price. The full GST amount collected on your products is passed directly to you. Delivery charges are handled separately.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
