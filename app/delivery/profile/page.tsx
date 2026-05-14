"use client";

import { useEffect, useState } from "react";
import { getCurrentDeliveryBoyInfo } from "@/app/apis/deliveryboyapi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DeliverySidebar from "../navbar/page";
import { useDeliveryBoy } from "@/app/hooks/Usedeliveryboy";

export default function DeliveryProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useDeliveryBoy();

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
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-10">
        <DeliverySidebar />
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-5 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Profile Info</h2>

          <button
            onClick={() => router.push("/delivery/edit")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm"
          >
            Edit
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          <div>
            <p className="text-xs text-slate-400 uppercase">Name</p>
            <p className="text-base font-semibold text-black">{data?.name || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase">Phone</p>
            <p className="text-base text-black">{data?.phone || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase">Vehicle Type</p>
            <p className="text-base text-black">{data?.vehicleType || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase">Vehicle Number</p>
            <p className="text-base text-black">{data?.vehicleNumber || "—"}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase">Status</p>
            <p className="text-sm font-medium text-emerald-600  ">
              {data?.status || "pending"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}