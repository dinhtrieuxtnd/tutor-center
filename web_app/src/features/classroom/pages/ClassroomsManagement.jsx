import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import {
    getAllClassroomsAsync,
    getClassroomByIdAsync,
    createClassroomAsync,
    updateClassroomAsync,
    deleteClassroomAsync,
    toggleArchiveStatusAsync,
    setFilters,
    setPagination,
} from '../../../features/classroom/store/classroomSlice';
import { School, Plus, Archive, Filter } from 'lucide-react';
import { Button, ConfirmModal, SearchInput, Dropdown, Pagination } from '../../../shared/components/ui';
import { ClassroomsTable } from '../../../features/classroom/components/ClassroomsTable';

export const ClassroomsManagement = () => {
    const dispatch = useAppDispatch();
    const {
        classrooms,
        loading,
        createLoading,
        deleteLoading,
        updateLoading,
        archiveLoading,
        currentClassroom,
        classroomDetailLoading,
        filters,
        pagination,
    } = useAppSelector((state) => state.classroom);

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [deletingClassroomId, setDeletingClassroomId] = useState(null);
    const [archivingClassroomId, setArchivingClassroomId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, classroom: null });

    // Fetch classrooms when component mounts or filters/pagination change
    useEffect(() => {
        fetchClassrooms();
    }, [filters, pagination.pageNumber, pagination.pageSize]);

    const fetchClassrooms = () => {
        const params = {
            page: pagination.pageNumber,
            limit: pagination.pageSize,
            search: filters.searchTerm || undefined,
            isArchived: filters.status === 'archived',
        };
        dispatch(getAllClassroomsAsync(params));
    };

    const handleSearchChange = (value) => {
        dispatch(setFilters({ searchTerm: value }));
    };

    const handleStatusFilterChange = (value) => {
        dispatch(setFilters({ status: value }));
    };

    const handlePageChange = (page) => {
        dispatch(setPagination({ pageNumber: page }));
    };

    const handleItemsPerPageChange = (value) => {
        dispatch(setPagination({ pageSize: value, pageNumber: 1 }));
    };

    const handleResetFilters = () => {
        dispatch(setFilters({ searchTerm: '', status: null }));
    };

    const handleAddClassroom = () => {
        setIsPanelOpen(true);
    };

    const handleEditClassroom = async (classroom) => {
        await dispatch(getClassroomByIdAsync(classroom.id));
        setIsEditPanelOpen(true);
    };

    const handleToggleArchive = async (classroom) => {
        setArchivingClassroomId(classroom.id);
        const result = await dispatch(toggleArchiveStatusAsync(classroom.id));
        setArchivingClassroomId(null);

        if (result.type.endsWith('/fulfilled')) {
            fetchClassrooms();
        }
    };

    const handleDeleteClassroom = (classroom) => {
        setConfirmDelete({ isOpen: true, classroom });
    };

    const handleConfirmDelete = async () => {
        const classroom = confirmDelete.classroom;
        if (!classroom) return;

        setDeletingClassroomId(classroom.id);
        const result = await dispatch(deleteClassroomAsync(classroom.id));
        setDeletingClassroomId(null);
        setConfirmDelete({ isOpen: false, classroom: null });

        if (result.type.endsWith('/fulfilled')) {
            fetchClassrooms();
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ isOpen: false, classroom: null });
    };

    // Stats
    const activeClassrooms = classrooms.filter(c => !c.isArchived).length;
    const archivedClassrooms = classrooms.filter(c => c.isArchived).length;

    const statusOptions = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Đang hoạt động' },
        { value: 'archived', label: 'Đã lưu trữ' },
    ];

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <School size={24} />
                            Quản lý lớp học
                        </h1>
                        <p className="text-sm text-foreground-light mt-1">
                            Quản lý các lớp học trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleAddClassroom}>
                        <Plus size={16} />
                        Thêm lớp học
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-primary border border-border rounded-sm p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-sm">
                            <School size={20} className="text-foreground" />
                        </div>
                        <div>
                            <p className="text-xs text-foreground-light">Tổng lớp học</p>
                            <p className="text-xl font-semibold text-foreground">{pagination.totalCount}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-primary border border-border rounded-sm p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-success-bg rounded-sm">
                            <School size={20} className="text-success" />
                        </div>
                        <div>
                            <p className="text-xs text-foreground-light">Đang hoạt động</p>
                            <p className="text-xl font-semibold text-foreground">{activeClassrooms}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-primary border border-border rounded-sm p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-sm">
                            <Archive size={20} className="text-foreground-light" />
                        </div>
                        <div>
                            <p className="text-xs text-foreground-light">Đã lưu trữ</p>
                            <p className="text-xl font-semibold text-foreground">{archivedClassrooms}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div>
                <div className="bg-primary border border-border rounded-sm p-4 mb-4">
                    <div className="grid grid-cols-3 gap-3">
                        <SearchInput
                            value={filters.searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Tìm theo tên lớp học..."
                            disabled={loading}
                        />

                        <Dropdown
                            value={filters.status || 'all'}
                            onChange={handleStatusFilterChange}
                            options={statusOptions}
                            placeholder="Lọc theo trạng thái"
                            disabled={loading}
                        />

                        <Button
                            variant="outline"
                            onClick={handleResetFilters}
                            disabled={loading || (!filters.searchTerm && !filters.status)}
                            className="w-full"
                        >
                            <Filter size={16} />
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-primary border border-border rounded-sm overflow-hidden">
                    <ClassroomsTable
                        classrooms={classrooms}
                        loading={loading}
                        onEdit={handleEditClassroom}
                        onDelete={handleDeleteClassroom}
                        onToggleArchive={handleToggleArchive}
                        deletingClassroomId={deletingClassroomId}
                        archivingClassroomId={archivingClassroomId}
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

            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Xóa lớp học"
                message={`Bạn có chắc chắn muốn xóa lớp học "${confirmDelete.classroom?.name}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={deletingClassroomId === confirmDelete.classroom?.id}
            />
        </>
    );
};
