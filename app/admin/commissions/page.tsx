"use client";
import { getCommissions } from "@/app/apis/doctor.api";
import { getAllSubscriptions } from "@/app/apis/subcription.api";
import { useEffect, useState } from "react";
import {
  Wallet,
  Calendar,
  TrendingUp,
  Package,
} from "lucide-react";
import AdminSidebar from "../adminnavbar/page";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AdminCommissionsPageProps {
  standalone?: boolean;
}

export default function AdminCommissionsPage({
  standalone = true,
}: AdminCommissionsPageProps) {
  const [loading, setloading] = useState<boolean>(true);
  const [commissions, setcommissions] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        setloading(true);
        const [commRes, subRes] = await Promise.all([
          getCommissions(),
          getAllSubscriptions(),
        ]);
        setcommissions(commRes.data);
        if (subRes && subRes.success) {
          setSubscribers(subRes.subscriptions);
        }
      } catch (error) {
        console.error("Failed to fetch commissions/subscriptions:", error);
      } finally {
        setloading(false);
      }
    }
    getData();
  }, []);

  let content;

  if (loading) {
    content = (
      <div className="w-full flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-slate-500 flex items-center gap-3 text-sm font-medium">
          <span className="w-5 h-5 border-2 border-[#105e3f] border-t-transparent rounded-full animate-spin"></span>
          Loading commissions data...
        </div>
      </div>
    );
  } else if (!commissions) {
    content = (
      <div className="w-full flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-red-500 text-sm font-medium">
          Failed to load commissions data.
        </div>
      </div>
    );
  } else {
    const earningsData = [
      { name: "Sellers", Revenue: commissions.sellerEarnings || 0 },
      { name: "Doctors", Revenue: commissions.doctorEarnings || 0 },
    ];
    const barData = [
      {
        name: "Sellers",
        Monthly: commissions.monthlySellerCount || 0,
        Yearly: commissions.yearlySellerCount || 0,
      },
      {
        name: "Doctors",
        Monthly: commissions.monthlyDoctorCount || 0,
        Yearly: commissions.yearlyDoctorCount || 0,
      },
    ];

    content = (
      <div className="w-full space-y-8">
        {/* Header (Only show if standalone) */}
        {standalone && (
          <header className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#105e3f] shrink-0 mt-0.5">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  Platform Earnings
                </h1>
                <p className="text-sm md:text-base text-slate-500 font-medium mt-1">
                  Track revenue generated from active Seller and Doctor Pro plans.
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <div className="px-4 py-2 bg-emerald-50 text-[#105e3f] rounded-lg text-sm font-bold border border-emerald-100 flex items-center gap-2 shadow-sm">
                <TrendingUp className="w-4 h-4 text-[#105e3f]" />
                Revenue Overview
              </div>
            </div>
          </header>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Earnings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#105e3f]">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-medium text-slate-400">₹</span>
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {commissions.totalEarnings?.toLocaleString("en-IN") || 0}
              </span>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-medium text-slate-500">
              <span>Active Subscriptions</span>
              <span className="px-2.5 py-1 bg-emerald-50 text-[#105e3f] rounded-full font-bold">
                {(commissions.sellerCount || 0) + (commissions.doctorCount || 0)} Total
              </span>
            </div>
          </div>

          {/* Seller Plans */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Seller Earnings</p>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#105e3f]">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-medium text-slate-400">₹</span>
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {commissions.sellerEarnings?.toLocaleString("en-IN") || 0}
              </span>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Monthly Pro</span>
                <span className="text-slate-900 font-bold">{commissions.monthlySellerCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Yearly Pro</span>
                <span className="text-slate-900 font-bold">{commissions.yearlySellerCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Doctor Plans */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor Earnings</p>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#105e3f]">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-medium text-slate-400">₹</span>
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {commissions.doctorEarnings?.toLocaleString("en-IN") || 0}
              </span>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Monthly Pro</span>
                <span className="text-slate-900 font-bold">{commissions.monthlyDoctorCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Yearly Pro</span>
                <span className="text-slate-900 font-bold">{commissions.yearlyDoctorCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm min-w-0 w-full overflow-hidden">
            <h2 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">
              Revenue Split (₹)
            </h2>
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={earningsData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value: any) => [
                      `₹${Number(value).toLocaleString("en-IN")}`,
                      "Revenue"
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="Revenue"
                    stroke="#105e3f"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#105e3f", strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subscribers Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm min-w-0 w-full overflow-hidden">
            <h2 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">
              Active Subscribers by Plan
            </h2>
            <div className="h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={barData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    iconSize={8}
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                  <Bar dataKey="Monthly" fill="#105e3f" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Yearly" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Subscription Tables Section */}
        <div className="space-y-8 pt-4">
          {/* Monthly Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#105e3f]" />
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Monthly Plan Subscribers</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Sellers */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Sellers</span>
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                    {subscribers.filter(s => s.planType === "PRO_MONTHLY" && s.userId?.role === "seller").length} Active
                  </span>
                </div>
                <div className="overflow-x-auto w-full max-h-72">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/25 border-b border-slate-100">
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Expires On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subscribers.filter(s => s.planType === "PRO_MONTHLY" && s.userId?.role === "seller").length > 0 ? (
                        subscribers.filter(s => s.planType === "PRO_MONTHLY" && s.userId?.role === "seller").map((sub, i) => (
                          <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-5 py-3.5 text-slate-900 font-medium">{sub.userId?.name || "N/A"}</td>
                            <td className="px-5 py-3.5 text-slate-500">{sub.userId?.email || "N/A"}</td>
                            <td className="px-5 py-3.5 text-right">
                              {sub.expiryDate ? (
                                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                  {new Date(sub.expiryDate).toLocaleDateString()}
                                </span>
                              ) : "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-5 py-8 text-center text-slate-400 font-medium text-xs">
                            No active monthly sellers
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly Doctors */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Doctors</span>
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                    {subscribers.filter(s => s.planType === "PRO_MONTHLY" && s.userId?.role === "doctor").length} Active
                  </span>
                </div>
                <div className="overflow-x-auto w-full max-h-72">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/25 border-b border-slate-100">
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Expires On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subscribers.filter(s => s.planType === "PRO_MONTHLY" && s.userId?.role === "doctor").length > 0 ? (
                        subscribers.filter(s => s.planType === "PRO_MONTHLY" && s.userId?.role === "doctor").map((sub, i) => (
                          <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-5 py-3.5 text-slate-900 font-medium">{sub.userId?.name || "N/A"}</td>
                            <td className="px-5 py-3.5 text-slate-500">{sub.userId?.email || "N/A"}</td>
                            <td className="px-5 py-3.5 text-right">
                              {sub.expiryDate ? (
                                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                  {new Date(sub.expiryDate).toLocaleDateString()}
                                </span>
                              ) : "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-5 py-8 text-center text-slate-400 font-medium text-xs">
                            No active monthly doctors
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Yearly Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#105e3f]" />
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Yearly Plan Subscribers</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Yearly Sellers */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Sellers</span>
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                    {subscribers.filter(s => s.planType === "PRO_YEARLY" && s.userId?.role === "seller").length} Active
                  </span>
                </div>
                <div className="overflow-x-auto w-full max-h-72">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/25 border-b border-slate-100">
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Expires On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subscribers.filter(s => s.planType === "PRO_YEARLY" && s.userId?.role === "seller").length > 0 ? (
                        subscribers.filter(s => s.planType === "PRO_YEARLY" && s.userId?.role === "seller").map((sub, i) => (
                          <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-5 py-3.5 text-slate-900 font-medium">{sub.userId?.name || "N/A"}</td>
                            <td className="px-5 py-3.5 text-slate-500">{sub.userId?.email || "N/A"}</td>
                            <td className="px-5 py-3.5 text-right">
                              {sub.expiryDate ? (
                                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                  {new Date(sub.expiryDate).toLocaleDateString()}
                                </span>
                              ) : "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-5 py-8 text-center text-slate-400 font-medium text-xs">
                            No active yearly sellers
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Yearly Doctors */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Doctors</span>
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                    {subscribers.filter(s => s.planType === "PRO_YEARLY" && s.userId?.role === "doctor").length} Active
                  </span>
                </div>
                <div className="overflow-x-auto w-full max-h-72">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/25 border-b border-slate-100">
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Expires On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subscribers.filter(s => s.planType === "PRO_YEARLY" && s.userId?.role === "doctor").length > 0 ? (
                        subscribers.filter(s => s.planType === "PRO_YEARLY" && s.userId?.role === "doctor").map((sub, i) => (
                          <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-5 py-3.5 text-slate-900 font-medium">{sub.userId?.name || "N/A"}</td>
                            <td className="px-5 py-3.5 text-slate-500">{sub.userId?.email || "N/A"}</td>
                            <td className="px-5 py-3.5 text-right">
                              {sub.expiryDate ? (
                                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                  {new Date(sub.expiryDate).toLocaleDateString()}
                                </span>
                              ) : "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-5 py-8 text-center text-slate-400 font-medium text-xs">
                            No active yearly doctors
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!standalone) {
    return content;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-gray-900 font-sans relative">
      <AdminSidebar />
      <main className="flex-1 w-full md:ml-72 p-4 sm:p-6 md:p-8 pt-24 md:pt-8 transition-all duration-300">
        {content}
      </main>
    </div>
  );
}
