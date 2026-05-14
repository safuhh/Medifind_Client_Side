"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Search,
  ChevronRight,
  MapPin,
  Phone,
  User,
  Calendar,
  IndianRupee,
  ShoppingBag,
} from "lucide-react";
import SellerBar from "../SellerBar/page";
import api from "../../apis/api";
import dayjs from "dayjs";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/seller-orders");
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch seller orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some((item: any) =>
        item.medicineId?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-amber-200 text-amber-700 bg-amber-50";
      case "confirmed":
        return "border-sky-200 text-sky-700 bg-sky-50";
      case "picked_up":
        return "border-purple-200 text-purple-700 bg-purple-50";
      case "delivered":
        return "border-emerald-200 text-emerald-700 bg-emerald-50";
      default:
        return "border-slate-200 text-slate-700 bg-slate-50";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex h-screen bg-white">
      <SellerBar />

      <main className="flex-1 overflow-y-auto md:ml-72 transition-all duration-300">
        <div className="p-8 max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Orders Received
              </h1>
              <p className="text-slate-500 mt-1">
                Manage and track orders for your products
              </p>
            </div>

            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center p-12 h-64">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                  Loading orders...
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center h-64 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  No Orders Found
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  You haven't received any orders yet or none match your search.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order: any) => (
                  <div
                    key={order._id}
                    className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Order Identity & Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                          </span>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}
                          >
                            {order.orderStatus.replace("_", " ")}
                          </span>
                          <span className="text-sm text-slate-500 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {dayjs(order.createdAt).format("MMM D, YYYY h:mm A")}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Customer Info */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Customer Details
                            </h4>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-slate-700">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="font-medium">
                                  {order.deliveryDetails?.name || order.user?.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-700">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span>{order.deliveryDetails?.phone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Info */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Delivery Address
                            </h4>
                            <div className="flex items-start gap-2 text-sm text-slate-700">
                              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                              <span className="leading-relaxed">
                                {order.deliveryDetails?.address}, {order.deliveryDetails?.city}, {order.deliveryDetails?.state} - {order.deliveryDetails?.zip}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items & Total */}
                      <div className="w-full lg:w-96 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <ShoppingBag className="w-4 h-4" />
                            Products Ordered
                          </h4>
                          <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {order.items.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-100"
                              >
                                <div className="w-12 h-12 rounded-md border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden bg-slate-50">
                                  {item.medicineId?.images?.[0] ? (
                                    <img
                                      src={item.medicineId.images[0].startsWith('http') ? item.medicineId.images[0] : `http://localhost:5000/${item.medicineId.images[0].replace(/\\/g, '/').replace(/^\//, '')}`}
                                      alt={item.medicineId.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Package className="w-5 h-5 text-slate-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-800 truncate">
                                    {item.medicineId?.name || "Unknown Product"}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    Qty: {item.quantity} × {formatCurrency(item.price)}
                                  </p>
                                </div>
                                <div className="text-sm font-semibold text-emerald-600">
                                  {formatCurrency(item.price * item.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                            Your Earnings
                          </span>
                          <span className="text-2xl font-bold text-slate-900">
                            {formatCurrency(order.sellerTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
