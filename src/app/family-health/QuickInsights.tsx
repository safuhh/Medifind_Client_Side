"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getFamilyHealthSummary } from "@/services/apis/familyChat.api";
import {
  Calendar, ShoppingBag, FileText, Clock, AlertCircle,
  Loader2, TrendingUp, Users
} from "lucide-react";

interface Props {
  activeMember: any | null;
  members: any[];
}

export default function QuickInsights({ activeMember, members }: Props) {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const res = await getFamilyHealthSummary();
      if (res.data?.success) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error("Failed to load summary:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#0a4d33] animate-spin" />
          <p className="text-sm text-slate-400">Loading family health insights...</p>
        </div>
      </div>
    );
  }

  const upcomingBookings = summary?.upcomingBookings || [];
  const recentReports = summary?.recentReports || [];
  const recentOrders = summary?.recentOrders || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Family Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="bg-gradient-to-br from-[#0a4d33] to-emerald-600 text-white p-5 rounded-2xl shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-sm font-bold">Family Overview</p>
        </div>
        <p className="text-3xl font-bold mb-1">{members.length}</p>
        <p className="text-emerald-100 text-sm mb-4">family members registered</p>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <span key={m._id} className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-lg font-medium">
              {m.name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm font-bold text-slate-800">Upcoming Appointments</p>
          {upcomingBookings.length > 0 && (
            <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
              {upcomingBookings.length}
            </span>
          )}
        </div>
        {upcomingBookings.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No upcoming appointments this week</p>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.slice(0, 3).map((b: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-700">
                  {new Date(b.date).getDate()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Dr. {(b.doctorId as any)?.fullName || "Unknown"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(b.date).toLocaleDateString()} at {b.timeSlot}
                    {b.familyMemberId && (
                      <span className="ml-1 text-blue-600">
                        · {(b.familyMemberId as any)?.name}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Health Reports */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-slate-800">Recent Health Reports</p>
          <span className="ml-auto text-xs text-slate-400">This week</span>
        </div>
        {recentReports.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No health reports this week</p>
        ) : (
          <div className="space-y-3">
            {recentReports.slice(0, 3).map((r: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {(r.doctorId as any)?.fullName || "Doctor"} · {(r.doctorId as any)?.specialization}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                    {r.familyMemberId && (
                      <span className="ml-1 text-emerald-600">
                        · {(r.familyMemberId as any)?.name}
                      </span>
                    )}
                  </p>
                  {r.medicines?.length > 0 && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {r.medicines.length} medicine{r.medicines.length > 1 ? "s" : ""} prescribed
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-sm font-bold text-slate-800">Recent Medicine Orders</p>
          <span className="ml-auto text-xs text-slate-400">This week</span>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No medicine orders this week</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.slice(0, 3).map((o: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-purple-50/50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {o.items?.slice(0, 2).map((item: any) => (item.medicineId as any)?.name || "Medicine").join(", ")}
                    {o.items?.length > 2 && ` +${o.items.length - 2} more`}
                  </p>
                  <p className="text-xs text-slate-400">
                    ₹{o.totalAmount} · {new Date(o.createdAt).toLocaleDateString()}
                    {o.familyMemberId && (
                      <span className="ml-1 text-purple-600">
                        · {(o.familyMemberId as any)?.name}
                      </span>
                    )}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                  o.orderStatus === "delivered"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {o.orderStatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
