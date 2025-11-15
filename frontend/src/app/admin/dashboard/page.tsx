"use client";

import { Header, AdminSidebar } from "@/components/layout";
import { GraduationCap, Users, BookOpen, FileText, ClipboardCheck, Brain } from "lucide-react";

export default function AdminDashboardPage() {
  // Mock statistics data
  const statistics = [
    {
      title: "Lớp học",
      value: "156",
      change: "+12%",
      icon: GraduationCap,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      changeColor: "text-green-600"
    },
    {
      title: "Gia sư",
      value: "89",
      change: "+5%",
      icon: Users,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      changeColor: "text-green-600"
    },
    {
      title: "Học sinh",
      value: "1,234",
      change: "+18%",
      icon: Users,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      changeColor: "text-green-600"
    },
    {
      title: "Bài giảng",
      value: "2,456",
      change: "+23%",
      icon: BookOpen,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      changeColor: "text-green-600"
    },
    {
      title: "Bài tập",
      value: "3,789",
      change: "+15%",
      icon: FileText,
      color: "yellow",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      changeColor: "text-green-600"
    },
    {
      title: "Bài kiểm tra",
      value: "892",
      change: "+8%",
      icon: ClipboardCheck,
      color: "pink",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      changeColor: "text-green-600"
    }
  ];

  // Mock chart data
  const chartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    classrooms: [120, 125, 130, 135, 138, 142, 145, 148, 150, 153, 154, 156],
    students: [800, 850, 900, 950, 1000, 1050, 1100, 1150, 1180, 1200, 1220, 1234]
  };

  // Mock activity log
  const activityLogs = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      action: "Tạo lớp học mới",
      details: "Lớp Toán 12 - Luyện thi THPT QG",
      time: "5 phút trước",
      type: "create",
      icon: "➕"
    },
    {
      id: 2,
      user: "Trần Thị B",
      action: "Gửi báo cáo",
      details: "Báo cáo về gia sư Lê Văn C",
      time: "15 phút trước",
      type: "report",
      icon: "⚠️"
    },
    {
      id: 3,
      user: "Lê Văn C",
      action: "Cập nhật bài giảng",
      details: "Bài 5: Đạo hàm và ứng dụng",
      time: "30 phút trước",
      type: "update",
      icon: "📝"
    },
    {
      id: 4,
      user: "Phạm Thị D",
      action: "Tham gia lớp học",
      details: "Lớp Vật lý 11",
      time: "1 giờ trước",
      type: "join",
      icon: "👤"
    },
    {
      id: 5,
      user: "Hoàng Văn E",
      action: "Hoàn thành bài kiểm tra",
      details: "Kiểm tra giữa kỳ - Hóa học 10",
      time: "2 giờ trước",
      type: "complete",
      icon: "✅"
    },
    {
      id: 6,
      user: "Ngô Thị F",
      action: "Đăng ký làm gia sư",
      details: "Môn Tiếng Anh",
      time: "3 giờ trước",
      type: "register",
      icon: "📋"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header userRole="admin" />

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="ml-64 pt-16">
        <div className="p-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Tổng quan về hệ thống trung tâm gia sư</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`${stat.bgColor} rounded-lg p-6 border border-gray-100`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                    <span className={`text-sm font-medium ${stat.changeColor}`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                  <p className={`text-3xl font-bold ${stat.iconColor}`}>{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Classroom Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê lớp học</h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {chartData.classrooms.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                      style={{ height: `${(value / 160) * 100}%` }}
                      title={`${chartData.labels[index]}: ${value} lớp`}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{chartData.labels[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê học sinh</h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {chartData.students.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors cursor-pointer"
                      style={{ height: `${(value / 1300) * 100}%` }}
                      title={`${chartData.labels[index]}: ${value} học sinh`}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{chartData.labels[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {activityLogs.map((log) => (
                <div key={log.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{log.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            <span className="font-semibold">{log.user}</span> {log.action}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {log.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Xem tất cả hoạt động →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
