import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import {
    getAllPermissionsAsync,
    getPermissionByIdAsync,
    createPermissionAsync,
    updatePermissionAsync,
    deletePermissionAsync,
    setSearchTerm,
    setFilter,
    setCurrentPage,
    setItemsPerPage,
    resetFilters,
    selectPaginatedPermissions,
    selectPaginationInfo,
} from '../store/permissionSlice';
import { Key, Plus, Lock, Filter } from 'lucide-react';
import { Button, ConfirmModal, SearchInput, Dropdown, Pagination, StatCard } from '../../../shared/components';
import { AddPermissionPanel, EditPermissionPanel, PermissionsTable } from '../components';

export const PermissionsManagement = () => {
    const dispatch = useAppDispatch();
    const {
        permissions,
        loading,
        createLoading,
        deleteLoading,
        updateLoading,
        currentPermission,
        permissionDetailLoading,
        searchTerm,
        filters,
    } = useAppSelector((state) => state.permission);

    const paginatedData = useAppSelector(selectPaginatedPermissions);
    const { totalItems, totalOriginalItems, totalPages, currentPage, itemsPerPage } = useAppSelector(selectPaginationInfo);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [deletingPermissionId, setDeletingPermissionId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, permission: null });

    useEffect(() => {
        dispatch(getAllPermissionsAsync());
    }, [dispatch]);

    const handleAddPermission = async (formData) => {
        const result = await dispatch(createPermissionAsync(formData));
        if (result.type.endsWith('/fulfilled')) {
            setIsPanelOpen(false);
            dispatch(getAllPermissionsAsync());
        }
    };

    const handleEditPermission = async (permission) => {
        await dispatch(getPermissionByIdAsync(permission.permissionId));
        setIsEditPanelOpen(true);
    };

    const handleUpdatePermission = async (formData) => {
        if (!currentPermission) return;

        const result = await dispatch(updatePermissionAsync({
            permissionId: currentPermission.permissionId,
            data: formData
        }));

        if (result.type.endsWith('/fulfilled')) {
            setIsEditPanelOpen(false);
            dispatch(getAllPermissionsAsync());
        }
    };

    const handleDeletePermission = (permission) => {
        setConfirmDelete({ isOpen: true, permission });
    };

    const handleConfirmDelete = async () => {
        const permission = confirmDelete.permission;
        if (!permission) return;

        setDeletingPermissionId(permission.permissionId);
        const result = await dispatch(deletePermissionAsync(permission.permissionId));
        setDeletingPermissionId(null);
        setConfirmDelete({ isOpen: false, permission: null });

        if (result.type.endsWith('/fulfilled')) {
            dispatch(getAllPermissionsAsync());
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ isOpen: false, permission: null });
    };

    // Group permissions by module
    const moduleStats = permissions.reduce((acc, permission) => {
        const module = permission.module || 'Other';
        acc[module] = (acc[module] || 0) + 1;
        return acc;
    }, {});

    const moduleCount = Object.keys(moduleStats).length;

    // Get unique modules and methods for filters
    const moduleOptions = useMemo(() => {
        const modules = [...new Set(permissions.map(p => p.module).filter(Boolean))];
        return [
            { value: 'all', label: 'Tất cả module' },
            ...modules.map(m => ({ value: m, label: m }))
        ];
    }, [permissions]);

    const methodOptions = [
        { value: 'all', label: 'Tất cả phương thức' },
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'PATCH', label: 'PATCH' },
    ];

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Key size={24} />
                            Quản lý quyền
                        </h1>
                        <p className="text-sm text-foreground-light mt-1">
                            Quản lý các quyền truy cập trong hệ thống
                        </p>
                    </div>
                    <Button onClick={() => setIsPanelOpen(true)}>
                        <Plus size={16} />
                        Thêm quyền
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard
                    icon={Key}
                    label="Tổng quyền"
                    value={permissions.length}
                    iconBg="bg-gray-100"
                    iconColor="text-foreground"
                />

                <StatCard
                    icon={Lock}
                    label="Số module"
                    value={moduleCount}
                    iconBg="bg-info-bg"
                    iconColor="text-info"
                />

                <StatCard
                    icon={Key}
                    label="Quyền đang dùng"
                    value={permissions.length}
                    iconBg="bg-success-bg"
                    iconColor="text-success"
                />
            </div>


            <div>
                <div className="bg-primary border border-border rounded-sm p-4 mb-4">
                    <div className="grid grid-cols-4 gap-3">
                        <SearchInput
                            value={searchTerm}
                            onChange={(value) => dispatch(setSearchTerm(value))}
                            placeholder="Tìm theo tên, module, đường dẫn..."
                            disabled={loading}
                        />

                        <Dropdown
                            value={filters.module || 'all'}
                            onChange={(value) => dispatch(setFilter({ key: 'module', value }))}
                            options={moduleOptions}
                            placeholder="Lọc theo module"
                            disabled={loading}
                        />

                        <Dropdown
                            value={filters.method || 'all'}
                            onChange={(value) => dispatch(setFilter({ key: 'method', value }))}
                            options={methodOptions}
                            placeholder="Lọc theo phương thức"
                            disabled={loading}
                        />

                        <Button
                            variant="outline"
                            onClick={() => dispatch(resetFilters())}
                            disabled={loading || (!searchTerm && !filters.module && !filters.method)}
                            className="w-full"
                        >
                            <Filter size={16} />
                            Xóa bộ lọc
                        </Button>
                    </div>

                    {totalItems !== totalOriginalItems && (
                        <p className="text-xs text-foreground-light mt-3">
                            Hiển thị {totalItems} / {totalOriginalItems} quyền
                        </p>
                    )}
                </div>

                {/* Table */}
                <div className="bg-primary border border-border rounded-sm overflow-hidden">
                    <PermissionsTable
                        permissions={paginatedData}
                        loading={loading}
                        onEdit={handleEditPermission}
                        onDelete={handleDeletePermission}
                        deletingPermissionId={deletingPermissionId}
                        deleteLoading={deleteLoading}
                    />

                    {!loading && totalItems > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => dispatch(setCurrentPage(page))}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={(value) => dispatch(setItemsPerPage(value))}
                            totalItems={totalItems}
                            disabled={loading}
                        />
                    )}
                </div>
                <div>
                    <p className="text-xs text-foreground-light">Quyền đang dùng</p>
                    <p className="text-xl font-semibold text-foreground">{permissions.length}</p>
                </div>
            </div>
            <AddPermissionPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onSubmit={handleAddPermission}
                isLoading={createLoading}
            />

            <EditPermissionPanel
                isOpen={isEditPanelOpen}
                onClose={() => setIsEditPanelOpen(false)}
                onSubmit={handleUpdatePermission}
                isLoading={updateLoading}
                permission={currentPermission}
            />

            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Xóa quyền"
                message={`Bạn có chắc chắn muốn xóa quyền "${confirmDelete.permission?.permissionName}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={deletingPermissionId === confirmDelete.permission?.permissionId}
            />
        </>
    );
};
