import { useLocation } from 'react-router-dom';
import { Header } from '../../../shared/components/header';
import { TutorSidebar } from '../components';

export const TutorLayout = ({ children }) => {
  const location = useLocation();
  const isProfilePage = location.pathname.includes('/profile');

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header */}
      <Header title="Tutor Dashboard" />

      <div className="flex">
        {/* Sidebar */}
        {!isProfilePage && <TutorSidebar />}

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
