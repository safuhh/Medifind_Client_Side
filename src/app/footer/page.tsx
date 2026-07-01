"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Storefront, Stethoscope, Lightning } from "@phosphor-icons/react";
import { SocialIcons } from "@/components/SocialIcons";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0a4d33] text-emerald-50 py-16 px-6 font-sans border-t border-emerald-900/50">
      <div className="max-w-7xl mx-auto">
        

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-9 h-9 bg-emerald-400/20 rounded-xl flex items-center justify-center border border-emerald-400/30 group-hover:bg-emerald-400/30 transition-colors">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">MediFind</span>
            </Link>
            
            <p className="text-emerald-100/70 text-sm leading-relaxed max-w-sm">
              Your comprehensive ecosystem for AI medicine fulfillment, verified doctor consultations, and instant delivery tracking.
            </p>

            <div className="flex flex-col gap-3.5 mt-2">
              <div className="flex items-center gap-3 text-sm text-emerald-100/70">
                <Storefront size={20} weight="duotone" className="text-emerald-400" />
                <span><strong className="font-semibold text-white">50+</strong> Partnered Pharmacies</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-100/70">
                <Stethoscope size={20} weight="duotone" className="text-emerald-400" />
                <span><strong className="font-semibold text-white">100+</strong> Verified Doctors</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-100/70">
                <Lightning size={20} weight="duotone" className="text-emerald-400" />
                <span><strong className="font-semibold text-white">99.9%</strong> Platform Uptime</span>
              </div>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-white font-semibold mb-6 tracking-tight">Platform</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/" className="text-emerald-100/70 hover:text-emerald-300 transition-colors text-sm">Home</Link></li>
              <li><Link href="/search" className="text-emerald-100/70 hover:text-emerald-300 transition-colors text-sm">Search Medicines</Link></li>
              <li><Link href="/upload" className="text-emerald-100/70 hover:text-emerald-300 transition-colors text-sm">Upload Prescription</Link></li>
              <li><Link href="/doctors" className="text-emerald-100/70 hover:text-emerald-300 transition-colors text-sm">Find Doctors</Link></li>
              <li><Link href="/track" className="text-emerald-100/70 hover:text-emerald-300 transition-colors text-sm">Track Order</Link></li>
              <li><Link href="/subcription" className="text-emerald-100/70 hover:text-emerald-300 transition-colors text-sm">Pricing & Plans</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-6 tracking-tight">Partners</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/seller" className="text-emerald-100/70 hover:text-emerald-300 transition-colors text-sm">Seller Dashboard</Link></li>
              <li><Link href="/partner" className="text-emerald-100/70 hover:text-emerald-300 transition-colors text-sm">Register Pharmacy</Link></li>
              <li><Link href="/delivery" className="text-emerald-100/70 hover:text-emerald-300 transition-colors text-sm">Join as Delivery</Link></li>
              <li><Link href="/doctors/register" className="text-emerald-100/70 hover:text-emerald-300 transition-colors text-sm">Register as Doctor</Link></li>
              <li><Link href="/admin" className="text-emerald-100/70 hover:text-emerald-300 transition-colors text-sm">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold mb-6 tracking-tight">Contact Us</h3>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-emerald-100/50 uppercase tracking-wider mb-0.5">Email support</span>
                  <a href="mailto:support@medifind.com" className="text-sm font-medium text-emerald-50 hover:text-emerald-300 transition-colors">support@medifind.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-emerald-100/50 uppercase tracking-wider mb-0.5">Call us (9AM-6PM)</span>
                  <a href="tel:+917600000000" className="text-sm font-medium text-emerald-50 hover:text-emerald-300 transition-colors">+91 7600000000</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-emerald-100/50 uppercase tracking-wider mb-0.5">Headquarters</span>
                  <span className="text-sm font-medium text-emerald-50 leading-snug">Kerala, India</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-emerald-100/50 text-center md:text-left">
            © {new Date().getFullYear()} MediFind Technologies Pvt. Ltd. All rights reserved.
          </p>
          
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-sm text-emerald-100/50 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-emerald-100/50 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="text-sm text-emerald-100/50 hover:text-white transition-colors">Cookies</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <SocialIcons />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;