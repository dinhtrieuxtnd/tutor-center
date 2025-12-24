import { LayoutDashboard, GraduationCap, Users, FileText, UserCheck, Shield, Key, School } from 'lucide-react';
import { ROUTES } from '../../../core/constants';
import { Sidebar } from '../../../shared/components/sidebar';

export const AdminSidebar = () => {
  const menuItems = [
    {
      name: 'Dashboard',
      href: ROUTES.ADMIN_DASHBOARD,
      icon: LayoutDashboard
    },
    {
      name: 'Quản lý vai trò',
      href: ROUTES.ADMIN_ROLES,
      icon: Shield
    },
    {
      name: 'Quản lý quyền',
      href: ROUTES.ADMIN_PERMISSIONS,
      icon: Key
    },
    {
      name: 'Quản lý lớp học',
      href: ROUTES.ADMIN_CLASSROOMS,
      icon: School
    },
    {
      name: 'Quản lý gia sư',
      href: '/admin/tutors',
      icon: UserCheck
    },
    {
      name: 'Quản lý học sinh',
      href: '/admin/students',
      icon: Users
    },
    {
      name: 'Quản lý báo cáo',
      href: '/admin/reports',
      icon: FileText
    }
  ];

  return <Sidebar menuItems={menuItems} />;
};
