"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { useRouter } from "next/navigation";
import NavbarPage from "../navbar/page";
import Footer from "../footer/page";
import api from "../apis/api";
import { motion } from "framer-motion";
import { getImageUrl } from "../utils/imageUrl";
const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {


    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?._id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0a4d33]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarPage />
      <div className="flex-1 mt-24 max-w-5xl mx-auto w-full px-4 sm:px-6 mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <p className="text-gray-500 mb-4">You have not placed any orders yet.</p>
            <button
              onClick={() => router.push("/medicines")}
              className="px-6 py-2 bg-[#0a4d33] text-white rounded-lg hover:bg-[#083d28] transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const itemsTotal = order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
              const deliveryCharge = order.totalAmount - itemsTotal;

              return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order._id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex flex-wrap justify-between items-center mb-4 pb-4 border-b border-gray-100 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-900">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Paid</p>
                    <p className="font-semibold text-emerald-600">₹{order.totalAmount}</p>
                    {deliveryCharge > 0 && (
                      <p className="text-[10px] text-slate-500 mt-0.5">(Includes ₹{deliveryCharge} Delivery)</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize mt-1 ${
                        order.orderStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.orderStatus === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.orderStatus === "delivered"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item._id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-100">
                        {item.medicineId?.images?.[0] ? (
                          <img
                            src={getImageUrl(item.medicineId.images[0])}
                            alt={item.medicineId?.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No Image</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.medicineId?.name || "Unknown Medicine"}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{item.price}</p>
                        <p className="text-[10px] text-emerald-600 font-medium">Incl. GST</p>
                      </div>
                    </div>
                  ))}
                </div>


              </motion.div>
            )})}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;
