"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { HomepageHeader } from "@/components/header";

export default function Home() {
  const { student, isAuthenticated, logout } = useAuth();

  return (
    <div>
      
    </div>
  );
}
