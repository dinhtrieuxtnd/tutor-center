import { X, Paperclip, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

export const ViewExercisePanel = ({ isOpen, onClose, exercise }) => {
    if (!isOpen || !exercise) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-screen w-[600px] bg-primary shadow-lg z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">Chi tiết bài tập</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                    {/* Title Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{exercise.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-foreground-light">
                            <span>ID: {exercise.id}</span>
                        </div>
                    </div>

                    {/* Description Section */}
                    {exercise.description && (
                        <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Mô tả</h4>
                            <div className="bg-secondary rounded-sm p-4 border border-border">
                                <p className="text-sm text-foreground whitespace-pre-wrap">{exercise.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Attachment Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Paperclip size={16} />
                            File đính kèm
                        </h4>
                        {exercise.attachMediaUrl ? (
                            <div className="border border-border rounded-sm overflow-hidden">
                                {/* File preview/info area */}
                                <div className="bg-secondary p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-sm flex items-center justify-center">
                                            <Paperclip size={24} className="text-gray-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                File đính kèm
                                            </p>
                                            <p className="text-xs text-foreground-light truncate">
                                                {exercise.attachMediaUrl}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action button */}
                                <div className="p-3 bg-primary border-t border-border">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(exercise.attachMediaUrl, '_blank')}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink size={14} />
                                        Mở trong tab mới
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-dashed border-border rounded-sm p-6 text-center">
                                <Paperclip size={32} className="mx-auto mb-2 text-foreground-light" />
                                <p className="text-sm text-foreground-light">Không có file đính kèm</p>
                            </div>
                        )}
                    </div>

                    {/* Timestamps Section */}
                    <div className="border-t border-border pt-4 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-foreground-light">
                            <Calendar size={14} />
                            <span>Ngày tạo: {formatDate(exercise.createdAt)}</span>
                        </div>
                        {exercise.updatedAt && (
                            <div className="flex items-center gap-2 text-xs text-foreground-light">
                                <Calendar size={14} />
                                <span>Cập nhật: {formatDate(exercise.updatedAt)}</span>
                            </div>
                        )}
                    </div>

                    {/* Statistics Section */}
                    {(exercise.submissionsCount !== undefined || exercise.classroomCount !== undefined) && (
                        <div className="border-t border-border pt-4">
                            <h4 className="text-sm font-semibold text-foreground mb-3">Thống kê</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {exercise.submissionsCount !== undefined && (
                                    <div className="bg-secondary rounded-sm p-3 border border-border">
                                        <p className="text-xs text-foreground-light mb-1">Bài nộp</p>
                                        <p className="text-2xl font-bold text-foreground">{exercise.submissionsCount || 0}</p>
                                    </div>
                                )}
                                {exercise.classroomCount !== undefined && (
                                    <div className="bg-secondary rounded-sm p-3 border border-border">
                                        <p className="text-xs text-foreground-light mb-1">Lớp học</p>
                                        <p className="text-2xl font-bold text-foreground">{exercise.classroomCount || 0}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border flex-shrink-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full"
                    >
                        Đóng
                    </Button>
                </div>
            </div>
        </>
    );
};
