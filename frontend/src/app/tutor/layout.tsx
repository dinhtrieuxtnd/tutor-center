'use client';

import { useEffect, useState } from 'react';
import { Header, TutorSidebar } from '@/components/layout';
import { profileApi } from '@/services/profileApi';

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState<string>();
  const [userAvatar, setUserAvatar] = useState<string>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileApi.getProfile();
        const profileData = response?.data || response;
        if (profileData) {
          setUserName(profileData.fullName);
          setUserAvatar(profileData.imageUrls?.url);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="tutor" userName={userName} userAvatar={userAvatar} />
      <TutorSidebar />
      <main className="ml-64 mt-16 p-8">
        {children}
      </main>
    </div>
  );
}
