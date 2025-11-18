'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { PageLoadingScreen } from '@/components/loading/PageLoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Mảng các role được phép truy cập
  fallbackUrl?: string;
}

/**
 * ProtectedRoute wrapper component
 * - Redirects to login if no accessToken or refreshToken exists
 * - Redirects to unauthorized page if user role doesn't match allowedRoles
 * - Shows loading screen during auth initialization
 */
export function ProtectedRoute({ 
  children, 
  allowedRoles,
  fallbackUrl = '/auth/login' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, accessToken, refreshToken, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth initialization to complete
    if (isLoading) return;

    // If no tokens exist, redirect to login
    if (!accessToken && !refreshToken) {
      router.push(fallbackUrl);
      return;
    }

    // Check role if allowedRoles is specified
    if (allowedRoles && allowedRoles.length > 0 && user) {
      const userRole = user.role?.toLowerCase();
      const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);
      
      if (!isAllowed) {
        // Redirect về dashboard đúng role của user
        if (userRole === 'admin') {
          router.push('/admin/dashboard');
        } else if (userRole === 'tutor') {
          router.push('/tutor/dashboard');
        } else if (userRole === 'student') {
          router.push('/student/dashboard');
        } else {
          router.push('/unauthorized');
        }
      }
    }
  }, [accessToken, refreshToken, isLoading, user, allowedRoles, router, fallbackUrl]);

  // Show loading screen during auth check
  if (isLoading) {
    return <PageLoadingScreen />;
  }

  // If tokens don't exist, show loading while redirecting
  if (!accessToken && !refreshToken) {
    return <PageLoadingScreen />;
  }

  // If role check failed, show loading while redirecting
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const userRole = user.role?.toLowerCase();
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);
    
    if (!isAllowed) {
      return <PageLoadingScreen />;
    }
  }

  // Render protected content
  return <>{children}</>;
}
