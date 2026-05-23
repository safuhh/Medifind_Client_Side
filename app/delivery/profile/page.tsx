"use client";

import { useEffect, useState } from "react";
import { getCurrentDeliveryBoyInfo } from "@/app/apis/deliveryboyapi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DeliverySidebar from "../navbar/page";
import { useDeliveryBoy } from "@/app/hooks/Usedeliveryboy";
import {
  User,
  Phone,
  Bike,
  ShieldAlert,
  MapPin,
  Edit3,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function DeliveryProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useDeliveryBoy();

  const getDisplayAddress = () => {
    const full = data?.location?.fullAddress;
    const addr = data?.location?.address;
    const manual = data?.address;

    if (full && full !== "Pending" && full !== "Address not found") return full;
    if (addr && addr !== "Pending" && addr !== "Unknown location") return addr;
    if (manual && manual !== "Update your address") return manual;
    return "Location details unavailable";
  };

  const hasCoords = 
    data?.location?.lat !== undefined && 
    data?.location?.lng !== undefined && 
    data?.location?.lat !== 0 && 
    data?.location?.lng !== 0;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCurrentDeliveryBoyInfo();
        setData(res.data.deliveryBoy);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          toast.info("Please complete your application first");
          router.push("/delivery/apply");
        } else {
          toast.error(
            err?.response?.data?.message || "Failed to load profile"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 text-sm font-medium">Loading profile...</p>
      </div>
    );
  }

  const getVehicleIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "cycle":
        return <span className="text-xl">🚲</span>;
      case "scooter":
        return <span className="text-xl">🛵</span>;
      default:
        return <Bike className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-emerald-100">
      <DeliverySidebar />
      
      <div className="md:ml-64 min-h-screen transition-all duration-300">
        {/* HEADER SECTION */}
        <header className="bg-white border-b border-slate-200/60 sticky top-0 z-20 px-6 py-5 md:py-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Profile Settings
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
                Manage your delivery partner account and vehicle configurations.
              </p>
            </div>
            
            <button
              onClick={() => router.push("/delivery/edit")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-800/10 hover:shadow-lg hover:shadow-emerald-800/15 active:scale-[0.98] transition-all self-start sm:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
          {/* STATUS NOTIFICATION BANNER */}
          {data?.status === "approved" ? (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900 text-sm">Account Approved</h3>
                <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                  Your delivery partner status is active. You are fully authorized to accept order pickups and complete final customer deliveries on the platform.
                </p>
              </div>
            </div>
          ) : data?.status === "rejected" ? (
            <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/60 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-rose-900 text-sm">Application Rejected</h3>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  Your application was not approved. Please review your details and contact our support team if you believe this is an error.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-sm">Verification In Progress</h3>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                  Your registration documents are currently undergoing review. You will receive an alert and full access to delivery requests as soon as your account is approved.
                </p>
              </div>
            </div>
          )}

          {/* TWO COLUMN INFO CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PERSONAL DETAILS CARD */}
            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 bg-slate-50 border rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <h2 className="font-bold text-slate-800 text-base">Personal Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{data?.name || "—"}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</p>
                  <p className="text-sm text-slate-900 mt-1 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {data?.phone || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Location / Address</p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      {getDisplayAddress()}
                      {hasCoords && (
                        <span className="block text-xs text-slate-400 mt-1">
                          Coordinates: {data.location.lat.toFixed(6)}, {data.location.lng.toFixed(6)}
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* VEHICLE & DOCUMENTS CARD */}
            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 bg-slate-50 border rounded-lg flex items-center justify-center">
                  <Bike className="w-4 h-4 text-slate-500" />
                </div>
                <h2 className="font-bold text-slate-800 text-base">Vehicle & Documents</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Type</p>
                  <p className="text-sm font-semibold text-slate-900 mt-1.5 flex items-center gap-2 capitalize">
                    {getVehicleIcon(data?.vehicleType)}
                    {data?.vehicleType || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Plate Number</p>
                  <p className="text-sm font-bold font-mono text-slate-800 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-lg inline-block mt-1 uppercase tracking-wider">
                    {data?.vehicleNumber || "—"}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}