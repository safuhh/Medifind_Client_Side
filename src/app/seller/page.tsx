"use client";
import LowStock from "./lowstock/page";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/redux/authSlice"
import SellerEarnings from "./Earnings/page"
import { useSeller } from "@/hooks/useSeller";
import { getSellerDashboard } from "@/services/apis/seller.api";
import { fetchCurrentUser } from "@/services/apis/fetchapi";
import SellerNavbar from "../seller/SellerBar/page";
import { Card, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function SellerDashboard() {
  useSeller();

  const dispatch = useDispatch();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await fetchCurrentUser();
        dispatch(setUser(userRes.data.user));

        const sellerRes = await getSellerDashboard();
        setData(sellerRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-surface font-sans flex">
      <SellerNavbar />

      <div className="flex-1 w-full md:ml-72">
        <div className="h-16 md:hidden" />

        <div className="p-4 sm:p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="success">Live</Badge>
                  <span className="text-xs font-semibold text-ink-faint">System operational</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                  Seller <span className="text-primary">Dashboard</span>
                </h1>
              </div>

              <div className="hidden sm:block px-4 py-2 bg-white border border-border rounded-sm text-xs font-semibold text-ink-muted shadow-sm">
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Orders Received" value={data?.ordersCount || 14} trend={{ value: "15%", direction: "up" }} />
              <StatCard label="Live Inventory Items" value={data?.medicineCount || 28} />
              <StatCard label="Low-Stock Alerts" value={data?.lowStockCount || 3} className={data?.lowStockCount > 0 ? "border-warning/30" : ""} />
              <StatCard label="Wallet Earnings" value={`$${data?.earnings || "840.00"}`} trend={{ value: "4.2%", direction: "up" }} />
            </div>

            {/* Render LowStock & Earnings */}
            <div className="space-y-8">
              <SellerEarnings isDashboard={true} />
              <LowStock />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

