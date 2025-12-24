import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { getAllRolesAsync, createRoleAsync, deleteRoleAsync, getRoleByIdAsync, updateRoleAsync, assignPermissionsAsync } from '../../../features/role/store/roleSlice';
import { getAllPermissionsAsync } from '../../../features/permission/store/permissionSlice';
import { Shield, Plus, Edit, Trash2, Users } from 'lucide-react';
import { Button, ConfirmModal } from '../../../shared/components/ui';
import { Spinner } from '../../../shared/components/loading/Loading';
import { AddRolePanel, EditRolePanel } from '../../../features/role/components';

export const RolesManagement = () => {
    const dispatch = useAppDispatch();
    const { roles, loading, createLoading, deleteLoading, updateLoading, currentRole } = useAppSelector((state) => state.role);
    const { permissions } = useAppSelector((state) => state.permission);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [deletingRoleId, setDeletingRoleId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, role: null });

    useEffect(() => {
        dispatch(getAllRolesAsync());
        // Fetch permissions if not already loaded
        if (permissions.length === 0) {
            dispatch(getAllPermissionsAsync());
        }
    }, [dispatch]);

    const handleAddRole = async (formData) => {
        const result = await dispatch(createRoleAsync(formData));
        if (result.type.endsWith('/fulfilled')) {
            setIsPanelOpen(false);
            dispatch(getAllRolesAsync()); // Refresh list
        }
    };

    const handleEditRole = async (role) => {
        await dispatch(getRoleByIdAsync(role.roleId));
        setIsEditPanelOpen(true);
    };

    const handleUpdateRole = async (formData) => {
        if (!currentRole) return;
        
        // Update role basic info (permissions are updated via toggle API)
        const result = await dispatch(updateRoleAsync({ 
            roleId: currentRole.roleId, 
            data: formData 
        }));
        
        if (result.type.endsWith('/fulfilled')) {
            setIsEditPanelOpen(false);
            dispatch(getAllRolesAsync()); // Refresh list
        }
    };

    const handleDeleteRole = (role) => {
        setConfirmDelete({ isOpen: true, role });
    };

    const handleConfirmDelete = async () => {
        const role = confirmDelete.role;
        if (!role) return;

        setDeletingRoleId(role.roleId);
        const result = await dispatch(deleteRoleAsync(role.roleId));
        setDeletingRoleId(null);
        setConfirmDelete({ isOpen: false, role: null });
        
        if (result.type.endsWith('/fulfilled')) {
            dispatch(getAllRolesAsync()); // Refresh list
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ isOpen: false, role: null });
    };

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Shield size={24} />
                            Quản lý vai trò
                        </h1>
                        <p className="text-sm text-foreground-light mt-1">
                            Quản lý vai trò và quyền hạn trong hệ thống
                        </p>
                    </div>
                    <Button onClick={() => setIsPanelOpen(true)}>
                        <Plus size={16} />
                        Thêm vai trò
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-primary border border-border rounded-sm p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-sm">
                            <Shield size={20} className="text-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-foreground-light">Tổng vai trò</p>
                            <p className="text-xl font-semibold text-foreground">{roles.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-primary border border-border rounded-sm p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-success-bg rounded-sm">
                            <Users size={20} className="text-success" />
                        </div>
                        <div>
                            <p className="text-xs text-foreground-light">Vai trò hoạt động</p>
                            <p className="text-xl font-semibold text-foreground">{roles.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-primary border border-border rounded-sm p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-info-bg rounded-sm">
                            <Shield size={20} className="text-info" />
                        </div>
                        <div>
                            <p className="text-xs text-foreground-light">Quyền hệ thống</p>
                            <p className="text-xl font-semibold text-foreground">--</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-primary border border-border rounded-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Spinner size="lg" className="mx-auto mb-2" />
                            <p className="text-sm text-foreground-light">Đang tải...</p>
                        </div>
                    </div>
                ) : roles.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Shield size={48} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-foreground-light">Chưa có vai trò nào</p>
                        </div>
                    </div>
                ) : (
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
                                            <span className="font-medium text-foreground">{role.roleName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-foreground-light">
                                        {role.description || '--'}
                                    </td>
                                    <td className="px-4 py-3 text-foreground-light">
                                        {role.createdAt ? new Date(role.createdAt).toLocaleDateString('vi-VN') : '--'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEditRole(role)}
                                                className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRole(role)}
                                                disabled={deletingRoleId === role.roleId || deleteLoading}
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
                )}
            </div>

            <AddRolePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onSubmit={handleAddRole}
                isLoading={createLoading}
            />

            <EditRolePanel
                isOpen={isEditPanelOpen}
                onClose={() => setIsEditPanelOpen(false)}
                onSubmit={handleUpdateRole}
                isLoading={updateLoading}
                role={currentRole}
                permissions={permissions}
            />

            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Xóa vai trò"
                message={`Bạn có chắc chắn muốn xóa vai trò "${confirmDelete.role?.roleName}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={deletingRoleId === confirmDelete.role?.roleId}
            />
        </>
    );
};
