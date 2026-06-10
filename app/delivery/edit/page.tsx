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

  const [form, setForm] = useState<{
    name: string;
    phone: string;
    vehicleType: "bike" | "scooter" | "cycle";
    vehicleNumber: string;
    address: string;
    lat: number | null;
    lng: number | null;
  }>({
    name: "",
    phone: "",
    vehicleType: "bike",
    vehicleNumber: "",
    address: "",
    lat: null,
    lng: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const isValidPhone = (phone: string) =>
    /^[6-9]\d{9}$/.test(phone);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCurrentDeliveryBoyInfo();
        const data = res.data.deliveryBoy;

        // Strip default placeholder strings so the edit screen is clean
        const displayAddress = 
          data.address === "Update your address" ? "" : (data.address || "");

        setForm({
          name: data.name || "",
          phone: data.phone || "",
          vehicleType: data.vehicleType || "bike",
          vehicleNumber: data.vehicleNumber || "",
          address: displayAddress,
          lat: data.location?.lat || null,
          lng: data.location?.lng || null,
        });
      } catch (err: any) {
        if (err?.response?.status === 404) {
          toast.info("Please complete your application first");
          router.push("/delivery/apply");
        } else {
          toast.error("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation not supported");
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude,
        }));

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://newmedifinddeploy-env.eba-pp6njqrd.eu-north-1.elasticbeanstalk.com";
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(
            `${apiUrl}/locations/reverse?lat=${latitude}&lng=${longitude}`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json();
            setForm((prev) => ({
              ...prev,
              address: data.address || prev.address,
            }));
            toast.success("Location & address captured 📍");
          } else {
            toast.success("Location coordinates saved 📍");
          }
        } catch (err) {
          console.warn("Address lookup failed:", err);
          toast.success("Location saved 📍 (address lookup unavailable)");
        } finally {
          setLocating(false);
        }
      },
      (geoErr) => {
        setLocating(false);
        console.error("Geolocation error:", geoErr);
        toast.error("Could not get location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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

          {/* Section: Registered Location & Address */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Registered Location & Address</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Registered Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your registered address"
                  className="w-full text-black px-4 py-2.5 h-24 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={handleLocation}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  📍 {locating ? "Capturing Location..." : "Capture Location"}
                </button>
                {form.lat !== null && form.lng !== null && (
                  <span className="text-xs font-semibold text-emerald-600">
                    Location Captured (Lat: {form.lat.toFixed(6)}, Lng: {form.lng.toFixed(6)})
                  </span>
                )}
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