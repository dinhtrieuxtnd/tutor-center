"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Grid3x3,
  List,
  Filter,
  MoreVertical,
  Users,
  BookOpen,
  Clock,
  Archive,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Calendar,
  DollarSign,
} from "lucide-react";

type ViewMode = "grid" | "list";
type ClassStatus = "active" | "archived";

interface ClassData {
  classroomId: number;
  name: string;
  description: string;
  studentCount: number;
  lessonCount: number;
  exerciseCount: number;
  price: number;
  createdAt: string;
  isArchived: boolean;
  coverImage?: string;
  schedule?: string;
  nextSession?: string;
}

export default function TutorClassesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ClassStatus>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Mock data - Danh sách lớp học
  const mockClasses: ClassData[] = [
    {
      classroomId: 1,
      name: "Toán 12 - Chuyên đề hàm số",
      description: "Học chuyên sâu về hàm số, đạo hàm và ứng dụng. Phù hợp cho học sinh lớp 12 chuẩn bị thi THPT Quốc gia.",
      studentCount: 25,
      lessonCount: 12,
      exerciseCount: 8,
      price: 500000,
      createdAt: "2024-01-15",
      isArchived: false,
      schedule: "Thứ 2, 4, 6 - 14:00-16:00",
      nextSession: "Hôm nay, 14:00",
    },
    {
      classroomId: 2,
      name: "Vật lý 11 - Cơ học",
      description: "Chuyên đề cơ học vật lý 11, bài tập nâng cao và ôn thi học kỳ.",
      studentCount: 18,
      lessonCount: 10,
      exerciseCount: 12,
      price: 450000,
      createdAt: "2024-02-01",
      isArchived: false,
      schedule: "Thứ 3, 5, 7 - 15:30-17:30",
      nextSession: "Mai, 15:30",
    },
    {
      classroomId: 3,
      name: "Hóa học 10 - Cơ bản",
      description: "Kiến thức hóa học cơ bản cho học sinh lớp 10, tập trung vào thí nghiệm và lý thuyết.",
      studentCount: 22,
      lessonCount: 15,
      exerciseCount: 10,
      price: 400000,
      createdAt: "2024-01-20",
      isArchived: false,
      schedule: "Thứ 2, 4 - 16:00-18:00",
      nextSession: "Thứ 5, 16:00",
    },
    {
      classroomId: 4,
      name: "Toán 10 - Cơ bản",
      description: "Toán học lớp 10 cơ bản, đại số và hình học. Giúp học sinh nắm vững kiến thức nền tảng.",
      studentCount: 30,
      lessonCount: 18,
      exerciseCount: 15,
      price: 380000,
      createdAt: "2023-12-10",
      isArchived: false,
      schedule: "Thứ 3, 5 - 14:00-16:00",
      nextSession: "Thứ 6, 14:00",
    },
    {
      classroomId: 5,
      name: "Tiếng Anh 12 - IELTS",
      description: "Luyện thi IELTS cho học sinh lớp 12, tập trung 4 kỹ năng nghe nói đọc viết.",
      studentCount: 15,
      lessonCount: 20,
      exerciseCount: 25,
      price: 600000,
      createdAt: "2024-03-01",
      isArchived: false,
      schedule: "Thứ 2, 4, 6 - 18:00-20:00",
      nextSession: "Hôm nay, 18:00",
    },
    {
      classroomId: 6,
      name: "Vật lý 12 - Điện học",
      description: "Chuyên đề điện học vật lý 12, chuẩn bị thi đại học.",
      studentCount: 12,
      lessonCount: 8,
      exerciseCount: 6,
      price: 480000,
      createdAt: "2023-11-15",
      isArchived: true,
      schedule: "Đã kết thúc",
    },
    {
      classroomId: 7,
      name: "Hóa học 11 - Hữu cơ",
      description: "Hóa hữu cơ nâng cao cho học sinh lớp 11 giỏi.",
      studentCount: 8,
      lessonCount: 10,
      exerciseCount: 8,
      price: 520000,
      createdAt: "2023-10-20",
      isArchived: true,
      schedule: "Đã kết thúc",
    },
  ];

  // Filter classes
  const filteredClasses = mockClasses.filter((classItem) => {
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !classItem.isArchived) ||
      (statusFilter === "archived" && classItem.isArchived);
    return matchesSearch && matchesStatus;
  });

  const activeCount = mockClasses.filter((c) => !c.isArchived).length;
  const archivedCount = mockClasses.filter((c) => c.isArchived).length;

  const handleArchiveClass = (classroomId: number) => {
    console.log("Archive class:", classroomId);
  };

  const handleEditClass = (classroomId: number) => {
    console.log("Edit class:", classroomId);
  };

  const handleDeleteClass = (classroomId: number) => {
    console.log("Delete class:", classroomId);
  };

  const handleViewClass = (classroomId: number) => {
    console.log("View class:", classroomId);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý lớp học</h1>
          <p className="text-gray-600 mt-2">
            Quản lý và theo dõi các lớp học bạn đang giảng dạy
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Tạo lớp học mới</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng lớp học</p>
              <p className="text-3xl font-bold text-gray-900">{mockClasses.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
              <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-orange-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đã lưu trữ</p>
              <p className="text-3xl font-bold text-gray-900">{archivedCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Archive className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng học sinh</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockClasses.reduce((sum, c) => sum + c.studentCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm lớp học theo tên hoặc mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">
                {statusFilter === "all"
                  ? "Tất cả"
                  : statusFilter === "active"
                  ? "Đang hoạt động"
                  : "Đã lưu trữ"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg"
                >
                  Tất cả
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("active");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  Đang hoạt động
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("archived");
                    setShowFilterDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg"
                >
                  Đã lưu trữ
                </button>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold">{filteredClasses.length}</span> lớp học
        </div>
      </div>

      {/* Classes Grid/List */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy lớp học nào
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "Thử tìm kiếm với từ khóa khác"
              : "Bạn chưa có lớp học nào. Tạo lớp học mới để bắt đầu!"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <ClassCardGrid
              key={classItem.classroomId}
              classData={classItem}
              onArchive={handleArchiveClass}
              onEdit={handleEditClass}
              onDelete={handleDeleteClass}
              onView={handleViewClass}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClasses.map((classItem) => (
            <ClassCardList
              key={classItem.classroomId}
              classData={classItem}
              onArchive={handleArchiveClass}
              onEdit={handleEditClass}
              onDelete={handleDeleteClass}
              onView={handleViewClass}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Grid View Card Component
function ClassCardGrid({
  classData,
  onArchive,
  onEdit,
  onDelete,
  onView,
}: {
  classData: ClassData;
  onArchive: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Cover Image */}
      <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              classData.isArchived
                ? "bg-gray-100 text-gray-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {classData.isArchived ? "Đã lưu trữ" : "Đang hoạt động"}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-700" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onView(classData.classroomId);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg"
                >
                  <Eye className="w-4 h-4" />
                  Xem chi tiết
                </button>
                <button
                  onClick={() => {
                    onEdit(classData.classroomId);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => {
                    onArchive(classData.classroomId);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  {classData.isArchived ? "Bỏ lưu trữ" : "Lưu trữ"}
                </button>
                <button
                  onClick={() => {
                    onDelete(classData.classroomId);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 last:rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa lớp học
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
            {classData.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{classData.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Học sinh</p>
            <p className="text-sm font-semibold text-gray-900">{classData.studentCount}</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <BookOpen className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Bài giảng</p>
            <p className="text-sm font-semibold text-gray-900">{classData.lessonCount}</p>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Bài tập</p>
            <p className="text-sm font-semibold text-gray-900">{classData.exerciseCount}</p>
          </div>
        </div>

        {/* Schedule and Price */}
        <div className="space-y-2 pt-3 border-t border-gray-100">
          {!classData.isArchived && classData.schedule && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{classData.schedule}</span>
            </div>
          )}
          {!classData.isArchived && classData.nextSession && (
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
              <Clock className="w-4 h-4" />
              <span>Buổi tiếp: {classData.nextSession}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-600">
              {classData.price.toLocaleString("vi-VN")}đ/tháng
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// List View Card Component
function ClassCardList({
  classData,
  onArchive,
  onEdit,
  onDelete,
  onView,
}: {
  classData: ClassData;
  onArchive: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-6">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-10 h-10 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{classData.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{classData.description}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  classData.isArchived
                    ? "bg-gray-100 text-gray-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {classData.isArchived ? "Đã lưu trữ" : "Đang hoạt động"}
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        onView(classData.classroomId);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg"
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => {
                        onEdit(classData.classroomId);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => {
                        onArchive(classData.classroomId);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Archive className="w-4 h-4" />
                      {classData.isArchived ? "Bỏ lưu trữ" : "Lưu trữ"}
                    </button>
                    <button
                      onClick={() => {
                        onDelete(classData.classroomId);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 last:rounded-b-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa lớp học
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats and Info */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                <span className="font-semibold text-gray-900">{classData.studentCount}</span> học
                sinh
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>
                <span className="font-semibold text-gray-900">{classData.lessonCount}</span> bài
                giảng
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                <span className="font-semibold text-gray-900">{classData.exerciseCount}</span> bài
                tập
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">
                {classData.price.toLocaleString("vi-VN")}đ/tháng
              </span>
            </div>
          </div>

          {/* Schedule */}
          {!classData.isArchived && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
              {classData.schedule && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{classData.schedule}</span>
                </div>
              )}
              {classData.nextSession && (
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                  <Clock className="w-4 h-4" />
                  <span>Buổi tiếp: {classData.nextSession}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
