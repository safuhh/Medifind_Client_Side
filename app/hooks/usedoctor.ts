"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export const useDoctor = () => {
  const router = useRouter();
  const { user, accessToken } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
  if (!user) return;

    // 🔥 FIX: wait for user load + safer check
    if (user && user.role !== "doctor") {
      router.push("/");
    }
  }, [user, accessToken, router]);
};