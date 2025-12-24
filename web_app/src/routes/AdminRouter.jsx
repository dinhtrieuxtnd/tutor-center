import { Dashboard, RolesManagement, PermissionsManagement } from '../features/admin/pages';
import { ProfilePage } from '../features/profile/pages';
import { ClassroomsManagement } from '../features/classroom/pages/ClassroomsManagement';
import { AdminLayout } from '../features/admin/layouts';
import { ROUTES } from '../core/constants';
import { Outlet } from 'react-router-dom';

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
        ],
    },
];
