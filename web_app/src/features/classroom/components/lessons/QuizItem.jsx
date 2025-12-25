import { ClipboardList, Clock, Calendar, Target, Eye, Award } from 'lucide-react';

export const QuizItem = ({ quiz }) => {
    const startDate = quiz.quizStartAt ? new Date(quiz.quizStartAt) : null;
    const endDate = quiz.quizEndAt ? new Date(quiz.quizEndAt) : null;
    const now = new Date();

    const isUpcoming = startDate && startDate > now;
    const isActive = startDate && endDate && startDate <= now && endDate >= now;
    const isEnded = endDate && endDate < now;

    const getStatusBadge = () => {
        if (isUpcoming) {
            return <span className="px-2 py-0.5 text-xs font-medium bg-info-bg text-info-text rounded-sm">Sắp diễn ra</span>;
        }
        if (isActive) {
            return <span className="px-2 py-0.5 text-xs font-medium bg-success-bg text-success-text rounded-sm">Đang diễn ra</span>;
        }
        if (isEnded) {
            return <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-sm">Đã kết thúc</span>;
        }
        return null;
    };

    return (
        <div className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-gray-50 transition-colors">
            {/* Quiz icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-sm flex items-center justify-center">
                <ClipboardList size={18} className="text-purple-600" />
            </div>

            {/* Quiz content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground">
                        {quiz.title}
                    </h4>
                    {getStatusBadge()}
                </div>
                
                {quiz.description && (
                    <p className="text-xs text-foreground-light line-clamp-2 mb-2">
                        {quiz.description}
                    </p>
                )}

                {/* Quiz info */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground-lighter mb-2">
                    {quiz.timeLimitSec && (
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Thời gian: {Math.floor(quiz.timeLimitSec / 60)} phút
                        </span>
                    )}
                    {quiz.maxAttempts && (
                        <span className="flex items-center gap-1">
                            <Target size={12} />
                            Số lần làm: {quiz.maxAttempts}
                        </span>
                    )}
                    {startDate && (
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Bắt đầu: {startDate.toLocaleString('vi-VN')}
                        </span>
                    )}
                    {endDate && (
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Kết thúc: {endDate.toLocaleString('vi-VN')}
                        </span>
                    )}
                </div>

                {/* Quiz settings */}
                <div className="flex items-center gap-3 text-xs">
                    {quiz.showQuizAnswers && (
                        <span className="flex items-center gap-1 text-success-text">
                            <Eye size={12} />
                            Hiển thị đáp án
                        </span>
                    )}
                    {quiz.showQuizScore && (
                        <span className="flex items-center gap-1 text-success-text">
                            <Award size={12} />
                            Hiển thị điểm
                        </span>
                    )}
                </div>
            </div>

            {/* Action button */}
            <button 
                disabled={!isActive}
                className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                    isActive 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
                {isUpcoming ? 'Chưa mở' : isActive ? 'Làm bài' : 'Đã đóng'}
            </button>
        </div>
    );
};
