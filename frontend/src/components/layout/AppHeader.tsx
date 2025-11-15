'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Logo } from '@/components';
import { useAuth } from '@/hooks/useAuth';

interface AppHeaderProps {
  currentPage?: 'dashboard' | 'classes' | 'messages';
  userName: string;
  userRole: string;
  userAvatar?: string;
  onLogout?: () => void;
  showTeacherLink?: boolean;
}

export function AppHeader({
  currentPage = 'dashboard',
  userName,
  userRole,
  userAvatar,
  onLogout,
  showTeacherLink = false
}: AppHeaderProps) {
  const router = useRouter();
  const { logout: handleLogoutAPI } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'Bài tập mới',
      message: 'Thầy Nguyễn Văn B đã giao bài tập "Đạo hàm và ứng dụng"',
      time: '5 phút trước',
      isRead: false,
      type: 'assignment'
    },
    {
      id: 2,
      title: 'Điểm số mới',
      message: 'Bài tập "Hàm số bậc nhất" đã được chấm điểm: 8.5/10',
      time: '1 giờ trước',
      isRead: false,
      type: 'grade'
    },
    {
      id: 3,
      title: 'Lớp học sắp bắt đầu',
      message: 'Lớp "Toán 12 - Luyện thi THPT QG" sẽ bắt đầu sau 30 phút',
      time: '2 giờ trước',
      isRead: true,
      type: 'class'
    },
    {
      id: 4,
      title: 'Tin nhắn mới',
      message: 'Bạn có 2 tin nhắn mới từ Trần Thị B',
      time: '3 giờ trước',
      isRead: true,
      type: 'message'
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
    const profilePath = userRole === 'student' ? '/student/profile' : 
                        userRole === 'tutor' ? '/tutor/profile' : 
                        '/admin/profile';
    router.push(profilePath);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    
    // Gọi API logout thông qua Redux (không cần await)
    handleLogoutAPI();
    
    // Gọi callback nếu được cung cấp
    if (onLogout) {
      onLogout();
    }
    
    // Redirect về trang login ngay lập tức
    router.push('/auth/login');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return '📝';
      case 'grade':
        return '⭐';
      case 'class':
        return '📚';
      case 'message':
        return '💬';
      default:
        return '🔔';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer"
              onClick={() => {
                const dashboardPath = userRole === 'student' ? '/student/dashboard' : 
                                     userRole === 'tutor' ? '/tutor/dashboard' : 
                                     '/admin/dashboard';
                router.push(dashboardPath);
              }}
            >
              <Logo className="w-12 h-12" />
              <span className="text-xl font-bold text-primary font-open-sans">
                Tutor Center
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href={userRole === 'student' ? '/student/dashboard' : userRole === 'tutor' ? '/tutor/dashboard' : '/admin/dashboard'}
              className={`transition-colors font-open-sans ${
                currentPage === 'dashboard'
                  ? 'text-gray-900 font-medium border-b-2 border-primary pb-1'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Dashboard
            </a>
            <a
              href="/student/classes"
              className={`transition-colors font-open-sans ${
                currentPage === 'classes'
                  ? 'text-gray-900 font-medium border-b-2 border-primary pb-1'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Lớp học
            </a>
            {showTeacherLink && (
              <a
                href="/tutor/students"
                className="text-gray-600 hover:text-primary transition-colors font-open-sans"
              >
                Học sinh
              </a>
            )}
            <a
              href="/messages"
              className={`transition-colors font-open-sans ${
                currentPage === 'messages'
                  ? 'text-gray-900 font-medium border-b-2 border-primary pb-1'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Tin nhắn
            </a>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 font-poppins">
                      Thông báo
                    </h3>
                    {unreadCount > 0 && (
                      <button className="text-xs text-primary hover:text-blue-700 font-open-sans">
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="overflow-y-auto flex-1">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="text-2xl flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-gray-900 text-sm font-poppins">
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 font-open-sans line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 font-open-sans">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500 font-open-sans">
                        Không có thông báo mới
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-200 text-center">
                    <button 
                      onClick={() => router.push('/notifications')}
                      className="text-sm text-primary hover:text-blue-700 font-medium font-open-sans"
                    >
                      Xem tất cả thông báo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold font-poppins">
                  {userName.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 font-open-sans">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 font-open-sans">
                    {userRole}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform hidden md:block ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 font-poppins">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-600 font-open-sans">
                      {userRole}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors font-open-sans text-left"
                  >
                    <User className="w-5 h-5" />
                    <span>Thông tin cá nhân</span>
                  </button>
                  
                  <button
                    onClick={() => router.push('/settings')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors font-open-sans text-left"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Cài đặt</span>
                  </button>
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors font-open-sans text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
