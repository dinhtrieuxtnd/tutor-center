'use client';

import { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Ban,
  UserPlus
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  grade: string;
  classrooms: number;
  enrolledSubjects: string[];
  gpa: number;
  attendance: number;
  totalSpent: number;
  joinDate: string;
  lastActive: string;
  parent: {
    name: string;
    phone: string;
  };
}

export default function AdminStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [gradeFilter, setGradeFilter] = useState<'all' | '10' | '11' | '12' | 'university'>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Mock data
  const students: Student[] = [
    {
      id: 's1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@student.com',
      phone: '0901234567',
      status: 'active',
      grade: '12',
      classrooms: 3,
      enrolledSubjects: ['math', 'physics'],
      gpa: 8.5,
      attendance: 95,
      totalSpent: 7500000,
      joinDate: '2024-01-15',
      lastActive: '2024-11-19T10:30:00',
      parent: {
        name: 'Nguyễn Văn B',
        phone: '0912345678'
      }
    },
    {
      id: 's2',
      name: 'Trần Thị C',
      email: 'tranthic@student.com',
      phone: '0923456789',
      status: 'active',
      grade: '11',
      classrooms: 2,
      enrolledSubjects: ['chemistry', 'english'],
      gpa: 9.0,
      attendance: 98,
      totalSpent: 5400000,
      joinDate: '2024-02-01',
      lastActive: '2024-11-19T09:15:00',
      parent: {
        name: 'Trần Văn D',
        phone: '0934567890'
      }
    },
    {
      id: 's3',
      name: 'Lê Minh E',
      email: 'leminhe@student.com',
      phone: '0945678901',
      status: 'active',
      grade: 'university',
      classrooms: 2,
      enrolledSubjects: ['math', 'physics'],
      gpa: 7.8,
      attendance: 85,
      totalSpent: 6400000,
      joinDate: '2024-01-20',
      lastActive: '2024-11-19T08:45:00',
      parent: {
        name: 'Lê Văn F',
        phone: '0956789012'
      }
    },
    {
      id: 's4',
      name: 'Phạm Thu G',
      email: 'phamthug@student.com',
      phone: '0967890123',
      status: 'active',
      grade: '12',
      classrooms: 4,
      enrolledSubjects: ['math', 'physics', 'chemistry', 'english'],
      gpa: 9.2,
      attendance: 97,
      totalSpent: 11000000,
      joinDate: '2024-01-10',
      lastActive: '2024-11-19T11:00:00',
      parent: {
        name: 'Phạm Văn H',
        phone: '0978901234'
      }
    },
    {
      id: 's5',
      name: 'Hoàng Minh I',
      email: 'hoangminhi@student.com',
      phone: '0989012345',
      status: 'active',
      grade: '11',
      classrooms: 2,
      enrolledSubjects: ['physics', 'chemistry'],
      gpa: 8.0,
      attendance: 90,
      totalSpent: 5000000,
      joinDate: '2024-02-15',
      lastActive: '2024-11-19T07:30:00',
      parent: {
        name: 'Hoàng Văn K',
        phone: '0990123456'
      }
    },
    {
      id: 's6',
      name: 'Đặng Thu L',
      email: 'dangthul@student.com',
      phone: '0901234568',
      status: 'inactive',
      grade: '10',
      classrooms: 1,
      enrolledSubjects: ['english'],
      gpa: 7.5,
      attendance: 70,
      totalSpent: 3000000,
      joinDate: '2024-03-01',
      lastActive: '2024-10-15T14:30:00',
      parent: {
        name: 'Đặng Văn M',
        phone: '0912345679'
      }
    },
    {
      id: 's7',
      name: 'Vũ Thanh N',
      email: 'vuthanhn@student.com',
      phone: '0923456790',
      status: 'active',
      grade: 'university',
      classrooms: 3,
      enrolledSubjects: ['math', 'physics', 'english'],
      gpa: 8.8,
      attendance: 92,
      totalSpent: 9600000,
      joinDate: '2024-01-25',
      lastActive: '2024-11-18T16:20:00',
      parent: {
        name: 'Vũ Văn O',
        phone: '0934567891'
      }
    },
    {
      id: 's8',
      name: 'Bùi Thị P',
      email: 'buithip@student.com',
      phone: '0945678902',
      status: 'suspended',
      grade: '11',
      classrooms: 0,
      enrolledSubjects: [],
      gpa: 6.5,
      attendance: 60,
      totalSpent: 2000000,
      joinDate: '2024-02-20',
      lastActive: '2024-09-20T11:00:00',
      parent: {
        name: 'Bùi Văn Q',
        phone: '0956789013'
      }
    },
    {
      id: 's9',
      name: 'Ngô Minh R',
      email: 'ngominhr@student.com',
      phone: '0967890124',
      status: 'active',
      grade: '12',
      classrooms: 2,
      enrolledSubjects: ['math', 'english'],
      gpa: 8.3,
      attendance: 88,
      totalSpent: 6000000,
      joinDate: '2024-02-10',
      lastActive: '2024-11-19T09:45:00',
      parent: {
        name: 'Ngô Văn S',
        phone: '0978901235'
      }
    },
    {
      id: 's10',
      name: 'Đinh Thu T',
      email: 'dinhthut@student.com',
      phone: '0989012346',
      status: 'active',
      grade: '10',
      classrooms: 2,
      enrolledSubjects: ['math', 'physics'],
      gpa: 7.2,
      attendance: 82,
      totalSpent: 4000000,
      joinDate: '2024-03-05',
      lastActive: '2024-11-19T08:00:00',
      parent: {
        name: 'Đinh Văn U',
        phone: '0990123457'
      }
    },
    {
      id: 's11',
      name: 'Phan Minh V',
      email: 'phanminhv@student.com',
      phone: '0901234569',
      status: 'active',
      grade: 'university',
      classrooms: 1,
      enrolledSubjects: ['chemistry'],
      gpa: 8.7,
      attendance: 94,
      totalSpent: 2800000,
      joinDate: '2024-02-25',
      lastActive: '2024-11-18T15:30:00',
      parent: {
        name: 'Phan Văn W',
        phone: '0912345680'
      }
    },
    {
      id: 's12',
      name: 'Lý Thu X',
      email: 'lythux@student.com',
      phone: '0923456791',
      status: 'inactive',
      grade: '11',
      classrooms: 0,
      enrolledSubjects: [],
      gpa: 7.0,
      attendance: 65,
      totalSpent: 1500000,
      joinDate: '2024-03-15',
      lastActive: '2024-10-01T10:00:00',
      parent: {
        name: 'Lý Văn Y',
        phone: '0934567892'
      }
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
    return matchesSearch && matchesStatus && matchesGrade;
  });

  // Statistics
  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    suspended: students.filter(s => s.status === 'suspended').length,
    avgGpa: students.reduce((sum, s) => sum + s.gpa, 0) / students.length,
    totalRevenue: students.reduce((sum, s) => sum + s.totalSpent, 0)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'suspended':
        return <Ban className="w-4 h-4" />;
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
      case 'suspended':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang học';
      case 'suspended':
        return 'Tạm khóa';
      case 'inactive':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  const getGradeText = (grade: string) => {
    switch (grade) {
      case '10':
      case '11':
      case '12':
        return `Lớp ${grade}`;
      case 'university':
        return 'Đại học';
      default:
        return grade;
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

  const getGpaColor = (gpa: number) => {
    if (gpa >= 9.0) return 'text-green-600';
    if (gpa >= 8.0) return 'text-blue-600';
    if (gpa >= 7.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 80) return 'text-blue-600';
    if (attendance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý học sinh</h1>
        <p className="text-gray-600">Quản lý tất cả học sinh trong hệ thống</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Tổng số học sinh</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.active}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Đang học</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.avgGpa.toFixed(1)}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Điểm TB trung bình</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {(stats.totalRevenue / 1000000).toFixed(0)}M
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Tổng doanh thu</h3>
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
              placeholder="Tìm kiếm học sinh, email..."
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
              <option value="active">Đang học</option>
              <option value="inactive">Không hoạt động</option>
              <option value="suspended">Tạm khóa</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tất cả khối lớp</option>
              <option value="10">Lớp 10</option>
              <option value="11">Lớp 11</option>
              <option value="12">Lớp 12</option>
              <option value="university">Đại học</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">
                    {student.name.split(' ').pop()?.charAt(0)}
                  </span>
                </div>

                <div className="flex-1">
                  {/* Header */}
                  <div className="mb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(student.status)}`}>
                        {getStatusIcon(student.status)}
                        {getStatusText(student.status)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {getGradeText(student.grade)}
                      </span>
                    </div>

                    {student.enrolledSubjects.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {student.enrolledSubjects.map((subject) => (
                          <span
                            key={subject}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getSubjectColor(subject)}`}
                          >
                            {getSubjectText(subject)}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>PH: {student.parent.name} - {student.parent.phone}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Tham gia: {new Date(student.joinDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Hoạt động: {getTimeAgo(student.lastActive)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-xs font-medium">Lớp học</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{student.classrooms}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Award className="w-4 h-4" />
                        <span className="text-xs font-medium">Điểm TB</span>
                      </div>
                      <p className={`text-lg font-semibold ${getGpaColor(student.gpa)}`}>
                        {student.gpa.toFixed(1)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Điểm danh</span>
                      </div>
                      <p className={`text-lg font-semibold ${getAttendanceColor(student.attendance)}`}>
                        {student.attendance}%
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-medium">Môn học</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {student.enrolledSubjects.length}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Award className="w-4 h-4" />
                        <span className="text-xs font-medium">Đã đóng</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {(student.totalSpent / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Menu */}
              <div className="relative ml-4">
                <button
                  onClick={() => setOpenMenuId(openMenuId === student.id ? null : student.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {openMenuId === student.id && (
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
                      <BookOpen className="w-4 h-4" />
                      Xem bảng điểm
                    </button>
                    {student.status === 'active' && (
                      <button className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2">
                        <Ban className="w-4 h-4" />
                        Tạm khóa
                      </button>
                    )}
                    {student.status === 'suspended' && (
                      <button className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Mở khóa
                      </button>
                    )}
                    <div className="border-t border-gray-200 my-2"></div>
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Xóa tài khoản
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy học sinh</h3>
          <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      {/* Add New Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
        <UserPlus className="w-6 h-6" />
      </button>
    </div>
  );
}
