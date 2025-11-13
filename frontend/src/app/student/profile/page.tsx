'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  School,
  Edit,
  Save,
  X,
  Camera,
  Lock,
  Bell,
  Globe,
  Shield
} from 'lucide-react';
import { AppHeader } from '@/components/layout';

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  school: string;
  grade: string;
  avatar?: string;
  bio?: string;
  joinedDate: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  // Mock data - sẽ fetch từ API
  const [profile, setProfile] = useState<UserProfile>({
    id: 1,
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    dateOfBirth: '15/05/2007',
    address: 'Quận 1, TP. Hồ Chí Minh',
    school: 'THPT Lê Hồng Phong',
    grade: 'Lớp 12A1',
    bio: 'Học sinh yêu thích môn Toán và Vật lý. Đang chuẩn bị cho kỳ thi THPT Quốc gia.',
    joinedDate: '01/09/2024'
  });

  const [editForm, setEditForm] = useState({ ...profile });

  const handleSave = () => {
    // TODO: Call API to update profile
    setProfile(editForm);
    setIsEditing(false);
    console.log('Saving profile:', editForm);
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const handleLogout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-open-sans">
      {/* Header */}
      <AppHeader
        currentPage="dashboard"
        userName={profile.fullName}
        userRole="Học sinh"
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 font-poppins">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600 font-open-sans mt-2">
            Quản lý thông tin tài khoản và cài đặt cá nhân của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left font-open-sans ${
                    activeTab === 'profile'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Hồ sơ</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left font-open-sans ${
                    activeTab === 'security'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span>Bảo mật</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left font-open-sans ${
                    activeTab === 'notifications'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span>Thông báo</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold font-poppins">
                        {profile.fullName.charAt(0)}
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                        {profile.fullName}
                      </h2>
                      <p className="text-gray-600 font-open-sans">{profile.email}</p>
                      <p className="text-sm text-gray-500 font-open-sans mt-1">
                        Tham gia từ {profile.joinedDate}
                      </p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-open-sans"
                      >
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 font-poppins">
                    Thông tin cá nhân
                  </h3>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 font-open-sans">
                        <User className="w-4 h-4" />
                        Họ và tên
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-open-sans"
                        />
                      ) : (
                        <p className="text-gray-900 font-open-sans">{profile.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 font-open-sans">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-open-sans"
                        />
                      ) : (
                        <p className="text-gray-900 font-open-sans">{profile.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 font-open-sans">
                        <Phone className="w-4 h-4" />
                        Số điện thoại
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-open-sans"
                        />
                      ) : (
                        <p className="text-gray-900 font-open-sans">{profile.phone}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 font-open-sans">
                        <Calendar className="w-4 h-4" />
                        Ngày sinh
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.dateOfBirth}
                          onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-open-sans"
                          placeholder="DD/MM/YYYY"
                        />
                      ) : (
                        <p className="text-gray-900 font-open-sans">{profile.dateOfBirth}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 font-open-sans">
                        <MapPin className="w-4 h-4" />
                        Địa chỉ
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-open-sans"
                        />
                      ) : (
                        <p className="text-gray-900 font-open-sans">{profile.address}</p>
                      )}
                    </div>

                    {/* School */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 font-open-sans">
                        <School className="w-4 h-4" />
                        Trường học
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.school}
                          onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-open-sans"
                        />
                      ) : (
                        <p className="text-gray-900 font-open-sans">{profile.school}</p>
                      )}
                    </div>

                    {/* Grade */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 font-open-sans">
                        <School className="w-4 h-4" />
                        Lớp
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.grade}
                          onChange={(e) => setEditForm({ ...editForm, grade: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-open-sans"
                        />
                      ) : (
                        <p className="text-gray-900 font-open-sans">{profile.grade}</p>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 font-open-sans">
                        <Globe className="w-4 h-4" />
                        Giới thiệu
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-open-sans"
                        />
                      ) : (
                        <p className="text-gray-900 font-open-sans">{profile.bio}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-open-sans"
                      >
                        <X className="w-4 h-4" />
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-open-sans"
                      >
                        <Save className="w-4 h-4" />
                        Lưu thay đổi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 font-poppins">
                  Bảo mật tài khoản
                </h3>

                <div className="space-y-6">
                  {/* Change Password */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 font-poppins">
                      Đổi mật khẩu
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="password"
                        placeholder="Mật khẩu hiện tại"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-open-sans"
                      />
                      <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-open-sans"
                      />
                      <input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-open-sans"
                      />
                      <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-open-sans">
                        <Lock className="w-4 h-4" />
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 font-poppins">
                      Xác thực hai yếu tố
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 font-open-sans">
                      Tăng cường bảo mật tài khoản với xác thực hai yếu tố
                    </p>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-open-sans">
                      Kích hoạt
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 font-poppins">
                  Cài đặt thông báo
                </h3>

                <div className="space-y-4">
                  {[
                    { label: 'Thông báo bài tập mới', description: 'Nhận thông báo khi có bài tập mới được giao' },
                    { label: 'Thông báo điểm số', description: 'Nhận thông báo khi bài tập được chấm điểm' },
                    { label: 'Thông báo lớp học', description: 'Nhận thông báo về lịch học và thay đổi lớp học' },
                    { label: 'Thông báo tin nhắn', description: 'Nhận thông báo khi có tin nhắn mới' },
                    { label: 'Email thông báo', description: 'Nhận thông báo qua email' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 font-poppins">{item.label}</p>
                        <p className="text-sm text-gray-600 font-open-sans">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
