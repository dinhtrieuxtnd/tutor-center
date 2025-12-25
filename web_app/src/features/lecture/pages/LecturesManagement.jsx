import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { BookOpen, Plus, Filter, FileText } from 'lucide-react';
import {
    getAllLecturesAsync,
    createLectureAsync,
    updateLectureAsync,
    deleteLectureAsync,
    setFilters,
    setPagination
} from '../store/lectureSlice';
import { Button, SearchInput, ConfirmModal } from '../../../shared/components/ui';
import { StatCard, Pagination } from '../../../shared/components';
import { LecturesTable } from '../components/LecturesTable';
import { AddLecturePanel } from '../components/AddLecturePanel';
import { EditLecturePanel } from '../components/EditLecturePanel';
import { ViewLecturePanel } from '../components/ViewLecturePanel';

export const LecturesManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const profile = useAppSelector((state) => state.profile.profile);
    const {
        lectures,
        loading,
        createLoading,
        updateLoading,
        deleteLoading,
        filters,
        pagination,
    } = useAppSelector((state) => state.lecture);

    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);
    const [editingLecture, setEditingLecture] = useState(null);
    const [viewingLecture, setViewingLecture] = useState(null);
    const [deletingLectureId, setDeletingLectureId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, lecture: null });

    // Fetch lectures when component mounts or filters/pagination change
    useEffect(() => {
        fetchLectures();
    }, [filters, pagination.pageNumber, pagination.pageSize]);

    const fetchLectures = () => {
        const params = {
            page: pagination.pageNumber,
            limit: pagination.pageSize,
            search: filters.searchTerm || undefined,
        };
        dispatch(getAllLecturesAsync(params));
    };

    const handleSearchChange = (value) => {
        dispatch(setFilters({ searchTerm: value }));
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

    const handleOpenAddPanel = () => {
        setIsAddPanelOpen(true);
    };

    const handleAddLecture = async (formData) => {
        const result = await dispatch(createLectureAsync(formData));
        if (result.type.endsWith('/fulfilled')) {
            setIsAddPanelOpen(false);
            fetchLectures();
        }
    };

    const handleViewLecture = (lecture) => {
        setViewingLecture(lecture);
        setIsViewPanelOpen(true);
    };

    const handleEditLecture = (lecture) => {
        setEditingLecture(lecture);
        setIsEditPanelOpen(true);
    };

    const handleUpdateLecture = async (formData) => {
        if (!editingLecture) return;

        const result = await dispatch(updateLectureAsync({
            lectureId: editingLecture.lectureId,
            data: formData
        }));

        if (result.type.endsWith('/fulfilled')) {
            setIsEditPanelOpen(false);
            setEditingLecture(null);
            fetchLectures();
        }
    };

    const handleDeleteLecture = (lecture) => {
        setConfirmDelete({ isOpen: true, lecture });
    };

    const handleConfirmDelete = async () => {
        if (!confirmDelete.lecture) return;

        setDeletingLectureId(confirmDelete.lecture.lectureId);
        const result = await dispatch(deleteLectureAsync(confirmDelete.lecture.lectureId));
        setDeletingLectureId(null);

        if (result.type.endsWith('/fulfilled')) {
            setConfirmDelete({ isOpen: false, lecture: null });
            fetchLectures();
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ isOpen: false, lecture: null });
    };

    // Stats
    const totalLectures = pagination.totalCount;
    const lecturesWithMedia = lectures.filter(l => l.mediaId).length;

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <BookOpen size={24} />
                            Quản lý bài giảng
                        </h1>
                        <p className="text-sm text-foreground-light mt-1">
                            Quản lý các bài giảng trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleOpenAddPanel}>
                        <Plus size={16} />
                        Thêm bài giảng
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard
                    icon={BookOpen}
                    label="Tổng bài giảng"
                    value={totalLectures}
                    iconBg="bg-gray-100"
                    iconColor="text-foreground"
                />

                <StatCard
                    icon={FileText}
                    label="Có media đính kèm"
                    value={lecturesWithMedia}
                    iconBg="bg-info-bg"
                    iconColor="text-info"
                />

                <StatCard
                    icon={BookOpen}
                    label="Không có media"
                    value={totalLectures - lecturesWithMedia}
                    iconBg="bg-gray-100"
                    iconColor="text-foreground-light"
                />
            </div>

            {/* Filters & Table */}
            <div>
                <div className="bg-primary border border-border rounded-sm p-4 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                        <SearchInput
                            value={filters.searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Tìm theo tiêu đề bài giảng..."
                            disabled={loading}
                        />

                        <Button
                            variant="outline"
                            onClick={handleResetFilters}
                            disabled={loading || !filters.searchTerm}
                            className="w-full"
                        >
                            <Filter size={16} />
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-primary border border-border rounded-sm overflow-hidden">
                    <LecturesTable
                        lectures={lectures}
                        loading={loading}
                        onView={handleViewLecture}
                        onEdit={handleEditLecture}
                        onDelete={handleDeleteLecture}
                        deletingLectureId={deletingLectureId}
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

            {/* Add Panel */}
            <AddLecturePanel
                isOpen={isAddPanelOpen}
                onClose={() => setIsAddPanelOpen(false)}
                onSubmit={handleAddLecture}
                isLoading={createLoading}
            />

            {/* Edit Panel */}
            <EditLecturePanel
                isOpen={isEditPanelOpen}
                onClose={() => {
                    setIsEditPanelOpen(false);
                    setEditingLecture(null);
                }}
                onSubmit={handleUpdateLecture}
                isLoading={updateLoading}
                lecture={editingLecture}
            />

            {/* View Panel */}
            <ViewLecturePanel
                isOpen={isViewPanelOpen}
                onClose={() => {
                    setIsViewPanelOpen(false);
                    setViewingLecture(null);
                }}
                lecture={viewingLecture}
            />

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Xóa bài giảng"
                message={`Bạn có chắc chắn muốn xóa bài giảng "${confirmDelete.lecture?.title}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={deletingLectureId === confirmDelete.lecture?.lectureId}
            />
        </>
    );
};
