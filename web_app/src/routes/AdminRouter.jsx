import { Dashboard, RolesManagement, PermissionsManagement } from '../features/admin/pages';
import { ProfilePage } from '../features/profile/pages';
import { ClassroomsManagement } from '../features/classroom/pages/ClassroomsManagement';
import { ClassroomsDetail } from '../features/classroom/pages/ClassroomsDetail';
import { TutorsManagement, StudentsManagement } from '../features/users/pages';
import { AdminLayout } from '../features/admin/layouts';
import { ROUTES } from '../core/constants';
import { Outlet } from 'react-router-dom';
import { path } from 'framer-motion/client';

export const adminRouter = [
    {
        path: '/admin',
        element: (
            <AdminLayout>
                <Outlet />
            </AdminLayout>
        ),
        children: [
            {
                path: ROUTES.ADMIN_DASHBOARD,
                element: <Dashboard />,
            },
            {
                path: ROUTES.ADMIN_PROFILE,
                element: <ProfilePage />,
            },
            {
                path: ROUTES.ADMIN_ROLES,
                element: <RolesManagement />,
            },
            {
                path: ROUTES.ADMIN_PERMISSIONS,
                element: <PermissionsManagement />,
            },
            {
                path: ROUTES.ADMIN_CLASSROOMS,
                element: <ClassroomsManagement />,
            },
            {
                path: ROUTES.ADMIN_CLASSROOM_DETAIL,
                element: <ClassroomsDetail />,
            },
            {
                path: ROUTES.ADMIN_TUTORS,
                element: <TutorsManagement />,
            },
            {
                path: ROUTES.ADMIN_STUDENTS,
                element: <StudentsManagement />,
            },
        ],
    },
];
