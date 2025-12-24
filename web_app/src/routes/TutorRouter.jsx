import { Dashboard } from "../features/tutor/pages";
import { ProfilePage } from '../features/profile/pages';
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
                path: ROUTES.TUTOR_PROFILE,
                element: <ProfilePage />,
            },
        ],
    },
];