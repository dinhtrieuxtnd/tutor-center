'use client';

import { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  Clock, 
  DollarSign,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Classroom {
  id: string;
  name: string;
  subject: string;
  tutor: {
    id: string;
    name: string;
    avatar?: string;
  };
  students: number;
  maxStudents: number;
  schedule: string;
  price: number;
  status: 'active' | 'inactive' | 'full';
  startDate: string;
  endDate: string;
  lessons: number;
  completedLessons: number;
}

export default function AdminClassroomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'full'>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'math' | 'physics' | 'chemistry' | 'english'>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Mock data
  const classrooms: Classroom[] = [
    {
      id: '1',
      name: 'Toán Cao Cấp A1',
      subject: 'math',
      tutor: {
        id: 't1',
        name: 'TS. Nguyễn Văn An',
        avatar: undefined
      },
      students: 25,
      maxStudents: 30,
      schedule: 'T2, T4, T6 - 18:00-20:00',
      price: 2500000,
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      lessons: 48,
      completedLessons: 32
    },
    {
      id: '2',
      name: 'Vật Lý Đại Cương B2',
      subject: 'physics',
      tutor: {
        id: 't2',
        name: 'ThS. Trần Thị Bình',
        avatar: undefined
      },
      students: 30,
      maxStudents: 30,
      schedule: 'T3, T5 - 19:00-21:00',
      price: 2200000,
      status: 'full',
      startDate: '2024-02-01',
      endDate: '2024-07-15',
      lessons: 40,
      completedLessons: 28
    },
    {
      id: '3',
      name: 'Hóa Hữu Cơ Nâng Cao',
      subject: 'chemistry',
      tutor: {
        id: 't3',
        name: 'PGS. Lê Văn Cường',
        avatar: undefined
      },
      students: 18,
      maxStudents: 25,
      schedule: 'T2, T6 - 18:30-20:30',
      price: 2800000,
      status: 'active',
      startDate: '2024-01-20',
      endDate: '2024-06-20',
      lessons: 36,
      completedLessons: 24
    },
    {
      id: '4',
      name: 'English Advanced C1',
      subject: 'english',
      tutor: {
        id: 't4',
        name: 'Ms. Emily Johnson',
        avatar: undefined
      },
      students: 20,
      maxStudents: 25,
      schedule: 'T3, T5, T7 - 17:00-19:00',
      price: 3000000,
      status: 'active',
      startDate: '2024-02-10',
      endDate: '2024-08-10',
      lessons: 60,
      completedLessons: 40
    },
    {
      id: '5',
      name: 'Toán Giải Tích 1',
      subject: 'math',
      tutor: {
        id: 't1',
        name: 'TS. Nguyễn Văn An',
        avatar: undefined
      },
      students: 15,
      maxStudents: 30,
      schedule: 'T2, T4 - 20:00-22:00',
      price: 2000000,
      status: 'inactive',
      startDate: '2024-03-01',
      endDate: '2024-08-30',
      lessons: 48,
      completedLessons: 0
    },
    {
      id: '6',
      name: 'Vật Lý Lượng Tử',
      subject: 'physics',
      tutor: {
        id: 't5',
        name: 'PGS.TS. Phạm Minh Đức',
        avatar: undefined
      },
      students: 22,
      maxStudents: 25,
      schedule: 'T4, T6 - 19:00-21:00',
      price: 3200000,
      status: 'active',
      startDate: '2024-01-25',
      endDate: '2024-07-25',
      lessons: 44,
      completedLessons: 30
    },
    {
      id: '7',
      name: 'IELTS Intensive 7.0+',
      subject: 'english',
      tutor: {
        id: 't6',
        name: 'Mr. David Smith',
        avatar: undefined
      },
      students: 16,
      maxStudents: 20,
      schedule: 'T2, T4, T6 - 18:00-20:00',
      price: 3500000,
      status: 'active',
      startDate: '2024-02-15',
      endDate: '2024-06-15',
      lessons: 48,
      completedLessons: 36
    },
    {
      id: '8',
      name: 'Hóa Vô Cơ Cơ Bản',
      subject: 'chemistry',
      tutor: {
        id: 't7',
        name: 'ThS. Hoàng Thị Lan',
        avatar: undefined
      },
      students: 12,
      maxStudents: 25,
      schedule: 'T3, T5 - 18:00-20:00',
      price: 1800000,
      status: 'inactive',
      startDate: '2024-03-10',
      endDate: '2024-08-20',
      lessons: 40,
      completedLessons: 0
    }
  ];

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classroom.tutor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || classroom.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || classroom.subject === subjectFilter;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Statistics
  const stats = {
    total: classrooms.length,
    active: classrooms.filter(c => c.status === 'active').length,
    inactive: classrooms.filter(c => c.status === 'inactive').length,
    full: classrooms.filter(c => c.status === 'full').length,
    totalStudents: classrooms.reduce((sum, c) => sum + c.students, 0),
    totalRevenue: classrooms.filter(c => c.status === 'active' || c.status === 'full')
                           .reduce((sum, c) => sum + (c.price * c.students), 0)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'full':
        return <AlertCircle className="w-4 h-4" />;
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'full':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'full':
        return 'Đã đủ';
      case 'inactive':
        return 'Chưa khai giảng';
      default:
        return status;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'math':
        return 'bg-blue-100 text-blue-700';
      case 'physics':
        return 'bg-purple-100 text-purple-700';
      case 'chemistry':
        return 'bg-green-100 text-green-700';
      case 'english':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSubjectText = (subject: string) => {
    switch (subject) {
      case 'math':
        return 'Toán';
      case 'physics':
        return 'Vật Lý';
      case 'chemistry':
        return 'Hóa Học';
      case 'english':
        return 'Tiếng Anh';
      default:
        return subject;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý lớp học</h1>
        <p className="text-gray-600">Quản lý tất cả các lớp học trong hệ thống</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Tổng số lớp</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.active}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Đang hoạt động</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalStudents}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Tổng học sinh</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {(stats.totalRevenue / 1000000).toFixed(1)}M
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Doanh thu/tháng</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm lớp học, gia sư..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Chưa khai giảng</option>
              <option value="full">Đã đủ học sinh</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tất cả môn học</option>
              <option value="math">Toán</option>
              <option value="physics">Vật Lý</option>
              <option value="chemistry">Hóa Học</option>
              <option value="english">Tiếng Anh</option>
            </select>
          </div>
        </div>
      </div>

      {/* Classrooms List */}
      <div className="space-y-4">
        {filteredClassrooms.map((classroom) => (
          <div
            key={classroom.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{classroom.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSubjectColor(classroom.subject)}`}>
                        {getSubjectText(classroom.subject)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(classroom.status)}`}>
                        {getStatusIcon(classroom.status)}
                        {getStatusText(classroom.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Giảng viên: {classroom.tutor.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{classroom.schedule}</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium">Học sinh</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {classroom.students}/{classroom.maxStudents}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-xs font-medium">Tiến độ</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {classroom.completedLessons}/{classroom.lessons}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-medium">Thời gian</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(classroom.startDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium">Học phí</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {(classroom.price / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Tiến độ học tập</span>
                    <span>{Math.round((classroom.completedLessons / classroom.lessons) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(classroom.completedLessons / classroom.lessons) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions Menu */}
              <div className="relative ml-4">
                <button
                  onClick={() => setOpenMenuId(openMenuId === classroom.id ? null : classroom.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {openMenuId === classroom.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Thêm học sinh
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Xem lịch học
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Xóa lớp học
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClassrooms.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy lớp học</h3>
          <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      {/* Add New Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
        <UserPlus className="w-6 h-6" />
      </button>
    </div>
  );
}
