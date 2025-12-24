import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import {
    getAllUsersAsync,
    createTutorAsync,
    changeUserStatusAsync,
    setFilters,
    setPagination,
} from '../store/userSlice';
import { Users, Plus, UserCheck, UserX, Filter } from 'lucide-react';
import { Button, ConfirmModal, SearchInput, Dropdown, Pagination, StatCard } from '../../../shared/components';
import { UsersTable } from '../components/UsersTable';
import { AddTutorPanel } from '../components/AddTutorPanel';

export const TutorsManagement = () => {
    const dispatch = useAppDispatch();
    const {
        users,
        loading,
        createLoading,
        statusLoading,
        filters,
        pagination,
    } = useAppSelector((state) => state.user);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [changingStatusUserId, setChangingStatusUserId] = useState(null);
    const [confirmStatusChange, setConfirmStatusChange] = useState({ isOpen: false, user: null });

    // Fetch users when component mounts or filters/pagination change
    useEffect(() => {
        fetchUsers();
    }, [filters, pagination.pageNumber, pagination.pageSize]);

    const fetchUsers = () => {
        const params = {
            page: pagination.pageNumber,
            limit: pagination.pageSize,
            search: filters.searchTerm || undefined,
            role: 2, // Only tutors
            isActive: filters.isActive === 'active' ? true : filters.isActive === 'locked' ? false : undefined,
        };
        dispatch(getAllUsersAsync(params));
    };

    const handleSearchChange = (value) => {
        dispatch(setFilters({ searchTerm: value }));
    };

    const handleStatusFilterChange = (value) => {
        dispatch(setFilters({ isActive: value }));
    };

    const handlePageChange = (page) => {
        dispatch(setPagination({ pageNumber: page }));
    };

    const handleItemsPerPageChange = (value) => {
        dispatch(setPagination({ pageSize: value, pageNumber: 1 }));
    };

    const handleResetFilters = () => {
        dispatch(setFilters({ searchTerm: '', isActive: null }));
    };

    const handleOpenAddPanel = () => {
        setIsPanelOpen(true);
    };

    const handleAddTutor = async (formData) => {
        const result = await dispatch(createTutorAsync(formData));
        if (result.type.endsWith('/fulfilled')) {
            setIsPanelOpen(false);
            fetchUsers();
        }
    };

    const handleChangeStatus = (user) => {
        setConfirmStatusChange({ isOpen: true, user });
    };

    const handleConfirmStatusChange = async () => {
        const user = confirmStatusChange.user;
        if (!user) return;

        setChangingStatusUserId(user.userId);
        const result = await dispatch(changeUserStatusAsync(user.userId));
        setChangingStatusUserId(null);
        setConfirmStatusChange({ isOpen: false, user: null });

        if (result.type.endsWith('/fulfilled')) {
            fetchUsers();
        }
    };

    const handleCancelStatusChange = () => {
        setConfirmStatusChange({ isOpen: false, user: null });
    };

    // Stats
    const activeTutors = users.filter(u => u.isActive).length;
    const lockedTutors = users.filter(u => !u.isActive).length;

    const statusOptions = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Đang hoạt động' },
        { value: 'locked', label: 'Đã khóa' },
    ];

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Users size={24} />
                            Quản lý giáo viên
                        </h1>
                        <p className="text-sm text-foreground-light mt-1">
                            Quản lý tài khoản giáo viên trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleOpenAddPanel}>
                        <Plus size={16} />
                        Thêm giáo viên
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard
                    icon={Users}
                    label="Tổng giáo viên"
                    value={pagination.totalCount}
                    iconBg="bg-gray-100"
                    iconColor="text-foreground"
                />

                <StatCard
                    icon={UserCheck}
                    label="Đang hoạt động"
                    value={activeTutors}
                    iconBg="bg-success-bg"
                    iconColor="text-success"
                />

                <StatCard
                    icon={UserX}
                    label="Đã khóa"
                    value={lockedTutors}
                    iconBg="bg-error-bg"
                    iconColor="text-error"
                />
            </div>

            {/* Filters */}
            <div>
                <div className="bg-primary border border-border rounded-sm p-4 mb-4">
                    <div className="grid grid-cols-3 gap-3">
                        <SearchInput
                            value={filters.searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Tìm theo tên, email..."
                            disabled={loading}
                        />

                        <Dropdown
                            value={filters.isActive || 'all'}
                            onChange={handleStatusFilterChange}
                            options={statusOptions}
                            placeholder="Lọc theo trạng thái"
                            disabled={loading}
                        />

                        <Button
                            variant="outline"
                            onClick={handleResetFilters}
                            disabled={loading || (!filters.searchTerm && !filters.isActive)}
                            className="w-full"
                        >
                            <Filter size={16} />
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-primary border border-border rounded-sm overflow-hidden">
                    <UsersTable
                        users={users}
                        loading={loading}
                        onChangeStatus={handleChangeStatus}
                        changingStatusUserId={changingStatusUserId}
                    />

                    {!loading && pagination.totalCount > 0 && (
                        <Pagination
                            currentPage={pagination.pageNumber}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={pagination.pageSize}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            totalItems={pagination.totalCount}
                            disabled={loading}
                        />
                    )}
                </div>
            </div>

            <AddTutorPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onSubmit={handleAddTutor}
                isLoading={createLoading}
            />

            <ConfirmModal
                isOpen={confirmStatusChange.isOpen}
                onClose={handleCancelStatusChange}
                onConfirm={handleConfirmStatusChange}
                title={!confirmStatusChange.user?.isActive ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                message={`Bạn có chắc chắn muốn ${!confirmStatusChange.user?.isActive ? 'mở khóa' : 'khóa'} tài khoản "${confirmStatusChange.user?.fullName}"?`}
                confirmText={!confirmStatusChange.user?.isActive ? "Mở khóa" : "Khóa"}
                cancelText="Hủy"
                variant={!confirmStatusChange.user?.isActive ? "success" : "danger"}
                isLoading={changingStatusUserId === confirmStatusChange.user?.userId}
            />
        </>
    );
};
