"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect về dashboard thay vì hiển thị 404
    router.replace("/dashboard");
  }, [router]);

  return null;
}
