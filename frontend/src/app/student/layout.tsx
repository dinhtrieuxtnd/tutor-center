'use client';

import { Header, StudentSidebar } from '@/components/layout';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="student" />
      <StudentSidebar />
      <main className="ml-64 mt-16 p-8">
        {children}
      </main>
    </div>
  );
}
