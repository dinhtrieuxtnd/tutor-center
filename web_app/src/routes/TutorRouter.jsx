import { Dashboard } from "../features/tutor/pages";
import { ProfilePage } from '../features/profile/pages';
import { ClassroomsManagement, ClassroomsDetail } from '../features/classroom/pages';
import { TutorLayout } from '../features/tutor/layouts';
import { ROUTES } from '../core/constants';
import { Outlet } from 'react-router-dom';

export const tutorRouter = [
    {
        path: '/tutor',
        element: (
            <TutorLayout>
                <Outlet />
            </TutorLayout>
        ),
        children: [
            {
                path: ROUTES.TUTOR_DASHBOARD,
                element: <Dashboard />,
            },
            {
                path: ROUTES.TUTOR_CLASSROOMS,
                element: <ClassroomsManagement />,
            },
            {
                path: ROUTES.TUTOR_CLASSROOM_DETAIL,
                element: <ClassroomsDetail />,
            },
            {
                path: ROUTES.TUTOR_PROFILE,
                element: <ProfilePage />,
            },
        ],
    },
];