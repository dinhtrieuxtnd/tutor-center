'use client';

import { Header, AdminSidebar } from '@/components/layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="admin" />
      <AdminSidebar />
      <main className="ml-64 pt-16">
        {children}
      </main>
    </div>
  );
}
