"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AppHeader } from "@/components/layout";
import {
  StatCard,
  QuickActionCard,
  ClassroomCard,
  ActivityCard,
  JoinClassModal,
  type ClassroomItem,
  type ActivityItem,
  type UserRole,
} from "@/components/dashboard";

interface MockUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface StatsData {
  totalClasses: number;
  totalStudents: number;
  totalTeachers: number;
  totalRevenue: number;
  pendingRequests: number;
  activeStudents: number;
  completedExercises: number;
  upcomingLessons: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isJoinClassModalOpen, setIsJoinClassModalOpen] = useState(false);

  // Mock user data - Trong thực tế sẽ lấy từ Redux store hoặc API
  const [currentUser] = useState<MockUser>({
    id: 1,
    fullName: "Nguyễn Văn A",
    email: "admin@bee.edu.vn",
    role: "student", // Thay đổi thành 'teacher' hoặc 'student' để xem giao diện khác
    avatar: undefined,
  });

  const [stats, setStats] = useState<StatsData>({
    totalClasses: 24,
    totalStudents: 156,
    totalTeachers: 12,
    totalRevenue: 125000000,
    pendingRequests: 8,
    activeStudents: 142,
    completedExercises: 89,
    upcomingLessons: 5,
  });

  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([
    {
      id: 1,
      title: "Toán 12 - Luyện thi THPT QG",
      teacher: "Thầy Nguyễn Văn B",
      students: 25,
      nextLesson: "14:00 - 16:00, Thứ 2",
      status: "active",
      progress: 65,
    },
    {
      id: 2,
      title: "Vật Lý 11 - Nâng cao",
      teacher: "Cô Trần Thị C",
      students: 18,
      nextLesson: "18:00 - 20:00, Thứ 3",
      status: "active",
      progress: 45,
    },
    {
      id: 3,
      title: "Hóa học 12 - Cơ bản",
      teacher: "Thầy Lê Văn D",
      students: 22,
      status: "pending",
      progress: 0,
    },
  ]);

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 1,
      type: "join_request",
      message: "Nguyễn Thị E đã gửi yêu cầu tham gia lớp Toán 12",
      time: "5 phút trước",
      user: "Nguyễn Thị E",
      icon: "user-plus",
      color: "blue",
    },
    {
      id: 2,
      type: "new_lesson",
      message: 'Bài giảng mới "Hàm số bậc hai" đã được đăng trong lớp Toán 12',
      time: "15 phút trước",
      icon: "book",
      color: "green",
    },
    {
      id: 3,
      type: "exercise_submitted",
      message: 'Trần Văn F đã nộp bài tập "Lượng giác"',
      time: "30 phút trước",
      user: "Trần Văn F",
      icon: "file-check",
      color: "purple",
    },
    {
      id: 4,
      type: "payment",
      message: "Thanh toán học phí lớp Vật Lý 11 thành công",
      time: "1 giờ trước",
      icon: "dollar",
      color: "yellow",
    },
  ]);

  const handleLogout = () => {
    // Clear auth data
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/auth/login");
  };

  const handleJoinClass = async (classCode: string) => {
    // TODO: Gọi API để tham gia lớp học
    console.log('Joining class with code:', classCode);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message (có thể dùng toast notification)
    alert(`Đã gửi yêu cầu tham gia lớp học với mã: ${classCode}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  const getRoleName = (role: UserRole) => {
    const roles = {
      admin: "Quản trị viên",
      teacher: "Giáo viên",
      student: "Học sinh",
    };
    return roles[role];
  };

  // Render khác nhau theo vai trò
  const renderStats = () => {
    if (currentUser.role === "admin") {
      return (
        <>
          <StatCard
            title="Tổng lớp học"
            value={stats.totalClasses}
            icon="school"
            color="blue"
            trend="+12%"
          />
          <StatCard
            title="Tổng học sinh"
            value={stats.totalStudents}
            icon="users"
            color="green"
            trend="+8%"
          />
          <StatCard
            title="Tổng giáo viên"
            value={stats.totalTeachers}
            icon="user-tie"
            color="purple"
          />
          <StatCard
            title="Doanh thu tháng"
            value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            icon="dollar"
            color="yellow"
            trend="+15%"
          />
        </>
      );
    } else if (currentUser.role === "teacher") {
      return (
        <>
          <StatCard
            title="Lớp học của tôi"
            value={6}
            icon="school"
            color="blue"
          />
          <StatCard
            title="Tổng học sinh"
            value={stats.activeStudents}
            icon="users"
            color="green"
          />
          <StatCard
            title="Yêu cầu chờ duyệt"
            value={stats.pendingRequests}
            icon="clock"
            color="orange"
            alert={stats.pendingRequests > 0}
          />
          <StatCard
            title="Bài tập chờ chấm"
            value={15}
            icon="file-check"
            color="purple"
          />
        </>
      );
    } else {
      return (
        <>
          <StatCard title="Lớp đang học" value={3} icon="school" color="blue" />
          <StatCard
            title="Bài học sắp tới"
            value={stats.upcomingLessons}
            icon="calendar"
            color="green"
          />
          <StatCard
            title="Bài tập hoàn thành"
            value={stats.completedExercises}
            icon="check-circle"
            color="purple"
          />
          <StatCard
            title="Điểm trung bình"
            value="8.5"
            icon="star"
            color="yellow"
            trend="+0.5"
          />
        </>
      );
    }
  };

  const renderQuickActions = () => {
    if (currentUser.role === "admin") {
      return (
        <>
          <QuickActionCard
            title="Tạo lớp học mới"
            description="Thêm lớp học vào hệ thống"
            icon="plus-circle"
            color="blue"
            onClick={() => {}}
          />
          <QuickActionCard
            title="Quản lý giáo viên"
            description="Thêm, sửa, xóa giáo viên"
            icon="user-tie"
            color="green"
            onClick={() => {}}
          />
          <QuickActionCard
            title="Báo cáo thống kê"
            description="Xem báo cáo chi tiết"
            icon="chart-bar"
            color="purple"
            onClick={() => {}}
          />
          <QuickActionCard
            title="Quản lý thanh toán"
            description="Theo dõi giao dịch"
            icon="dollar"
            color="yellow"
            onClick={() => {}}
          />
        </>
      );
    } else if (currentUser.role === "teacher") {
      return (
        <>
          <QuickActionCard
            title="Tạo bài giảng"
            description="Thêm bài giảng mới"
            icon="book"
            color="blue"
            onClick={() => {}}
          />
          <QuickActionCard
            title="Tạo bài tập"
            description="Giao bài tập cho học sinh"
            icon="file-edit"
            color="green"
            onClick={() => {}}
          />
          <QuickActionCard
            title="Duyệt yêu cầu"
            description={`${stats.pendingRequests} yêu cầu chờ duyệt`}
            icon="user-check"
            color="orange"
            badge={stats.pendingRequests}
            onClick={() => {}}
          />
          <QuickActionCard
            title="AI Trợ giảng"
            description="Soạn giáo án với AI"
            icon="robot"
            color="purple"
            onClick={() => {}}
          />
        </>
      );
    } else {
      return (
        <>
          <QuickActionCard
            title="Tìm lớp học"
            description="Tham gia lớp học mới"
            icon="search"
            color="blue"
            onClick={() => setIsJoinClassModalOpen(true)}
          />
          <QuickActionCard
            title="Làm bài tập"
            description="Xem bài tập đã giao"
            icon="file-edit"
            color="green"
            onClick={() => {}}
          />
          <QuickActionCard
            title="Lịch học"
            description="Xem lịch học tuần này"
            icon="calendar"
            color="purple"
            onClick={() => {}}
          />
          <QuickActionCard
            title="Thanh toán"
            description="Thanh toán học phí"
            icon="credit-card"
            color="yellow"
            onClick={() => {}}
          />
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-open-sans">
      {/* App Header */}
      <AppHeader
        currentPage="dashboard"
        userName={currentUser.fullName}
        userRole={getRoleName(currentUser.role)}
        onLogout={handleLogout}
        showTeacherLink={currentUser.role === "teacher"}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">
            {getGreeting()}, {currentUser.fullName}! 👋
          </h1>
          <p className="text-gray-600 font-open-sans">
            Đây là tổng quan về hoạt động của bạn trên hệ thống Tutor Center
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {renderStats()}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-poppins">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderQuickActions()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Classrooms / Recent Classrooms */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 font-poppins">
                  {currentUser.role === "student"
                    ? "Lớp học của tôi"
                    : "Lớp học gần đây"}
                </h2>
                <button 
                  onClick={() => router.push('/student/classes')}
                  className="text-sm text-primary hover:text-blue-700 font-medium font-open-sans"
                >
                  Xem tất cả →
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {classrooms.map((classroom) => (
                  <ClassroomCard
                    key={classroom.id}
                    classroom={classroom}
                    userRole={currentUser.role}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 font-poppins">
                  Hoạt động gần đây
                </h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Join Class Modal */}
      <JoinClassModal
        isOpen={isJoinClassModalOpen}
        onClose={() => setIsJoinClassModalOpen(false)}
        onSubmit={handleJoinClass}
      />
    </div>
  );
}
