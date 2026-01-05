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
      href: ROUTES.TUTOR_CLASSROOMS,
      icon: GraduationCap
    },
    {
      name: 'Quản lý bài giảng',
      href: ROUTES.TUTOR_LECTURES,
      icon: BookOpen
    },
    {
      name: 'Quản lý bài tập',
      href: ROUTES.TUTOR_EXERCISES,
      icon: FileText
    },
    {
      name: 'Quản lý bài kiểm tra',
      href: ROUTES.TUTOR_QUIZZES,
      icon: ClipboardCheck
    },
  ];

  return <Sidebar menuItems={menuItems} />;
};
