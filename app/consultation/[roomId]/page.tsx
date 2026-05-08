"use client";

import React, { useState, useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useParams, useRouter } from "next/navigation";
import api from "../../apis/api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { FiClock, FiAlertCircle, FiArrowLeft } from "react-icons/fi";

export default function ConsultationRoom() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [loading, setLoading] = useState(true);
  const [consultation, setConsultation] = useState<any>(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [timeMessage, setTimeMessage] = useState("");

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await api.get(`/api/v1/consultation/${roomId}`);
        if (res.data.success) {
          const cons = res.data.consultation;
          setConsultation(cons);
          
          if (cons.status === "completed") {
            setIsAllowed(false);
            setTimeMessage("This consultation has already been completed.");
            setLoading(false);
            return;
          }
          
          const scheduledTime = dayjs(cons.scheduledAt);
          const now = dayjs();
          
          // Allow joining 10 minutes before and up to 2 hours after
          const startTime = scheduledTime.subtract(10, "minute");
          const endTime = scheduledTime.add(15, "minute");
          
          if (now.isBefore(startTime)) {
            setIsAllowed(false);
            setTimeMessage(`This consultation is scheduled for ${scheduledTime.format("DD MMM YYYY, hh:mm A")}. You can join 10 minutes before the time.`);
          } else if (now.isAfter(endTime)) {
            setIsAllowed(false);
            setTimeMessage("This consultation session has expired.");
          } else {
            setIsAllowed(true);
          }
        }
      } catch (err) {
        console.error("Error fetching consultation:", err);
        toast.error("Failed to load consultation details");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [roomId]);

  useEffect(() => {
    if (!consultation) return;

    const interval = setInterval(async () => {
      try {
        // Poll status to see if completed
        const res = await api.get(`/api/v1/consultation/${roomId}`);
        if (res.data.success) {
          const cons = res.data.consultation;
          if (cons.status === "completed") {
            setIsAllowed(false);
            setTimeMessage("This consultation has been completed.");
            clearInterval(interval);
            return;
          }
        }
      } catch (err) {
        console.error("Error checking consultation status:", err);
      }

      const scheduledTime = dayjs(consultation.scheduledAt);
      const endTime = scheduledTime.add(30, "minute");
      const now = dayjs();
      
      if (now.isAfter(endTime)) {
        setIsAllowed(false);
        setTimeMessage("This consultation session has expired.");
        clearInterval(interval);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [consultation, roomId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600 border-r-2 border-emerald-600/30"></div>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center space-y-6">
          <div className="bg-orange-50 text-orange-600 p-5 rounded-full inline-block">
            <FiClock size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Not Time Yet</h1>
          <p className="text-slate-500 font-medium">{timeMessage}</p>
          <button 
            onClick={() => router.back()}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomId}
        getIFrameRef={(node) => {
          if (node) {
            node.style.height = "100vh";
            node.style.width = "100%";
          }
        }}
        configOverwrite={{
          toolbarButtons: [
            "microphone",
            "camera",
            "desktop",
            "chat",
            "hangup",
          ],
        }}
      />
    </div>
  );
}