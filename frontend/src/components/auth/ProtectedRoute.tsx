'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { PageLoadingScreen } from '@/components/loading/PageLoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * ProtectedRoute wrapper component
 * Redirects to login if no accessToken or refreshToken exists
 * Shows loading screen during auth initialization
 */
export function ProtectedRoute({ 
  children, 
  fallbackUrl = '/auth/login' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { accessToken, refreshToken, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Wait for auth initialization to complete
    if (isLoading) return;

    // If no tokens exist, redirect to login
    if (!accessToken && !refreshToken) {
      router.push(fallbackUrl);
    }
  }, [accessToken, refreshToken, isLoading, isAuthenticated, router, fallbackUrl]);

  // Show loading screen during auth check
  if (isLoading) {
    return <PageLoadingScreen />;
  }

  // If tokens don't exist, show loading while redirecting
  if (!accessToken && !refreshToken) {
    return <PageLoadingScreen />;
  }

  // Render protected content
  return <>{children}</>;
}
