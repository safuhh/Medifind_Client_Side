"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export const useDoctor = () => {
  const router = useRouter();
  const { user, isLoading } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "doctor") {
      router.push("/");
    }
  }, [user, isLoading, router]);
};