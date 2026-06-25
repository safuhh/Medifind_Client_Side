"use client";
import AdminSidebar from "../adminnavbar/page";
import { useEffect, useState } from "react";
import {
  getDeliveryBoyRequests,
  approveDeliveryBoy,
  rejectDeliveryBoy,
} from "@/services/apis/deliveryadmin";
import { 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Truck, 
  Phone, 
  User, 
  Loader2,
  Inbox
} from "lucide-react";

export default function DeliveryRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await getDeliveryBoyRequests();
      setRequests(res.data);
    } catch (err: any) {
      console.error("ERROR DETAILS:", err.response?.data || err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to load requests";
      const currentRole = err.response?.data?.currentRole;
      alert(`${errorMsg}${currentRole ? ` (Current Role: ${currentRole})` : ""}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(`approve-${id}`);
      await approveDeliveryBoy(id);
      loadRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(`reject-${id}`);
      await rejectDeliveryBoy(id);
      loadRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setActionLoading(null);
    }
  };

return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Assuming AdminSidebar has its own responsive classes (e.g., hidden lg:block or a mobile drawer) */}
      <AdminSidebar />

      {/* Adjusted margin and padding for mobile-first responsiveness */}
      <main className="flex-1 md:ml-72 p-4 sm:p-6 lg:p-8 pt-24 md:pt-8 transition-all duration-300 w-full overflow-hidden">
        <div className="w-full max-w-6xl">
          
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Delivery Requests
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">
              Manage and review onboarding requests from delivery personnel.
            </p>
          </div>

          {/* Premium Skeleton Loading State */}
          {loading && (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mb-4">
                    <div className="h-6 bg-slate-200 rounded w-1/2 sm:w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-2/3 sm:w-1/2"></div>
                    <div className="h-4 bg-slate-200 rounded w-full sm:w-3/4"></div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <div className="h-10 bg-slate-200 rounded-xl flex-1"></div>
                    <div className="h-10 bg-slate-200 rounded-xl flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Premium Empty State */}
          {!loading && requests.length === 0 && (
            <div className="bg-white rounded-3xl p-8 sm:p-16 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Inbox className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">No pending requests</h3>
              <p className="text-sm sm:text-base text-slate-500 max-w-sm">
                You're all caught up! New delivery boy registration requests will appear here.
              </p>
            </div>
          )}

          {/* Requests Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {requests.map((req) => (
              <div 
                key={req._id} 
                className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
              >
                {/* Changed to flex-col on mobile, flex-row on larger screens */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-500 shrink-0" />
                      <span className="truncate">{req.name}</span>
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mt-1 flex items-center gap-2 font-medium">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      {req.phone}
                    </p>
                  </div>

                  {/* Enhanced Status Badge */}
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 self-start sm:self-auto ${
                    req.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    req.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                    'bg-rose-100 text-rose-700 border border-rose-200'
                  }`}>
                    {req.status === 'pending' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
                    {req.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 sm:p-4 space-y-3 mb-5 sm:mb-6 flex-grow border border-slate-100">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{req.vehicleType}</p>
                      <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider break-all">{req.vehicleNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {req.location?.fullAddress || "Address not provided"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {req.status === "pending" && (
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 mt-auto">
                    <button
                      disabled={!!actionLoading}
                      onClick={() => handleApprove(req._id)}
                      className={`flex-1 flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm sm:text-base ${
                        actionLoading === `approve-${req._id}` 
                          ? 'bg-emerald-100 text-emerald-500 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow focus:ring-4 focus:ring-emerald-100'
                      }`}
                    >
                      {actionLoading === `approve-${req._id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      ) : (
                        <CheckCircle className="w-4 h-4 shrink-0" />
                      )}
                      Approve
                    </button>
                    
                    <button
                      disabled={!!actionLoading}
                      onClick={() => handleReject(req._id)}
                      className={`flex-1 flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm sm:text-base ${
                        actionLoading === `reject-${req._id}`
                          ? 'bg-rose-100 text-rose-500 cursor-not-allowed'
                          : 'bg-white hover:bg-rose-50 text-rose-600 border-2 border-rose-100 hover:border-rose-200 focus:ring-4 focus:ring-rose-50'
                      }`}
                    >
                      {actionLoading === `reject-${req._id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0" />
                      )}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}