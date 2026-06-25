"use client";

import { useEffect, useState } from "react";
import { getMedicines, deleteMedicine } from "@/services/apis/medicineapi";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiBox } from "react-icons/fi";
import Link from "next/link";
import SellerNavbar from "@/app/seller/SellerBar/page";
import { getImageUrl } from "@/utils/imageUrl";

export default function ManageMedicinesPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async (query = "") => {
    try {
      setLoading(true);
      const res = await getMedicines("", query);
      setMedicines(res.data.medicines || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMedicines(search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await deleteMedicine(id);
      fetchMedicines(search);
    } catch (err) {
      alert("Delete failed");
    }
  };



  return (
    <div className="min-h-screen bg-white flex">
      <SellerNavbar />
      
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="h-16 md:hidden" />
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="hidden md:block">
          
   
          </div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Medicines</h1>
              <p className="text-gray-500 mt-2">Manage and track your pharmaceutical products</p>
            </div>
            
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-72">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search medicines..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none w-full transition-all text-gray-900"
                  />
                </div>
                <Link href="/seller/add-medicine" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm shadow-emerald-600/10">
                  <FiPlus />
                  Add Medicine
                </Link>
              </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 border-4 border-gray-100 border-t-emerald-600 rounded-full animate-spin" />
            </div>
          ) : medicines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <FiBox className="text-4xl text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No medicines found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or add a new product</p>
              <Link href="/seller/add-medicine" className="mt-6 text-emerald-600 font-medium hover:underline">
                Add your first medicine →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {medicines.map((med) => (
                  <motion.div
                    key={med._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col"
                  >
                    <div className="relative h-48 bg-gray-50 overflow-hidden">
                      {med.images?.[0] ? (
                        <img
                          src={getImageUrl(med.images[0])}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          alt={med.name}
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-gray-300">
                          <FiBox size={32} />
                        </div>
                      )}
                      
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Link 
                          href={`/seller/edit-medicine/${med._id}`}
                          className="bg-white text-emerald-600 p-2 rounded-lg shadow-sm hover:bg-emerald-50 transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(med._id)} 
                          className="bg-white text-red-600 p-2 rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 line-clamp-1">{med.name}</h3>
                        {med.category && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                            {med.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-4">{med.brand || "Generic"}</p>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Price</p>
                          <p className="text-lg font-bold text-gray-900">₹{med.pricing?.sellingPrice || 0}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Stock</p>
                          <p className={`text-sm font-semibold ${med.stock > 10 ? 'text-gray-600' : 'text-orange-500'}`}>
                            {med.stock} units
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
