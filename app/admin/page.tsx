"use client";

import AdminSidebar from "./adminnavbar/page";
import { useEffect, useState } from "react";
import { useAdmin } from "../hooks/useAdmin";
import {fetchCurrentUser} from "../apis/fetchapi"
import {
  getSellerRequests,
  approveSeller,
  rejectSeller,
} from "../apis/admin.api";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/authSlice";

export default function AdminPage() {
  useAdmin();

  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: any) => state.auth);

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await getSellerRequests();
      setRequests(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);
const handleApprove = async (id: string) => {
  try {
    await approveSeller(id);

    const userRes = await fetchCurrentUser();

    dispatch(
      setCredentials({
        user: userRes.data.user,
        accessToken, // or refreshed token if needed
      }),
    );

    toast.success("Seller approved");
    loadRequests();
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Approval failed");
  }
};

  const handleReject = async (id: string) => {
    try {
      await rejectSeller(id);
      toast.success("Seller rejected ");
      loadRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Rejection failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-900 selection:bg-indigo-100 flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-72 p-4 sm:p-6 md:p-12 pt-24 md:pt-12">
        <div className="w-full max-w-5xl space-y-8">
      
      {/* Header Section */}
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Seller <span className="text-[#115E3D]">Requests</span>
        </h1>
        <p className="text-slate-500 font-medium">
          Review and curate the marketplace community.
        </p>
      </header>

      {/* Main Container (The Single Card) */}
      <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
        
        {/* Status Filter / Tab Bar (Visual Only) */}
        <div className="px-8 pt-6 flex gap-6 border-b border-slate-100">
          <button className="pb-4 text-sm font-semibold border-b-2 border-black">
            All Requests  
          </button>
        </div>

        <div>
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-400">
                Refining requests...
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm font-medium text-slate-400">
                Everything is up to date.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="group p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors duration-300"
                >
                  
                  {/* Shop Info Block (Flattened - No nested card styles) */}
                  <div className="flex-1 space-y-4">
                    
                    {/* TOP ROW */}
                    <div className="flex items-start justify-between gap-3 md:justify-start md:gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                          {req.shopName}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                          {req.address}
                        </p>
                      </div>

                      {/* STATUS BADGE */}
                      <span
                        className={`mt-1 shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full border ${
                          req.status === "approved"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : req.status === "rejected"
                            ? "bg-rose-50 text-rose-600 border-rose-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* LOCATION BLOCK */}
                    {(req.location?.address || req.location?.fullAddress) && (
                      <div className="flex items-start gap-3 bg-slate-50/50 border border-slate-100 p-3 rounded-xl w-fit pr-6">
                        <div className="text-slate-400 mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="text-sm">
                          {req.location?.address && (
                            <p className="text-slate-700 font-medium">
                              {req.location.address}
                            </p>
                          )}
                          {req.location?.fullAddress && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {req.location.fullAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* META INFO (Phone & License) */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.7 2.8a2 2 0 01-.45 1.88l-1.27 1.27a16 16 0 006.586 6.586l1.27-1.27a2 2 0 011.88-.45l2.8.7A2 2 0 0119 16.72V19a2 2 0 01-2 2h-1C7.163 21 3 16.837 3 11V5z"/>
                        </svg>
                        <span>{req.phone}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z"/>
                        </svg>
                        <span className="font-mono text-xs tracking-wide">
                          {req.licenseNumber}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Actions Section */}
                  {req.status === "pending" && (
                    <div className="flex items-center md:flex-col lg:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0">
                      
                      {/* DECLINE */}
                      <button
                        onClick={() => handleReject(req._id)}
                        className="group flex-1 md:flex-none inline-flex justify-center items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Decline
                      </button>

                      {/* APPROVE */}
                      <button
                        onClick={() => handleApprove(req._id)}
                        className="group flex-1 md:flex-none inline-flex justify-center items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#115E3D] hover:bg-[#0c472f] shadow-md shadow-[#115E3D]/20 hover:shadow-none active:scale-[0.97] rounded-xl transition-all duration-200"
                      >
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>

                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-center text-xs text-slate-400 font-medium">
        Secure Admin Panel &bull; {new Date().getFullYear()}
      </p>
      </div>
    </main>
  </div>
);
}
