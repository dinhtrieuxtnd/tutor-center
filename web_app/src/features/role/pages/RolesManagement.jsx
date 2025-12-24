import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { getAllRolesAsync, createRoleAsync, deleteRoleAsync, getRoleByIdAsync, updateRoleAsync, assignPermissionsAsync } from '../store/roleSlice';
import { getAllPermissionsAsync } from '../../permission/store/permissionSlice';
import { Shield, Plus, Edit, Trash2, Users } from 'lucide-react';
import { Button, ConfirmModal, StatCard } from '../../../shared/components';
import { Spinner } from '../../../shared/components/loading/Loading';
import { AddRolePanel, EditRolePanel, RolesTable } from '../components';

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
                <StatCard
                    icon={Shield}
                    label="Tổng vai trò"
                    value={roles.length}
                    iconBg="bg-gray-100"
                    iconColor="text-foreground"
                />

                <StatCard
                    icon={Users}
                    label="Vai trò hoạt động"
                    value={roles.length}
                    iconBg="bg-success-bg"
                    iconColor="text-success"
                />

                <StatCard
                    icon={Shield}
                    label="Quyền hệ thống"
                    value="--"
                    iconBg="bg-info-bg"
                    iconColor="text-info"
                />
            </div>


            {/* Table */}
            <div className="bg-primary border border-border rounded-sm overflow-hidden">
                <RolesTable
                    roles={roles}
                    loading={loading}
                    onEdit={handleEditRole}
                    onDelete={handleDeleteRole}
                    deletingRoleId={deletingRoleId}
                    deleteLoading={deleteLoading}
                />
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
