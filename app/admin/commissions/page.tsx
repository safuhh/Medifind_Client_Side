"use client";
import { getCommissions } from "@/app/apis/doctor.api";
import { useEffect, useState } from "react";
import { Wallet, Calendar, TrendingUp, Package, Truck, ShoppingBag } from "lucide-react";

export default function AdminCommissionsPage() {
  const [loading, setloading] = useState<boolean>(true);
  const [commissions, setcommissions] = useState<any>(null);

  useEffect(() => {
    async function getData() {
      try {
        setloading(true);
        const res = await getCommissions();
        setcommissions(res.data);
      } catch (error) {
        console.error("Failed to fetch commissions:", error);
      } finally {
        setloading(false);
      }
    }
    getData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto flex items-center justify-center h-64">
          <div className="text-slate-500 flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
            Loading commissions...
          </div>
        </div>
      </div>
    );
  }

  if (!commissions) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto flex items-center justify-center h-64">
          <div className="text-red-500">Failed to load commissions data.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Platform Commissions</h1>
            <p className="text-slate-500 mt-1">Track revenue generated from orders and deliveries</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-700">Platform Revenue</span>
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
            <p className="text-4xl font-bold text-slate-900">₹{commissions.today?.earnings || 0}</p>
            
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                  Product Profit:
                </span>
                <span className="font-semibold text-slate-700">₹{commissions.today?.product || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-slate-400" />
                  Delivery Profit:
                </span>
                <span className="font-semibold text-slate-700">₹{commissions.today?.delivery || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
              <Package className="w-3.5 h-3.5" />
              <span>{commissions.today?.orders || 0} orders processed</span>
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
            <p className="text-4xl font-bold text-slate-900">₹{commissions.thisMonth?.earnings || 0}</p>
            
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                  Product Profit:
                </span>
                <span className="font-semibold text-slate-700">₹{commissions.thisMonth?.product || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-slate-400" />
                  Delivery Profit:
                </span>
                <span className="font-semibold text-slate-700">₹{commissions.thisMonth?.delivery || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
              <Package className="w-3.5 h-3.5" />
              <span>{commissions.thisMonth?.orders || 0} orders processed</span>
            </div>
          </div>

          {/* Total */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Lifetime</p>
              <div className="w-8 h-8 border border-indigo-200 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-900">₹{commissions.total?.earnings || 0}</p>
            
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                  Product Profit:
                </span>
                <span className="font-semibold text-slate-700">₹{commissions.total?.product || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-slate-400" />
                  Delivery Profit:
                </span>
                <span className="font-semibold text-slate-700">₹{commissions.total?.delivery || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
              <Package className="w-3.5 h-3.5" />
              <span>{commissions.total?.orders || 0} total orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
