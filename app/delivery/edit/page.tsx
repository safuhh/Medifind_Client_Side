"use client";

import { useEffect, useState } from "react";
import {
  getCurrentDeliveryBoyInfo,
  updateDeliveryBoyInfo,
} from "@/app/apis/deliveryboyapi";
import { useDeliveryBoy } from "@/app/hooks/Usedeliveryboy";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DeliverySidebar from "../navbar/page";

export default function EditDeliveryProfile() {
  const router = useRouter();
  useDeliveryBoy();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicleType: "bike",
    vehicleNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isValidPhone = (phone: string) =>
    /^[6-9]\d{9}$/.test(phone);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCurrentDeliveryBoyInfo();
        const data = res.data.deliveryBoy;

        setForm({
          name: data.name || "",
          phone: data.phone || "",
          vehicleType: data.vehicleType || "bike",
          vehicleNumber: data.vehicleNumber || "",
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, phone: cleaned });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!isValidPhone(form.phone)) {
      toast.error("Invalid phone number");
      return;
    }

    setSaving(true);

    try {
      await updateDeliveryBoyInfo(form);
      toast.success("Profile updated 🚀");
      router.push("/delivery/profile");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-slate-50 p-4 md:p-12">
    <DeliverySidebar />
    
    <div className="max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Edit Profile</h1>
        <p className="text-slate-500 mt-2">Update your personal information and vehicle details below.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Section: Personal Info */}
          <section>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full  text-black px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-black px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                />
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section: Vehicle Info */}
          <section>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  className="w-full  text-black px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="cycle">Cycle</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">License Plate / Number</label>
                <input
                  name="vehicleNumber"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  placeholder="ABC-1234"
                  className="w-full  text-black px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/delivery/profile")}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 active:scale-95 transition-all"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}