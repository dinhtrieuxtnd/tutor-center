import { useState } from 'react';
import { User, Lock, Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../core/store/hooks';
import { ROUTES } from '../../../core/constants';
import { ProfileLayout } from '../layouts/ProfileLayout';
import { ProfileInfoTab, ChangePasswordTab } from '../components';

export const ProfilePage = () => {
    // Tab state
    const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'
    const { profile } = useAppSelector((state) => state.profile);

    // Determine dashboard route based on user role
    const getDashboardRoute = () => {
        const roles = profile?.roles || [];
        if (roles.includes('Admin')) {
            return ROUTES.ADMIN_DASHBOARD;
        } else if (roles.includes('Tutor')) {
            return ROUTES.TUTOR_DASHBOARD;
        }
        return ROUTES.HOME;
    };

    const getDashboardLabel = () => {
        const roles = profile?.roles || [];
        if (roles.includes('Admin')) {
            return 'Quản trị';
        } else if (roles.includes('Tutor')) {
            return 'Giảng viên';
        }
        return 'Trang chủ';
    };

    return (
        <>
            <div className="min-w-[56rem] max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <nav className="flex items-center gap-2 text-sm text-foreground-light">
                        <Link 
                            to={getDashboardRoute()} 
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                        >
                            <Home size={14} />
                            {getDashboardLabel()}
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-foreground">Hồ sơ cá nhân</span>
                    </nav>
                </div>

                {/* Tabs */}
                <div className="bg-primary border border-border rounded-sm mb-6">
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'info'
                                ? 'text-foreground border-b-2 border-foreground'
                                : 'text-foreground-light hover:text-foreground hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <User size={16} />
                                Thông tin cá nhân
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'password'
                                ? 'text-foreground border-b-2 border-foreground'
                                : 'text-foreground-light hover:text-foreground hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Lock size={16} />
                                Đổi mật khẩu
                            </div>
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'info' ? <ProfileInfoTab /> : <ChangePasswordTab />}
            </div>
        </>
    );
};
