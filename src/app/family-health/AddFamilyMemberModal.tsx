"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { addFamilyMember } from "@/services/apis/family.api";
import { toast } from "react-toastify";
import { X, Plus, Loader2 } from "lucide-react";

const RELATIONSHIPS = [
  { value: "self", label: "Myself (Self)", emoji: "🧑" },
  { value: "mother", label: "Mother", emoji: "👩" },
  { value: "father", label: "Father", emoji: "👨" },
  { value: "spouse", label: "Spouse / Partner", emoji: "💑" },
  { value: "child", label: "Child", emoji: "👶" },
  { value: "grandfather", label: "Grandfather", emoji: "👴" },
  { value: "grandmother", label: "Grandmother", emoji: "👵" },
  { value: "sibling", label: "Sibling", emoji: "👫" },
  { value: "other", label: "Other", emoji: "👤" },
];



interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddFamilyMemberModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "",
    relationship: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.relationship) {
      toast.error("Name and relationship are required");
      return;
    }

    setLoading(true);
    try {
      await addFamilyMember({
        name: form.name.trim(),
        relationship: form.relationship,
        gender: form.gender || undefined,
      });
      toast.success(`${form.name} added to your family!`);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add family member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Add Family Member</h2>
            <p className="text-sm text-slate-400 mt-0.5">Their health records will be available to the AI</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Rahul Sharma"
              required
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0a4d33]/30 focus:border-[#0a4d33] text-slate-900 bg-white placeholder:text-slate-400"
            />
          </div>



          {/* Relationship */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Relationship *</label>
            <div className="grid grid-cols-3 gap-2">
              {RELATIONSHIPS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, relationship: r.value })}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                    form.relationship === r.value
                      ? "border-[#0a4d33] bg-emerald-50 text-[#0a4d33]"
                      : "border-slate-100 hover:border-slate-200 text-slate-600"
                  }`}
                >
                  <span className="text-lg">{r.emoji}</span>
                  <span className="text-center leading-tight">{r.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0a4d33]/30 focus:border-[#0a4d33] bg-white text-slate-900"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#0a4d33] hover:bg-[#0d6b47] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
              ) : (
                <><Plus className="w-4 h-4" /> Verify & Add</>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
