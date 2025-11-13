"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { student, isAuthenticated } = useAuth();

  useEffect(() => {
    // Nếu chưa đăng nhập → đá về login
    // if (isAuthenticated === false) {
    router.replace("/auth/login");
    // }
  }, []);

  // Trong lúc kiểm tra auth, tránh flicker bằng return null
  return null;
}
