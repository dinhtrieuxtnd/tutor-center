"use client";

import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, FileText, ClipboardCheck, TrendingUp, Bell, Award, Target, Activity } from "lucide-react";

export default function StudentDashboardPage() {
  const { student } = useAuth();

  // Mock data - Thống kê
  const stats = [
    {
      title: "Lớp học",
      value: 4,
      description: "Đã tham gia",
      icon: GraduationCap,
      color: "blue",
      trend: "+1 lớp mới"
    },
    {
      title: "Bài tập",
      value: 18,
      description: "Đã nộp",
      icon: FileText,
      color: "green",
      trend: "12/15 đạt điểm tốt"
    },
    {
      title: "Bài kiểm tra",
      value: 6,
      description: "Đã hoàn thành",
      icon: ClipboardCheck,
      color: "purple",
      trend: "Điểm TB: 8.5"
    },
    {
      title: "Điểm trung bình",
      value: "8.5",
      description: "Tổng quát",
      icon: Award,
      color: "orange",
      trend: "+0.5 so với kỳ trước"
    }
  ];

  // Mock data - Biểu đồ hoạt động (7 ngày gần nhất)
  const activityData = [
    { day: "T2", exercises: 2, quizzes: 1, lessons: 3 },
    { day: "T3", exercises: 3, quizzes: 0, lessons: 2 },
    { day: "T4", exercises: 1, quizzes: 1, lessons: 4 },
    { day: "T5", exercises: 2, quizzes: 2, lessons: 3 },
    { day: "T6", exercises: 4, quizzes: 1, lessons: 2 },
    { day: "T7", exercises: 1, quizzes: 0, lessons: 1 },
    { day: "CN", exercises: 0, quizzes: 0, lessons: 2 }
  ];

  const maxActivity = Math.max(...activityData.map(d => d.exercises + d.quizzes + d.lessons));

  // Mock data - Tiến độ học tập theo lớp
  const progressByClass = [
    {
      className: "Toán 12 - Chuyên đề hàm số",
      completed: 12,
      total: 15,
      percentage: 80,
      color: "blue"
    },
    {
      className: "Vật lý 11",
      completed: 8,
      total: 10,
      percentage: 80,
      color: "green"
    },
    {
      className: "Hóa học 10",
      completed: 9,
      total: 12,
      percentage: 75,
      color: "purple"
    },
    {
      className: "Toán 10 - Cơ bản",
      completed: 14,
      total: 16,
      percentage: 87.5,
      color: "orange"
    }
  ];

  // Mock data - Thông báo các lớp học đã tham gia
  const classNotifications = [
    {
      id: 1,
      className: "Toán 12 - Chuyên đề hàm số",
      teacher: "Thầy Nguyễn Văn A",
      announcement: "Bài tập tuần 5 đã được đăng. Hạn nộp: 25/11/2025",
      time: "30 phút trước",
      priority: "high",
      type: "exercise"
    },
    {
      id: 2,
      className: "Vật lý 11",
      teacher: "Cô Trần Thị B",
      announcement: "Bài kiểm tra giữa kỳ sẽ diễn ra vào 20/11/2025",
      time: "1 giờ trước",
      priority: "high",
      type: "quiz"
    },
    {
      id: 3,
      className: "Hóa học 10",
      teacher: "Thầy Lê Văn C",
      announcement: "Lớp học ngày mai sẽ bắt đầu lúc 2:00 PM",
      time: "2 giờ trước",
      priority: "medium",
      type: "class"
    },
    {
      id: 4,
      className: "Toán 10 - Cơ bản",
      teacher: "Cô Phạm Thị D",
      announcement: "Bài giảng mới về phương trình đã được cập nhật",
      time: "3 giờ trước",
      priority: "low",
      type: "lecture"
    },
    {
      id: 5,
      className: "Toán 12 - Chuyên đề hàm số",
      teacher: "Thầy Nguyễn Văn A",
      announcement: "Bài tập tuần 4 của bạn đã được chấm điểm: 9/10",
      time: "5 giờ trước",
      priority: "medium",
      type: "grade"
    },
    {
      id: 6,
      className: "Vật lý 11",
      teacher: "Cô Trần Thị B",
      announcement: "Tài liệu ôn tập chương 3 đã được chia sẻ",
      time: "1 ngày trước",
      priority: "low",
      type: "document"
    }
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

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: "bg-red-100 text-red-700 border-red-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-gray-100 text-gray-700 border-gray-200"
    };
    const labels = {
      high: "Quan trọng",
      medium: "Bình thường",
      low: "Thông tin"
    };
    return {
      className: badges[priority as keyof typeof badges],
      label: labels[priority as keyof typeof labels]
    };
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'exercise':
        return '📝';
      case 'quiz':
        return '📊';
      case 'class':
        return '🏫';
      case 'lecture':
        return '📚';
      case 'grade':
        return '⭐';
      case 'document':
        return '📄';
      default:
        return '📢';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-open-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Học viên
          </h1>
          <p className="text-gray-600 mt-2">
            Chào mừng trở lại, {student?.fullName}! Đây là tổng quan về quá trình học tập của bạn.
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
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
                  const total = data.exercises + data.quizzes + data.lessons;
                  const height = (total / maxActivity) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center gap-0.5">
                        {data.lessons > 0 && (
                          <div
                            className="w-full bg-purple-500 rounded-t transition-all hover:opacity-80"
                            style={{ height: `${(data.lessons / maxActivity) * 192}px` }}
                            title={`Bài giảng: ${data.lessons}`}
                          ></div>
                        )}
                        {data.quizzes > 0 && (
                          <div
                            className="w-full bg-green-500 transition-all hover:opacity-80"
                            style={{ height: `${(data.quizzes / maxActivity) * 192}px` }}
                            title={`Bài kiểm tra: ${data.quizzes}`}
                          ></div>
                        )}
                        {data.exercises > 0 && (
                          <div
                            className="w-full bg-blue-500 rounded-b transition-all hover:opacity-80"
                            style={{ height: `${(data.exercises / maxActivity) * 192}px` }}
                            title={`Bài tập: ${data.exercises}`}
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

          {/* Progress by Class */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600" />
              Tiến độ học tập theo lớp
            </h2>
            <div className="space-y-5">
              {progressByClass.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.className}</span>
                    <span className="text-sm text-gray-600">
                      {item.completed}/{item.total} bài ({Math.round(item.percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${item.percentage >= 80
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : item.percentage >= 60
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                            : 'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Tổng tiến độ</span>
                  <span className="text-lg font-bold text-green-600">
                    {Math.round(progressByClass.reduce((sum, item) => sum + item.percentage, 0) / progressByClass.length)}%
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
              Thông báo các lớp học đã tham gia
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3">
            {classNotifications.map((notification) => {
              const priority = getPriorityBadge(notification.priority);
              return (
                <div
                  key={notification.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {notification.className}
                          </h3>
                          <p className="text-sm text-gray-500">{notification.teacher}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full border ${priority.className} whitespace-nowrap`}>
                          {priority.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {notification.announcement}
                      </p>
                      <p className="text-xs text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
