import { User, Lock, Unlock } from 'lucide-react';
import { ButtonLoading } from '../../../shared/components/loading';

export const UsersTable = ({ 
    users, 
    loading, 
    onChangeStatus,
    changingStatusUserId,
}) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <ButtonLoading message="Đang tải danh sách người dùng..." />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <User size={48} className="text-gray-300 mb-3" />
                <p className="text-sm text-foreground-light">Không có người dùng nào</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-border">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Họ và tên
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Số điện thoại
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Vai trò
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Trạng thái
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-primary divide-y divide-border">
                    {users.map((user) => (
                        <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                                {user.userId}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    {user.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.fullName}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User size={16} className="text-gray-400" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-foreground">
                                        {user.fullName}
                                    </span>
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                                {user.email}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                                {user.phoneNumber || '--'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-sm bg-blue-100 text-blue-700`}>
                                    gia sư
                                </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                {!user.isActive ? (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-error-bg text-error-text rounded-sm">
                                        <Lock size={12} className="mr-1" />
                                        Đã khóa
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-success-bg text-success-text rounded-sm">
                                        <Unlock size={12} className="mr-1" />
                                        Hoạt động
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                                <button
                                    onClick={() => onChangeStatus(user)}
                                    disabled={changingStatusUserId === user.userId}
                                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                                        !user.isActive
                                            ? 'bg-success-bg text-success-text hover:bg-success'
                                            : 'bg-error-bg text-error-text hover:bg-error hover:text-white'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title={!user.isActive ? 'Mở khóa' : 'Khóa tài khoản'}
                                >
                                    {changingStatusUserId === user.userId ? (
                                        <ButtonLoading message="" size="xs" />
                                    ) : !user.isActive ? (
                                        <>
                                            <Unlock size={14} />
                                            Mở khóa
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={14} />
                                            Khóa
                                        </>
                                    )}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
