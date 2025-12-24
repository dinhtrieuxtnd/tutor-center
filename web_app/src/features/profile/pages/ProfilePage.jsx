import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { ProfileLayout } from '../layouts/ProfileLayout';
import { ProfileInfoTab, ChangePasswordTab } from '../components';

export const ProfilePage = () => {
    // Tab state
    const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'

    return (
        <>
            <div className="min-w-[56rem] max-w-4xl mx-auto">
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
