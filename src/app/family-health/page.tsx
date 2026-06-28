"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavbarPage from "@/app/navbar/page";
import Footer from "@/app/footer/page";
import FamilyMemberSelector from "./FamilyMemberSelector";
import FamilyAIChat from "./FamilyAIChat";
import AddFamilyMemberModal from "./AddFamilyMemberModal";
import VerifyMemberModal from "./VerifyMemberModal";
import QuickInsights from "./QuickInsights";
import { getFamilyMembers } from "@/services/apis/family.api";
import { Users, Brain, Activity, Plus, HeartPulse, Sparkles } from "lucide-react";

export default function FamilyHealthPage() {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [activeMember, setActiveMember] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "insights">("chat");
  const [showAddModal, setShowAddModal] = useState(false);
  const [memberToVerify, setMemberToVerify] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/family-health");
      return;
    }
    loadMembers();
  }, [user]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await getFamilyMembers();
      if (res.data?.success) {
        setMembers(res.data.members);
        // Default to "self" member if available
        const selfMember = res.data.members.find((m: any) => m.isDefault);
        if (selfMember) setActiveMember(selfMember);
        else if (res.data.members.length > 0) setActiveMember(res.data.members[0]);
      }
    } catch (err) {
      console.error("Failed to load family members:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "chat", label: "AI Health Chat", icon: Brain },
    { id: "insights", label: "Quick Insights", icon: Activity },
  ];

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f0f7f4]">
      <NavbarPage />

      <div className="pt-20">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-[#0a4d33] via-[#0d6b47] to-[#1a8a5a] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <HeartPulse className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-emerald-300 font-semibold text-sm uppercase tracking-widest">
                    Family Health Hub
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                  Your Family's Health,{" "}
                  <span className="text-emerald-300">All in One Place</span>
                </h1>
                <p className="text-emerald-100/80 text-base max-w-xl">
                  AI-powered health assistant that understands your family's complete medical history. Ask anything — get answers grounded in your actual records.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#0a4d33] border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Loading your family health data...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left Column: Family Members */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#0a4d33]" />
                      <span className="text-sm font-bold text-slate-800">Family Members</span>
                    </div>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-8 h-8 bg-emerald-50 hover:bg-emerald-100 text-[#0a4d33] rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <FamilyMemberSelector
                    members={members}
                    activeMember={activeMember}
                    onSelect={setActiveMember}
                    onAddMember={() => setShowAddModal(true)}
                    onRefresh={loadMembers}
                    onVerify={(member) => setMemberToVerify(member)}
                  />
                </div>
              </div>

              {/* Right Column: Main Content */}
              <div className="xl:col-span-3 flex flex-col gap-6">
                {/* Tab Navigation */}
                <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-slate-100 w-fit">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          activeTab === tab.id
                            ? "bg-[#0a4d33] text-white shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "chat" ? (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FamilyAIChat activeMember={activeMember} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <QuickInsights activeMember={activeMember} members={members} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddFamilyMemberModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadMembers();
          }}
        />
      )}

      <AnimatePresence>
        {memberToVerify && (
          <VerifyMemberModal
            member={memberToVerify}
            onClose={() => setMemberToVerify(null)}
            onSuccess={() => {
              setMemberToVerify(null);
              loadMembers();
            }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
