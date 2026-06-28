"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteFamilyMember } from "@/services/apis/family.api";
import { toast } from "react-toastify";
import { Plus, Trash2, User, AlertTriangle, Loader2 } from "lucide-react";

const RELATIONSHIP_EMOJIS: Record<string, string> = {
  self: "🧑",
  mother: "👩",
  father: "👨",
  spouse: "💑",
  child: "👶",
  grandfather: "👴",
  grandmother: "👵",
  sibling: "👫",
  other: "👤",
};

const RELATIONSHIP_COLORS: Record<string, string> = {
  self: "bg-emerald-100 text-emerald-800",
  mother: "bg-pink-100 text-pink-800",
  father: "bg-blue-100 text-blue-800",
  spouse: "bg-purple-100 text-purple-800",
  child: "bg-yellow-100 text-yellow-800",
  grandfather: "bg-orange-100 text-orange-800",
  grandmother: "bg-rose-100 text-rose-800",
  sibling: "bg-cyan-100 text-cyan-800",
  other: "bg-slate-100 text-slate-700",
};

interface Props {
  members: any[];
  activeMember: any | null;
  onSelect: (member: any) => void;
  onAddMember: () => void;
  onRefresh: () => void;
  onVerify?: (member: any) => void;
}

export default function FamilyMemberSelector({ members, activeMember, onSelect, onAddMember, onRefresh, onVerify }: Props) {
  const [memberToDelete, setMemberToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent, member: any) => {
    e.stopPropagation();
    if (member.isDefault) {
      toast.error("Cannot delete your primary (self) profile");
      return;
    }
    setMemberToDelete(member);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFamilyMember(memberToDelete._id);
      toast.success(`${memberToDelete.name} removed`);
      onRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    } finally {
      setIsDeleting(false);
      setMemberToDelete(null);
    }
  };

  if (members.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-emerald-400" />
        </div>
        <p className="text-slate-500 text-sm mb-4">No family members yet. Add yourself to get started.</p>
        <button
          onClick={onAddMember}
          className="bg-[#0a4d33] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0d6b47] transition-colors flex items-center gap-2 mx-auto"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="p-3 flex flex-col gap-2">
        {members.map((member) => {
        const isActive = activeMember?._id === member._id;
        const emoji = RELATIONSHIP_EMOJIS[member.relationship] || "👤";
        const color = RELATIONSHIP_COLORS[member.relationship] || RELATIONSHIP_COLORS.other;

        return (
          <motion.div
            key={member._id}
            onClick={() => onSelect(member)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full cursor-pointer flex items-center gap-3 p-3 rounded-xl text-left transition-all group relative ${
              isActive
                ? "bg-[#0a4d33] text-white shadow-md"
                : "bg-slate-50 hover:bg-slate-100 text-slate-800"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                isActive ? "bg-white/20" : "bg-white"
              }`}
            >
              {member.profileImage ? (
                <img src={member.profileImage} alt={member.name} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                emoji
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold truncate ${isActive ? "text-white" : "text-slate-800"}`}>
                {member.name}
              </p>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                  isActive ? "bg-white/20 text-white" : color
                }`}
              >
                {member.relationship}
              </span>
              {member.verificationStatus === "pending" && (
                <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? "bg-amber-400 text-white" : "bg-amber-100 text-amber-700"}`}>
                  Pending
                </span>
              )}
            </div>

            {member.verificationStatus === "pending" && onVerify && (
              <button
                onClick={(e) => { e.stopPropagation(); onVerify(member); }}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                  isActive ? "bg-white text-[#0a4d33] hover:bg-emerald-50" : "bg-[#0a4d33] text-white hover:bg-[#0d6b47]"
                }`}
              >
                Verify
              </button>
            )}

            {!member.isDefault && member.verificationStatus !== "pending" && (
              <button
                onClick={(e) => handleDeleteClick(e, member)}
                className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all ${
                  isActive ? "hover:bg-white/20 text-white" : "hover:bg-red-50 text-red-400"
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        );
      })}

      {members.length < 10 && (
        <button
          onClick={onAddMember}
          className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center">
            <Plus className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </div>
          <span className="text-sm font-medium text-slate-400 group-hover:text-emerald-600">Add family member</span>
        </button>
      )}
      </div>

      <AnimatePresence>
        {memberToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 pb-0 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Remove Family Member</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Are you sure you want to remove <span className="font-bold text-slate-700">{memberToDelete.name}</span> from your family? This action cannot be undone.
                </p>
              </div>
              
              <div className="p-6 flex gap-3">
                <button
                  onClick={() => setMemberToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Remove"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
