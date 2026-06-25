"use client";

import Navbar from "@/app/navbar/page";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { applyDeliveryBoy } from "@/services/apis/deliveryboyapi";
import { toast } from "react-toastify";
import Link from "next/link";
import Footer from "@/app/footer/page";
import { Clock, CreditCard, Shield, Truck, FileText, Smartphone, CheckCircle2 } from "lucide-react";

type FormType = {
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  address: string;
  aadhaarNumber: string;
  aadhaarImageFile: File | null;
  lat: number | null;
  lng: number | null;
};

export default function DeliveryApplyPage() {
  const { user, isLoading } = useSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.push("/login");
  }, [user, isLoading, router]);

  const [form, setForm] = useState<FormType>({
    name: "",
    phone: "",
    vehicleType: "bike",
    vehicleNumber: "",
    address: "",
    aadhaarNumber: "",
    aadhaarImageFile: null,
    lat: null,
    lng: null,
  });

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

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

    if (!form.aadhaarImageFile)
      return toast.error("Please upload Aadhaar image file"), false;

    if (form.lat === null || form.lng === null)
      return toast.error("Please add location"), false;

    return true;
  };

  // ðŸ“ LOCATION
  const handleLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation not supported");
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Always save coordinates first
        setForm((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude,
        }));

        // Try to reverse-geocode the address (non-critical â€“ failure is OK)
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
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
            toast.success("Location & address captured ðŸ“");
          } else {
            toast.success("Location coordinates saved ðŸ“");
          }
        } catch (err) {
          // Network error or timeout â€“ location coords are already saved above
          console.warn("Address lookup failed (coords still saved):", err);
          toast.success("Location saved ðŸ“ (address lookup unavailable)");
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

  // ðŸš€ SUBMIT
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", form.name.trim());
      data.append("phone", form.phone.trim());
      data.append("vehicleType", form.vehicleType);
      data.append("vehicleNumber", form.vehicleNumber.trim());
      data.append("address", form.address.trim());
      data.append("aadhaarNumber", form.aadhaarNumber.replace(/\s+/g, "").trim());
      if (form.aadhaarImageFile) {
        data.append("aadhaarImage", form.aadhaarImageFile);
      }
      data.append("lat", String(form.lat));
      data.append("lng", String(form.lng));

      const res = await applyDeliveryBoy(data);

      toast.success("âœ… Application submitted successfully!");
      console.log(res.data);

      setForm({
        name: "",
        phone: "",
        vehicleType: "bike",
        vehicleNumber: "",
        address: "",
        aadhaarNumber: "",
        aadhaarImageFile: null,
        lat: null,
        lng: null,
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-24 sm:py-32">
        <div className="max-w-4xl w-full mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 tracking-tight">Become a Delivery Partner</h1>
            <p className="text-slate-600 text-sm sm:text-base">Join our network and earn competitive payouts while delivering essential healthcare products.</p>
          </div>

          {/* Top: Form Card (12:9 aspect ratio feel, wide and balanced) */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 bg-[#0a4d33] rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex flex-col leading-none text-left">
                    <span className="text-xl font-black tracking-tighter text-[#0a4d33]">MediFind</span>
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-500">Healthcare</span>
                  </div>
                </Link>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Application Form</h2>
              <p className="text-xs text-slate-500">Fill in your details to get started</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Full Name</label>
                <input
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Phone Number</label>
                <input
                  placeholder="Enter 10 digit mobile number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Full Address</label>
                <textarea
                  placeholder="Enter your current residential address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2.5 h-20 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Vehicle Type</label>
                <select
                  value={form.vehicleType}
                  onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
                >
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="cycle">Cycle</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Vehicle No.</label>
                <input
                  placeholder="KL-01-AB-1234"
                  value={form.vehicleNumber}
                  onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Aadhaar Number</label>
                <input
                  placeholder="Enter 12 digit Aadhaar number"
                  value={form.aadhaarNumber}
                  onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Upload Aadhaar Image or PDF</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setForm({ ...form, aadhaarImageFile: file });
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <button
                onClick={handleLocation}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 text-xs font-medium hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition md:col-span-2"
              >
                {locating ? "Fetching..." : form.lat ? "Location Captured ðŸ“" : "Capture My Location"}
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#0a4d33] text-white font-bold text-sm hover:bg-[#083d28] transition shadow-md shadow-[#0a4d33]/10 disabled:opacity-50 mt-2 md:col-span-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting...
                  </>
                ) : "Submit Application"}
              </button>
            </div>
          </div>

          {/* Bottom: Side-by-side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Why Join Us Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Why Join Us?</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <CreditCard className="w-4 h-4 text-[#0a4d33]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-0.5">Earn up to ₹30,000/mo</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Be your own boss and earn competitive payouts based on your deliveries.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <Clock className="w-4 h-4 text-[#0a4d33]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-0.5">Flexible Work Hours</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Choose your own shifts. Work part-time or full-time according to your schedule.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <Shield className="w-4 h-4 text-[#0a4d33]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-0.5">Instant Insurance</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Stay protected on the road with our comprehensive accidental insurance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What You Need Card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">What You Need</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <Truck className="w-4 h-4 text-[#0a4d33]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-0.5">Own Vehicle</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">A working bike, scooter, or cycle. Electric vehicles are highly encouraged!</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <FileText className="w-4 h-4 text-[#0a4d33]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-0.5">Identity Proof</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Valid Aadhaar Card and PAN Card for background verification.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100">
                    <Smartphone className="w-4 h-4 text-[#0a4d33]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-0.5">Smart Device</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">An Android or iOS smartphone with a working internet connection.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}