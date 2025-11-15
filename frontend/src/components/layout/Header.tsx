'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Bell, User, Settings, LogOut, ChevronDown, Search } from 'lucide-react';
import { Logo } from '@/components';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  userRole: 'student' | 'tutor' | 'admin';
  userName?: string;
  userAvatar?: string;
}

const ROLE_CONFIG = {
  student: {
    label: 'Học viên',
    dashboardPath: '/student/dashboard',
    profilePath: '/student/profile',
    settingsPath: '/student/settings',
    searchPlaceholder: 'Tìm kiếm lớp học, bài giảng...'
  },
  tutor: {
    label: 'Gia sư',
    dashboardPath: '/tutor/dashboard',
    profilePath: '/tutor/profile',
    settingsPath: '/tutor/settings',
    searchPlaceholder: 'Tìm kiếm lớp học, bài giảng, học sinh...'
  },
  admin: {
    label: 'Quản trị viên',
    dashboardPath: '/admin/dashboard',
    profilePath: '/admin/profile',
    settingsPath: '/admin/settings',
    searchPlaceholder: 'Tìm kiếm người dùng, lớp học, báo cáo...'
  }
};

export function Header({
  userRole,
  userName: userNameProp,
  userAvatar: userAvatarProp
}: HeaderProps) {
  const router = useRouter();
  const { student, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const config = ROLE_CONFIG[userRole];

  // Get user info from props (passed from layout) or Redux store (for student) or fallback to label
  const userName = userNameProp || (userRole === 'student' ? student?.fullName : null) || config.label;
  const userAvatar = userAvatarProp || (userRole === 'student' ? student?.imageUrls?.url : null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'Lớp Toán 12 - Chuyên đề hàm số',
      message: userRole === 'tutor' ? 'Có 2 bài tập mới chờ chấm' : 'Gia sư đã tạo bài tập mới',
      time: '10 phút trước',
      isRead: false,
      type: 'exercise'
    },
    {
      id: 2,
      title: 'Lớp Vật lý 11',
      message: userRole === 'tutor' ? 'Học sinh Nguyễn Văn A đã nộp bài kiểm tra' : 'Bài kiểm tra sẽ bắt đầu vào 3:00 PM hôm nay',
      time: '30 phút trước',
      isRead: false,
      type: 'quiz'
    },
    {
      id: 3,
      title: 'Lớp Hóa học 10',
      message: 'Lớp học sẽ bắt đầu vào 2:00 PM hôm nay',
      time: '1 giờ trước',
      isRead: true,
      type: 'class'
    },
    {
      id: 4,
      title: 'Lớp Toán 12 - Chuyên đề hàm số',
      message: userRole === 'tutor' ? 'Có học sinh mới tham gia lớp' : 'Bài tập của bạn đã được chấm điểm',
      time: '2 giờ trước',
      isRead: true,
      type: userRole === 'tutor' ? 'student' : 'grade'
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setShowUserMenu(false);
    router.push(config.profilePath);
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    router.push(config.settingsPath);
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
    router.push('/auth/login');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'exercise':
        return '📝';
      case 'quiz':
        return '📊';
      case 'class':
        return '🎓';
      case 'student':
        return '👨‍🎓';
      case 'grade':
        return '⭐';
      case 'request':
        return '📋';
      case 'report':
        return '⚠️';
      default:
        return '📬';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <div className="flex items-center">
            <div
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer"
              onClick={() => router.push(config.dashboardPath)}
            >
              <Logo className="w-12 h-12" />
              <span className="text-xl font-bold text-primary font-open-sans">
                Tutor Center
              </span>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder={config.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Thông báo lớp học</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Xem tất cả thông báo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                {userAvatar ? (
                  <Image src={userAvatar} alt={userName} width={32} height={32} className="rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{config.label}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{userName}</p>
                  <p className="text-sm text-gray-500">{config.label}</p>
                </div>
                <button
                  onClick={handleProfileClick}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Hồ sơ</span>
                </button>
                <button
                  onClick={handleSettingsClick}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Cài đặt</span>
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
