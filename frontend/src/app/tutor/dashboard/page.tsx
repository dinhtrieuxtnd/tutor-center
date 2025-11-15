"use client";

import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, BookOpen, FileText, ClipboardCheck, TrendingUp, Users, Clock, Bell } from "lucide-react";

export default function TutorDashboardPage() {
  const { student } = useAuth();

  // Mock data - Thống kê
  const stats = [
    {
      title: "Lớp học",
      value: 5,
      description: "Đang giảng dạy",
      icon: GraduationCap,
      color: "blue",
      trend: "+2 so với tháng trước"
    },
    {
      title: "Bài giảng",
      value: 24,
      description: "Tổng số bài giảng",
      icon: BookOpen,
      color: "green",
      trend: "+8 bài mới"
    },
    {
      title: "Bài tập",
      value: 12,
      description: "Chờ chấm điểm",
      icon: FileText,
      color: "orange",
      trend: "15 đã chấm"
    },
    {
      title: "Bài kiểm tra",
      value: 8,
      description: "Đã tạo",
      icon: ClipboardCheck,
      color: "purple",
      trend: "3 đang diễn ra"
    }
  ];

  // Mock data - Biểu đồ hoạt động (7 ngày gần nhất)
  const activityData = [
    { day: "T2", exercises: 3, quizzes: 1, lectures: 2 },
    { day: "T3", exercises: 5, quizzes: 2, lectures: 3 },
    { day: "T4", exercises: 2, quizzes: 1, lectures: 1 },
    { day: "T5", exercises: 4, quizzes: 0, lectures: 2 },
    { day: "T6", exercises: 6, quizzes: 3, lectures: 4 },
    { day: "T7", exercises: 3, quizzes: 1, lectures: 2 },
    { day: "CN", exercises: 1, quizzes: 0, lectures: 1 }
  ];

  const maxActivity = Math.max(...activityData.map(d => d.exercises + d.quizzes + d.lectures));

  // Mock data - Thông báo các lớp học
  const classNotifications = [
    {
      id: 1,
      className: "Toán 12 - Chuyên đề hàm số",
      studentCount: 25,
      nextSession: "Hôm nay, 14:00",
      status: "active",
      pendingExercises: 3,
      recentActivity: "Học sinh Nguyễn Văn A vừa nộp bài tập"
    },
    {
      id: 2,
      className: "Vật lý 11",
      studentCount: 18,
      nextSession: "Mai, 15:30",
      status: "active",
      pendingExercises: 5,
      recentActivity: "2 học sinh mới tham gia"
    },
    {
      id: 3,
      className: "Hóa học 10",
      studentCount: 22,
      nextSession: "Thứ 5, 16:00",
      status: "active",
      pendingExercises: 1,
      recentActivity: "Bài kiểm tra cuối tuần đã được tạo"
    },
    {
      id: 4,
      className: "Toán 10 - Cơ bản",
      studentCount: 30,
      nextSession: "Thứ 6, 14:00",
      status: "active",
      pendingExercises: 0,
      recentActivity: "Tất cả bài tập đã được chấm"
    }
  ];

  // Mock data - Phân bố học sinh theo lớp
  const studentDistribution = [
    { class: "Toán 12", students: 25, percentage: 28 },
    { class: "Toán 10", students: 30, percentage: 34 },
    { class: "Vật lý 11", students: 18, percentage: 20 },
    { class: "Hóa học 10", students: 22, percentage: 18 }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200"
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Giảng viên
        </h1>
        <p className="text-gray-600 mt-2">
          Chào mừng trở lại, {student?.fullName}! Đây là tổng quan hoạt động giảng dạy của bạn.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${getColorClasses(stat.color)} rounded-lg p-6 border-2 transition-transform hover:scale-105`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium opacity-80 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold mb-2">{stat.value}</p>
                  <p className="text-xs opacity-70 mb-2">{stat.description}</p>
                  <p className="text-xs font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </p>
                </div>
                <Icon className="w-10 h-10 opacity-50" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Hoạt động 7 ngày qua
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Bài tập</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Bài kiểm tra</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>Bài giảng</span>
              </div>
            </div>
            <div className="flex items-end justify-between h-48 gap-2">
              {activityData.map((data, index) => {
                const total = data.exercises + data.quizzes + data.lectures;
                const height = (total / maxActivity) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center gap-0.5">
                      {data.lectures > 0 && (
                        <div
                          className="w-full bg-purple-500 rounded-t transition-all hover:opacity-80"
                          style={{ height: `${(data.lectures / maxActivity) * 192}px` }}
                        ></div>
                      )}
                      {data.quizzes > 0 && (
                        <div
                          className="w-full bg-green-500 transition-all hover:opacity-80"
                          style={{ height: `${(data.quizzes / maxActivity) * 192}px` }}
                        ></div>
                      )}
                      {data.exercises > 0 && (
                        <div
                          className="w-full bg-blue-500 rounded-b transition-all hover:opacity-80"
                          style={{ height: `${(data.exercises / maxActivity) * 192}px` }}
                        ></div>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{data.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Student Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Phân bố học sinh theo lớp
          </h2>
          <div className="space-y-4">
            {studentDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.class}</span>
                  <span className="text-sm text-gray-600">
                    {item.students} học sinh ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Tổng cộng</span>
                <span className="text-lg font-bold text-blue-600">
                  {studentDistribution.reduce((sum, item) => sum + item.students, 0)} học sinh
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Notifications */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Thông báo các lớp học đang quản lý
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Xem tất cả
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classNotifications.map((notification) => (
            <div
              key={notification.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex-1">
                  {notification.className}
                </h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Đang hoạt động
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{notification.studentCount} học sinh</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Buổi học tiếp theo: {notification.nextSession}</span>
                </div>
                {notification.pendingExercises > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">
                      {notification.pendingExercises} bài tập chờ chấm
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 italic">
                    {notification.recentActivity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
