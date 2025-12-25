import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { BookOpen, Plus, Filter, FileText } from 'lucide-react';
import {
    getAllExercisesAsync,
    createExerciseAsync,
    updateExerciseAsync,
    deleteExerciseAsync,
    setFilters,
    setPagination
} from '../store/exerciseSlice';
import { Button, SearchInput, ConfirmModal } from '../../../shared/components/ui';
import { StatCard, Pagination } from '../../../shared/components';
import { ExercisesTable } from '../components/ExercisesTable';
import { AddExercisePanel } from '../components/AddExercisePanel';
import { EditExercisePanel } from '../components/EditExercisePanel';
import { ViewExercisePanel } from '../components/ViewExercisePanel';

export const ExercisesManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const profile = useAppSelector((state) => state.profile.profile);
    const {
        exercises,
        loading,
        createLoading,
        updateLoading,
        deleteLoading,
        filters,
        pagination,
    } = useAppSelector((state) => state.exercise);

    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
    const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [viewingExercise, setViewingExercise] = useState(null);
    const [deletingExerciseId, setDeletingExerciseId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, exercise: null });

    // Fetch exercises when component mounts or filters/pagination change
    useEffect(() => {
        fetchExercises();
    }, [filters, pagination.pageNumber, pagination.pageSize]);

    const fetchExercises = () => {
        const params = {
            page: pagination.pageNumber,
            limit: pagination.pageSize,
            search: filters.searchTerm || undefined,
        };
        dispatch(getAllExercisesAsync(params));
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

    const handleAddExercise = async (formData) => {
        const result = await dispatch(createExerciseAsync(formData));
        if (result.type.endsWith('/fulfilled')) {
            setIsAddPanelOpen(false);
            fetchExercises();
        }
    };

    const handleViewExercise = (exercise) => {
        setViewingExercise(exercise);
        setIsViewPanelOpen(true);
    };

    const handleEditExercise = (exercise) => {
        setEditingExercise(exercise);
        setIsEditPanelOpen(true);
    };

    const handleUpdateExercise = async (formData) => {
        if (!editingExercise) return;

        const result = await dispatch(updateExerciseAsync({
            exerciseId: editingExercise.id,
            data: formData
        }));

        if (result.type.endsWith('/fulfilled')) {
            setIsEditPanelOpen(false);
            setEditingExercise(null);
            fetchExercises();
        }
    };

    const handleDeleteExercise = (exercise) => {
        setConfirmDelete({ isOpen: true, exercise });
    };

    const handleConfirmDelete = async () => {
        if (!confirmDelete.exercise) return;

        setDeletingExerciseId(confirmDelete.exercise.id);
        const result = await dispatch(deleteExerciseAsync(confirmDelete.exercise.id));
        setDeletingExerciseId(null);

        if (result.type.endsWith('/fulfilled')) {
            setConfirmDelete({ isOpen: false, exercise: null });
            fetchExercises();
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ isOpen: false, exercise: null });
    };

    // Stats
    const totalExercises = pagination.totalCount;
    const exercisesWithAttachment = exercises.filter(e => e.attachMediaId).length;

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <BookOpen size={24} />
                            Quản lý bài tập
                        </h1>
                        <p className="text-sm text-foreground-light mt-1">
                            Quản lý các bài tập trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleOpenAddPanel}>
                        <Plus size={16} />
                        Thêm bài tập
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard
                    icon={BookOpen}
                    label="Tổng bài tập"
                    value={totalExercises}
                    iconBg="bg-gray-100"
                    iconColor="text-foreground"
                />

                <StatCard
                    icon={FileText}
                    label="Có file đính kèm"
                    value={exercisesWithAttachment}
                    iconBg="bg-info-bg"
                    iconColor="text-info"
                />

                <StatCard
                    icon={BookOpen}
                    label="Không có file"
                    value={totalExercises - exercisesWithAttachment}
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
                            placeholder="Tìm theo tiêu đề bài tập..."
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
                    <ExercisesTable
                        exercises={exercises}
                        loading={loading}
                        onView={handleViewExercise}
                        onEdit={handleEditExercise}
                        onDelete={handleDeleteExercise}
                        deletingExerciseId={deletingExerciseId}
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
            <AddExercisePanel
                isOpen={isAddPanelOpen}
                onClose={() => setIsAddPanelOpen(false)}
                onSubmit={handleAddExercise}
                isLoading={createLoading}
            />

            {/* Edit Panel */}
            <EditExercisePanel
                isOpen={isEditPanelOpen}
                onClose={() => {
                    setIsEditPanelOpen(false);
                    setEditingExercise(null);
                }}
                onSubmit={handleUpdateExercise}
                isLoading={updateLoading}
                exercise={editingExercise}
            />

            {/* View Panel */}
            <ViewExercisePanel
                isOpen={isViewPanelOpen}
                onClose={() => {
                    setIsViewPanelOpen(false);
                    setViewingExercise(null);
                }}
                exercise={viewingExercise}
            />

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={confirmDelete.isOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Xóa bài tập"
                message={`Bạn có chắc chắn muốn xóa bài tập "${confirmDelete.exercise?.title}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                isLoading={deletingExerciseId === confirmDelete.exercise?.id}
            />
        </>
    );
};
