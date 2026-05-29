"use client";

import { getSellerEarnings } from "../../apis/seller.api";
import { useEffect, useState } from "react";
import SellerBar from "../SellerBar/page";
import { toast } from "react-toastify";
import {
  Wallet,
  Calendar,
  TrendingUp,
  Package,
  ArrowUpRight,
  BarChart3,
  LineChart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import dayjs from "dayjs";

export default function SellerEarnings({ isDashboard = false }: { isDashboard?: boolean }) {
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [thisMonthEarnings, setThisMonthEarnings] = useState(0);
  const [thisMonthOrders, setThisMonthOrders] = useState(0);
  const [thisYearEarnings, setThisYearEarnings] = useState(0);
  const [thisYearOrders, setThisYearOrders] = useState(0);
  const [dailyHistory, setDailyHistory] = useState<any[]>([]);
  const [monthlyHistory, setMonthlyHistory] = useState<any[]>([]);
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
        
        // Format daily history for chart
        const formattedDaily = res.data.dailyHistory?.map((item: any) => ({
          name: dayjs(item._id).format("MMM DD"),
          value: item.earnings
        })) || [];
        setDailyHistory(formattedDaily);

        // Format monthly history for chart
        const formattedMonthly = res.data.monthlyHistory?.map((item: any) => ({
          name: dayjs(item._id).format("MMM YY"),
          value: item.earnings
        })) || [];
        setMonthlyHistory(formattedMonthly);
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
      textColor: "text-emerald-700",
    },
    {
      title: "This Month",
      value: thisMonthEarnings,
      count: thisMonthOrders,
      icon: <Calendar className="w-5 h-5 text-sky-500" />,
      accent: "border-sky-200 bg-sky-50/50",
      textColor: "text-sky-700",
    },
    {
      title: "This Year",
      value: thisYearEarnings,
      count: thisYearOrders,
      icon: <Wallet className="w-5 h-5 text-purple-500" />,
      accent: "border-purple-200 bg-purple-50/50",
      textColor: "text-purple-700",
    },
  ];

  const content = (
    <div className="space-y-12">
      <div className="hidden md:block">
 
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <span className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">Syncing Data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
              >
                <div className="flex justify-between items-center mb-8">
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.textColor}`}>
                    {item.title}
                  </p>
                  <div className={`w-12 h-12 border rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${item.accent}`}>
                    {item.icon}
                  </div>
                </div>

                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                  {formatCurrency(item.value)}
                </h2>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Package className="w-4 h-4" />
                    <span>{item.count} Transactions</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    Ledger <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Revenue Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Revenue Performance</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Growth Trend</p>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyHistory}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                      formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0ea5e9" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRev)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Sales Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Daily Volume</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">7-Day Sales Activity</p>
                  </div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                      cursor={{fill: '#f8fafc'}}
                      formatter={(value: any) => [formatCurrency(value), 'Sales']}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#10b981" 
                      radius={[6, 6, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isDashboard) {
    return <div className="mt-8">{content}</div>;
  }

  return (
    <div className="flex h-screen bg-white">
      <SellerBar />

      <main className="flex-1 overflow-y-auto md:ml-72 transition-all duration-300 animate-fadeIn">
        <div className="h-16 md:hidden" />
        <div className="p-8 max-w-6xl mx-auto">
          {content}
        </div>
      </main>
    </div>
  );
}
