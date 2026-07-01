"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/redux/hooks";
import { useRouter } from "next/navigation";
import NavbarPage from "../navbar/page";
import Footer from "../footer/page";
import api from "@/services/apis/api";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/utils/imageUrl";
import { CheckCircle2, Clock, Package, MapPin, X, ChevronRight } from "lucide-react";
import { io } from "socket.io-client";

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed & Packed", icon: Package },
  { key: "picked_up", label: "Out for Delivery", icon: MapPin },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 }
];

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders");
      if (res.data.success) {
        const fetchedOrders = res.data.orders;
        setOrders(fetchedOrders);
        
        // Live update the tracking modal if it's open
        setTrackingOrder((prev: any) => {
          if (prev) {
            const updated = fetchedOrders.find((o: any) => o._id === prev._id);
            return updated || prev;
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?._id, router]);

  // Socket.io for live order status updates
  useEffect(() => {
    if (!user?._id) return;
    
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://medifindapiii.duckdns.org/api").replace('/api', '');
    const socket = io(baseUrl, { 
      withCredentials: true 
    });
    
    socket.emit("join_user_room", user._id);
    
    socket.on("connect", () => console.log("Socket connected to user room!", socket.id));
    socket.on("connect_error", (err) => console.error("Socket connect error:", err));

    socket.on("order_status_update", (data) => {
      console.log("Live status update received via Socket:", data);
      fetchOrders(); // Refresh orders seamlessly
    });
    
    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (trackingOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [trackingOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <NavbarPage />
      <div className="flex-1 mt-28 max-w-4xl mx-auto w-full px-4 sm:px-6 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Order History</h1>
        </div>
        
        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-100">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-slate-800 mb-2">No Orders Found</h2>
            <p className="text-sm text-slate-500 mb-6">Looks like you haven't made a purchase yet.</p>
            <button
              onClick={() => router.push("/medicines")}
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Browse Medicines
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const currentStatusIndex = STATUS_STEPS.findIndex(s => s.key === order.orderStatus);
              const currentStatus = STATUS_STEPS[currentStatusIndex];

              return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Minimal Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-white">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-sm font-semibold text-slate-900">₹{order.totalAmount}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {/* Current Status Badge */}
                      <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                        order.orderStatus === "delivered" ? "bg-emerald-100 text-emerald-700" :
                        order.orderStatus === "picked_up" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {currentStatus?.label}
                      </span>
                      {/* Track Order Button */}
                      <button 
                        onClick={() => setTrackingOrder(order)}
                        className="text-[11px] px-3 py-1.5 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1"
                      >
                        Track Order <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compact Items List */}
                <div className="px-5 py-3 bg-slate-50/50">
                  <div className="flex flex-col gap-3">
                    {order.items.map((item: any) => (
                      <div key={item._id} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 border border-slate-200 shrink-0">
                          {item.medicineId?.images?.[0] ? (
                            <img
                              src={getImageUrl(item.medicineId.images[0])}
                              alt={item.medicineId?.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{item.medicineId?.name || "Unknown Medicine"}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
        )}
      </div>

      {/* Tracking Modal (Maintains its sleek design) */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Track Delivery</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Order #{trackingOrder._id.slice(-8).toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setTrackingOrder(null)} 
                  className="p-2 hover:bg-slate-100 text-slate-500 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto">
                {(() => {
                  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.key === trackingOrder.orderStatus);
                  const history = trackingOrder.statusHistory || [];
                  const progressPercentage = (currentStatusIndex / (STATUS_STEPS.length - 1)) * 100;

                  return (
                    <div className="relative pl-3">
                      {/* Vertical Base Line */}
                      <div className="absolute left-[31px] top-[24px] bottom-[24px] w-0.5 bg-slate-100 rounded-full"></div>
                      
                      {/* Vertical Active Line */}
                      <div 
                        className="absolute left-[31px] top-[24px] w-0.5 bg-emerald-500 transition-all duration-1000 ease-out rounded-full"
                        style={{ height: `calc(${progressPercentage}% - 48px)` }}
                      ></div>

                      <div className="space-y-8 relative z-10">
                        {STATUS_STEPS.map((step, idx) => {
                          const isCompleted = idx <= currentStatusIndex;
                          const isActive = idx === currentStatusIndex;
                          const historyItem = history.find((h: any) => h.status === step.key);
                          const timestamp = historyItem?.timestamp ? new Date(historyItem.timestamp) : (idx === 0 ? new Date(trackingOrder.createdAt) : null);
                          const StepIcon = step.icon;

                          return (
                            <div key={step.key} className="flex items-start gap-5">
                              <div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 bg-white transition-all duration-500 ${
                                  isCompleted ? 'border-emerald-500 text-emerald-500' : 'border-slate-200 text-slate-300'
                                } ${isActive ? 'ring-4 ring-emerald-50 bg-emerald-50' : ''}`}
                              >
                                <StepIcon className={`w-4 h-4 ${isCompleted ? 'text-emerald-500' : 'text-slate-300'}`} />
                              </div>
                              <div className="flex flex-col pt-2">
                                <p className={`font-medium text-sm ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                                  {step.label}
                                </p>
                                {timestamp && isCompleted ? (
                                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 opacity-70" />
                                    {timestamp.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                ) : (
                                  <p className="text-xs text-slate-400 mt-1">Pending...</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default OrdersPage;
