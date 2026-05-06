"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getsellerinfo, updateSellerInfo } from "@/app/apis/seller.api";
import SellerNavbar from "@/app/seller/SellerBar/page";

type FormState = {
  shopName: string;
  licenseNumber: string;
  address: string;
  phone: string;
  lat: number | null;
  lng: number | null;

  locationName?: string;
  fullAddress?: string;
};

export default function SellerProfilePage() {
  const [form, setForm] = useState<FormState>({
    shopName: "",
    licenseNumber: "",
    address: "",
    phone: "",
    lat: null,
    lng: null,
    locationName: "",
    fullAddress: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load seller
  useEffect(() => {
    const load = async () => {
      try {
        setFetching(true);
        const res = await getsellerinfo();
        console.log("SELLER_INFO_RESPONSE:", res.data);
        
        const data = res.data?.seller ?? res.data?.sellerinfo ?? res.data;

        if (data) {
          setForm({
            shopName: data.shopName || "",
            licenseNumber: data.licenseNumber || "",
            address: data.address || "",
            phone: data.phone || "",
            lat: data.location?.lat ?? null,
            lng: data.location?.lng ?? null,
            locationName: data.location?.address || "",
            fullAddress: data.location?.fullAddress || "",
          });
        }
      } catch (err: any) {
        console.error("LOAD_SELLER_ERROR:", err);
        toast.error("Failed to load seller info");
      } finally {
        setFetching(false);
      }
    };

    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

const getMyLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setForm((p) => ({
        ...p,
        lat,
        lng,
      }));

      toast.success("Location captured");
    },
    (err) => {
      console.log(err);
      toast.error("Enable location permission");
    }
  );
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (
    !form.shopName.trim() ||
    !form.licenseNumber.trim() ||
    !form.address.trim() ||
    !form.phone.trim()
  ) {
    toast.error("All fields are required");
    return;
  }

  if (form.lat === null || form.lng === null) {
    toast.error("Please set your location ");
    return;
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(form.phone)) {
    toast.error("Enter valid phone number");
    return;
  }

  setLoading(true);

  try {
    await updateSellerInfo(form);
    toast.success("Profile updated ");
    setEditing(false);
  } catch {
    toast.error("Update failed");
  } finally {
    setLoading(false);
  }
};

  if (fetching) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading seller profile...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#fafafa] flex">
    
    {/* NAVBAR */}
    <SellerNavbar />

    {/* CONTENT */}
    <div className="flex-1 w-full md:ml-72">

      {/* mobile top spacing */}
      <div className="h-16 md:hidden" />

      <div className="p-4 sm:p-6 md:p-10">
        <div className="max-w-4xl mx-auto">

          {/* ===== HEADER ===== */}
          <header className="mb-8">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Profile Settings
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Manage Your <span className="text-emerald-600">Seller Profile</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-lg">
              Keep your shop info accurate so customers can easily find and trust your business.
            </p>
          </header>

          {/* ===== CARD ===== */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">

            {/* CARD HEADER */}
            <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                Shop Information
              </h2>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition"
                >
                  Edit
                </button>
              )}
            </div>

            {/* ===== VIEW MODE ===== */}
            {!editing ? (
              <div className="p-6 sm:p-8 space-y-8">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Shop Name</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {form.shopName || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">License</p>
                    <p className="mt-1 text-base text-slate-900">
                      {form.licenseNumber || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Phone</p>
                    <p className="mt-1 text-base text-slate-900">
                      {form.phone || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Location</p>
                    <p className="mt-1 text-base text-slate-900">
                      {form.locationName || "Not set"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase text-slate-400">Address</p>
                    <p className="mt-1 text-base text-slate-900">
                      {form.fullAddress || "—"}
                    </p>
                  </div>

                </div>

           

              </div>
            ) : (

              /* ===== EDIT MODE ===== */
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Shop Name</label>
                    <input
                      name="shopName"
                      value={form.shopName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-black  bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">License</label>
                    <input
                      name="licenseNumber"
                      value={form.licenseNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Phone</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-black  bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Address</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                </div>

                {/* LOCATION */}
                <div className="pt-4 border-t border-slate-100 space-y-4">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        Shop Location
                      </h3>
                      <p className="text-xs text-slate-500">
                        Helps customers find your shop faster
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={getMyLocation}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200 hover:bg-emerald-100"
                    >
                      Use Location
                    </button>
                  </div>

                  {form.locationName && (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                      <p className="text-sm font-medium text-slate-900">
                        {form.locationName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {form.fullAddress}
                      </p>
                    </div>
                  )}

                </div>

                {/* ACTIONS */}
                <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-slate-100">

                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !form.shopName ||
                      !form.licenseNumber ||
                      !form.address ||
                      !form.phone ||
                      !form.lat ||
                      !form.lng
                    }
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>

                </div>

              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  </div>
);
}