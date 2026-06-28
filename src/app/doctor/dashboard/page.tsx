"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/redux/hooks";
import { useRouter } from "next/navigation";
import DoctorSidebar from "@/app/doctor/navbar/page";
import { getApplicationStatus } from "@/services/apis/doctor.api";
import { getImageUrl } from "@/utils/imageUrl";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import api from "@/services/apis/api";
import dayjs from "dayjs";
import { FiStar, FiCalendar, FiDollarSign, FiUsers, FiActivity } from "react-icons/fi";

export default function DoctorDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [revenueTotals, setRevenueTotals] = useState<any>({ today: 0, month: 0, year: 0, totalBookings: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user && user.role !== "doctor") {
      router.push("/");
    } else if (!user) {
      router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          const [statusRes, apptsRes, revRes] = await Promise.all([
            getApplicationStatus(),
            api.get("/booking/doctor-appointments"),
            api.get("/doctor-revenue/today").catch(() => ({ data: { totals: { today: 0, month: 0, year: 0, totalBookings: 0 } } }))
          ]);
          setDoctorData(statusRes.data.application);
          setAppointments(apptsRes.data.bookings || []);
          if (revRes.data?.totals) {
            setRevenueTotals(revRes.data.totals);
          }
        } catch (err) {
          console.error("Error fetching doctor data", err);
        } finally {
          setLoading(false);
          setLoadingStats(false);
        }
      };
      fetchData();
    }
  }, [user, router]);

  // Compute doctor metrics dynamically from database appointments
  const totalRevenue = appointments
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const todayApps = appointments.filter(
    (b) =>
      b.status !== "cancelled" &&
      b.date &&
      dayjs(b.date).isSame(dayjs(), "day")
  ).length;

  const upcomingApps = appointments.filter(
    (b) =>
      b.status === "scheduled" &&
      b.date &&
      dayjs(b.date).isAfter(dayjs(), "day")
  ).length;

  const completedConsults = appointments.filter(
    (b) => b.consultationStatus === "completed" || b.status === "completed"
  ).length;

  const pendingConsults = appointments.filter(
    (b) =>
      b.status === "pending" ||
      (b.status === "scheduled" && b.consultationStatus !== "completed")
  ).length;

  const distinctPatients = Array.from(
    new Set(appointments.map((b) => b.userId?._id || b.userId).filter(Boolean))
  ).length;

  const activeCount = appointments.filter((b) => b.status !== "cancelled").length;
  const successRate =
    activeCount > 0 ? Math.round((completedConsults / activeCount) * 100) : 100;

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0a4d33] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Loading Clinical Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex relative">
      <DoctorSidebar />

      <div className="flex-1 w-full md:ml-64 transition-all duration-300">
        <main className="max-w-7xl mx-auto pt-8 md:pt-12 pb-20 px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Professional Doctor Profile Header */}
          <Card className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-border bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
              {doctorData?.profileImage && (
                <img
                  src={getImageUrl(doctorData.profileImage)}
                  className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-slate-100 shrink-0"
                  alt="Doctor"
                />
              )}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Dr. {doctorData?.fullName}
                    </h1>
                    <Badge variant="success">Verified Profile</Badge>
                </div>

                <div className="flex flex-wrap items-center text-sm text-slate-500 gap-2 font-semibold">
                  <span className="text-[#0a4d33] font-bold">{doctorData?.specialization}</span>
                  <span className="text-slate-200" aria-hidden="true">•</span>
                  <span>{doctorData?.qualification?.degree}</span>
                  <span className="text-slate-200" aria-hidden="true">•</span>
                  <span>{doctorData?.experienceYears} Years Clinical Exp.</span>
                </div>
                
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Medical Council Reg: {doctorData?.medicalCouncil}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-3 w-full sm:w-auto">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Clinical Location</p>
                    <p className="text-xs font-black text-slate-700">{doctorData?.location?.shortName || "Clinic Active"}</p>
                </div>
            </div>
          </Card>

          {/* KPI Dashboard Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 hover:border-emerald-100 transition-all duration-300 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50/30 rounded-bl-full -mr-4 -mt-4 transition-all duration-500 group-hover:scale-110" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Earnings</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <FiDollarSign size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-900">
                  {loadingStats ? (
                    <div className="h-7 w-24 bg-slate-100 animate-pulse rounded-md" />
                  ) : (
                    `₹${totalRevenue.toLocaleString()}`
                  )}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1">Direct payout balance</p>
              </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 hover:border-teal-100 transition-all duration-300 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/30 rounded-bl-full -mr-4 -mt-4 transition-all duration-500 group-hover:scale-110" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today's Appointments</span>
                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
                  <FiCalendar size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-900">
                  {loadingStats ? (
                    <div className="h-7 w-12 bg-slate-100 animate-pulse rounded-md" />
                  ) : (
                    `${todayApps} Scheduled`
                  )}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1">Real-time daily schedule</p>
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 hover:border-amber-100 transition-all duration-300 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/30 rounded-bl-full -mr-4 -mt-4 transition-all duration-500 group-hover:scale-110" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Rating</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <FiStar size={16} fill="currentColor" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-900">
                  {loadingStats ? (
                    <div className="h-7 w-20 bg-slate-100 animate-pulse rounded-md" />
                  ) : (
                    `${doctorData?.rating ? Number(doctorData.rating).toFixed(1) : "0.0"} / 5.0`
                  )}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1">Based on {doctorData?.ratingCount || 0} reviews</p>
              </div>
            </div>

            {/* Total Patients Treated */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 hover:border-indigo-100 transition-all duration-300 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-bl-full -mr-4 -mt-4 transition-all duration-500 group-hover:scale-110" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patients Treated</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700">
                  <FiUsers size={16} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-900">
                  {loadingStats ? (
                    <div className="h-7 w-12 bg-slate-100 animate-pulse rounded-md" />
                  ) : (
                    `${distinctPatients} Patients`
                  )}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1">Distinct clinical profiles</p>
              </div>
            </div>
          </div>

          {/* Detailed Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Consultation Success Metrics */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FiActivity className="text-[#0a4d33]" />
                  Consultation Diagnostics
                </h3>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Success Rate: {successRate}%
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-slate-900">
                    {loadingStats ? "..." : completedConsults}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Completed</p>
                </div>
                <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-slate-900">
                    {loadingStats ? "..." : pendingConsults}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Pending</p>
                </div>
                <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-slate-900">
                    {loadingStats ? "..." : upcomingApps}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Upcoming</p>
                </div>
                <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-slate-900">
                    {loadingStats ? "..." : completedConsults}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Prescriptions</p>
                </div>
              </div>
            </div>

            {/* Income Highlights */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2 mb-6">
                <FiDollarSign className="text-[#0a4d33]" />
                Revenue Milestones
              </h3>
              <div className="space-y-4 text-xs font-semibold text-slate-650">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Monthly Earnings</span>
                  <span className="text-slate-900 font-black">
                    {loadingStats ? "..." : `₹${revenueTotals.month.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Yearly Revenue</span>
                  <span className="text-slate-900 font-black">
                    {loadingStats ? "..." : `₹${revenueTotals.year.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-400 font-medium">Total Bookings</span>
                  <span className="text-slate-900 font-black">
                    {loadingStats ? "..." : `${revenueTotals.totalBookings} slots`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
