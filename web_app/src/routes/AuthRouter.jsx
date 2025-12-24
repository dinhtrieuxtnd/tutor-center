import { LoginPage, LoadingRedirect } from '../features/auth/pages';

export const authRouter = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/loading',
    element: <LoadingRedirect />,
  },
];
