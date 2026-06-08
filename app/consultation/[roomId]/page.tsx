"use client";

import React, { useState, useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useParams, useRouter } from "next/navigation";
import api from "../../apis/api";
import { io } from "socket.io-client";
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
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [jitsiToken, setJitsiToken] = useState<string | null>(null);
  const [jitsiAppId, setJitsiAppId] = useState<string | null>(null);

  // 1. Fetch initial authorization & server-calculated duration
  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const res = await api.get(`/consultation/${roomId}`);
        if (res.data.success) {
          const {
            consultation: cons,
            isAllowed: allowed,
            timeMessage: msg,
            remainingSeconds: seconds,
            jitsiToken: token,
            jitsiAppId: appId,
          } = res.data;

          setConsultation(cons);
          setIsAllowed(allowed);
          setTimeMessage(msg);
          setRemainingSeconds(seconds);
          setJitsiToken(token);
          setJitsiAppId(appId);
        }
      } catch (err: any) {
        console.error("Error fetching consultation:", err);
        const errMsg = err.response?.data?.message || "Failed to load consultation details";
        toast.error(errMsg);
        setTimeMessage(errMsg);
        setIsAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchConsultation();
    }
  }, [roomId]);

  // 2. Relative countdown timer independent of client-side system clock manipulation
  useEffect(() => {
    if (!isAllowed || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsAllowed(false);
          setTimeMessage("This consultation session has expired.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAllowed, remainingSeconds]);

  useEffect(() => {
    if (!roomId) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://medifind-env.eba-6rdig2er.eu-north-1.elasticbeanstalk.com";
    const socket = io(socketUrl);

    socket.emit("join_consultation_room", roomId);

    socket.on("consultation_status_changed", (data) => {
      console.log("Real-time consultation status change:", data);
      if (data.status === "completed") {
        setIsAllowed(false);
        setTimeMessage("This consultation has been completed.");
        toast.info("Consultation completed by the doctor.");
      }
    });

    return () => {
      socket.off("consultation_status_changed");
      socket.disconnect();
    };
  }, [roomId]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

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
          <h1 className="text-2xl font-black text-slate-900">Room Status</h1>
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
    <div className="w-full h-screen flex flex-col bg-slate-900">
      {/* Floating Header with Remaining Time */}
      <div className="bg-slate-950 text-white py-3 px-6 flex justify-between items-center shadow-md z-50 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-semibold text-sm tracking-wide text-slate-200">Live Consultation Room</span>
        </div>
        <div className="bg-slate-900 text-emerald-400 font-mono font-bold px-4 py-1.5 rounded-xl border border-slate-800 text-sm flex items-center gap-2">
          <FiClock size={16} />
          <span>Time Remaining: {formatTime(remainingSeconds)}</span>
        </div>
      </div>

      {/* Jitsi Meeting Iframe wrapper */}
      <div className="flex-1 w-full bg-slate-900">
        <JitsiMeeting
          domain={jitsiAppId ? "8x8.vc" : "meet.jit.si"}
          roomName={jitsiAppId ? `${jitsiAppId}/${roomId}` : roomId}
          jwt={jitsiToken || undefined}
          getIFrameRef={(node) => {
            if (node) {
              node.style.height = "100%";
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
    </div>
  );
}