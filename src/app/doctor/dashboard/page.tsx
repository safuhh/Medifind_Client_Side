"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/redux/hooks";
import { useRouter } from "next/navigation";
import DoctorSidebar from "@/app/doctor/navbar/page";
import { getApplicationStatus } from "@/services/apis/doctor.api";
import { getImageUrl } from "@/utils/imageUrl";
import Revenue from "../revenue/page";
import { Card, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-bold uppercase tracking-widest text-ink-faint">Loading Clinical Profile...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-surface font-sans flex relative">
      <DoctorSidebar />

      <div className="flex-1 w-full md:ml-64 transition-all duration-300">
        <main className="max-w-7xl mx-auto pt-8 md:pt-12 pb-20 px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Professional Doctor Profile Header */}
          <Card className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-border">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
              {doctorData?.profileImage && (
                <img
                  src={getImageUrl(doctorData.profileImage)}
                  className="w-24 h-24 rounded-md object-cover shadow-md border-2 border-white shrink-0"
                  alt="Doctor"
                />
              )}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                      Dr. {doctorData?.fullName}
                    </h1>
                    <Badge variant="success">Verified</Badge>
                </div>

                <div className="flex flex-wrap items-center text-sm text-ink-muted gap-2 font-semibold">
                  <span className="text-primary font-bold">{doctorData?.specialization}</span>
                  <span className="text-border" aria-hidden="true">•</span>
                  <span>{doctorData?.qualification?.degree}</span>
                  <span className="text-border" aria-hidden="true">•</span>
                  <span>{doctorData?.experienceYears} Years Clinical Exp.</span>
                </div>
                
                <p className="text-xs text-ink-faint font-bold uppercase tracking-wider">
                  Medical Council Reg: {doctorData?.medicalCouncil}
                </p>
              </div>
            </div>

            <div className="bg-surface px-6 py-4 rounded-sm border border-border flex items-center gap-3 w-full sm:w-auto">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <div>
                    <p className="text-[10px] font-bold text-ink-faint uppercase tracking-wider">Clinical Location</p>
                    <p className="text-sm font-bold text-ink-muted">{doctorData?.location?.shortName || "Clinic Active"}</p>
                </div>
            </div>
          </Card>

          {/* KPI Dashboard Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Consultations" value="148" trend={{ value: "12%", direction: "up" }} />
            <StatCard label="Live Appointments" value="8 Today" />
            <StatCard label="Average Rating" value="4.9 / 5.0" />
            <StatCard label="Wallet Balance" value="$4,250.00" trend={{ value: "8.5%", direction: "up" }} />
          </div>

          {/* Revenue Analytics Section */}
          <div className="space-y-6">
              <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-lg font-bold text-ink tracking-tight uppercase">Financial Analytics</h2>
              </div>
              <Revenue />
          </div>

        </main>
      </div>
    </div>
  );
}
