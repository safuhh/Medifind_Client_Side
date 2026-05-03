"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export const useDeliveryBoy = () => {
  const router = useRouter();
  const { user, accessToken } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
  if (!user) return;

    // 🔥 FIX: wait for user load + safer check
    if (user && user.role !== "delivery_boy") {
      router.push("/");
    }
  }, [user, accessToken, router]);
};