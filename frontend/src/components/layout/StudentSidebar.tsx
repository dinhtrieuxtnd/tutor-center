'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, GraduationCap, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentSidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export function StudentSidebar({ isOpen, setIsOpen }: StudentSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/student/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Lớp học',
      href: '/student/classes',
      icon: GraduationCap
    },
    {
      name: 'Tin nhắn',
      href: '/student/messages',
      icon: MessageSquare
    }
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer absolute -right-3 top-1/2 z-50 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        aria-label={isOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          let isActive = false;
          if (item.href === '/student/classes') {
            // Lớp học: active cho cả /student/classes... và /student/class...
            isActive =
              pathname === '/student/classes' ||
              pathname.startsWith('/student/classes/') ||
              pathname.startsWith('/student/class/');
          } else {
            // Mặc định: active nếu đúng path hoặc nằm dưới
            isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative min-h-12
                ${isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
              title={!isOpen ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
