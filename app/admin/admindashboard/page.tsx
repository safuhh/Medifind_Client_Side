"use client";

import AdminSidebar from "../adminnavbar/page";
import { useAdmin } from "../../hooks/useAdmin";
import AdminCommissionsPage from "../commissions/page";
export default function AdminDashboard() {
  useAdmin();

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex">
      
      <AdminSidebar />
      
      <main className="flex-1 md:ml-72 p-4 sm:p-6 md:p-12 pt-24 md:pt-12">
        <div className="w-full max-w-6xl">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm mb-10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#105e3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 14v1"/><path d="M9 19v2"/><path d="M9 3v2"/><path d="M9 9v1"/><path d="M15 14v1"/><path d="M15 19v2"/><path d="M15 3v2"/><path d="M15 9v1"/></svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-sm md:text-base text-slate-500 font-medium ml-14">
                Welcome back! Here's what's happening on your platform today.
              </p>
            </div>
            
          </header>
          <AdminCommissionsPage standalone={false} />
        </div>
      </main>

    </div>
  );
}