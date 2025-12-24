import { Layout } from '../layouts/Layout';
import { UserList } from '..';

export const HomePage = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chào mừng đến với Tutor Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dự án React + Vite với cấu trúc code sạch, dễ bảo trì. 
            Sử dụng Redux Toolkit, Axios và Tailwind CSS v3.
          </p>
        </div>

        {/* User List Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <UserList />
        </div>
      </div>
    </Layout>
  );
};
