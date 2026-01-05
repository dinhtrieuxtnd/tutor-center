import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { FileQuestion, Plus, Filter, BookOpen } from 'lucide-react';
import {
    getAllQuizzesAsync,
    createQuizAsync,
    setFilters,
    setPagination
} from '../store/quizSlice';
import { Button, SearchInput } from '../../../shared/components/ui';
import { StatCard, Pagination } from '../../../shared/components';
import { QuizzesTable } from '../components/QuizzesTable';
import { AddQuizPanel } from '../components/AddQuizPanel';
import { ROUTES } from '../../../core/constants';

export const QuizzesManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const profile = useAppSelector((state) => state.profile.profile);
    const {
        quizzes,
        loading,
        createLoading,
        filters,
        pagination,
    } = useAppSelector((state) => state.quiz);

    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

    // Fetch quizzes when component mounts or filters/pagination change
    useEffect(() => {
        fetchQuizzes();
    }, [filters, pagination.pageNumber, pagination.pageSize]);

    const fetchQuizzes = () => {
        const params = {
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize,
            searchTerm: filters.searchTerm || undefined,
            status: filters.status || undefined,
        };
        dispatch(getAllQuizzesAsync(params));
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

    const handleAddQuiz = async (formData) => {
        const result = await dispatch(createQuizAsync(formData));
        if (result.type.endsWith('/fulfilled')) {
            setIsAddPanelOpen(false);
            fetchQuizzes();
        }
    };

    const handleViewQuiz = (quiz) => {
        navigate(`${ROUTES.TUTOR_QUIZZES}/${quiz.id}`);
    };

    // Stats
    const totalQuizzes = pagination.totalCount;
    const avgTimeLimit = quizzes.length > 0
        ? Math.floor(quizzes.reduce((sum, q) => sum + q.timeLimitSec, 0) / quizzes.length / 60)
        : 0;

    return (
        <>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <FileQuestion size={24} />
                            Quản lý bài kiểm tra
                        </h1>
                        <p className="text-sm text-foreground-light mt-1">
                            Quản lý các bài kiểm tra trong hệ thống
                        </p>
                    </div>
                    <Button onClick={handleOpenAddPanel}>
                        <Plus size={16} />
                        Thêm bài kiểm tra
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard
                    icon={FileQuestion}
                    label="Tổng bài kiểm tra"
                    value={totalQuizzes}
                    iconBg="bg-gray-100"
                    iconColor="text-foreground"
                />

                <StatCard
                    icon={BookOpen}
                    label="Thời gian TB"
                    value={`${avgTimeLimit} phút`}
                    iconBg="bg-info-bg"
                    iconColor="text-info"
                />

                <StatCard
                    icon={FileQuestion}
                    label="Quiz hôm nay"
                    value={quizzes.filter(q => {
                        const today = new Date();
                        const created = new Date(q.createdAt);
                        return created.toDateString() === today.toDateString();
                    }).length}
                    iconBg="bg-success-bg"
                    iconColor="text-success"
                />
            </div>

            {/* Filters & Table */}
            <div>
                <div className="bg-primary border border-border rounded-sm p-4 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                        <SearchInput
                            value={filters.searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Tìm theo tiêu đề bài kiểm tra..."
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
                    <QuizzesTable
                        quizzes={quizzes}
                        loading={loading}
                        onView={handleViewQuiz}
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
            <AddQuizPanel
                isOpen={isAddPanelOpen}
                onClose={() => setIsAddPanelOpen(false)}
                onSubmit={handleAddQuiz}
                isLoading={createLoading}
            />
        </>
    );
};
