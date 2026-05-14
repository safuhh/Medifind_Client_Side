"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useRouter } from "next/navigation";
import DoctorSidebar from "@/app/doctor/navbar/page";
import { getApplicationStatus } from "../../apis/doctor.api";
import { getImageUrl } from "../../utils/imageUrl";

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex relative">
      <DoctorSidebar />

      <div className="flex-1 w-full md:ml-64 transition-all duration-300">
        <main className="max-w-7xl mx-auto pt-8 md:pt-12 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex p-10  flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              {doctorData?.profileImage && (
                <img
                  src={getImageUrl(doctorData.profileImage)}
                  className="w-20 h-20 rounded-3xl object-cover shadow-xl shadow-emerald-900/10 border-4 border-white"
                  alt="Doctor"
                />
              )}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
                  Welcome back,{" "}
                  <span className="text-emerald-600">
                    Dr. {doctorData?.fullName}
                  </span>
                </h1>

                {/* Consolidated Metadata Row */}
                <div className="flex flex-wrap items-center text-sm text-slate-500 gap-2 sm:gap-3">
                  <span className="font-medium text-slate-700">
                    {doctorData?.specialization}
                  </span>
                  <span className="text-slate-300" aria-hidden="true">
                    •
                  </span>

                  <span>{doctorData?.qualification?.degree}</span>
                  <span className="text-slate-300" aria-hidden="true">
                    •
                  </span>

                  <span>{doctorData?.experienceYears} Yrs Exp.</span>
                  <span className="text-slate-300" aria-hidden="true">
                    •
                  </span>

                  <span>{doctorData?.location?.shortName}</span>
                </div>

                {/* Subtle Subtext for Council */}
                <p className="text-xs text-slate-400">
                  Reg: {doctorData?.medicalCouncil}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto mt-2 md:mt-0"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
