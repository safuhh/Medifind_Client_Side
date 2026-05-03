"use client";

import { useEffect, useState } from "react";
import { getDeliveryBoyDashboard } from "@/app/apis/deliveryboyapi";
import { useDeliveryBoy } from "@/app/hooks/Usedeliveryboy";
import {
  MapPin,
  Phone,
  CheckCircle2,
  Package,
  TrendingUp,
  Clock,
  Bike
} from "lucide-react";
import DeliverySidebar from "../navbar/page";

export default function DeliveryDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useDeliveryBoy();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDeliveryBoyDashboard();
        setData(res.data.deliveryBoy);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
        <div className="w-6 h-6 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 text-sm font-medium">Loading dashboard...</p>
      </div>
    );
  }

 return (
  <div>
    <DeliverySidebar />
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-emerald-100">
    
  

{/* MAIN CONTENT AREA */}
<div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
  
<header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60">
  <div className="max-w-7xl mx-auto pl-12 pr-4 sm:pl-14 sm:pr-6 lg:px-10 py-3 md:py-5 flex justify-between items-center">

    {/* TITLE */}
    <div className="flex flex-col min-w-0 items-start">
      <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
        Dashboard
      </h1>

      <div className="flex items-center gap-1.5">
        <p className="text-[10px] md:text-xs text-slate-500 font-medium">
          Agent <span className="hidden sm:inline">Portal</span>
        </p>
        <span className="text-[8px] text-slate-300">•</span>
        <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-bold">
          4429-DX
        </p>
      </div>
    </div>

    {/* STATUS BADGE */}
    <div className="flex-shrink-0">
      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 md:px-4 md:py-2 rounded-full border border-emerald-100">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] md:text-[11px] font-bold text-emerald-700 uppercase">
          {data?.status || "Live"}
        </span>
      </div>
    </div>

  </div>
</header>
</div>
  </div>
  </div>
);
}