"use client";

import { useEffect, useState } from "react";
import { useSeller } from "@/hooks/useSeller";
import { getlowstocks } from "@/services/apis/lowstock.api";
import {
  AlertTriangle,
  Package,
  RefreshCw,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUrl";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  stock: number;
  category: string;
  images?: string[];
  pricing?: {
    sellingPrice: number;
  };
}

export default function LowStock() {
  useSeller();
  const { user } = useSelector((state: any) => state.auth);
  const [lowstocks, setLowstocks] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api", { withCredentials: true });
    
    socket.emit("join_seller_room", user._id);

    socket.on("low_stock_alert", (data) => {
      toast.warning(`Low Stock Alert: ${data.name} is running low (${data.stock} units left!)`);
      
      // Refresh the list
      getlowstocks()
        .then((res) => setLowstocks(res.medicines || []))
        .catch(console.error);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  useEffect(() => {
    setLoading(true);
    getlowstocks()
      .then((res) => {
        setLowstocks(res.medicines || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching low stock:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#F8F9FA] p-6 md:p-10 font-sans text-slate-900 rounded-2xl border border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="hidden md:block">
          <br/>
          <br/>
          <br/>
        </div>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              Low Stock Alerts
            </h1>
            <p className="text-slate-500 mt-1">
              These products are running low on stock and need restocking.
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">
              {lowstocks.length} Items Low
            </span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Checking inventory...</p>
          </div>
        ) : lowstocks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              All Stocked Up!
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm">
              None of your products are currently low on stock. Great job
              maintaining inventory!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {lowstocks.map((med) => (
              <div
                key={med._id}
                className="bg-white rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
                    {med.images && med.images[0] ? (
                      <img
                        src={getImageUrl(med.images[0])}
                        alt={med.name}
                        className="w-full h-full object-contain p-1.5"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900 truncate">
                      {med.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 truncate">
                        {med.brand || "Generic"}
                      </span>
                      <span className="text-slate-300">â€¢</span>
                      <span className="text-xs text-slate-500">
                        {med.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                  <div className="text-right">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Stock
                    </p>
                    <div className="flex items-center gap-1.5 justify-end mt-0.5">
                      <span
                        className={`font-bold text-lg ${med.stock <= 3 ? "text-red-500" : "text-amber-500"}`}
                      >
                        {med.stock}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        units
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/seller/edit-medicine/${med._id}`}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 group"
                  >
                    Restock
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
