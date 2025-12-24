import { Shield, Edit, Trash2 } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';

export const RolesTable = ({
    roles = [],
    loading,
    onEdit,
    onDelete,
    deletingRoleId,
    deleteLoading,
}) => {
    /* ============ LOADING ============ */
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-2" />
                    <p className="text-sm text-foreground-light">Đang tải...</p>
                </div>
            </div>
        );
    }

    /* ============ EMPTY ============ */
    if (!roles.length) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Shield size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-foreground-light">
                        Chưa có vai trò nào
                    </p>
                </div>
            </div>
        );
    }

    /* ============ TABLE ============ */
    return (
        <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
                <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Tên vai trò
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Mô tả
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Ngày tạo
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">
                        Thao tác
                    </th>
                </tr>
            </thead>

            <tbody>
                {roles.map((role, index) => (
                    <tr
                        key={role.roleId}
                        className={`border-b border-border hover:bg-gray-50 transition-colors ${index === roles.length - 1 ? 'border-b-0' : ''
                            }`}
                    >
                        <td className="px-4 py-3 text-foreground-light">
                            {role.roleId}
                        </td>

                        <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Shield size={16} className="text-foreground-light" />
                                <span className="font-medium text-foreground">
                                    {role.roleName}
                                </span>
                            </div>
                        </td>

                        <td className="px-4 py-3 text-foreground-light">
                            {role.description || '--'}
                        </td>

                        <td className="px-4 py-3 text-foreground-light">
                            {role.createdAt
                                ? new Date(role.createdAt).toLocaleDateString('vi-VN')
                                : '--'}
                        </td>

                        <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => onEdit(role)}
                                    className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors"
                                    title="Chỉnh sửa"
                                >
                                    <Edit size={16} />
                                </button>

                                <button
                                    onClick={() => onDelete(role)}
                                    disabled={
                                        deletingRoleId === role.roleId || deleteLoading
                                    }
                                    className="p-2 hover:bg-red-50 rounded-sm text-foreground-light hover:text-error transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Xóa"
                                >
                                    {deletingRoleId === role.roleId ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
