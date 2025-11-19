"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  FileText,
  Clock,
  Eye,
  Edit,
  Trash2,
  Calendar,
  GraduationCap,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Send,
} from "lucide-react";

type ExerciseStatus = "draft" | "published" | "closed";
type ExerciseDifficulty = "easy" | "medium" | "hard";

interface ExerciseData {
  exerciseId: number;
  title: string;
  description: string;
  classroomId: number;
  className: string;
  status: ExerciseStatus;
  difficulty: ExerciseDifficulty;
  dueDate: string;
  createdAt: string;
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingSubmissions: number;
  maxScore: number;
  fileCount: number;
}

export default function TutorExercisesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ExerciseStatus | "all">("all");
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Mock data - Classes
  const mockClasses = [
    { classroomId: 1, name: "Toán 12 - Chuyên đề hàm số" },
    { classroomId: 2, name: "Vật lý 11 - Cơ học" },
    { classroomId: 3, name: "Hóa học 10 - Cơ bản" },
    { classroomId: 4, name: "Toán 10 - Cơ bản" },
    { classroomId: 5, name: "Tiếng Anh 12 - IELTS" },
  ];

  // Mock data - Exercises
  const mockExercises: ExerciseData[] = [
    {
      exerciseId: 1,
      title: "Bài tập 1: Tính đạo hàm cơ bản",
      description:
        "Tính đạo hàm của các hàm số bậc nhất, bậc hai, và hàm phân thức. Áp dụng quy tắc tính đạo hàm cơ bản.",
      classroomId: 1,
      className: "Toán 12 - Chuyên đề hàm số",
      status: "published",
      difficulty: "easy",
      dueDate: "2024-02-15",
      createdAt: "2024-01-20",
      totalSubmissions: 25,
      gradedSubmissions: 18,
      pendingSubmissions: 7,
      maxScore: 10,
      fileCount: 2,
    },
    {
      exerciseId: 2,
      title: "Bài tập 2: Khảo sát và vẽ đồ thị hàm số",
      description:
        "Khảo sát sự biến thiên và vẽ đồ thị của hàm số bậc 3. Tìm cực trị, điểm uốn và các tiệm cận.",
      classroomId: 1,
      className: "Toán 12 - Chuyên đề hàm số",
      status: "published",
      difficulty: "hard",
      dueDate: "2024-02-20",
      createdAt: "2024-01-25",
      totalSubmissions: 20,
      gradedSubmissions: 20,
      pendingSubmissions: 0,
      maxScore: 15,
      fileCount: 3,
    },
    {
      exerciseId: 3,
      title: "Bài tập 3: Bài toán cực trị",
      description:
        "Giải các bài toán cực trị trong thực tế sử dụng đạo hàm. Tìm giá trị lớn nhất và nhỏ nhất của hàm số.",
      classroomId: 1,
      className: "Toán 12 - Chuyên đề hàm số",
      status: "draft",
      difficulty: "medium",
      dueDate: "2024-02-25",
      createdAt: "2024-02-01",
      totalSubmissions: 0,
      gradedSubmissions: 0,
      pendingSubmissions: 0,
      maxScore: 12,
      fileCount: 1,
    },
    {
      exerciseId: 4,
      title: "Bài tập 1: Chuyển động thẳng đều",
      description:
        "Bài tập về phương trình chuyển động, vận tốc và quãng đường. Vẽ đồ thị chuyển động.",
      classroomId: 2,
      className: "Vật lý 11 - Cơ học",
      status: "published",
      difficulty: "easy",
      dueDate: "2024-02-10",
      createdAt: "2024-02-01",
      totalSubmissions: 18,
      gradedSubmissions: 15,
      pendingSubmissions: 3,
      maxScore: 10,
      fileCount: 2,
    },
    {
      exerciseId: 5,
      title: "Bài tập 2: Định luật Newton",
      description:
        "Áp dụng các định luật Newton để giải bài toán về lực và chuyển động. Phân tích lực tác dụng lên vật.",
      classroomId: 2,
      className: "Vật lý 11 - Cơ học",
      status: "published",
      difficulty: "medium",
      dueDate: "2024-02-18",
      createdAt: "2024-02-05",
      totalSubmissions: 15,
      gradedSubmissions: 8,
      pendingSubmissions: 7,
      maxScore: 12,
      fileCount: 3,
    },
    {
      exerciseId: 6,
      title: "Bài tập 3: Chuyển động ném xiên",
      description:
        "Bài toán về chuyển động ném xiên, tính tầm xa, độ cao cực đại và thời gian bay.",
      classroomId: 2,
      className: "Vật lý 11 - Cơ học",
      status: "closed",
      difficulty: "hard",
      dueDate: "2024-01-30",
      createdAt: "2024-01-15",
      totalSubmissions: 18,
      gradedSubmissions: 18,
      pendingSubmissions: 0,
      maxScore: 15,
      fileCount: 4,
    },
    {
      exerciseId: 7,
      title: "Bài tập 1: Cấu hình electron",
      description:
        "Viết cấu hình electron của các nguyên tố. Xác định vị trí của nguyên tố trong bảng tuần hoàn.",
      classroomId: 3,
      className: "Hóa học 10 - Cơ bản",
      status: "published",
      difficulty: "easy",
      dueDate: "2024-02-12",
      createdAt: "2024-01-28",
      totalSubmissions: 22,
      gradedSubmissions: 22,
      pendingSubmissions: 0,
      maxScore: 10,
      fileCount: 1,
    },
    {
      exerciseId: 8,
      title: "Bài tập 2: Liên kết hóa học",
      description:
        "Xác định loại liên kết trong các hợp chất. Vẽ công thức Lewis và dự đoán hình dạng phân tử.",
      classroomId: 3,
      className: "Hóa học 10 - Cơ bản",
      status: "published",
      difficulty: "medium",
      dueDate: "2024-02-22",
      createdAt: "2024-02-05",
      totalSubmissions: 18,
      gradedSubmissions: 10,
      pendingSubmissions: 8,
      maxScore: 12,
      fileCount: 2,
    },
    {
      exerciseId: 9,
      title: "Bài tập 1: Tập hợp và mệnh đề",
      description:
        "Các phép toán trên tập hợp, biểu đồ Venn, xác định tính đúng sai của mệnh đề.",
      classroomId: 4,
      className: "Toán 10 - Cơ bản",
      status: "published",
      difficulty: "easy",
      dueDate: "2024-02-08",
      createdAt: "2023-12-20",
      totalSubmissions: 30,
      gradedSubmissions: 30,
      pendingSubmissions: 0,
      maxScore: 10,
      fileCount: 2,
    },
    {
      exerciseId: 10,
      title: "Bài tập 2: Hàm số bậc nhất",
      description:
        "Vẽ đồ thị hàm số bậc nhất, xác định tính đồng biến nghịch biến, tìm giao điểm.",
      classroomId: 4,
      className: "Toán 10 - Cơ bản",
      status: "published",
      difficulty: "medium",
      dueDate: "2024-02-16",
      createdAt: "2023-12-28",
      totalSubmissions: 28,
      gradedSubmissions: 20,
      pendingSubmissions: 8,
      maxScore: 12,
      fileCount: 3,
    },
    {
      exerciseId: 11,
      title: "Exercise 1: Present Perfect Usage",
      description:
        "Complete exercises on Present Perfect tense. Identify and correct common mistakes in usage.",
      classroomId: 5,
      className: "Tiếng Anh 12 - IELTS",
      status: "published",
      difficulty: "medium",
      dueDate: "2024-03-10",
      createdAt: "2024-03-02",
      totalSubmissions: 12,
      gradedSubmissions: 8,
      pendingSubmissions: 4,
      maxScore: 10,
      fileCount: 2,
    },
    {
      exerciseId: 12,
      title: "Exercise 2: IELTS Writing Task 1 Practice",
      description:
        "Write a 150-word report describing a bar chart. Focus on overview, key features, and comparisons.",
      classroomId: 5,
      className: "Tiếng Anh 12 - IELTS",
      status: "published",
      difficulty: "hard",
      dueDate: "2024-03-15",
      createdAt: "2024-03-06",
      totalSubmissions: 10,
      gradedSubmissions: 3,
      pendingSubmissions: 7,
      maxScore: 15,
      fileCount: 3,
    },
  ];

  // Filter exercises
  const filteredExercises = mockExercises.filter((exercise) => {
    const matchesSearch =
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || exercise.classroomId === classFilter;
    const matchesStatus = statusFilter === "all" || exercise.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusInfo = (status: ExerciseStatus) => {
    switch (status) {
      case "draft":
        return { label: "Nháp", color: "bg-gray-100 text-gray-700 border-gray-200" };
      case "published":
        return { label: "Đã phát hành", color: "bg-green-100 text-green-700 border-green-200" };
      case "closed":
        return { label: "Đã đóng", color: "bg-red-100 text-red-700 border-red-200" };
    }
  };

  const getDifficultyInfo = (difficulty: ExerciseDifficulty) => {
    switch (difficulty) {
      case "easy":
        return { label: "Dễ", color: "text-green-600" };
      case "medium":
        return { label: "Trung bình", color: "text-yellow-600" };
      case "hard":
        return { label: "Khó", color: "text-red-600" };
    }
  };

  const handleView = (exerciseId: number) => {
    console.log("View exercise:", exerciseId);
  };

  const handleEdit = (exerciseId: number) => {
    console.log("Edit exercise:", exerciseId);
  };

  const handleDelete = (exerciseId: number) => {
    console.log("Delete exercise:", exerciseId);
  };

  const handleGrade = (exerciseId: number) => {
    console.log("Grade submissions:", exerciseId);
  };

  const handlePublish = (exerciseId: number) => {
    console.log("Publish exercise:", exerciseId);
  };

  const selectedClassName =
    classFilter === "all"
      ? "Tất cả lớp học"
      : mockClasses.find((c) => c.classroomId === classFilter)?.name || "Chọn lớp học";

  const selectedStatusName =
    statusFilter === "all"
      ? "Tất cả trạng thái"
      : getStatusInfo(statusFilter).label;

  const totalExercises = mockExercises.length;
  const publishedExercises = mockExercises.filter((e) => e.status === "published").length;
  const draftExercises = mockExercises.filter((e) => e.status === "draft").length;
  const totalPendingSubmissions = mockExercises.reduce((sum, e) => sum + e.pendingSubmissions, 0);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý bài tập</h1>
          <p className="text-gray-600 mt-2">Tạo và chấm điểm bài tập cho học sinh</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Tạo bài tập mới</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng bài tập</p>
              <p className="text-3xl font-bold text-gray-900">{totalExercises}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đã phát hành</p>
              <p className="text-3xl font-bold text-gray-900">{publishedExercises}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bản nháp</p>
              <p className="text-3xl font-bold text-gray-900">{draftExercises}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <Edit className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-orange-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Chờ chấm điểm</p>
              <p className="text-3xl font-bold text-gray-900">{totalPendingSubmissions}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
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
              placeholder="Tìm kiếm bài tập theo tên, mô tả hoặc lớp học..."
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
                setShowStatusDropdown(false);
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

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowClassDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[170px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700 text-sm">{selectedStatusName}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setShowStatusDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg text-sm"
                >
                  Tất cả trạng thái
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("published");
                    setShowStatusDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Đã phát hành
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("draft");
                    setShowStatusDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Bản nháp
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("closed");
                    setShowStatusDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg text-sm"
                >
                  Đã đóng
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold">{filteredExercises.length}</span> bài tập
        </div>
      </div>

      {/* Exercises List */}
      {filteredExercises.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy bài tập nào</h3>
          <p className="text-gray-600">
            {searchQuery
              ? "Thử tìm kiếm với từ khóa khác"
              : "Bạn chưa có bài tập nào. Tạo bài tập mới để bắt đầu!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.exerciseId}
              exercise={exercise}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onGrade={handleGrade}
              onPublish={handlePublish}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Exercise Card Component
function ExerciseCard({
  exercise,
  onView,
  onEdit,
  onDelete,
  onGrade,
  onPublish,
}: {
  exercise: ExerciseData;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onGrade: (id: number) => void;
  onPublish: (id: number) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const statusInfo = getStatusInfo(exercise.status);
  const difficultyInfo = getDifficultyInfo(exercise.difficulty);

  const dueDate = new Date(exercise.dueDate);
  const today = new Date();
  const isOverdue = dueDate < today && exercise.status === "published";
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const submissionRate =
    exercise.totalSubmissions > 0
      ? Math.round((exercise.gradedSubmissions / exercise.totalSubmissions) * 100)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-lg text-gray-900">{exercise.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                <span className={`text-xs font-medium ${difficultyInfo.color}`}>
                  • {difficultyInfo.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{exercise.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <GraduationCap className="w-4 h-4" />
                <span>{exercise.className}</span>
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
                      onView(exercise.exerciseId);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => {
                      onEdit(exercise.exerciseId);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  {exercise.pendingSubmissions > 0 && (
                    <button
                      onClick={() => {
                        onGrade(exercise.exerciseId);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-orange-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Chấm điểm ({exercise.pendingSubmissions})
                    </button>
                  )}
                  {exercise.status === "draft" && (
                    <button
                      onClick={() => {
                        onPublish(exercise.exerciseId);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-green-600"
                    >
                      <Send className="w-4 h-4" />
                      Phát hành
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onDelete(exercise.exerciseId);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 last:rounded-b-lg text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa bài tập
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                <span className="font-semibold text-gray-900">{exercise.totalSubmissions}</span> bài
                nộp
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>
                <span className="font-semibold text-gray-900">{exercise.gradedSubmissions}</span> đã
                chấm
              </span>
            </div>
            {exercise.pendingSubmissions > 0 && (
              <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>{exercise.pendingSubmissions} chờ chấm</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>Điểm tối đa: {exercise.maxScore}</span>
            </div>
            <div
              className={`flex items-center gap-2 text-sm ml-auto ${
                isOverdue ? "text-red-600 font-medium" : "text-gray-600"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>
                {isOverdue
                  ? "Đã quá hạn"
                  : exercise.status === "closed"
                  ? "Đã đóng"
                  : exercise.status === "draft"
                  ? `Hạn: ${dueDate.toLocaleDateString("vi-VN")}`
                  : daysUntilDue > 0
                  ? `Còn ${daysUntilDue} ngày`
                  : "Hết hạn hôm nay"}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          {exercise.totalSubmissions > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Tiến độ chấm điểm</span>
                <span className="font-medium">{submissionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${submissionRate}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusInfo(status: ExerciseStatus) {
  switch (status) {
    case "draft":
      return { label: "Nháp", color: "bg-gray-100 text-gray-700 border-gray-200" };
    case "published":
      return { label: "Đã phát hành", color: "bg-green-100 text-green-700 border-green-200" };
    case "closed":
      return { label: "Đã đóng", color: "bg-red-100 text-red-700 border-red-200" };
  }
}

function getDifficultyInfo(difficulty: ExerciseDifficulty) {
  switch (difficulty) {
    case "easy":
      return { label: "Dễ", color: "text-green-600" };
    case "medium":
      return { label: "Trung bình", color: "text-yellow-600" };
    case "hard":
      return { label: "Khó", color: "text-red-600" };
  }
}
