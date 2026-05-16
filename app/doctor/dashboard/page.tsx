"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useRouter } from "next/navigation";
import DoctorSidebar from "@/app/doctor/navbar/page";
import { getApplicationStatus } from "../../apis/doctor.api";
import { getImageUrl } from "../../utils/imageUrl";
import Revenue from "../revenue/page";

export default function DoctorDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<any>(null);

  useEffect(() => {
    if (user && user.role !== "doctor") {
      router.push("/");
    } else if (!user) {
      router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          const res = await getApplicationStatus();
          setDoctorData(res.data.application);
        } catch (err) {
          console.error("Error fetching doctor data", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-black uppercase tracking-widest text-slate-400">Loading Clinical Profile...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex relative">
      <DoctorSidebar />

      <div className="flex-1 w-full md:ml-64 transition-all duration-300">
        <main className="max-w-7xl mx-auto pt-8 md:pt-12 pb-20 px-4 sm:px-6 lg:px-8">
          
          {/* Professional Doctor Profile Header */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-8">
              {doctorData?.profileImage && (
                <img
                  src={getImageUrl(doctorData.profileImage)}
                  className="w-24 h-24 rounded-3xl object-cover shadow-2xl shadow-emerald-900/10 border-4 border-white"
                  alt="Doctor"
                />
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                      Dr. {doctorData?.fullName}
                    </h1>
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                        Verified
                    </div>
                </div>

                <div className="flex flex-wrap items-center text-sm text-slate-500 gap-3 font-medium">
                  <span className="text-emerald-600 font-bold">{doctorData?.specialization}</span>
                  <span className="text-slate-200" aria-hidden="true">•</span>
                  <span>{doctorData?.qualification?.degree}</span>
                  <span className="text-slate-200" aria-hidden="true">•</span>
                  <span>{doctorData?.experienceYears} Years Clinical Exp.</span>
                </div>
                
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Council Reg: {doctorData?.medicalCouncil}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse ring-4 ring-emerald-500/10"></div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Location</p>
                    <p className="text-sm font-bold text-slate-700">{doctorData?.location?.shortName || "Clinic Active"}</p>
                </div>
            </div>
          </div>

          {/* Revenue Analytics Section */}
          <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-emerald-500 rounded-full"></div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Financial Analytics</h2>
              </div>
              <Revenue />
          </div>

        </main>
      </div>
    </div>
  );
}
