"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  ClipboardCheck,
  Clock,
  Eye,
  Edit,
  Trash2,
  Calendar,
  GraduationCap,
  ChevronDown,
  Users,
  FileQuestion,
  Trophy,
  TrendingUp,
  Play,
  StopCircle,
  Copy,
} from "lucide-react";

type QuizStatus = "draft" | "scheduled" | "active" | "completed";
type QuizType = "practice" | "midterm" | "final" | "homework";

interface QuizData {
  quizId: number;
  title: string;
  description: string;
  classroomId: number;
  className: string;
  status: QuizStatus;
  type: QuizType;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  totalQuestions: number;
  totalPoints: number;
  createdAt: string;
  participants: number;
  completed: number;
  averageScore?: number;
  passingScore: number;
}

export default function TutorQuizzesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<QuizStatus | "all">("all");
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

  // Mock data - Quizzes
  const mockQuizzes: QuizData[] = [
    {
      quizId: 1,
      title: "Kiểm tra giữa kỳ - Hàm số và Đạo hàm",
      description:
        "Kiểm tra giữa kỳ chương 1 và 2. Bao gồm lý thuyết về hàm số, khảo sát hàm số, và tính đạo hàm.",
      classroomId: 1,
      className: "Toán 12 - Chuyên đề hàm số",
      status: "completed",
      type: "midterm",
      startTime: "2024-01-20T14:00:00",
      endTime: "2024-01-20T16:00:00",
      duration: 90,
      totalQuestions: 20,
      totalPoints: 100,
      createdAt: "2024-01-15",
      participants: 25,
      completed: 25,
      averageScore: 75.5,
      passingScore: 50,
    },
    {
      quizId: 2,
      title: "Bài kiểm tra 15 phút - Đạo hàm cơ bản",
      description: "Kiểm tra nhanh về các quy tắc tính đạo hàm cơ bản và đạo hàm hàm hợp.",
      classroomId: 1,
      className: "Toán 12 - Chuyên đề hàm số",
      status: "active",
      type: "practice",
      startTime: "2024-02-10T14:00:00",
      endTime: "2024-02-10T14:15:00",
      duration: 15,
      totalQuestions: 10,
      totalPoints: 30,
      createdAt: "2024-02-08",
      participants: 25,
      completed: 18,
      averageScore: 22.5,
      passingScore: 15,
    },
    {
      quizId: 3,
      title: "Kiểm tra cuối kỳ - Toàn bộ chương trình",
      description:
        "Kiểm tra tổng hợp toàn bộ kiến thức đã học: hàm số, đạo hàm, khảo sát và ứng dụng.",
      classroomId: 1,
      className: "Toán 12 - Chuyên đề hàm số",
      status: "scheduled",
      type: "final",
      startTime: "2024-02-25T14:00:00",
      endTime: "2024-02-25T16:30:00",
      duration: 120,
      totalQuestions: 30,
      totalPoints: 150,
      createdAt: "2024-02-01",
      participants: 0,
      completed: 0,
      passingScore: 75,
    },
    {
      quizId: 4,
      title: "Quiz: Động học chất điểm",
      description: "Bài kiểm tra trắc nghiệm về chuyển động thẳng đều và chuyển động biến đổi đều.",
      classroomId: 2,
      className: "Vật lý 11 - Cơ học",
      status: "completed",
      type: "practice",
      startTime: "2024-02-05T15:30:00",
      endTime: "2024-02-05T16:00:00",
      duration: 30,
      totalQuestions: 15,
      totalPoints: 40,
      createdAt: "2024-02-01",
      participants: 18,
      completed: 18,
      averageScore: 32.5,
      passingScore: 20,
    },
    {
      quizId: 5,
      title: "Kiểm tra giữa kỳ - Động lực học",
      description: "Kiểm tra ba định luật Newton và các bài toán ứng dụng trong thực tế.",
      classroomId: 2,
      className: "Vật lý 11 - Cơ học",
      status: "active",
      type: "midterm",
      startTime: "2024-02-15T15:30:00",
      endTime: "2024-02-15T17:00:00",
      duration: 90,
      totalQuestions: 20,
      totalPoints: 100,
      createdAt: "2024-02-10",
      participants: 18,
      completed: 12,
      averageScore: 68.0,
      passingScore: 50,
    },
    {
      quizId: 6,
      title: "Bài tập về nhà - Định luật bảo toàn",
      description: "Bài tập về định luật bảo toàn động lượng và năng lượng. Làm tại nhà trong 2 ngày.",
      classroomId: 2,
      className: "Vật lý 11 - Cơ học",
      status: "scheduled",
      type: "homework",
      startTime: "2024-02-20T00:00:00",
      endTime: "2024-02-22T23:59:00",
      duration: 60,
      totalQuestions: 12,
      totalPoints: 50,
      createdAt: "2024-02-15",
      participants: 0,
      completed: 0,
      passingScore: 25,
    },
    {
      quizId: 7,
      title: "Quiz: Cấu hình electron",
      description: "Kiểm tra nhanh về cấu hình electron và bảng tuần hoàn các nguyên tố hóa học.",
      classroomId: 3,
      className: "Hóa học 10 - Cơ bản",
      status: "completed",
      type: "practice",
      startTime: "2024-02-01T16:00:00",
      endTime: "2024-02-01T16:20:00",
      duration: 20,
      totalQuestions: 12,
      totalPoints: 30,
      createdAt: "2024-01-28",
      participants: 22,
      completed: 22,
      averageScore: 24.5,
      passingScore: 15,
    },
    {
      quizId: 8,
      title: "Kiểm tra giữa kỳ - Liên kết hóa học",
      description: "Kiểm tra về liên kết ion, cộng hóa trị, kim loại và cấu trúc phân tử.",
      classroomId: 3,
      className: "Hóa học 10 - Cơ bản",
      status: "scheduled",
      type: "midterm",
      startTime: "2024-02-18T16:00:00",
      endTime: "2024-02-18T17:30:00",
      duration: 90,
      totalQuestions: 25,
      totalPoints: 100,
      createdAt: "2024-02-10",
      participants: 0,
      completed: 0,
      passingScore: 50,
    },
    {
      quizId: 9,
      title: "Bài kiểm tra - Tập hợp và Logic",
      description: "Kiểm tra về các phép toán trên tập hợp và mệnh đề logic.",
      classroomId: 4,
      className: "Toán 10 - Cơ bản",
      status: "completed",
      type: "practice",
      startTime: "2024-01-10T14:00:00",
      endTime: "2024-01-10T14:45:00",
      duration: 45,
      totalQuestions: 15,
      totalPoints: 50,
      createdAt: "2023-12-28",
      participants: 30,
      completed: 30,
      averageScore: 38.5,
      passingScore: 25,
    },
    {
      quizId: 10,
      title: "Kiểm tra cuối kỳ - Đại số 10",
      description: "Kiểm tra tổng hợp về hàm số, phương trình và bất phương trình.",
      classroomId: 4,
      className: "Toán 10 - Cơ bản",
      status: "scheduled",
      type: "final",
      startTime: "2024-02-28T14:00:00",
      endTime: "2024-02-28T16:00:00",
      duration: 120,
      totalQuestions: 25,
      totalPoints: 120,
      createdAt: "2024-02-05",
      participants: 0,
      completed: 0,
      passingScore: 60,
    },
    {
      quizId: 11,
      title: "Grammar Test: Present Perfect",
      description: "Test your understanding of Present Perfect tense usage and common mistakes.",
      classroomId: 5,
      className: "Tiếng Anh 12 - IELTS",
      status: "active",
      type: "practice",
      startTime: "2024-03-08T18:00:00",
      endTime: "2024-03-08T18:30:00",
      duration: 30,
      totalQuestions: 20,
      totalPoints: 40,
      createdAt: "2024-03-06",
      participants: 15,
      completed: 8,
      averageScore: 28.5,
      passingScore: 24,
    },
    {
      quizId: 12,
      title: "IELTS Mock Test - Reading",
      description: "Full IELTS Reading mock test with 3 passages and 40 questions. Academic module.",
      classroomId: 5,
      className: "Tiếng Anh 12 - IELTS",
      status: "draft",
      type: "midterm",
      startTime: "2024-03-20T18:00:00",
      endTime: "2024-03-20T19:00:00",
      duration: 60,
      totalQuestions: 40,
      totalPoints: 100,
      createdAt: "2024-03-10",
      participants: 0,
      completed: 0,
      passingScore: 60,
    },
  ];

  // Filter quizzes
  const filteredQuizzes = mockQuizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || quiz.classroomId === classFilter;
    const matchesStatus = statusFilter === "all" || quiz.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusInfo = (status: QuizStatus) => {
    switch (status) {
      case "draft":
        return {
          label: "Nháp",
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: Edit,
        };
      case "scheduled":
        return {
          label: "Đã lên lịch",
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: Calendar,
        };
      case "active":
        return {
          label: "Đang diễn ra",
          color: "bg-green-100 text-green-700 border-green-200",
          icon: Play,
        };
      case "completed":
        return {
          label: "Đã hoàn thành",
          color: "bg-purple-100 text-purple-700 border-purple-200",
          icon: Trophy,
        };
    }
  };

  const getTypeInfo = (type: QuizType) => {
    switch (type) {
      case "practice":
        return { label: "Luyện tập", color: "text-blue-600" };
      case "midterm":
        return { label: "Giữa kỳ", color: "text-orange-600" };
      case "final":
        return { label: "Cuối kỳ", color: "text-red-600" };
      case "homework":
        return { label: "Bài tập về nhà", color: "text-green-600" };
    }
  };

  const handleView = (quizId: number) => {
    console.log("View quiz:", quizId);
  };

  const handleEdit = (quizId: number) => {
    console.log("Edit quiz:", quizId);
  };

  const handleDelete = (quizId: number) => {
    console.log("Delete quiz:", quizId);
  };

  const handleResults = (quizId: number) => {
    console.log("View results:", quizId);
  };

  const handleStart = (quizId: number) => {
    console.log("Start quiz:", quizId);
  };

  const handleStop = (quizId: number) => {
    console.log("Stop quiz:", quizId);
  };

  const handleDuplicate = (quizId: number) => {
    console.log("Duplicate quiz:", quizId);
  };

  const selectedClassName =
    classFilter === "all"
      ? "Tất cả lớp học"
      : mockClasses.find((c) => c.classroomId === classFilter)?.name || "Chọn lớp học";

  const selectedStatusName =
    statusFilter === "all" ? "Tất cả trạng thái" : getStatusInfo(statusFilter).label;

  const totalQuizzes = mockQuizzes.length;
  const activeQuizzes = mockQuizzes.filter((q) => q.status === "active").length;
  const scheduledQuizzes = mockQuizzes.filter((q) => q.status === "scheduled").length;
  const totalParticipants = mockQuizzes.reduce((sum, q) => sum + q.participants, 0);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý bài kiểm tra</h1>
          <p className="text-gray-600 mt-2">Tạo và quản lý bài kiểm tra trực tuyến</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Tạo bài kiểm tra mới</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng bài kiểm tra</p>
              <p className="text-3xl font-bold text-gray-900">{totalQuizzes}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đang diễn ra</p>
              <p className="text-3xl font-bold text-gray-900">{activeQuizzes}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-orange-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đã lên lịch</p>
              <p className="text-3xl font-bold text-gray-900">{scheduledQuizzes}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border-2 border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lượt tham gia</p>
              <p className="text-3xl font-bold text-gray-900">{totalParticipants}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
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
              placeholder="Tìm kiếm bài kiểm tra theo tên, mô tả hoặc lớp học..."
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
                    setStatusFilter("active");
                    setShowStatusDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Đang diễn ra
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("scheduled");
                    setShowStatusDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Đã lên lịch
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("completed");
                    setShowStatusDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  Đã hoàn thành
                </button>
                <button
                  onClick={() => {
                    setStatusFilter("draft");
                    setShowStatusDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg text-sm"
                >
                  Bản nháp
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Hiển thị <span className="font-semibold">{filteredQuizzes.length}</span> bài kiểm tra
        </div>
      </div>

      {/* Quizzes List */}
      {filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ClipboardCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy bài kiểm tra nào
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "Thử tìm kiếm với từ khóa khác"
              : "Bạn chưa có bài kiểm tra nào. Tạo bài kiểm tra mới để bắt đầu!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.quizId}
              quiz={quiz}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onResults={handleResults}
              onStart={handleStart}
              onStop={handleStop}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Quiz Card Component
function QuizCard({
  quiz,
  onView,
  onEdit,
  onDelete,
  onResults,
  onStart,
  onStop,
  onDuplicate,
}: {
  quiz: QuizData;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onResults: (id: number) => void;
  onStart: (id: number) => void;
  onStop: (id: number) => void;
  onDuplicate: (id: number) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const statusInfo = getStatusInfo(quiz.status);
  const typeInfo = getTypeInfo(quiz.type);
  const StatusIcon = statusInfo.icon;

  const completionRate = quiz.participants > 0 ? Math.round((quiz.completed / quiz.participants) * 100) : 0;
  const passRate =
    quiz.averageScore && quiz.passingScore
      ? Math.round((quiz.averageScore / quiz.passingScore) * 100)
      : 0;

  const startTime = new Date(quiz.startTime);
  const endTime = new Date(quiz.endTime);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <ClipboardCheck className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-lg text-gray-900">{quiz.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${statusInfo.color}`}>
                  <StatusIcon className="w-3 h-3 inline mr-1" />
                  {statusInfo.label}
                </span>
                <span className={`text-xs font-medium ${typeInfo.color}`}>• {typeInfo.label}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{quiz.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <GraduationCap className="w-4 h-4" />
                <span>{quiz.className}</span>
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
                      onView(quiz.quizId);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                  {quiz.status === "completed" && (
                    <button
                      onClick={() => {
                        onResults(quiz.quizId);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-purple-600"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Xem kết quả
                    </button>
                  )}
                  {quiz.status === "draft" && (
                    <button
                      onClick={() => {
                        onStart(quiz.quizId);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-green-600"
                    >
                      <Play className="w-4 h-4" />
                      Bắt đầu
                    </button>
                  )}
                  {quiz.status === "active" && (
                    <button
                      onClick={() => {
                        onStop(quiz.quizId);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600"
                    >
                      <StopCircle className="w-4 h-4" />
                      Kết thúc
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onEdit(quiz.quizId);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      onDuplicate(quiz.quizId);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    Nhân bản
                  </button>
                  <button
                    onClick={() => {
                      onDelete(quiz.quizId);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 last:rounded-b-lg text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa bài kiểm tra
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileQuestion className="w-4 h-4" />
              <span>
                <span className="font-semibold text-gray-900">{quiz.totalQuestions}</span> câu hỏi
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Trophy className="w-4 h-4" />
              <span>
                <span className="font-semibold text-gray-900">{quiz.totalPoints}</span> điểm
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>
                <span className="font-semibold text-gray-900">{quiz.duration}</span> phút
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                <span className="font-semibold text-gray-900">
                  {quiz.completed}/{quiz.participants}
                </span>{" "}
                hoàn thành
              </span>
            </div>
          </div>

          {/* Time and Progress */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {startTime.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  - {startTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              {quiz.averageScore !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Điểm TB:</span>
                  <span className="font-semibold text-blue-600">{quiz.averageScore.toFixed(1)}</span>
                  <span className="text-gray-600">/ {quiz.totalPoints}</span>
                </div>
              )}
            </div>

            {/* Progress Bar for Active/Completed */}
            {(quiz.status === "active" || quiz.status === "completed") && quiz.participants > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Tỷ lệ hoàn thành</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      quiz.status === "completed"
                        ? "bg-gradient-to-r from-purple-500 to-purple-600"
                        : "bg-gradient-to-r from-green-500 to-green-600"
                    }`}
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusInfo(status: QuizStatus) {
  switch (status) {
    case "draft":
      return {
        label: "Nháp",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: Edit,
      };
    case "scheduled":
      return {
        label: "Đã lên lịch",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: Calendar,
      };
    case "active":
      return {
        label: "Đang diễn ra",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: Play,
      };
    case "completed":
      return {
        label: "Đã hoàn thành",
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: Trophy,
      };
  }
}

function getTypeInfo(type: QuizType) {
  switch (type) {
    case "practice":
      return { label: "Luyện tập", color: "text-blue-600" };
    case "midterm":
      return { label: "Giữa kỳ", color: "text-orange-600" };
    case "final":
      return { label: "Cuối kỳ", color: "text-red-600" };
    case "homework":
      return { label: "Bài tập về nhà", color: "text-green-600" };
  }
}
