"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/redux/authSlice";

import { useSeller } from "../hooks/useSeller";
import { getSellerDashboard } from "../apis/seller.api";
import { fetchCurrentUser } from "../apis/fetchapi";

import SellerNavbar from "../seller/SellerBar/page";
import {
  FiList,
  FiCheck,
  FiPlus,
  FiTrash2,
  FiAlertCircle,
} from "react-icons/fi";

export default function SellerDashboard() {
  useSeller();

  const dispatch = useDispatch();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // 🔥 STEP 1: sync current user
        const userRes = await fetchCurrentUser();
        dispatch(setUser(userRes.data.user));

        // 🔥 STEP 2: fetch seller dashboard info
        const sellerRes = await getSellerDashboard();
        setData(sellerRes.data);

      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex">
      <SellerNavbar />

      <div className="flex-1 w-full md:ml-72">
        <div className="h-16 md:hidden" />

        <div className="p-4 sm:p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase text-emerald-700">
                      Live
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">System running</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                  Seller{" "}
                  <span className="text-[#115E3D] font-sans">Dashboard</span>
                </h1>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] text-sm font-medium text-slate-600">
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </header>

            {/* Dashboard Content Removed as per User Request */}
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <FiList size={40} className="text-slate-200" />
               </div>
               <p className="font-medium">Dashboard summary is currently hidden</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
