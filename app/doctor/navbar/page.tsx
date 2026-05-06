"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/authSlice";
import { useAppSelector } from "../../redux/hooks";

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon as UserCircleIconOutline,
} from "@heroicons/react/24/outline";
import { HeartIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useDoctor } from "../../hooks/usedoctor";

// Navigation items - Fixed typos and updated paths for a Doctor
const navItems = [
  { name: "Dashboard", href: "/doctor/dashboard", icon: HomeIcon },
  { name: "Appointments", href: "/doctor/appointments", icon: ClipboardDocumentListIcon },
  { name: "Patients", href: "/doctor/patients", icon: UserGroupIcon },
  { name: "Update Profile", href: "/doctor/update-profile", icon: UserCircleIconOutline },
  { name: "Settings", href: "/doctor/settings", icon: Cog6ToothIcon },
];

export default function DoctorSidebar() {
  const doctor = useDoctor(); // Fetching doctor info if available
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [doctorData, setDoctorData] = useState<any>(null);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchDoctorData = async () => {
        try {
            const { getApplicationStatus } = await import("../../apis/doctor.api");
            const res = await getApplicationStatus();
            setDoctorData(res.data.application);
        } catch (err) {
            console.log("Could not fetch sidebar doctor data");
        }
    };
    if (user?.role === "doctor") fetchDoctorData();
  }, [user]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <>
      {/* 📱 Mobile Top Bar (Glassmorphism effect) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 text-white p-1.5 rounded-xl shadow-sm flex items-center justify-center">
            <HeartIcon className="w-5 h-5" fill="currentColor" />
          </div>
          <span className="text-lg font-bold text-slate-800 tracking-tight">Doctor Portal</span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors focus:outline-none"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* 📱 Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 💻 Sidebar / Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out shadow-sm md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header / Logo */}
        <div className="h-20 sm:h-24 flex items-center justify-between px-6 mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-700 text-white p-2 rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center">
              <HeartIcon className="w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Doctor<span className="text-emerald-700">Side</span>
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 mt-2">
            Menu
          </p>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                    : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/50"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600"
                  } ${!isActive && "group-hover:scale-110"}`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Area (Profile & Logout) */}
        <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
          
          {/* Optional User Snippet */}
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-white border border-slate-100 shadow-sm">
            {doctorData?.profileImage ? (
                <img 
                    src={doctorData.profileImage.startsWith('http') ? doctorData.profileImage : `http://localhost:5000${doctorData.profileImage}`} 
                    className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-100" 
                    alt="Doctor" 
                />
            ) : (
                <UserCircleIcon className="w-10 h-10 text-slate-300" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
             Dr. {user?.name }
              </p>
              <p className="text-xs font-medium text-slate-500 truncate">
                {user?.email || "Physician"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <ArrowRightOnRectangleIcon 
              className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" 
              strokeWidth={1.5} 
            />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}