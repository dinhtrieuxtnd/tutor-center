import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authRouter, userRouter, adminRouter, tutorRouter } from './routes';
import { NotificationContainer } from './shared/components/notifications';
import { ProtectedRoute } from './shared/components';
import { NotFound } from './shared/pages/NotFound';

import { ROUTES } from './core/constants';

function App() {
  return (
    <BrowserRouter>
      <NotificationContainer />
      <Routes>
        {/* Auth Routes */}
        {authRouter.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        
        {/* User Routes */}
        {userRouter.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}

        {/* Admin Routes */}
        {adminRouter.map((route, index) => (
          <Route key={index} path={route.path} element={
            <ProtectedRoute>
              {route.element}
            </ProtectedRoute>
          }>
            {route.children?.map((child, childIndex) => (
              <Route key={childIndex} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}
        
        {/* Tutor Routes */}
        {tutorRouter.map((route, index) => (
          <Route key={index} path={route.path} element={
            <ProtectedRoute>
              {route.element}
            </ProtectedRoute>
          }>
            {route.children?.map((child, childIndex) => (
              <Route key={childIndex} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}

        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
