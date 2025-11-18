'use client';

import { useEffect, useState } from 'react';
import { Header, StudentSidebar } from '@/components/layout';
import { PageLoadingScreen } from '@/components/loading';
import { useAuth } from '@/hooks';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, accessToken, refreshToken } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (!isLoading) {
      setIsInitializing(false);
    }
  }, [isLoading]);

  if (isInitializing || isLoading) {
    return <PageLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="student" />
      <StudentSidebar />
      <main className="ml-64 mt-16">
        {children}
      </main>
    </div>
  );
}
