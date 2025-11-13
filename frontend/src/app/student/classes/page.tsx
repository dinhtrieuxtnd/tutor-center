'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle, Hourglass } from 'lucide-react';
import { AppHeader } from '@/components/layout';
import { JoinClassModal } from '@/components/dashboard';
import {
  ClassStatsCard,
  ClassToolbar,
  ClassCard,
  EmptyClassState
} from '@/components/class/classes';

type ClassStatus = 'all' | 'active' | 'pending' | 'completed';
type ViewMode = 'grid' | 'list';

interface ClassItem {
  id: number;
  title: string;
  teacher: string;
  subject: string;
  coverImage?: string;
  students: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson?: {
    date: string;
    time: string;
  };
  status: 'active' | 'pending' | 'completed';
  progress: number;
  joinDate: string;
}

export default function MyClassesPage() {
  const router = useRouter();
  const [isJoinClassModalOpen, setIsJoinClassModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClassStatus>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Mock data
  const classes: ClassItem[] = [
    {
      id: 1,
      title: 'Toán 12 - Luyện thi THPT QG',
      teacher: 'Thầy Nguyễn Văn B',
      subject: 'Toán học',
      students: 25,
      totalLessons: 36,
      completedLessons: 24,
      nextLesson: {
        date: 'Thứ 2, 15/11/2025',
        time: '14:00 - 16:00'
      },
      status: 'active',
      progress: 67,
      joinDate: '01/09/2025'
    },
    {
      id: 2,
      title: 'Vật Lý 11 - Nâng cao',
      teacher: 'Cô Trần Thị C',
      subject: 'Vật lý',
      students: 18,
      totalLessons: 30,
      completedLessons: 15,
      nextLesson: {
        date: 'Thứ 3, 16/11/2025',
        time: '18:00 - 20:00'
      },
      status: 'active',
      progress: 50,
      joinDate: '01/09/2025'
    },
    {
      id: 3,
      title: 'Hóa học 12 - Cơ bản',
      teacher: 'Thầy Lê Văn D',
      subject: 'Hóa học',
      students: 22,
      totalLessons: 28,
      completedLessons: 0,
      status: 'pending',
      progress: 0,
      joinDate: '12/11/2025'
    },
    {
      id: 4,
      title: 'Tiếng Anh 12 - IELTS Foundation',
      teacher: 'Cô Phạm Thị E',
      subject: 'Tiếng Anh',
      students: 30,
      totalLessons: 40,
      completedLessons: 40,
      status: 'completed',
      progress: 100,
      joinDate: '01/05/2025'
    },
    {
      id: 5,
      title: 'Sinh học 12 - Ôn thi',
      teacher: 'Thầy Hoàng Văn F',
      subject: 'Sinh học',
      students: 20,
      totalLessons: 24,
      completedLessons: 18,
      nextLesson: {
        date: 'Thứ 5, 18/11/2025',
        time: '16:00 - 18:00'
      },
      status: 'active',
      progress: 75,
      joinDate: '01/09/2025'
    },
    {
      id: 6,
      title: 'Văn học 12 - Chuyên sâu',
      teacher: 'Cô Nguyễn Thị G',
      subject: 'Ngữ văn',
      students: 15,
      totalLessons: 32,
      completedLessons: 0,
      status: 'pending',
      progress: 0,
      joinDate: '13/11/2025'
    }
  ];

  const handleJoinClass = async (classCode: string) => {
    console.log('Joining class with code:', classCode);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`Đã gửi yêu cầu tham gia lớp học với mã: ${classCode}`);
  };

  const handleLogout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/auth/login');
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cls.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: classes.length,
    active: classes.filter(c => c.status === 'active').length,
    pending: classes.filter(c => c.status === 'pending').length,
    completed: classes.filter(c => c.status === 'completed').length
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 font-open-sans">
      {/* App Header */}
      <AppHeader
        currentPage="classes"
        userName="Nguyễn Văn A"
        userRole="Học sinh"
        onLogout={handleLogout}
      />

      {/* Main Content - Fixed Header + Scrollable Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
                Lớp học của tôi
              </h1>
              <p className="text-gray-600 font-open-sans">
                Quản lý và theo dõi tiến độ học tập của bạn
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <ClassStatsCard
                label="Tổng lớp học"
                value={stats.total}
                icon={BookOpen}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
              <ClassStatsCard
                label="Đang học"
                value={stats.active}
                icon={CheckCircle}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
                valueColor="text-green-600"
              />
              <ClassStatsCard
                label="Chờ duyệt"
                value={stats.pending}
                icon={Hourglass}
                iconBgColor="bg-yellow-100"
                iconColor="text-yellow-600"
                valueColor="text-yellow-600"
              />
              <ClassStatsCard
                label="Hoàn thành"
                value={stats.completed}
                icon={CheckCircle}
                iconBgColor="bg-gray-100"
                iconColor="text-gray-600"
                valueColor="text-gray-600"
              />
            </div>

            {/* Toolbar */}
            <ClassToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onJoinClass={() => setIsJoinClassModalOpen(true)}
            />
          </div>
        </div>

        {/* Scrollable Classes Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Classes Grid/List */}
            {filteredClasses.length === 0 ? (
              <EmptyClassState
                searchQuery={searchQuery}
                onJoinClass={() => setIsJoinClassModalOpen(true)}
              />
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredClasses.map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    classItem={classItem}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={isJoinClassModalOpen}
        onClose={() => setIsJoinClassModalOpen(false)}
        onSubmit={handleJoinClass}
      />
    </div>
  );
}
