"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/redux/hooks";
import { logout } from "@/store/redux/authSlice";
import {
  HomeIcon,
  DocumentPlusIcon,
  TruckIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useAdmin } from "@/hooks/useAdmin";

// Navigation items
const navItems = [
  { name: "Dashboard", href: "/admin/admindashboard", icon: HomeIcon },
  { name: "Seller Requests", href: "/admin", icon: DocumentPlusIcon },
  {
    name: "Delivery-Boy Requests",
    href: "/admin/delivery",
    icon: TruckIcon,
  },
  {
    name: "Doctor Verifications",
    href: "/admin/doctor-applications",
    icon: CheckBadgeIcon,
  },
  {
    name: "Seller Management",
    href: "/admin/blockseller",
    icon: BuildingStorefrontIcon,
  },
  {
    name: "Delivery-Boy",
    href: "/admin/deliveryboy",
    icon: MapPinIcon,
  },
  {
    name: "Doctor Management",
    href: "/admin/blockdoctor",
    icon: UserGroupIcon,
  },
];


export default function AdminSidebar() {
  useAdmin();

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  // 🔥 Logout handler
  const handleLogout = () => {
    dispatch(logout());
    router.push("/"); // redirect after logout
  };

  // The primary dark green color used in the design
  const brandColor = "#105e3f";

  return (
    <>
      {/* Mobile Top Bar (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200/60 flex items-center justify-between px-4 z-40">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-[#105e3f] text-white p-1.5 rounded-full flex items-center justify-center">
            <HeartIcon className="w-5 h-5" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-[#105e3f]">Admin Side</span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-md focus:outline-none"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 w-72 h-screen bg-white border-r border-gray-200/60 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo & Mobile Close Button */}
        <div className="h-24 flex items-center justify-between px-8 border-b border-gray-100">
          {/* Desktop Logo */}
          <div className="flex items-center gap-2.5">
            <div className="bg-[#105e3f] text-white p-2 rounded-full flex items-center justify-center">
              <HeartIcon className="w-6 h-6" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#105e3f]">
              Admin Side
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-5 py-8 space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-[20px] text-[15px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#105e3f] text-white shadow-md shadow-[#105e3f]/20"
                    : "text-slate-700 hover:text-[#105e3f] hover:bg-emerald-50/50"
                }`}
              >
                <item.icon
                  className={`w-6 h-6 ${isActive ? "text-white" : "text-slate-800"}`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-5 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-5 py-3.5 rounded-[20px] text-[15px] font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" strokeWidth={1.5} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
