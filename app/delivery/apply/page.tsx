"use client";

import Navbar from "@/app/navbar/page";
import { useState } from "react";
import { applyDeliveryBoy } from "@/app/apis/deliveryboyapi";
import { toast } from "react-toastify";
import Link from "next/link";
type FormType = {
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  address: string;
  aadhaarNumber: string;
  aadhaarImage: string;
  lat: number | null;
  lng: number | null;
};

export default function DeliveryApplyPage() {
  const [form, setForm] = useState<FormType>({
    name: "",
    phone: "",
    vehicleType: "bike",
    vehicleNumber: "",
    address: "",
    aadhaarNumber: "",
    aadhaarImage: "",
    lat: null,
    lng: null,
  });

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  // 🔥 FRONTEND VALIDATION (matches Joi backend)
  const validateForm = (): boolean => {
    if (!form.name || form.name.length < 3)
      return toast.error("Name must be at least 3 characters"), false;

    if (!/^[6-9]\d{9}$/.test(form.phone))
      return toast.error("Enter valid Indian phone number"), false;

    if (!["bike", "scooter", "cycle"].includes(form.vehicleType))
      return toast.error("Invalid vehicle type"), false;

    if (!form.vehicleNumber || form.vehicleNumber.length < 5)
      return toast.error("Vehicle number too short"), false;

    if (!form.address || form.address.length < 5)
      return toast.error("Address too short"), false;

    if (!/^\d{12}$/.test(form.aadhaarNumber))
      return toast.error("Aadhaar must be 12 digits"), false;

    try {
      new URL(form.aadhaarImage);
    } catch {
      return toast.error("Invalid Aadhaar image URL"), false;
    }

    if (form.lat === null || form.lng === null)
      return toast.error("Please add location"), false;

    return true;
  };

  // 📍 LOCATION
  const handleLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation not supported");
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }));
        setLocating(false);
        toast.success("Location captured ");
      },
      () => {
        setLocating(false);
        toast.error("Location error");
      },
      { enableHighAccuracy: true }
    );
  };

  // 🚀 SUBMIT
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      };

      const res = await applyDeliveryBoy(payload);

      toast.success("Application submitted ");

      console.log(res.data);

      setForm({
        name: "",
        phone: "",
        vehicleType: "bike",
        vehicleNumber: "",
        address: "",
        aadhaarNumber: "",
        aadhaarImage: "",
        lat: null,
        lng: null,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen bg-white text-slate-800 flex flex-col">
    <Navbar />

    <div className="flex-1 flex items-center justify-center p-4">
      {/* Reduced max-width from md to sm and padding from p-7 to p-5 */}
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-100/50 p-5">

        {/* BRAND HEADER - More compact spacing */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center mb-2">
            <Link href="/" className="flex items-center gap-2 group">
              {/* Scaled down logo box from w-10 to w-8 */}
              <div className="w-8 h-8 bg-[#0a4d33] rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col leading-none text-left">
                <span className="text-xl font-black tracking-tighter text-[#0a4d33]">MediFind</span>
                <span className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-500">Healthcare</span>
              </div>
            </Link>
          </div>

          <h2 className="text-md font-bold text-slate-800">Partner Application</h2>
          <p className="text-xs text-slate-500">Join our delivery network</p>
        </div>

        {/* FORM - Tightened spacing from space-y-4 to space-y-2.5 */}
        <div className="space-y-2.5">
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />

          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />

          <textarea
            placeholder="Full Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3 py-2 h-16 rounded-lg border border-slate-200 bg-slate-50/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />

          {/* Grid for small inputs to save vertical space */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.vehicleType}
              onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            >
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
              <option value="cycle">Cycle</option>
            </select>

            <input
              placeholder="Vehicle No."
              value={form.vehicleNumber}
              onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>

          <input
            placeholder="Aadhaar Number"
            value={form.aadhaarNumber}
            onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />

          <input
            placeholder="Aadhaar Image URL"
            value={form.aadhaarImage}
            onChange={(e) => setForm({ ...form, aadhaarImage: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          />

          <button
            onClick={handleLocation}
            className="w-full py-2 rounded-lg border border-dashed border-slate-300 text-xs font-medium hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
          >
            {locating ? "Fetching..." : form.lat ? "Location Captured 📍" : "Add Location"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition shadow-md shadow-emerald-100 disabled:opacity-50 mt-2"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  </div>
);
}