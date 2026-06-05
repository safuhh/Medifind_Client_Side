"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export const useDeliveryBoy = () => {
  const router = useRouter();
  const { user, isLoading } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "delivery_boy") {
      router.push("/");
    }
  }, [user, isLoading, router]);
};