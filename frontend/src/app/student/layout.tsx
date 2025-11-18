'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header, StudentSidebar } from '@/components/layout';
import { PageLoadingScreen } from '@/components/loading';
import { useAuth } from '@/hooks';
import { motion } from 'framer-motion';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      setIsInitializing(false);
    }
  }, [isLoading]);

  if (isInitializing || isLoading) {
    return <PageLoadingScreen />;
  }

  // 👉 Trang learn: /student/class/[id]/learn
  const isLearnPage =
    pathname.startsWith('/student/class/') && pathname.endsWith('/learn');

  // 🧠 Với trang learn: KHÔNG header, KHÔNG sidebar
  if (isLearnPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // 🧱 Các trang student khác: có header + sidebar như bình thường
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header userRole="student" />

      <StudentSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="mt-16 z-30 relative"
      >
        {children}
      </motion.main>
    </div>
  );
}


// 'use client';

// import { Header, StudentSidebar } from '@/components/layout';
// import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// export default function StudentLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ProtectedRoute fallbackUrl="/auth/login">
//       <div className="min-h-screen bg-gray-50">
//         <Header userRole="student" />
//         <StudentSidebar />
//         <main className="ml-64 mt-16">
//           {children}
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }

