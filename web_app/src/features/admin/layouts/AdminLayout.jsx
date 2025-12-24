import { Header } from '../../../shared/components/header';
import { AdminSidebar } from '../components';

export const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header */}
      <Header title="Admin Dashboard" />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
