'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppHeader } from '@/components/layout';
import { 
  ArrowLeft, 
  BookOpen, 
  Video, 
  FileText, 
  ClipboardList,
  Users,
  Calendar,
  Clock,
  MessageSquare,
  Share2,
  Settings,
  CheckCircle2,
  PlayCircle
} from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'document';
  duration?: string;
  completed: boolean;
  uploadDate: string;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  type: 'exercise' | 'quiz';
  dueDate: string;
  duration?: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore: number;
}

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

  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'assignments' | 'members'>('overview');

  // Mock data - sẽ fetch từ API theo classId
  const classData = {
    id: classId,
    title: 'Toán 12 - Luyện thi THPT QG',
    teacher: 'Thầy Nguyễn Văn B',
    description: 'Lớp học toán nâng cao dành cho học sinh lớp 12 chuẩn bị thi THPT Quốc Gia. Tập trung vào các dạng bài tập quan trọng và phương pháp giải nhanh.',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
    schedule: 'Thứ 2, 4, 6 - 14:00-16:00',
    totalStudents: 25,
    totalLessons: 36,
    completedLessons: 12,
    progress: 65,
    nextLesson: {
      title: 'Hàm số bậc hai và đồ thị',
      date: 'Thứ 2, 15/11/2025',
      time: '14:00 - 16:00'
    }
  };

  const lessons: Lesson[] = [
    {
      id: 1,
      title: 'Giới thiệu về hàm số',
      description: 'Khái niệm cơ bản về hàm số và các tính chất',
      type: 'video',
      duration: '45 phút',
      completed: true,
      uploadDate: '01/11/2025'
    },
    {
      id: 2,
      title: 'Đạo hàm và ứng dụng',
      description: 'Quy tắc tính đạo hàm và bài tập áp dụng',
      type: 'video',
      duration: '60 phút',
      completed: true,
      uploadDate: '05/11/2025'
    },
    {
      id: 3,
      title: 'Tài liệu ôn tập giữa kỳ',
      description: 'Bộ đề thi thử và đáp án chi tiết',
      type: 'document',
      completed: false,
      uploadDate: '10/11/2025'
    }
  ];

  const assignments: Assignment[] = [
    {
      id: 1,
      title: 'Bài tập về hàm số bậc nhất',
      description: 'Làm bài tập từ câu 1 đến câu 10 trong sách giáo khoa',
      type: 'exercise',
      dueDate: '20/11/2025',
      status: 'graded',
      score: 8.5,
      maxScore: 10
    },
    {
      id: 2,
      title: 'Bài tập về đạo hàm',
      description: 'Hoàn thành worksheet về đạo hàm',
      type: 'exercise',
      dueDate: '25/11/2025',
      status: 'submitted',
      maxScore: 10
    },
    {
      id: 3,
      title: 'Kiểm tra giữa kỳ',
      description: 'Bài kiểm tra trắc nghiệm 15 câu về hàm số và đạo hàm',
      type: 'quiz',
      duration: '30 phút',
      dueDate: '30/11/2025',
      status: 'pending',
      maxScore: 10
    },
    {
      id: 4,
      title: 'Bài tập tổng hợp chương 1',
      description: 'Tổng hợp kiến thức chương 1',
      type: 'exercise',
      dueDate: '05/12/2025',
      status: 'pending',
      maxScore: 10
    }
  ];

  const members: ClassMember[] = [
    { id: 1, name: 'Thầy Nguyễn Văn B', role: 'teacher' },
    { id: 2, name: 'Nguyễn Văn A', role: 'student' },
    { id: 3, name: 'Trần Thị B', role: 'student' },
    { id: 4, name: 'Lê Văn C', role: 'student' },
    { id: 5, name: 'Phạm Thị D', role: 'student' },
  ];

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise': return <FileText className="w-5 h-5" />;
      case 'quiz': return <ClipboardList className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Chưa nộp', color: 'bg-yellow-100 text-yellow-800' },
      submitted: { label: 'Đã nộp', color: 'bg-blue-100 text-blue-800' },
      graded: { label: 'Đã chấm', color: 'bg-green-100 text-green-800' }
    };
    return badges[status as keyof typeof badges];
  };

  const handleLogout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-open-sans">

      {/* Back Button Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-open-sans"
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
              backgroundImage: `linear-gradient(rgba(25, 77, 182, 0.8), rgba(25, 77, 182, 0.8)), url(${classData.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 flex items-end px-4 sm:px-6 lg:px-8 pb-6">
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2 font-poppins">{classData.title}</h1>
                <div className="flex items-center gap-4 text-sm font-open-sans">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {classData.totalStudents} học sinh
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {classData.schedule}
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
                { id: 'assignments', label: 'Bài tập', icon: ClipboardList },
                { id: 'members', label: 'Thành viên', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors font-open-sans ${
                      activeTab === tab.id
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
              <div className="space-y-6">
                {/* Next Lesson */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Buổi học tiếp theo
                  </h2>
                  <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg p-4 border border-primary/20">
                    <h3 className="font-semibold text-gray-900 mb-2 font-poppins">
                      {classData.nextLesson.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 font-open-sans">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {classData.nextLesson.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {classData.nextLesson.time}
                      </span>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-open-sans">
                      Tham gia lớp học
                    </button>
                  </div>
                </div>

                {/* About */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                    Về lớp học này
                  </h2>
                  <p className="text-gray-700 leading-relaxed font-open-sans">
                    {classData.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 font-open-sans">
                    <Users className="w-4 h-4" />
                    <span>Giáo viên: <strong>{classData.teacher}</strong></span>
                  </div>
                </div>

                {/* Recent Lessons */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                    Bài học gần đây
                  </h2>
                  <div className="space-y-3">
                    {lessons.slice(0, 3).map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => router.push(`/student/lesson/${lesson.id}`)}
                        className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          lesson.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {lesson.completed ? <CheckCircle2 className="w-5 h-5" /> : getLessonTypeIcon(lesson.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 font-poppins">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-600 font-open-sans">
                            {lesson.description}
                          </p>
                          {lesson.duration && (
                            <span className="text-xs text-gray-500 font-open-sans">
                              {lesson.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('lessons')}
                    className="mt-4 text-sm text-primary hover:text-blue-700 font-medium font-open-sans"
                  >
                    Xem tất cả bài học →
                  </button>
                </div>
              </div>
            )}

            {/* Lessons Tab */}
            {activeTab === 'lessons' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                  Tất cả bài học ({lessons.length})
                </h2>
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => router.push(`/student/lesson/${lesson.id}`)}
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        lesson.completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {lesson.completed ? <CheckCircle2 className="w-6 h-6" /> : getLessonTypeIcon(lesson.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 font-poppins">
                            {lesson.title}
                          </h3>
                          {lesson.completed && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-open-sans">
                              Đã hoàn thành
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 font-open-sans">
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-open-sans">
                          {lesson.duration && <span>⏱ {lesson.duration}</span>}
                          <span>📅 {lesson.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                  Bài tập ({assignments.length})
                </h2>
                <div className="space-y-3">
                  {assignments.map((assignment) => {
                    const badge = getStatusBadge(assignment.status);
                    return (
                      <div
                        key={assignment.id}
                        onClick={() => {
                          if (assignment.type === 'quiz') {
                            router.push(`/student/quiz/${assignment.id}`);
                          } else {
                            router.push(`/student/assignment/${assignment.id}`);
                          }
                        }}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            assignment.type === 'quiz' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {getAssignmentTypeIcon(assignment.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 font-poppins">
                                {assignment.title}
                              </h3>
                              {assignment.type === 'quiz' && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full font-open-sans">
                                  Trắc nghiệm
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2 font-open-sans">
                              {assignment.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 font-open-sans">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Hạn nộp: {assignment.dueDate}
                              </span>
                              {assignment.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {assignment.duration}
                                </span>
                              )}
                              {assignment.score !== undefined && (
                                <span className="font-medium text-green-600">
                                  Điểm: {assignment.score}/{assignment.maxScore}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 font-poppins">
                  Thành viên ({members.length})
                </h2>
                <div className="space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold font-poppins">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 font-poppins">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-open-sans">
                          {member.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                        </p>
                      </div>
                      {member.role === 'teacher' && (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium font-open-sans">
                          Giáo viên
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4 font-poppins">
                  Tiến độ học tập
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2 font-open-sans">
                    <span className="text-gray-600">Đã hoàn thành</span>
                    <span className="font-bold text-primary">{classData.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary to-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${classData.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary font-poppins">
                      {classData.completedLessons}
                    </p>
                    <p className="text-xs text-gray-600 font-open-sans">Đã học</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900 font-poppins">
                      {classData.totalLessons}
                    </p>
                    <p className="text-xs text-gray-600 font-open-sans">Tổng bài</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4 font-poppins">
                  Thao tác nhanh
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left font-open-sans">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Nhắn tin nhóm</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left font-open-sans">
                    <Share2 className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Chia sẻ lớp học</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left font-open-sans">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Cài đặt</span>
                  </button>
                </div>
              </div>

              {/* Teacher Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4 font-poppins">
                  Giáo viên
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold font-poppins">
                    {classData.teacher.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 font-poppins">
                      {classData.teacher}
                    </h4>
                    <p className="text-sm text-gray-600 font-open-sans">
                      Giáo viên môn Toán
                    </p>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-open-sans">
                  Liên hệ giáo viên
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
