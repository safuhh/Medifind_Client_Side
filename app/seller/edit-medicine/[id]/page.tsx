"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMedicine, updateMedicine } from "@/app/apis/medicineapi";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiTrash2, FiArrowLeft, FiCheck, FiX, FiPlus } from "react-icons/fi";
import SellerNavbar from "@/app/seller/SellerBar/page";
import { getImageUrl } from "@/app/utils/imageUrl";

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

export default function EditMedicinePage() {
  const { id } = useParams();
  const router = useRouter();
  const [medicine, setMedicine] = useState<any | null>(null);
  const [editImages, setEditImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await getMedicine(id as string);
        const med = res.data.medicine || res.data;
        setMedicine(med);
      } catch (err) {
        console.error(err);
        alert("Failed to load medicine details");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchMedicine();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setMedicine((prev: any) => {
        if (!prev) return prev;
        const updatedParent = { ...prev[parent], [child]: value };
        
        if (parent === "pricing" && (child === "mrp" || child === "offer" || child === "gst")) {
          updatedParent.sellingPrice = calculateSellingPrice(
            updatedParent.mrp || "",
            updatedParent.offer || "",
            updatedParent.gst || ""
          );
        }
        
        return {
          ...prev,
          [parent]: updatedParent
        };
      });
    } else {
      setMedicine((prev: any) => {
        if (!prev) return prev;
        return { ...prev, [name]: value };
      });
    }
  };

  const handleImageChange = (e: any) => {
    if (e.target.files) {
      setEditImages((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeNewImage = (index: number) => {
    setEditImages(editImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    const newImages = [...medicine.images];
    newImages.splice(index, 1);
    setMedicine({ ...medicine, images: newImages });
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", medicine.name);
      formData.append("brand", medicine.brand || "");
      formData.append("category", medicine.category || "");
      formData.append("manufacturer", medicine.manufacturer || "");
      formData.append("stock", String(medicine.stock));
      formData.append("description", medicine.description || "");
      formData.append("unitWeight", medicine.unitWeight || "");
      formData.append("barcode", medicine.barcode || "");
      formData.append("visibility", medicine.visibility || "public");

      formData.append(
        "pricing",
        JSON.stringify({
          mrp: Number(medicine.pricing?.mrp),
          sellingPrice: Number(medicine.pricing?.sellingPrice),
          offer: medicine.pricing?.offer,
          gst: Number(medicine.pricing?.gst) || 0,
        })
      );

      medicine.images.forEach((img: string) => {
        formData.append("existingImages", img);
      });

      editImages.forEach((img) => {
        formData.append("images", img);
      });

      await updateMedicine(id as string, formData);
      router.push("/seller/manage-medicines");
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="h-8 w-8 border-4 border-gray-100 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex">
      <SellerNavbar />
      
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Medicines
          </button>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-500 mt-0.5">Update your medicine details and availability</p>
              </div>
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <FiCheck className="text-emerald-600" />
              </div>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Barcode / EAN</label>
                  <input name="barcode" value={medicine.barcode || ""} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" placeholder="Product barcode" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Visibility</label>
                  <select name="visibility" value={medicine.visibility || "public"} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900">
                    <option value="public">Public (Visible to all users)</option>
                    <option value="restricted">Restricted (Visible only to doctors)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Medicine Name</label>
                  <input name="name" required value={medicine.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Brand</label>
                  <input name="brand" value={medicine.brand} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
                  <input name="category" value={medicine.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unit / Weight (klg)</label>
                  <input name="unitWeight" value={medicine.unitWeight || ""} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Manufacturer</label>
                  <input name="manufacturer" value={medicine.manufacturer} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">MRP (₹)</label>
                  <input name="pricing.mrp" type="number" value={medicine.pricing?.mrp} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Selling Price (₹)</label>
                  <input name="pricing.sellingPrice" type="number" value={medicine.pricing?.sellingPrice} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">GST (%)</label>
                  <input name="pricing.gst" type="number" value={medicine.pricing?.gst || ""} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" placeholder="e.g. 12" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</label>
                  <input name="stock" type="number" value={medicine.stock} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Offer Label</label>
                  <input name="pricing.offer" value={medicine.pricing?.offer} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" placeholder="e.g. 10% OFF" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                  <textarea name="description" value={medicine.description || ""} onChange={handleChange} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all text-gray-900" placeholder="Product details, composition, usage instructions, etc." />
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Images</label>
                <div className="flex flex-wrap gap-4">
                  {/* Existing Images */}
                  {medicine.images?.map((img: string, i: number) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-100 h-28 w-28">
                      <img src={getImageUrl(img)} className="h-full w-full object-cover" alt="existing" />
                      <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-white/90 text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}

                  {/* New Images */}
                  {editImages.map((img, i) => (
                    <div key={`new-${i}`} className="relative group rounded-xl overflow-hidden border border-emerald-100 h-28 w-28">
                      <img src={URL.createObjectURL(img)} className="h-full w-full object-cover" alt="preview" />
                      <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-white/90 text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <FiX size={14} />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-[8px] text-center text-white py-0.5 font-bold uppercase">New</div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-28 w-28 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                  >
                    <FiPlus size={20} />
                    <span className="text-[10px] mt-1 font-bold">ADD IMAGE</span>
                  </button>



                  <input ref={fileInputRef} type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                </div>
              </div>

              <div className="pt-8 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {loading && <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
