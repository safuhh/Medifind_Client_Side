"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { verifyFamilyMember, resendFamilyMemberOTP } from "@/services/apis/family.api";
import { toast } from "react-toastify";
import { X, Loader2, RefreshCw } from "lucide-react";

interface Props {
  member: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VerifyMemberModal({ member, onClose, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyFamilyMember(member._id, code);
      toast.success("Family member successfully added!");
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to verify. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResendLoading(true);
    try {
      await resendFamilyMemberOTP(member._id);
      toast.success("A new OTP has been sent to your email.");
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="bg-[#0a4d33] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Verify New Member</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-sm text-slate-600">
              An OTP has been sent to your registered email address. Please enter the 6-digit code below to securely verify and add this family member.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 text-center">Enter 6-Digit Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full text-center text-3xl tracking-[1em] font-mono border border-slate-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#0a4d33]/30 focus:border-[#0a4d33] text-slate-900 bg-white placeholder:text-slate-300"
            />
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading || cooldown > 0}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
              >
                {resendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0a4d33] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#0d6b47] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Verifying..." : "Verify & Add"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
