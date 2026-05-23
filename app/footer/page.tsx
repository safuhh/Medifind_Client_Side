import React from "react";
import Link from "next/link";
import { SocialIcons } from "../components/SocialIcons"; // Adjust path as needed

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0a4d33] text-white pt-20 pb-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* 1. Brand Section */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 bg-emerald-400/20 rounded-lg flex items-center justify-center border border-emerald-400/30">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight">MediFind</span>
            </Link>
            <p className="text-emerald-100/70 text-sm leading-relaxed max-w-[280px]">
              Your trusted healthcare partner for finding medicines quickly and easily across nearby pharmacies.
            </p>
            <SocialIcons />
          </div>

          {/* 2. Quick Links */}
          <nav className="flex flex-col gap-6">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/" className="text-emerald-100/60 hover:text-emerald-400 transition-colors text-sm font-medium">Home</Link></li>
              <li><Link href="/search" className="text-emerald-100/60 hover:text-emerald-400 transition-colors text-sm font-medium">Search Medicines</Link></li>
              <li><Link href="/upload" className="text-emerald-100/60 hover:text-emerald-400 transition-colors text-sm font-medium">Upload Prescription</Link></li>
            </ul>
          </nav>

          {/* 3. For Pharmacies */}
          <nav className="flex flex-col gap-6">
            <h3 className="text-lg font-bold">For Pharmacies</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/seller" className="text-emerald-100/60 hover:text-emerald-400 transition-colors text-sm font-medium">Seller Dashboard</Link></li>
              <li><Link href="/partner" className="text-emerald-100/60 hover:text-emerald-400 transition-colors text-sm font-medium">Register Your Pharmacy</Link></li>
            </ul>
          </nav>

          {/* 4. Contact Us */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <div className="flex flex-col gap-5">
              <address className="not-italic flex flex-col gap-5">
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-400/10 transition-colors">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500/50 mb-0.5">Email</span>
                    <a href="mailto:support@medifind.com" className="text-sm font-medium text-emerald-100/80 hover:text-white transition-colors tracking-tight">support@medifind.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-400/10 transition-colors">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500/50 mb-0.5">Location</span>
                    <p className="text-sm font-medium text-emerald-100/80 leading-snug max-w-[180px] tracking-tight">123 Healthcare St, Medical District, City - 400001</p>
                  </div>
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/30 text-center md:text-left">
            © {new Date().getFullYear()} MediFind. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/30 hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100/30 hover:text-emerald-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;