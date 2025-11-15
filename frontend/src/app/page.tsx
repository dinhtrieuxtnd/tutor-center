"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, student } = useAuth();

  useEffect(() => {
    // Middleware sẽ xử lý redirect dựa trên cookies
    // Component này chỉ cần đảm bảo không render gì
    // Middleware sẽ redirect về:
    // - /auth/login nếu chưa đăng nhập
    // - /student/dashboard, /tutor/dashboard, hoặc /admin/dashboard nếu đã đăng nhập
  }, [router, isAuthenticated, student]);

  // Trong lúc kiểm tra auth và redirect, không hiển thị gì
  return null;
}
