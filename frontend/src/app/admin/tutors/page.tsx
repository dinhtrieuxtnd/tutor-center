'use client';

import { useState } from 'react';
import { 
  UserCheck, 
  Users, 
  GraduationCap, 
  DollarSign,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Ban
} from 'lucide-react';

interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  subjects: string[];
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  totalReviews: number;
  experience: number;
  education: string;
  classrooms: number;
  students: number;
  monthlyRevenue: number;
  joinDate: string;
  lastActive: string;
  bio: string;
}

export default function AdminTutorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'math' | 'physics' | 'chemistry' | 'english'>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Mock data
  const tutors: Tutor[] = [
    {
      id: 't1',
      name: 'TS. Nguyễn Văn An',
      email: 'nguyenvanan@example.com',
      phone: '0901234567',
      subjects: ['math'],
      status: 'active',
      rating: 4.8,
      totalReviews: 124,
      experience: 8,
      education: 'Tiến sĩ Toán học - ĐH Quốc gia Hà Nội',
      classrooms: 2,
      students: 40,
      monthlyRevenue: 90000000,
      joinDate: '2022-01-15',
      lastActive: '2024-11-19T10:30:00',
      bio: 'Chuyên gia giảng dạy Toán cao cấp với 8 năm kinh nghiệm'
    },
    {
      id: 't2',
      name: 'ThS. Trần Thị Bình',
      email: 'tranthibinh@example.com',
      phone: '0912345678',
      subjects: ['physics'],
      status: 'active',
      rating: 4.9,
      totalReviews: 98,
      experience: 6,
      education: 'Thạc sĩ Vật lý - ĐH Bách Khoa HN',
      classrooms: 1,
      students: 30,
      monthlyRevenue: 66000000,
      joinDate: '2022-03-20',
      lastActive: '2024-11-19T09:15:00',
      bio: 'Giảng viên Vật lý với phương pháp giảng dạy hiện đại'
    },
    {
      id: 't3',
      name: 'PGS. Lê Văn Cường',
      email: 'levancuong@example.com',
      phone: '0923456789',
      subjects: ['chemistry'],
      status: 'active',
      rating: 4.7,
      totalReviews: 156,
      experience: 12,
      education: 'Phó Giáo sư Hóa học - ĐH Khoa học Tự nhiên',
      classrooms: 1,
      students: 18,
      monthlyRevenue: 50400000,
      joinDate: '2021-09-10',
      lastActive: '2024-11-19T08:45:00',
      bio: 'Chuyên gia hóa học với nhiều công trình nghiên cứu'
    },
    {
      id: 't4',
      name: 'Ms. Emily Johnson',
      email: 'emily.johnson@example.com',
      phone: '0934567890',
      subjects: ['english'],
      status: 'active',
      rating: 5.0,
      totalReviews: 87,
      experience: 10,
      education: 'Master of Education - Oxford University',
      classrooms: 1,
      students: 20,
      monthlyRevenue: 60000000,
      joinDate: '2022-05-15',
      lastActive: '2024-11-19T11:00:00',
      bio: 'Native English teacher with IELTS expertise'
    },
    {
      id: 't5',
      name: 'PGS.TS. Phạm Minh Đức',
      email: 'phamminhduc@example.com',
      phone: '0945678901',
      subjects: ['physics', 'math'],
      status: 'active',
      rating: 4.9,
      totalReviews: 142,
      experience: 15,
      education: 'Phó Giáo sư - Tiến sĩ Vật lý lý thuyết',
      classrooms: 1,
      students: 22,
      monthlyRevenue: 70400000,
      joinDate: '2021-06-01',
      lastActive: '2024-11-19T07:30:00',
      bio: 'Chuyên gia Vật lý lượng tử và Toán ứng dụng'
    },
    {
      id: 't6',
      name: 'Mr. David Smith',
      email: 'david.smith@example.com',
      phone: '0956789012',
      subjects: ['english'],
      status: 'active',
      rating: 4.8,
      totalReviews: 103,
      experience: 7,
      education: 'CELTA Certified - Cambridge University',
      classrooms: 1,
      students: 16,
      monthlyRevenue: 56000000,
      joinDate: '2022-08-20',
      lastActive: '2024-11-18T16:20:00',
      bio: 'IELTS examiner and Cambridge certified teacher'
    },
    {
      id: 't7',
      name: 'ThS. Hoàng Thị Lan',
      email: 'hoangthilan@example.com',
      phone: '0967890123',
      subjects: ['chemistry'],
      status: 'inactive',
      rating: 4.5,
      totalReviews: 45,
      experience: 4,
      education: 'Thạc sĩ Hóa hữu cơ - ĐH Khoa học Tự nhiên',
      classrooms: 1,
      students: 12,
      monthlyRevenue: 21600000,
      joinDate: '2023-02-10',
      lastActive: '2024-10-15T14:30:00',
      bio: 'Chuyên gia Hóa hữu cơ và Hóa sinh'
    },
    {
      id: 't8',
      name: 'TS. Vũ Thanh Hải',
      email: 'vuthanhhai@example.com',
      phone: '0978901234',
      subjects: ['math'],
      status: 'pending',
      rating: 0,
      totalReviews: 0,
      experience: 5,
      education: 'Tiến sĩ Toán ứng dụng - ĐH Bách Khoa',
      classrooms: 0,
      students: 0,
      monthlyRevenue: 0,
      joinDate: '2024-11-15',
      lastActive: '2024-11-18T10:00:00',
      bio: 'Chuyên gia Toán ứng dụng và Thống kê'
    },
    {
      id: 't9',
      name: 'ThS. Đặng Thu Hà',
      email: 'dangthuha@example.com',
      phone: '0989012345',
      subjects: ['english'],
      status: 'pending',
      rating: 0,
      totalReviews: 0,
      experience: 3,
      education: 'Thạc sĩ Ngôn ngữ Anh - ĐH Ngoại ngữ',
      classrooms: 0,
      students: 0,
      monthlyRevenue: 0,
      joinDate: '2024-11-10',
      lastActive: '2024-11-17T09:30:00',
      bio: 'Giảng viên tiếng Anh giao tiếp và TOEIC'
    },
    {
      id: 't10',
      name: 'ThS. Ngô Minh Tuấn',
      email: 'ngominhtuan@example.com',
      phone: '0990123456',
      subjects: ['physics'],
      status: 'inactive',
      rating: 4.3,
      totalReviews: 28,
      experience: 5,
      education: 'Thạc sĩ Vật lý - ĐH Sư phạm HN',
      classrooms: 0,
      students: 0,
      monthlyRevenue: 0,
      joinDate: '2023-06-01',
      lastActive: '2024-09-20T11:00:00',
      bio: 'Giảng viên Vật lý chuyên luyện thi đại học'
    }
  ];

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tutor.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || tutor.subjects.includes(subjectFilter);
    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Statistics
  const stats = {
    total: tutors.length,
    active: tutors.filter(t => t.status === 'active').length,
    pending: tutors.filter(t => t.status === 'pending').length,
    totalStudents: tutors.reduce((sum, t) => sum + t.students, 0),
    totalRevenue: tutors.reduce((sum, t) => sum + t.monthlyRevenue, 0)
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
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
      case 'pending':
        return 'Chờ duyệt';
      case 'inactive':
        return 'Không hoạt động';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý gia sư</h1>
        <p className="text-gray-600">Quản lý tất cả gia sư trong hệ thống</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Tổng số gia sư</h3>
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

        <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.pending}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Chờ duyệt</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {(stats.totalRevenue / 1000000).toFixed(0)}M
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
              placeholder="Tìm kiếm gia sư, email..."
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
              <option value="pending">Chờ duyệt</option>
              <option value="inactive">Không hoạt động</option>
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

      {/* Tutors List */}
      <div className="space-y-4">
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-white">
                    {tutor.name.split(' ').pop()?.charAt(0)}
                  </span>
                </div>

                <div className="flex-1">
                  {/* Header */}
                  <div className="mb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{tutor.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(tutor.status)}`}>
                        {getStatusIcon(tutor.status)}
                        {getStatusText(tutor.status)}
                      </span>
                      {tutor.status === 'active' && tutor.rating > 0 && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-gray-900">{tutor.rating}</span>
                          <span className="text-xs text-gray-600">({tutor.totalReviews})</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {tutor.subjects.map((subject) => (
                        <span
                          key={subject}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getSubjectColor(subject)}`}
                        >
                          {getSubjectText(subject)}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-gray-600 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">{tutor.education}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">{tutor.bio}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{tutor.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{tutor.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Tham gia: {new Date(tutor.joinDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Hoạt động: {getTimeAgo(tutor.lastActive)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  {tutor.status !== 'pending' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <GraduationCap className="w-4 h-4" />
                          <span className="text-xs font-medium">Lớp học</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{tutor.classrooms}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Users className="w-4 h-4" />
                          <span className="text-xs font-medium">Học sinh</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{tutor.students}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-xs font-medium">Kinh nghiệm</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{tutor.experience} năm</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-xs font-medium">Doanh thu</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {(tutor.monthlyRevenue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Menu */}
              <div className="relative ml-4">
                <button
                  onClick={() => setOpenMenuId(openMenuId === tutor.id ? null : tutor.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {openMenuId === tutor.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                    {tutor.status === 'pending' && (
                      <>
                        <button className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Phê duyệt
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Từ chối
                        </button>
                      </>
                    )}
                    {tutor.status === 'active' && (
                      <button className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2">
                        <Ban className="w-4 h-4" />
                        Tạm khóa
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
      {filteredTutors.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy gia sư</h3>
          <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );
}
