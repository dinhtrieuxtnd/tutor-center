'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useClassroom, useLesson, useMedia } from '@/hooks';
import { ClassDetailSkeleton } from '@/components/loading';
import { OverviewTab, LessonsTab, MembersTab, ProgressCard, QuickActions, TeacherInfo, StartLearningButton } from './components';
import {
  ArrowLeft,
  BookOpen,
  Users,
  Calendar,
  PlayCircle
} from 'lucide-react';

interface ClassMember {
  id: number;
  name: string;
  avatar?: string;
  role: 'teacher' | 'student';
}

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id;

  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'members'>('overview');
  const [coverImageUrl, setCoverImageUrl] = useState<string>('https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800');

  const { currentClassroom, isLoading, fetchClassroomById } = useClassroom();
  const { lessons, isLoading: isLoadingLessons, fetchLessonsByClassroom } = useLesson();
  const { fetchPresignedUrl } = useMedia();

  useEffect(() => {
    if (classId && typeof classId === 'string') {
      fetchClassroomById(classId);
      fetchLessonsByClassroom(classId);
    }
  }, [classId]);

  useEffect(() => {
    const fetchCoverImage = async () => {
      if (currentClassroom?.coverMediaId) {
        try {
          const result = await fetchPresignedUrl(currentClassroom.coverMediaId);
          if (result.payload && typeof result.payload === 'object' && 'url' in result.payload) {
            setCoverImageUrl(result.payload.url as string);
          }
        } catch (error) {
          console.error('Failed to fetch cover image:', error);
        }
      }
    };

    fetchCoverImage();
  }, [currentClassroom?.coverMediaId, fetchPresignedUrl]);

  if (isLoading || !currentClassroom) {
    return <ClassDetailSkeleton />;
  }

  const members: ClassMember[] = [
    { id: 1, name: 'Thầy Nguyễn Văn B', role: 'teacher' },
    { id: 2, name: 'Nguyễn Văn A', role: 'student' },
    { id: 3, name: 'Trần Thị B', role: 'student' },
    { id: 4, name: 'Lê Văn C', role: 'student' },
    { id: 5, name: 'Phạm Thị D', role: 'student' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-open-sans">

      {/* Back Button Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-open-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
        </div>
      </div>

      {/* Cover Image & Class Info */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div
            className="h-48 bg-gradient-to-r from-primary to-blue-600 relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(25, 77, 182, 0.8), rgba(25, 77, 182, 0.8)), url(${coverImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 flex items-end px-4 sm:px-6 lg:px-8 pb-6">
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2 font-poppins">{currentClassroom.name}</h1>
                <div className="flex items-center gap-4 text-sm font-open-sans">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {currentClassroom.studentCount} học sinh
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Thứ 2, 4, 6 - 14:00-16:00
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 border-b border-gray-200">
              {[
                { id: 'overview', label: 'Tổng quan', icon: BookOpen },
                { id: 'lessons', label: 'Bài học', icon: PlayCircle },
                { id: 'members', label: 'Thành viên', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-3 border-b-2 transition-colors font-open-sans ${activeTab === tab.id
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <OverviewTab
                classData={currentClassroom}
                lessons={lessons}
                onViewAllLessons={() => setActiveTab('lessons')}
                isLoading={isLoadingLessons}
              />
            )}

            {/* Lessons Tab */}
            {activeTab === 'lessons' && (
              <LessonsTab lessons={lessons} isLoading={isLoadingLessons} />
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <MembersTab members={members} />
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <StartLearningButton classroomId={currentClassroom.classroomId} />
              <ProgressCard classData={currentClassroom} />
              <QuickActions />
              <TeacherInfo teacherName={currentClassroom.tutorName} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
