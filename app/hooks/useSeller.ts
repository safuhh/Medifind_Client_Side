"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export const useSeller = () => {
  const router = useRouter();
  const { user, accessToken } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
      return;
    }
  if (!user) return;

    if (user && user.role !== "seller") {
      router.push("/");
    }
  }, [user, accessToken, router]);
};