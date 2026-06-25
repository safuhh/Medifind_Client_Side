"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSeller } from "@/hooks/useSeller";
import { getMostSellingProducts } from "@/services/apis/mostsellingproduct.api";
import SellerNavbar from "@/app/seller/SellerBar/page";
import { getImageUrl } from "@/utils/imageUrl";
import {
  TrendingUp,
  Award,
  DollarSign,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Trophy,
} from "lucide-react";

interface MostSellingProduct {
  productId: string;
  productName: string;
  image?: string;
  totalQuantity: number;
  totalSales: number;
}

export default function MostSellingProductsPage({ isDashboard = false }: { isDashboard?: boolean }) {
  useSeller();
  const { user } = useSelector((state: any) => state.auth);
  const [products, setProducts] = useState<MostSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"all" | "weekly" | "monthly" | "yearly">("all");

  useEffect(() => {
    if (!user?._id) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMostSellingProducts(user._id, timeRange);
        if (response && response.success) {
          setProducts(response.data || []);
        } else {
          setError("Failed to retrieve products data.");
        }
      } catch (err: any) {
        console.error("Error fetching most selling products:", err);
        setError(err || "Failed to fetch most selling products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user?._id, timeRange]);

  // Calculate totals
  const totalSalesVolume = products.reduce((sum, p) => sum + p.totalQuantity, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.totalSales, 0);
  const topProduct = products.length > 0 ? products[0] : null;

  const content = (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase text-emerald-700">
                Analytics
              </span>
            </div>
            <span className="text-xs text-slate-400">Real-time performance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Most Selling <span className="text-[#115E3D]">Products</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
            {(["all", "weekly", "monthly", "yearly"] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize select-none cursor-pointer ${
                  timeRange === range
                    ? "bg-[#115E3D] text-white shadow-sm shadow-[#115E3D]/20"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {range === "all" ? "All Time" : range}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-xs font-medium text-slate-600">
            <span>
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Error Loading Data</h3>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Analyzing sales data...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-slate-950 mb-2">No sales recorded yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">
            Once your products are ordered and paid for, you will see your top performing items listed here.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Total Revenue */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</span>
                <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-[#115E3D]">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-500 mt-1">From best-selling items</p>
            </div>

            {/* Card 2: Total Units Sold */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Units Sold</span>
                <div className="p-2.5 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{totalSalesVolume}</h2>
              <p className="text-xs text-slate-500 mt-1">Cumulative item quantity</p>
            </div>

            {/* Card 3: Top Performer */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Product</span>
                <div className="p-2.5 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 truncate" title={topProduct?.productName || ""}>
                {topProduct?.productName || "N/A"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {topProduct ? `${topProduct.totalQuantity} units sold` : "No sales data"}
              </p>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Products Ranking</h2>
                <p className="text-xs text-slate-500 mt-0.5">Ranked by total quantity sold</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 text-[11px] font-semibold text-slate-500">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Best Sellers</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6 text-center w-20">Rank</th>
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6 text-right">Units Sold</th>
                    <th className="py-4 px-6 text-right">Revenue</th>
                    <th className="py-4 px-6">Share of Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {products.map((product, index) => {
                    const rank = index + 1;
                    const share = totalRevenue > 0 ? (product.totalSales / totalRevenue) * 100 : 0;

                    return (
                      <tr key={product.productId} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center items-center">
                            {rank === 1 ? (
                              <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-sm shadow-sm" title="First Place">
                                🥇
                              </div>
                            ) : rank === 2 ? (
                              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-600 flex items-center justify-center font-bold text-sm shadow-sm" title="Second Place">
                                🥈
                              </div>
                            ) : rank === 3 ? (
                              <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center font-bold text-sm shadow-sm" title="Third Place">
                                🥉
                              </div>
                            ) : (
                              <span className="text-slate-400 font-semibold text-sm">#{rank}</span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-150">
                              {product.image ? (
                                <img
                                  src={getImageUrl(product.image)}
                                  alt={product.productName}
                                  className="w-full h-full object-contain p-1.5"
                                />
                              ) : (
                                <ShoppingBag className="w-5 h-5 text-slate-300" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 max-w-xs sm:max-w-sm truncate" title={product.productName}>
                                {product.productName}
                              </h3>
                              <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200/60 rounded px-1.5 py-0.5 font-mono select-all">
                                {product.productId}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right font-semibold text-slate-900">
                          {product.totalQuantity.toLocaleString()}
                        </td>

                        <td className="py-4 px-6 text-right font-bold text-emerald-700">
                          ₹{product.totalSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>

                        <td className="py-4 px-6 min-w-48">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/20">
                              <div
                                className="bg-[#115E3D] h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${share}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-500 w-10 text-right">
                              {share.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isDashboard) {
    return <div className="mt-12">{content}</div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex">
      <SellerNavbar />

      <div className="flex-1 w-full md:ml-72">
        <div className="h-16 md:hidden" />

        <div className="p-4 sm:p-6 md:p-10">
          {content}
        </div>
      </div>
    </div>
  );
}