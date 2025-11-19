'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, GraduationCap, BookOpen, FileText, ClipboardCheck } from 'lucide-react';

export function TutorSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/tutor/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Quản lý lớp học',
      href: '/tutor/classes',
      icon: GraduationCap
    },
    {
      name: 'Quản lý bài giảng',
      href: '/tutor/lectures',
      icon: BookOpen
    },
    {
      name: 'Quản lý bài tập',
      href: '/tutor/exercises',
      icon: FileText
    },
    {
      name: 'Quản lý bài kiểm tra',
      href: '/tutor/quizzes',
      icon: ClipboardCheck
    }
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
