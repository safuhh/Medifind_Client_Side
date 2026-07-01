"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMedicine } from "@/services/apis/medicineapi";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiTrash2, FiCheck, FiPlus, FiList } from "react-icons/fi";
import Link from "next/link";
import SellerNavbar from "@/app/seller/SellerBar/page";
import api from "@/services/apis/api";
import { getSubscriptionStatus, type Subscription } from "@/services/apis/subcription.api";

const calculateSellingPrice = (mrpVal: string, offerVal: string, gstVal: string): string => {
  const mrp = parseFloat(mrpVal);
  if (isNaN(mrp) || mrp <= 0) return "";

  let discountPercent = 0;
  if (offerVal) {
    const pctMatch = offerVal.match(/(\d+(?:\.\d+)?)\s*%/);
    if (pctMatch) {
      discountPercent = parseFloat(pctMatch[1]);
    } else {
      const numMatch = offerVal.match(/^\s*(\d+(?:\.\d+)?)\s*$/);
      if (numMatch) {
        discountPercent = parseFloat(numMatch[1]);
      } else {
        const fallbackMatch = offerVal.match(/(\d+(?:\.\d+)?)/);
        if (fallbackMatch) {
          discountPercent = parseFloat(fallbackMatch[1]);
        }
      }
    }
  }

  const finalPrice = mrp * (1 - discountPercent / 100);
  const gstPercent = parseFloat(gstVal) || 0;
  const sellingPrice = finalPrice / (1 + gstPercent / 100);

  return isNaN(sellingPrice) || sellingPrice < 0 ? "0.00" : sellingPrice.toFixed(2);
};

export default function AddMedicinePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    manufacturer: "",
    mrp: "",
    sellingPrice: "",
    stock: "",
    offer: "",
    description: "",
    unitWeight: "",
    visibility: "public",
    gst: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [externalImages, setExternalImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isLocked, setIsLocked] = useState(false);
  const [checkingSub, setCheckingSub] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkSub = async () => {
      try {
        const res = await getSubscriptionStatus();
        if (res.subscription) {
          if (!res.subscription.isPro && res.subscription.trialStartedAt) {
            // Check immediately
            const checkExpiry = () => {
              const diffMs = Date.now() - new Date(res.subscription.trialStartedAt!).getTime();
              const diffSeconds = diffMs / 1000;
              if (diffSeconds >= 20) {
                setIsLocked(true);
                clearInterval(interval);
              }
            };
            
            checkExpiry();
            // Then check every second
            interval = setInterval(checkExpiry, 1000);
          }
        }
      } catch (err) {
        console.error("Failed to check subscription", err);
      } finally {
        setCheckingSub(false);
      }
    };
    
    checkSub();
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "mrp" || name === "offer" || name === "gst") {
        updated.sellingPrice = calculateSellingPrice(updated.mrp, updated.offer, updated.gst);
      }
      return updated;
    });
  };



  const handleImageChange = (e: any) => {
    if (e.target.files) {
      setImages((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExternalImage = (index: number) => {
    setExternalImages(externalImages.filter((_, i) => i !== index));
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    if (!form.name || !form.sellingPrice) return alert("Name and Selling Price are required");
    if (!form.category) return alert("Please select a category");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("category", form.category);
      formData.append("manufacturer", form.manufacturer);
      formData.append("stock", form.stock);
      formData.append("description", form.description);
      formData.append("unitWeight", form.unitWeight);
      formData.append("visibility", form.visibility);
      formData.append("existingImageUrls", JSON.stringify(externalImages));

      formData.append(
        "pricing",
        JSON.stringify({
          mrp: Number(form.mrp),
          sellingPrice: Number(form.sellingPrice),
          offer: form.offer,
          gst: Number(form.gst) || 0,
        })
      );

      images.forEach((img) => {
        formData.append("images", img);
      });

      await createMedicine(formData);
      router.push("/seller/manage-medicines");
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || "Failed to create medicine. Please try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <SellerNavbar />
  
      
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="h-16 md:hidden" />
        <div className="max-w-4xl mx-auto">
          <div className="hidden md:block">
            <br/>
      
          </div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-100 pb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Medicine</h1>
              <p className="text-gray-500 mt-2">Expand your catalog and reach more customers</p>
            </div>
            <Link 
              href="/seller/manage-medicines" 
              className="flex items-center gap-2 text-emerald-600 font-semibold hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all"
            >
              <FiList />
              View Medicines
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden relative">
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
              <div className="h-10 w-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <FiPlus className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Product Details</h2>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Fill in all required information</p>
              </div>
            </div>

            {checkingSub ? (
              <div className="p-20 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600 border-r-2 border-emerald-600/30"></div>
              </div>
            ) : isLocked ? (
              <div className="p-16 text-center space-y-6">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔒</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Free Trial Expired</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Your 20-second free trial has ended. Upgrade to our Pro plan to list unlimited medicines and get priority search ranking!
                </p>
                <button 
                  onClick={() => router.push("/subcription")}
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform"
                >
                  View Pro Plans
                </button>
              </div>
            ) : (
            <form onSubmit={handleCreate} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Visibility</label>
                  <select name="visibility" value={form.visibility} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900">
                    <option value="public">Public (Visible to all users)</option>
                    <option value="restricted">Restricted (Visible only to doctors)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Medicine Name *</label>
                  <input name="name" required value={form.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="e.g. Paracetamol 500mg" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Brand</label>
                  <input name="brand" value={form.brand} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="e.g. Crocin" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category *</label>
                  <select name="category" required value={form.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900">
                    <option value="" disabled>Select Category</option>
                    <option value="pain relief">Pain Relief</option>
                    <option value="antibiotics">Antibiotics</option>
                    <option value="diabetes">Diabetes</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="skin care">Skin Care</option>
                    <option value="vitamins">Vitamins</option>
                    <option value="baby care">Baby Care</option>
                    <option value="respiratory">Respiratory</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unit / Weight (klg)</label>
                  <input name="unitWeight" value={form.unitWeight} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="e.g. 500mg, 1kg" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Manufacturer</label>
                  <input name="manufacturer" value={form.manufacturer} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="e.g. GSK" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">MRP (₹)</label>
                  <input name="mrp" type="number" value={form.mrp} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="0.00" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Selling Price (₹) *</label>
                  <input name="sellingPrice" required type="number" value={form.sellingPrice} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="0.00" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">GST (%)</label>
                  <input name="gst" type="number" value={form.gst} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="e.g. 12" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Quantity *</label>
                  <input name="stock" required type="number" value={form.stock} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Offer Label</label>
                  <input name="offer" value={form.offer} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="e.g. 20% OFF" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="Product details, composition, usage instructions, etc." />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Images</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className="bg-emerald-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <FiUploadCloud className="text-2xl text-emerald-600" />
                  </div>
                  <p className="text-gray-900 font-bold">Drop images here or click to upload</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium">PNG, JPG or WEBP (Max 5MB)</p>
                  <input ref={fileInputRef} type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                </div>

                { (images.length > 0 || externalImages.length > 0) && (
                  <div className="flex flex-wrap gap-4 mt-6">
                    <AnimatePresence>
                      {/* External Images Preview */}
                      {externalImages.map((img, i) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          key={`ext-${i}`} 
                          className="relative group rounded-xl overflow-hidden border border-emerald-100 h-28 w-28 shadow-sm"
                        >
                          <img src={img} className="h-full w-full object-cover" alt="external preview" />
                          <button type="button" onClick={() => removeExternalImage(i)} className="absolute top-1 right-1 bg-white/90 text-red-600 p-1.5 rounded-lg transition-opacity shadow-sm">
                            <FiTrash2 size={14} />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-[8px] text-center text-white py-0.5 font-bold uppercase">Online</div>
                        </motion.div>
                      ))}

                      {/* Local Upload Preview */}
                      {images.map((img, i) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          key={i} 
                          className="relative group rounded-xl overflow-hidden border border-gray-100 h-28 w-28 shadow-sm"
                        >
                          <img src={URL.createObjectURL(img)} className="h-full w-full object-cover" alt="preview" />
                          <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white/90 text-red-600 p-1.5 rounded-lg transition-opacity shadow-sm">
                            <FiTrash2 size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="pt-8 flex justify-end gap-4 border-t border-gray-50">
                <button 
                  type="button"
                  onClick={() => router.push("/seller/manage-medicines")}
                  className="px-8 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FiCheck size={20} />
                  )}
                  {loading ? "Publishing..." : "Publish Product"}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}