"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Khi auth đã load xong
    if (!isLoading) {
      // Nếu chưa đăng nhập → đá về /auth/login
      if (!isAuthenticated) {
        router.replace("/auth/login");
      } else {
        // Nếu đã đăng nhập → điều hướng vào dashboard (hoặc trang bạn muốn)
        router.replace("/student/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Trong lúc auth đang load hoặc đang redirect → không render gì
  return null;
}
