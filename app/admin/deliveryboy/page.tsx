"use client";
import AdminSidebar from "../adminnavbar/page";

import { useEffect, useState } from "react";
import {
  getAllDeliveryBoys,
  blockDeliveryBoy,
  unblockDeliveryBoy,
} from "@/app/apis/blockdeliveryboy";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiSearch } from "react-icons/fi";

type DeliveryBoy = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isBlocked: boolean;
};

export default function DeliveryBoyAdminPage() {
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);
      const res = await getAllDeliveryBoys();
      setDeliveryBoys(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load delivery boys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const handleBlockToggle = async (boy: DeliveryBoy) => {
    try {
      setActionId(boy._id);
      if (boy.isBlocked) {
        await unblockDeliveryBoy(boy._id);
      } else {
        await blockDeliveryBoy(boy._id);
      }
      
      setDeliveryBoys(prev => prev.map(b => 
        b._id === boy._id ? { ...b, isBlocked: !b.isBlocked } : b
      ));
    } catch (err) {
      alert("Operation failed");
    } finally {
      setActionId(null);
    }
  };

  const filteredBoys = deliveryBoys.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.email.toLowerCase().includes(search.toLowerCase())
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


    {/* 🔥 MAIN CONTENT */}
    {/* Full width on mobile, ml-64 to accommodate sidebar on md screens and up */}
    <div className="flex-1 w-full md:ml-64 p-4 sm:p-6 lg:p-10 transition-all duration-300">

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-gray-200">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Delivery Partners
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              Manage, monitor, and update partner access status.
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 pt-2">

          <AnimatePresence>
            {filteredBoys.map((boy) => (
              <motion.div
                key={boy._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-5 sm:p-6 flex flex-col"
              >

                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 text-gray-600 text-xl shadow-sm">
                    <FiUser />
                  </div>

                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full tracking-wide uppercase ${
                    boy.isBlocked
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-green-50 text-green-600 border border-green-100"
                  }`}>
                    {boy.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex-1 min-w-0"> {/* min-w-0 prevents flex children from overflowing */}
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {boy.name}
                  </h3>

                  <div className="mt-2 space-y-1.5">
                    <p className="text-sm text-gray-500 flex items-center gap-2.5 truncate" title={boy.email}>
                      <FiMail className="shrink-0 text-gray-400" size={15} /> 
                      <span className="truncate">{boy.email}</span>
                    </p>

                    {boy.phone && (
                      <p className="text-sm text-gray-500 flex items-center gap-2.5">
                        <FiPhone className="shrink-0 text-gray-400" size={15} /> 
                        {boy.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <button
                  onClick={() => handleBlockToggle(boy)}
                  disabled={actionId === boy._id}
                  className={`mt-6 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 ${
                    boy.isBlocked
                      ? "bg-gray-900 text-white hover:bg-gray-800 shadow-md"
                      : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  }`}
                >
                  {actionId === boy._id
                    ? "Processing..."
                    : boy.isBlocked
                    ? "Unblock Partner"
                    : "Block Access"}
                </button>

              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State Fallback (Optional but good UX) */}
          {filteredBoys.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white border border-dashed border-gray-300 rounded-2xl">
              <p>No delivery partners found.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  </div>
);
}