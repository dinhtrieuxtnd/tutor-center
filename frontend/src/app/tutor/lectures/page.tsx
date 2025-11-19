"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  BookOpen,
  Clock,
  Eye,
  Edit,
  Trash2,
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  ChevronDown,
  Calendar,
  GraduationCap,
  Link as LinkIcon,
} from "lucide-react";

type LectureType = "video" | "document" | "presentation" | "mixed";

interface LectureData {
  lectureId: number;
  title: string;
  description: string;
  classroomId: number;
  className: string;
  type: LectureType;
  duration?: number; // minutes
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  fileCount: number;
  thumbnailUrl?: string;
  order: number;
}

export default function TutorLecturesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<number | "all">("all");
  const [typeFilter, setTypeFilter] = useState<LectureType | "all">("all");
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Mock data - Classes
  const mockClasses = [
    { classroomId: 1, name: "Toán 12 - Chuyên đề hàm số" },
    { classroomId: 2, name: "Vật lý 11 - Cơ học" },
    { classroomId: 3, name: "Hóa học 10 - Cơ bản" },
    { classroomId: 4, name: "Toán 10 - Cơ bản" },
    { classroomId: 5, name: "Tiếng Anh 12 - IELTS" },
  ];

  // Mock data - Lectures
  const mockLectures: LectureData[] = [
    {
      lectureId: 1,
      title: "Bài 1: Giới thiệu về hàm số",
      description:
        "Khái niệm hàm số, các loại hàm số cơ bản, tập xác định và tập giá trị. Bài giảng video với slide minh họa chi tiết.",
      classroomId: 1,
      className: "Toán 12 - Chuyên đề hàm số",
      type: "video",
      duration: 45,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      viewCount: 125,
      fileCount: 3,
      order: 1,
    },
    {
      lectureId: 2,
      title: "Bài 2: Khảo sát hàm số bậc 3",
      description:
        "Các bước khảo sát hàm số bậc 3, tìm cực trị, điểm uốn và vẽ đồ thị. Kèm theo tài liệu PDF và bài tập mẫu.",
      classroomId: 1,
      className: "Toán 12 - Chuyên đề hàm số",
      type: "mixed",
      duration: 60,
      createdAt: "2024-01-20",
      updatedAt: "2024-01-22",
      viewCount: 98,
      fileCount: 5,
      order: 2,
    },
    {
      lectureId: 3,
      title: "Bài 1: Động học chất điểm",
      description:
        "Các đại lượng trong chuyển động, phương trình chuyển động, vận tốc và gia tốc. Video giảng dạy với animation.",
      classroomId: 2,
      className: "Vật lý 11 - Cơ học",
      type: "video",
      duration: 50,
      createdAt: "2024-02-01",
      updatedAt: "2024-02-01",
      viewCount: 87,
      fileCount: 2,
      order: 1,
    },
    {
      lectureId: 4,
      title: "Bài 2: Các định luật Newton",
      description:
        "Ba định luật Newton và ứng dụng trong giải bài tập. Tài liệu lý thuyết và bài tập thực hành chi tiết.",
      classroomId: 2,
      className: "Vật lý 11 - Cơ học",
      type: "document",
      createdAt: "2024-02-05",
      updatedAt: "2024-02-06",
      viewCount: 76,
      fileCount: 4,
      order: 2,
    },
    {
      lectureId: 5,
      title: "Chương 1: Nguyên tử và bảng tuần hoàn",
      description:
        "Cấu trúc nguyên tử, cấu hình electron, quy luật bảng tuần hoàn. Slide trình chiếu với hình ảnh minh họa.",
      classroomId: 3,
      className: "Hóa học 10 - Cơ bản",
      type: "presentation",
      duration: 40,
      createdAt: "2024-01-25",
      updatedAt: "2024-01-25",
      viewCount: 102,
      fileCount: 2,
      order: 1,
    },
    {
      lectureId: 6,
      title: "Chương 2: Liên kết hóa học",
      description:
        "Các loại liên kết hóa học: ion, cộng hóa trị, kim loại. Video bài giảng kèm tài liệu tham khảo.",
      classroomId: 3,
      className: "Hóa học 10 - Cơ bản",
      type: "mixed",
      duration: 55,
      createdAt: "2024-02-01",
      updatedAt: "2024-02-02",
      viewCount: 94,
      fileCount: 6,
      order: 2,
    },
    {
      lectureId: 7,
      title: "Bài 1: Mệnh đề và tập hợp",
      description:
        "Khái niệm mệnh đề, các phép toán trên tập hợp. Tài liệu PDF với bài tập có lời giải chi tiết.",
      classroomId: 4,
      className: "Toán 10 - Cơ bản",
      type: "document",
      createdAt: "2023-12-15",
      updatedAt: "2023-12-15",
      viewCount: 145,
      fileCount: 3,
      order: 1,
    },
    {
      lectureId: 8,
      title: "Bài 2: Hàm số bậc nhất và bậc hai",
      description:
        "Tính chất và đồ thị hàm số bậc nhất, bậc hai. Video hướng dẫn vẽ đồ thị từng bước.",
      classroomId: 4,
      className: "Toán 10 - Cơ bản",
      type: "video",
      duration: 50,
      createdAt: "2023-12-20",
      updatedAt: "2023-12-22",
      viewCount: 132,
      fileCount: 4,
      order: 2,
    },
    {
      lectureId: 9,
      title: "Unit 1: Present Tenses",
      description:
        "Các thì hiện tại trong tiếng Anh: Present Simple, Present Continuous, Present Perfect. Bài giảng video với ví dụ thực tế.",
      classroomId: 5,
      className: "Tiếng Anh 12 - IELTS",
      type: "video",
      duration: 45,
      createdAt: "2024-03-01",
      updatedAt: "2024-03-01",
      viewCount: 68,
      fileCount: 3,
      order: 1,
    },
    {
      lectureId: 10,
      title: "Unit 2: IELTS Writing Task 1",
      description:
        "Hướng dẫn viết Task 1 IELTS, phân tích biểu đồ và mô tả xu hướng. Tài liệu mẫu và template có sẵn.",
      classroomId: 5,
      className: "Tiếng Anh 12 - IELTS",
      type: "mixed",
      duration: 60,
      createdAt: "2024-03-05",
      updatedAt: "2024-03-06",
      viewCount: 55,
      fileCount: 7,
      order: 2,
    },
  ];

  // Filter lectures
  const filteredLectures = mockLectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || lecture.classroomId === classFilter;
    const matchesType = typeFilter === "all" || lecture.type === typeFilter;
    return matchesSearch && matchesClass && matchesType;
  });

  const getTypeInfo = (type: LectureType) => {
    switch (type) {
      case "video":
        return { label: "Video", icon: Video, color: "text-red-600 bg-red-50" };
      case "document":
        return { label: "Tài liệu", icon: FileText, color: "text-blue-600 bg-blue-50" };
      case "presentation":
        return { label: "Slide", icon: ImageIcon, color: "text-purple-600 bg-purple-50" };
      case "mixed":
        return { label: "Hỗn hợp", icon: BookOpen, color: "text-green-600 bg-green-50" };
    }
  };

  const handleView = (lectureId: number) => {
    console.log("View lecture:", lectureId);
  };

  const handleEdit = (lectureId: number) => {
    console.log("Edit lecture:", lectureId);
  };

  const handleDelete = (lectureId: number) => {
    console.log("Delete lecture:", lectureId);
  };

  const handleDownload = (lectureId: number) => {
    console.log("Download lecture:", lectureId);
  };

  const selectedClassName = classFilter === "all" 
    ? "Tất cả lớp học" 
    : mockClasses.find(c => c.classroomId === classFilter)?.name || "Chọn lớp học";

  const selectedTypeName = typeFilter === "all"
    ? "Tất cả loại"
    : getTypeInfo(typeFilter).label;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý bài giảng</h1>
          <p className="text-gray-600 mt-2">
            Tạo và quản lý tài liệu học tập cho học sinh
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Tạo bài giảng mới</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng bài giảng</p>
              <p className="text-3xl font-bold text-gray-900">{mockLectures.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Video</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockLectures.filter((l) => l.type === "video" || l.type === "mixed").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lượt xem</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockLectures.reduce((sum, l) => sum + l.viewCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tài liệu đính kèm</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockLectures.reduce((sum, l) => sum + l.fileCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài giảng theo tên, mô tả hoặc lớp học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Class Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowClassDropdown(!showClassDropdown);
                setShowTypeDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[200px] justify-between"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700 text-sm truncate">
                  {selectedClassName}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </button>
            {showClassDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setClassFilter("all");
                    setShowClassDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg text-sm"
                >
                  Tất cả lớp học
                </button>
                {mockClasses.map((cls) => (
                  <button
                    key={cls.classroomId}
                    onClick={() => {
                      setClassFilter(cls.classroomId);
                      setShowClassDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowClassDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[150px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700 text-sm">
                  {selectedTypeName}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </button>
            {showTypeDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setTypeFilter("all");
                    setShowTypeDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg text-sm"
                >
                  Tất cả loại
                </button>
                <button
                  onClick={() => {
                    setTypeFilter("video");
                    setShowTypeDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Video
                </button>
                <button
                  onClick={() => {
                    setTypeFilter("document");
                    setShowTypeDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Tài liệu
                </button>
                <button
                  onClick={() => {
                    setTypeFilter("presentation");
                    setShowTypeDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Slide
                </button>
                <button
                  onClick={() => {
                    setTypeFilter("mixed");
                    setShowTypeDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg text-sm"
                >
                  Hỗn hợp
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold">{filteredLectures.length}</span> bài giảng
        </div>
      </div>

      {/* Lectures List */}
      {filteredLectures.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy bài giảng nào
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "Thử tìm kiếm với từ khóa khác"
              : "Bạn chưa có bài giảng nào. Tạo bài giảng mới để bắt đầu!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLectures.map((lecture) => (
            <LectureCard
              key={lecture.lectureId}
              lecture={lecture}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Lecture Card Component
function LectureCard({
  lecture,
  onView,
  onEdit,
  onDelete,
  onDownload,
}: {
  lecture: LectureData;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload: (id: number) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const typeInfo = getTypeInfo(lecture.type);
  const TypeIcon = typeInfo.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}
        >
          <TypeIcon className="w-8 h-8" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900">{lecture.title}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}
                >
                  {typeInfo.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{lecture.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <GraduationCap className="w-4 h-4" />
                <span>{lecture.className}</span>
              </div>
            </div>
            <div className="relative ml-4">
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
                      onView(lecture.lectureId);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => {
                      onEdit(lecture.lectureId);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      onDownload(lecture.lectureId);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Tải xuống
                  </button>
                  <button
                    onClick={() => {
                      onDelete(lecture.lectureId);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 last:rounded-b-lg text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa bài giảng
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>
                <span className="font-semibold text-gray-900">{lecture.viewCount}</span> lượt xem
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>
                <span className="font-semibold text-gray-900">{lecture.fileCount}</span> tài liệu
              </span>
            </div>
            {lecture.duration && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  <span className="font-semibold text-gray-900">{lecture.duration}</span> phút
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
              <Calendar className="w-4 h-4" />
              <span>
                Cập nhật: {new Date(lecture.updatedAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTypeInfo(type: LectureType) {
  switch (type) {
    case "video":
      return { label: "Video", icon: Video, color: "text-red-600 bg-red-50" };
    case "document":
      return { label: "Tài liệu", icon: FileText, color: "text-blue-600 bg-blue-50" };
    case "presentation":
      return { label: "Slide", icon: ImageIcon, color: "text-purple-600 bg-purple-50" };
    case "mixed":
      return { label: "Hỗn hợp", icon: BookOpen, color: "text-green-600 bg-green-50" };
  }
}
