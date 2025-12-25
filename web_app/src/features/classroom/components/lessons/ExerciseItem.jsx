import { FileText, Calendar, Paperclip, Clock } from 'lucide-react';

export const ExerciseItem = ({ exercise, exerciseDueAt, onView }) => {
    const isOverdue = exerciseDueAt && new Date(exerciseDueAt) < new Date();
    const dueDate = exerciseDueAt ? new Date(exerciseDueAt) : null;

    return (
        <div className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-gray-50 transition-colors">
            {/* Exercise icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-sm flex items-center justify-center">
                <FileText size={18} className="text-green-600" />
            </div>

            {/* Exercise content */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-1">
                    {exercise.title}
                </h4>
                {exercise.description && (
                    <p className="text-xs text-foreground-light line-clamp-2 mb-2">
                        {exercise.description}
                    </p>
                )}
                <div className="flex items-center gap-3 text-xs text-foreground-lighter">
                    {exercise.attachMediaUrl && (
                        <span className="flex items-center gap-1">
                            <Paperclip size={12} />
                            File đính kèm
                        </span>
                    )}
                    {dueDate && (
                        <span className={`flex items-center gap-1 ${isOverdue ? 'text-error' : ''}`}>
                            <Clock size={12} />
                            Hạn nộp: {dueDate.toLocaleDateString('vi-VN')}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Tạo: {new Date(exercise.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                </div>
                {isOverdue && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-error-bg text-error-text rounded-sm">
                        Đã quá hạn
                    </span>
                )}
            </div>

            {/* Action button */}
            <button 
                onClick={() => onView && onView(exercise)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-foreground border border-border rounded-sm hover:bg-gray-50 transition-colors"
            >
                Xem chi tiết
            </button>
        </div>
    );
};
