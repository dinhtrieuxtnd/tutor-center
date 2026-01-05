import { Eye, User, Clock, CheckCircle } from 'lucide-react';
import { ButtonLoading } from '../../../shared/components/loading';

export const QuizAttemptsTable = ({ attempts, loading, onViewDetail }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <ButtonLoading message="Đang tải danh sách lượt làm bài..." />
            </div>
        );
    }

    if (attempts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-foreground-light">Chưa có học sinh nào làm bài</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (attempt) => {
        if (attempt.submittedAt) {
            return (
                <span className="px-2 py-1 rounded-sm text-xs font-medium bg-success-bg text-success flex items-center gap-1 justify-center">
                    <CheckCircle size={12} />
                    Đã nộp bài
                </span>
            );
        }
        return (
            <span className="px-2 py-1 rounded-sm text-xs font-medium bg-warning-bg text-warning flex items-center gap-1 justify-center">
                <Clock size={12} />
                Đang làm
            </span>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-border">
                    <tr>
                        <th className="px-3 py-2 text-left font-semibold text-foreground w-12">ID</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Học sinh</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Bắt đầu</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Nộp bài</th>
                        <th className="px-3 py-2 text-center font-semibold text-foreground w-32">Điểm</th>
                        <th className="px-3 py-2 text-center font-semibold text-foreground w-32">Trạng thái</th>
                        <th className="px-3 py-2 text-center font-semibold text-foreground w-24">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {attempts.map((attempt) => (
                        <tr key={attempt.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-foreground-light">
                                {attempt.id}
                            </td>
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-info-bg rounded-full flex items-center justify-center">
                                        <User size={16} className="text-info" />
                                    </div>
                                    <div>
                                        <div className="text-foreground font-medium">
                                            {attempt.student?.fullName || 'Học sinh'}
                                        </div>
                                        <div className="text-xs text-foreground-light">
                                            {attempt.student?.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 py-3 text-foreground-light text-xs">
                                {formatDate(attempt.startedAt)}
                            </td>
                            <td className="px-3 py-3 text-foreground-light text-xs">
                                {attempt.submittedAt ? formatDate(attempt.submittedAt) : (
                                    <span className="text-foreground-lighter italic">Chưa nộp</span>
                                )}
                            </td>
                            <td className="px-3 py-3 text-center">
                                {attempt.score !== null && attempt.score !== undefined ? (
                                    <span className="text-foreground font-semibold text-base">
                                        {attempt.score.toFixed(2)}
                                    </span>
                                ) : (
                                    <span className="text-foreground-lighter italic text-xs">Chưa chấm</span>
                                )}
                            </td>
                            <td className="px-3 py-3">
                                {getStatusBadge(attempt)}
                            </td>
                            <td className="px-3 py-3">
                                <div className="flex items-center justify-center gap-1">
                                    <button
                                        onClick={() => onViewDetail(attempt)}
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
