"use client";
import AdminSidebar from "../adminnavbar/page";

import { useEffect, useState } from "react";
import {
  blockSeller,
  unblockSeller,
  getAllSellers,
} from "@/app/apis/blockseller";
import { FiSearch } from "react-icons/fi";

type Seller = {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
};

export default function SellerAdminPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await getAllSellers();
      const sellersList = res.data.data;
      setSellers(Array.isArray(sellersList) ? sellersList : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleBlock = async (id: string) => {
    try {
      setActionId(id);
      await blockSeller(id);
      setSellers((prev) => prev.map((s) => (s._id === id ? { ...s, isBlocked: true } : s)));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error blocking seller");
    } finally {
      setActionId(null);
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      setActionId(id);
      await unblockSeller(id);
      setSellers((prev) => prev.map((s) => (s._id === id ? { ...s, isBlocked: false } : s)));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error unblocking seller");
    } finally {
      setActionId(null);
    }
  };

  const filteredSellers = sellers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
  <div className="flex min-h-screen bg-slate-50 text-gray-900 font-sans relative">
    <AdminSidebar />
    <div className="flex-1 w-full md:ml-64 p-4 sm:p-6 lg:p-10 transition-all duration-300">
      
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-gray-200">
          <div className="space-y-1">
            <br/>
            <br/>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Seller Management
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Control system access and monitor medicine sellers.
            </p>
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 md:py-2.5 border border-gray-300 rounded-xl text-sm transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none bg-white"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          
         {/* Table & Mobile Card Section */}
<div className="bg-transparent md:bg-white md:border border-gray-200 md:rounded-2xl md:shadow-sm w-full">
  
  <table className="w-full text-left border-collapse block md:table">
    
    {/* 🖥️ Desktop Header (Hidden on Mobile) */}
    <thead className="hidden md:table-header-group">
      <tr className="bg-gray-50/50 border-b border-gray-200">
        <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          Seller Details
        </th>
        <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
          Actions
        </th>
      </tr>
    </thead>

    {/* 📱 Body: Renders as stacked cards on mobile, normal rows on desktop */}
    <tbody className="block md:table-row-group space-y-4 md:space-y-0 md:divide-y md:divide-gray-100">
      {filteredSellers.map((seller) => (
        <tr 
          key={seller._id} 
          className="relative block md:table-row bg-white border border-gray-200 md:border-none rounded-2xl md:rounded-none p-5 md:p-0 shadow-sm md:shadow-none hover:bg-gray-50/50 transition-colors"
        >
          
          {/* 1. Details Column */}
          <td className="block md:table-cell md:px-5 md:py-4">
            {/* Added pr-24 on mobile so text doesn't overlap the absolute status badge */}
            <div className="flex flex-col pr-24 md:pr-0">
              <span className="font-bold text-gray-900 text-lg md:text-base">
                {seller.name}
              </span>
              <span className="text-sm text-gray-500 truncate" title={seller.email}>
                {seller.email}
              </span>
            </div>
          </td>

          {/* 2. Status Badge Column */}
          {/* On mobile, this badge is pinned to the top right of the card. On desktop, it centers in the table cell */}
          <td className="absolute top-5 right-5 md:static block md:table-cell md:px-5 md:py-4">
            <span
              className={`inline-flex items-center px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full ${
                seller.isBlocked
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-green-50 text-green-600 border border-green-100"
              }`}
            >
              {seller.isBlocked ? "Blocked" : "Active"}
            </span>
          </td>

          {/* 3. Actions Column */}
          {/* On mobile, adds a top border and pushes the button full width. On desktop, removes the border and aligns right */}
          <td className="block md:table-cell mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-100 md:border-none md:px-5 md:py-4 md:text-right">
            <button
              onClick={() =>
                seller.isBlocked
                  ? handleUnblock(seller._id)
                  : handleBlock(seller._id)
              }
              className={`w-full md:w-auto px-4 py-2.5 md:py-2 text-sm font-semibold rounded-xl transition-all active:scale-95 ${
                seller.isBlocked
                  ? "bg-gray-900 text-white hover:bg-gray-800 shadow-md"
                  : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
              }`}
            >
              {seller.isBlocked ? "Unblock" : "Block"}
            </button>
          </td>
          
        </tr>
      ))}
    </tbody>
  </table>

  {/* Empty State */}
  {filteredSellers.length === 0 && (
    <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-200 md:border-none">
      <span className="text-lg font-medium text-gray-900 mb-1">No sellers found</span>
      <p className="text-sm">Try adjusting your search criteria.</p>
    </div>
  )}

</div>

          {/* Empty State UI */}
          {filteredSellers.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
              <span className="text-lg font-medium text-gray-900 mb-1">No sellers found</span>
              <p className="text-sm">Try adjusting your search criteria.</p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  </div>
);
}