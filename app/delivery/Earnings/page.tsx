"use client";
import { deliveryBoyEarnings } from "@/app/apis/deliveryboyapi";
import { useEffect, useState } from "react";
import DeliverySidebar from "../navbar/page";
import { Wallet, Calendar, TrendingUp, Package } from "lucide-react";

export default function EarningsPage() {
  const [loading, setloading] = useState<boolean>(true);
  const [earnings, setearnings] = useState<any>(null);

  useEffect(() => {
    async function getData() {
      try {
        setloading(true);
        const res = await deliveryBoyEarnings();
        setearnings(res.data);
      } catch (error) {
        console.error("Failed to fetch earnings:", error);
      } finally {
        setloading(false);
      }
    }
    getData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex">
        <DeliverySidebar />
        <div className="flex-1 flex items-center justify-center md:ml-[280px]">
          <div className="text-slate-500 flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
            Loading earnings...
          </div>
        </div>
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="min-h-screen bg-white flex">
        <DeliverySidebar />
        <div className="flex-1 flex items-center justify-center md:ml-[280px]">
          <div className="text-red-500">Failed to load earnings data.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      <DeliverySidebar />
      <div className="flex-1 p-8 md:ml-[280px]">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Earnings Dashboard</h1>
              <p className="text-slate-500 mt-1">Monitor your performance and payouts</p>
            </div>
          
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Today */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Today</p>
                <div className="w-8 h-8 border border-emerald-200 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-900">₹{earnings.today?.earnings || 0}</p>
              <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
                <Package className="w-4 h-4 text-slate-400" />
                <span>{earnings.today?.orders || 0} orders completed</span>
              </div>
            </div>

            {/* This Month */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs font-bold text-sky-600 uppercase tracking-wider">This Month</p>
                <div className="w-8 h-8 border border-sky-200 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-sky-500" />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-900">₹{earnings.thisMonth?.earnings || 0}</p>
              <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
                <Package className="w-4 h-4 text-slate-400" />
                <span>{earnings.thisMonth?.orders || 0} orders completed</span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Lifetime</p>
                <div className="w-8 h-8 border border-slate-200 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-slate-500" />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-900">₹{earnings.total?.earnings || 0}</p>
              <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
                <Package className="w-4 h-4 text-slate-400" />
                <span>{earnings.total?.orders || 0} total orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}