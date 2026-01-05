import { Eye, FileQuestion } from 'lucide-react';
import { ButtonLoading } from '../../../shared/components/loading';

export const QuizzesTable = ({ quizzes, loading, onView }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <ButtonLoading message="Đang tải danh sách bài kiểm tra..." />
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-foreground-light">Không có bài kiểm tra nào</p>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Active': { label: 'Hoạt động', class: 'bg-success-bg text-success' },
            'Inactive': { label: 'Không hoạt động', class: 'bg-gray-100 text-foreground-light' },
        };
        const config = statusConfig[status] || { label: status, class: 'bg-gray-100 text-foreground' };
        return (
            <span className={`px-2 py-1 rounded-sm text-xs font-medium ${config.class}`}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-border">
                    <tr>
                        <th className="px-3 py-2 text-left font-semibold text-foreground w-12">ID</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Tiêu đề</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Mô tả</th>
                        <th className="px-3 py-2 text-center font-semibold text-foreground w-24">Thời gian</th>
                        <th className="px-3 py-2 text-center font-semibold text-foreground w-24">Lượt thử</th>
                        <th className="px-3 py-2 text-center font-semibold text-foreground w-24">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.map((quiz) => (
                        <tr key={quiz.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-foreground-light">
                                {quiz.id}
                            </td>
                            <td className="px-3 py-3 text-foreground font-medium">
                                {quiz.title}
                            </td>
                            <td className="px-3 py-3 text-foreground-light">
                                <div className="max-w-md truncate">
                                    {quiz.description || <span className="text-foreground-lighter italic">Không có mô tả</span>}
                                </div>
                            </td>
                            <td className="px-3 py-3 text-center">
                                <span className="text-foreground-light text-xs">
                                    {Math.floor(quiz.timeLimitSec / 60)} phút
                                </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                                <span className="text-foreground font-medium">
                                    {quiz.maxAttempts}
                                </span>
                            </td>
                            <td className="px-3 py-3">
                                <div className="flex items-center justify-center gap-1">
                                    <button
                                        onClick={() => onView(quiz)}
                                        className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-info transition-colors"
                                        title="Xem chi tiết"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
