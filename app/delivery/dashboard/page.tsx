"use client";

import { useEffect, useState } from "react";
import { getDeliveryBoyDashboard, getAvailableOrders, acceptOrder, pickupOrder, deliverOrder, connectStripe } from "@/app/apis/deliveryboyapi";
import { useDeliveryBoy } from "@/app/hooks/Usedeliveryboy";
import { toast } from "react-toastify";
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
import dynamic from "next/dynamic";
import { io } from "socket.io-client";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), { ssr: false });

export default function DeliveryDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<any>(null);

  useDeliveryBoy();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDeliveryBoyDashboard();
      setData(res.data.deliveryBoy);
      
      // Initialize currentLocation with the registered location of the delivery boy
      if (res.data.deliveryBoy?.location?.lat && res.data.deliveryBoy?.location?.lng) {
        setCurrentLocation({
          lat: res.data.deliveryBoy.location.lat,
          lng: res.data.deliveryBoy.location.lng
        });
      }

      // If no active order, fetch available ones
      if (!res.data.deliveryBoy?.currentOrderId) {
        const availableRes = await getAvailableOrders();
        setAvailableOrders(availableRes.data.orders || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Socket initialization
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "https://newmedifinddeploy-env.eba-pp6njqrd.eu-north-1.elasticbeanstalk.com").replace('/api', '');
    const socket = io(baseUrl, { withCredentials: true });
    
    if (data?.currentOrderId?._id) {
      // join room specific to the order to broadcast location
      socket.emit("join_delivery_room", data.currentOrderId._id);
    }

    // Listen for new orders
    socket.on("new_order_available", (order) => {
      setNewOrderAlert(order);
      // Refresh available orders list
      if (!data?.currentOrderId) {
        fetchData();
      }
    });

    // Listen for accepted orders to remove them
    socket.on("order_assigned", ({ orderId }: { orderId: string }) => {
      setAvailableOrders((prev: any[]) => prev.filter((order: any) => order._id !== orderId));
      setNewOrderAlert((prev: any) => prev?.orderId === orderId ? null : prev);
    });

    let watchId: number;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const loc = { lat: latitude, lng: longitude };
          setCurrentLocation(loc);

          // Emit live tracking location
          if (data?.currentOrderId?._id) {
            socket.emit("update_delivery_location", {
              orderId: data.currentOrderId._id,
              location: loc
            });
          }
        },
        (error) => {
          console.warn(`Geolocation error (${error.code}): ${error.message}`);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      socket.disconnect();
    };
  }, [data?.currentOrderId?._id]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setAccepting(orderId);
      const res = await acceptOrder({ orderId });
      if (res.data.success) {
        toast.success("Order accepted successfully!");
        fetchData(); // Refresh dashboard to show active order
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to accept order");
    } finally {
      setAccepting(null);
    }
  };

  const handlePickup = async (orderId: string, sellerId?: string) => {
    try {
      const res = await pickupOrder({ orderId, sellerId });
      if (res.data.success) {
        toast.success(sellerId ? "Shop items marked as picked up!" : "Order marked as picked up!");
        fetchData(); // Refresh to update status and map
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to pickup order");
    }
  };

  const handleDeliver = async (orderId: string) => {
    try {
      const res = await deliverOrder({ orderId });
      if (res.data.success) {
        toast.success("Order marked as delivered!");
        fetchData(); // Refresh to clear active order
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to deliver order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
        <div className="w-6 h-6 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-500 text-sm font-medium">Loading dashboard...</p>
      </div>
    );
  }

  const groupedShops = data?.currentOrderId?.items 
    ? Object.values(
        data.currentOrderId.items.reduce((acc: any, item: any) => {
          const sellerId = item.sellerId?._id || item.sellerId;
          if (!sellerId) return acc;
          
          if (!acc[sellerId]) {
            acc[sellerId] = {
              sellerId,
              sellerShop: item.sellerShop,
              sellerInfo: item.sellerId,
              items: [],
              isPickedUp: true
            };
          }
          acc[sellerId].items.push(item);
          if (!item.isPickedUp) {
            acc[sellerId].isPickedUp = false;
          }
          return acc;
        }, {})
      )
    : [];

 return (
  <div>
    <DeliverySidebar />
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-emerald-100">
    
  

<div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
  
<header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60">
  <div className="max-w-7xl mx-auto pl-12 pr-4 sm:pl-14 sm:pr-6 lg:px-10 py-3 md:py-5 flex justify-between items-center">

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
          {data?.name || "Driver"}
        </p>
      </div>
    </div>

    {/* STATUS BADGE & STRIPE CONNECT */}
    <div className="flex-shrink-0 flex items-center gap-3">
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

<main className="p-4 md:p-6 lg:p-8 flex-1 max-w-5xl mx-auto w-full">
  {data?.currentOrderId ? (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Active Delivery</h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-emerald-900">Order #{data.currentOrderId._id?.slice(-6).toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
              {data.currentOrderId.orderStatus}
            </span>

            {data.currentOrderId.orderStatus === "picked_up" && (
              <button
                onClick={() => handleDeliver(data.currentOrderId._id)}
                className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-700 transition"
              >
                Mark Delivered
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Pickup and Dropoff Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200"></div>
            
            {/* Pickup Details (Sellers) */}
            <div className="relative pl-16 mb-8">
              <div className="absolute left-4 top-1 w-5 h-5 bg-white border-4 border-blue-500 rounded-full"></div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Pickup Locations (Pharmacies)</h3>
              
              <div className="space-y-4">
                {groupedShops.map((shop: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex justify-between items-start mb-3 gap-4">
                      <div>
                        <p className="font-bold text-slate-900 text-lg">
                          {shop.sellerShop?.shopName || shop.sellerInfo?.name || "Unknown Pharmacy"}
                        </p>
                        <p className="text-slate-600 text-sm flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {shop.sellerShop?.address || "Address not available"}
                        </p>
                        <p className="text-slate-600 text-sm flex items-center gap-1 mt-1">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {shop.sellerShop?.phone || shop.sellerInfo?.phone || "No phone"}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {shop.isPickedUp ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Picked Up
                          </span>
                        ) : (
                          <button
                            onClick={() => handlePickup(data.currentOrderId._id, shop.sellerId)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                          >
                            Mark Picked Up
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      {shop.items.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="bg-white rounded-lg p-3 border border-slate-200 flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800 text-sm">{item.medicineId?.name || "Medicine"}</p>
                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          {item.isPickedUp && (
                            <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Picked</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dropoff Details (Customer) */}
            <div className="relative pl-16">
              <div className="absolute left-4 top-1 w-5 h-5 bg-white border-4 border-emerald-500 rounded-full"></div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Dropoff Location (Customer)</h3>
              
              <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                <p className="font-bold text-slate-900 text-lg">{data.currentOrderId.deliveryDetailsId?.name || data.currentOrderId.userId?.name}</p>
                <p className="text-slate-700 text-sm flex items-start gap-2 mt-2 leading-relaxed">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {data.currentOrderId.deliveryDetailsId?.address}, {data.currentOrderId.deliveryDetailsId?.city}, {data.currentOrderId.deliveryDetailsId?.state} - {data.currentOrderId.deliveryDetailsId?.zip}
                  </span>
                </p>
                <p className="text-slate-700 text-sm flex items-center gap-2 mt-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  {data.currentOrderId.deliveryDetailsId?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Map and Route */}
          <div className="mt-8 border-t border-slate-100 pt-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Route Map
            </h3>
            <DeliveryMap 
              currentLocation={currentLocation} 
              pickupLocations={groupedShops
                .filter((shop: any) => !shop.isPickedUp)
                .map((shop: any) => ({
                  lat: shop.sellerShop?.location?.lat || shop.sellerInfo?.location?.coordinates?.[1] || 0,
                  lng: shop.sellerShop?.location?.lng || shop.sellerInfo?.location?.coordinates?.[0] || 0
                }))
                .filter((loc: any) => loc.lat !== 0)}
              dropoffLocation={data.currentOrderId.userId?.location?.coordinates ? {
                lat: data.currentOrderId.userId.location.coordinates[1],
                lng: data.currentOrderId.userId.location.coordinates[0]
              } : (data.currentOrderId.items?.[0]?.sellerShop?.location?.lat != null ? { 
                lat: data.currentOrderId.items[0].sellerShop.location.lat + 0.01, 
                lng: data.currentOrderId.items[0].sellerShop.location.lng + 0.01 
              } : null)}
              orderStatus={data.currentOrderId.orderStatus}
            />
          </div>

        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Available Orders</h2>
      {availableOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {availableOrders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="font-semibold text-slate-900">Order #{order._id?.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-slate-500">{order.items?.length || 0} items • ₹{order.totalAmount}</p>
                </div>
                <button
                  onClick={() => handleAcceptOrder(order._id)}
                  disabled={accepting === order._id}
                  className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {accepting === order._id ? "Accepting..." : "Accept Order"}
                </button>
              </div>

              <div className="mb-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Order Items</h4>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-100">
                      <div className="w-8 h-8 bg-emerald-50 rounded-md flex items-center justify-center">
                        <Package className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">{item.medicineId?.name || "Medicine"}</p>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Pickup From</h4>
                  <div className="space-y-4">
                    {Object.values(
                      order.items?.reduce((acc: any, item: any) => {
                        const sellerId = item.sellerId?._id || item.sellerId;
                        if (sellerId && !acc[sellerId]) {
                          acc[sellerId] = item.sellerShop;
                        }
                        return acc;
                      }, {}) || {}
                    ).map((shop: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{shop?.shopName || "Pharmacy"}</p>
                          <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{shop?.address || "Location unavailable"}</p>
                          {shop?.phone && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <Phone className="w-3 h-3" /> {shop.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Dropoff At</h4>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{order.deliveryDetailsId?.name || "Customer"}</p>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        {order.deliveryDetailsId?.address}, {order.deliveryDetailsId?.city}, {order.deliveryDetailsId?.state} - {order.deliveryDetailsId?.zip}
                      </p>
                      {order.deliveryDetailsId?.phone && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" /> {order.deliveryDetailsId.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Bike className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Orders Available</h3>
          <p className="text-slate-500 mt-2 max-w-md">There are no orders ready for pickup right now. Stay online and check back shortly.</p>
        </div>
      )}
    </div>
  )}
</main>
</div>

{/* New Order Modal Notification */}
{newOrderAlert && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-emerald-100 transform transition-all">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 text-emerald-600 animate-bounce" />
      </div>
      <h3 className="text-xl font-black text-center text-slate-900 mb-2">New Delivery Request!</h3>
      <p className="text-center text-slate-500 mb-6 text-sm font-medium">
        A new order #{newOrderAlert.orderId?.slice(-6).toUpperCase()} is ready for pickup.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => setNewOrderAlert(null)}
          className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
        >
          Dismiss
        </button>
        <button
          onClick={() => {
            setNewOrderAlert(null);
            handleAcceptOrder(newOrderAlert.orderId);
          }}
          className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200"
        >
          Accept Order
        </button>
      </div>
    </div>
  </div>
)}

  </div>
  </div>
);
}