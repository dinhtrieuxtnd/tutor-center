'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JoinClassModal } from '@/components/dashboard';
import {
  AllClassesSection,
  MyEnrolledClassesSection,
  ViewMode,
} from '@/components/studentPages/classes';
import { useAuth, useClassroom, useDebounce, useJoinRequest, useNotification } from '@/hooks';

export default function MyClassesPage() {
  const {
    myEnrollments,
    isLoadingEnrollments,
  } = useClassroom();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-open-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* All Classes Section */}
        <AllClassesSection />

        {/* My Enrolled Classes Section */}
        <MyEnrolledClassesSection
          classes={myEnrollments}
          isLoading={isLoadingEnrollments}
        />
      </div>
    </div>
  );
}
