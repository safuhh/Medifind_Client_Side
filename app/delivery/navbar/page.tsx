"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/redux/hooks";
import { logout } from "@/app/redux/authSlice";
import {
  LayoutDashboard,
  Package,
  Wallet,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import clsx from "clsx";
import { HeartIcon } from "@heroicons/react/24/solid";


const navItems = [
  { name: "Dashboard", path: "/delivery/dashboard", icon: LayoutDashboard },
  { name: "Inform", path: "/delivery", icon: Package },
  { name: "Earnings", path: "/delivery/earnings", icon: Wallet },
  { name: "Profile", path: "/delivery/profile", icon: User },
];

export default function DeliverySidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

 return (
  <>
    {/* --- MOBILE TOP BAR --- */}
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between z-40">
      <div className="flex items-center gap-2">
        <div className="bg-[#105e3f] text-white p-1.5 rounded-lg">
          <HeartIcon className="w-5 h-5" fill="currentColor" />
        </div>
        <span className="font-bold text-lg text-slate-800 tracking-tight">MediFind</span>
      </div>
      
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>
    </header>

    {/* --- OVERLAY --- */}
    {isOpen && (
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-[60] md:hidden transition-all duration-300"
      />
    )}

    {/* --- SIDEBAR --- */}
    <aside
      className={clsx(
        "fixed top-0 left-0 h-full w-[280px] bg-white z-[70] transform transition-transform duration-300 ease-out flex flex-col border-r border-slate-100",
        {
          "-translate-x-full md:translate-x-0": !isOpen,
          "translate-x-0 shadow-2xl": isOpen,
        }
      )}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="bg-[#105e3f] text-white p-1.5 rounded-lg shadow-sm">
            <HeartIcon className="w-5 h-5" fill="currentColor" />
          </div>
          <h2 className="font-bold text-xl text-slate-800">MediFind</h2>
        </div>

        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-3 mb-2">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => {
                router.push(item.path);
                setIsOpen(false);
              }}
              className={clsx(
                "w-full group flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold",
                active
                  ? "bg-[#105e3f] text-white shadow-lg shadow-[#105e3f]/20"
                  : "text-slate-500 hover:bg-[#105e3f]/5 hover:text-[#105e3f]"
              )}
            >
              <Icon 
                size={20} 
                className={clsx(
                  "transition-transform group-hover:scale-110",
                  active ? "text-white" : "text-slate-400 group-hover:text-[#105e3f]"
                )} 
              />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* FOOTER / LOGOUT */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/50">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:text-rose-600 hover:bg-rose-100/50 transition-all"
        >
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-rose-200 shadow-sm">
            <LogOut size={18} className="text-slate-400 group-hover:text-rose-500" />
          </div>
          Logout
        </button>
      </div>
    </aside>

    {/* SPACER FOR MOBILE CONTENT (Prevents content hiding under header) */}
    <div className="h-16 md:hidden" />
  </>
);
}