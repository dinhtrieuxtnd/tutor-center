import { LayoutDashboard, GraduationCap, BookOpen, FileText, ClipboardCheck } from 'lucide-react';
import { ROUTES } from '../../../core/constants';
import { Sidebar } from '../../../shared/components/sidebar';

export const TutorSidebar = () => {
  const menuItems = [
    {
      name: 'Dashboard',
      href: ROUTES.TUTOR_DASHBOARD,
      icon: LayoutDashboard
    },
    {
      name: 'Quản lý lớp học',
      href: '/tutor/classrooms',
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

  return <Sidebar menuItems={menuItems} />;
};
