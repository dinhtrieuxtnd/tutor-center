import { Edit, Trash2, Key } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';

export const PermissionsTable = ({ 
    permissions, 
    loading, 
    onEdit, 
    onDelete, 
    deletingPermissionId, 
    deleteLoading 
}) => {
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

    if (permissions.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Key size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-foreground-light">Chưa có quyền nào</p>
                </div>
            </div>
        );
    }

    return (
        <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
                <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Tên quyền
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Module
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Đường dẫn
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Phương thức
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
                {permissions.map((permission, index) => (
                    <tr
                        key={permission.permissionId}
                        className={`border-b border-border hover:bg-gray-50 transition-colors ${
                            index === permissions.length - 1 ? 'border-b-0' : ''
                        }`}
                    >
                        <td className="px-4 py-3 text-foreground-light">
                            {permission.permissionId}
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Key size={14} className="text-foreground-light" />
                                <span className="font-medium text-foreground">
                                    {permission.permissionName}
                                </span>
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-sm">
                                {permission.module || 'N/A'}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-foreground-light font-mono text-xs">
                            {permission.path || '--'}
                        </td>
                        <td className="px-4 py-3">
                            <span
                                className={`inline-block px-2 py-1 text-xs font-medium rounded-sm ${
                                    permission.method === 'GET'
                                        ? 'bg-info-bg text-info-text'
                                        : permission.method === 'POST'
                                        ? 'bg-success-bg text-success-text'
                                        : permission.method === 'PUT'
                                        ? 'bg-warning-bg text-warning-text'
                                        : permission.method === 'DELETE'
                                        ? 'bg-error-bg text-error-text'
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {permission.method || 'N/A'}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-foreground-light">
                            {permission.createdAt
                                ? new Date(permission.createdAt).toLocaleDateString('vi-VN')
                                : '--'}
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => onEdit(permission)}
                                    className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors"
                                    title="Chỉnh sửa"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => onDelete(permission)}
                                    disabled={
                                        deletingPermissionId === permission.permissionId ||
                                        deleteLoading
                                    }
                                    className="p-2 hover:bg-red-50 rounded-sm text-foreground-light hover:text-error transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Xóa"
                                >
                                    {deletingPermissionId === permission.permissionId ? (
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
