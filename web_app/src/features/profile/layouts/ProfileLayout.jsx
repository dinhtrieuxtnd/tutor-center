import { Header } from '../../../shared/components/header';

export const ProfileLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header */}
      <Header title="Thông tin cá nhân" />

      {/* Main Content */}
      <main className="flex p-6 w-full">
        {children}
      </main>
    </div>
  );
};
