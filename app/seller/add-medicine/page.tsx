"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMedicine, getMedicineByBarcode } from "@/app/apis/medicineapi";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiTrash2, FiCheck, FiPlus, FiList, FiMaximize, FiX, FiRefreshCw, FiSearch } from "react-icons/fi";
import { BrowserMultiFormatReader, ChecksumException, FormatException, NotFoundException } from "@zxing/library";
import Link from "next/link";
import SellerNavbar from "@/app/seller/SellerBar/page";

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
    barcode: "",
    unitWeight: "",
  });

  const [showScanner, setShowScanner] = useState(false);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const [images, setImages] = useState<File[]>([]);
  const [externalImages, setExternalImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let isMounted = true;
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    const startScanning = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
          } catch (e) {}
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        if (!isMounted || !showScanner || !videoRef.current) return;

        const devices = await codeReader.listVideoInputDevices();
        if (!devices || devices.length === 0) throw new Error("No cameras found");

        const selectedDeviceId = devices.length > 1 ? devices[devices.length - 1].id : devices[0].id;

        await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result && isMounted) {
              onScanSuccess(result.getText());
            }
          }
        );
      } catch (err: any) {
        console.error("ZXING_START_ERROR:", err);
        if (isMounted) {
          setShowScanner(false);
          alert("Camera error: " + (err.message || "Could not start video"));
        }
      }
    };

    if (showScanner) {
      startScanning();
    }

    return () => {
      isMounted = false;
      codeReader.reset();
    };
  }, [showScanner]);

  async function onScanSuccess(decodedText: string) {
    console.log("BARCODE_SCANNED:", decodedText);
    const trimmedBarcode = decodedText.trim();
    
    try {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
      setShowScanner(false);
      setForm(prev => ({ ...prev, barcode: trimmedBarcode }));
      
      console.log("FETCHING_BY_BARCODE:", trimmedBarcode);
      const res = await getMedicineByBarcode(trimmedBarcode);
      console.log("BARCODE_API_RESPONSE:", res.data);

      if (res.data.success && res.data.medicine) {
        const med = res.data.medicine;
        setForm(prev => ({
          ...prev,
          name: med.name || prev.name,
          brand: med.brand || prev.brand,
          category: med.category || prev.category,
          manufacturer: med.manufacturer || prev.manufacturer,
          description: med.description || prev.description,
        }));
        if (med.images && med.images.length > 0) {
          setExternalImages(med.images);
        }
        alert("Product found! Autofilling details...");
      } else {
        console.log("PRODUCT_NOT_FOUND_IN_API");
        alert(`Product not found (Barcode: ${trimmedBarcode}). You can enter details manually.`);
      }
    } catch (err: any) {
      console.error("BARCODE_FETCH_ERROR:", err);
      const errorMsg = err.response?.data?.message || err.message || "Network error";
      alert(`Failed to connect to barcode database: ${errorMsg}`);
      setShowScanner(false);
    }
  }

  function onScanFailure(error: any) {
    // Silently handle scan failures during scanning
  }

  const handleCreate = async (e: any) => {
    e.preventDefault();
    if (!form.name || !form.sellingPrice) return alert("Name and Selling Price are required");

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
      formData.append("barcode", form.barcode);
      formData.append("existingImageUrls", JSON.stringify(externalImages));

      formData.append(
        "pricing",
        JSON.stringify({
          mrp: Number(form.mrp),
          sellingPrice: Number(form.sellingPrice),
          offer: form.offer,
        })
      );

      images.forEach((img) => {
        formData.append("images", img);
      });

      await createMedicine(formData);
      router.push("/seller/manage-medicines");
    } catch (err) {
      console.error(err);
      alert("Create failed ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <SellerNavbar />
      
      <main className="flex-1 md:ml-72 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          
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

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
              <div className="h-10 w-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <FiPlus className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Product Details</h2>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Fill in all required information</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="p-8 space-y-8">
              {/* Scanner Section */}
              <AnimatePresence>
                {showScanner && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 border-2 border-emerald-500 rounded-2xl overflow-hidden bg-black"
                  >
                    <div className="flex justify-between items-center p-4 bg-emerald-600 text-white">
                      <span className="font-bold flex items-center gap-2"><FiMaximize /> Scanning Barcode...</span>
                      <button type="button" onClick={() => setShowScanner(false)}><FiX size={20} /></button>
                    </div>
                    <div className="relative bg-black group h-[450px]">
                      <video 
                        ref={videoRef}
                        className="w-full h-full object-cover opacity-60"
                        playsInline 
                        muted 
                        autoPlay
                      ></video>
                      
                      {/* Scanning Square Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-[350px] h-[350px]">
                          {/* Corner Borders */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
                          
                          {/* Scanning Line Animation */}
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-scan-loop"></div>
                        </div>
                      </div>

                      <div className="absolute bottom-6 inset-x-0 text-center text-white/80 text-xs font-bold uppercase tracking-widest drop-shadow-md">
                        Align Barcode within square
                      </div>
                    </div>
                    <div className="p-6 text-center text-slate-400 text-sm bg-slate-900 border-t border-slate-800">
                      <p className="animate-pulse text-emerald-500 font-semibold mb-1">Scanning active...</p>
                      Scanning builds our shared database for faster future entry!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 py-4 rounded-2xl font-bold border-2 border-emerald-100 hover:bg-emerald-100 transition-all"
                >
                  <FiMaximize className="text-xl" />
                  Scan Product Barcode
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Barcode / EAN (Optional)</label>
                  <p className="text-[10px] text-emerald-600 font-medium italic -mt-1 mb-1">Tip: Scanning builds our shared database for faster future entry!</p>
                  <div className="relative">
                    <input name="barcode" value={form.barcode} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="Scan or enter barcode" />
                    <button 
                      type="button"
                      onClick={() => onScanSuccess(form.barcode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
                      title="Fetch product details"
                    >
                      <FiSearch size={16} />
                    </button>
                  </div>
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
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
                  <input name="category" value={form.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="e.g. Pain Reliever" />
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
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Quantity *</label>
                  <input name="stock" required type="number" value={form.stock} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300 text-gray-900" placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Offer Label</label>
                  <input name="offer" value={form.offer} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-gray-300" placeholder="e.g. 20% OFF" />
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
                          <button type="button" onClick={() => removeExternalImage(i)} className="absolute top-1 right-1 bg-white/90 text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
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
                          <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-white/90 text-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
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
          </div>
        </div>
      </main>
    </div>
  );
}