import { X, FileText, Image as ImageIcon, Calendar } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

export const ViewLecturePanel = ({ isOpen, onClose, lecture }) => {
    if (!isOpen || !lecture) return null;

    const isImage = lecture.mediaUrl && lecture.mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);

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
                    <h2 className="text-lg font-semibold text-foreground">Chi tiết bài giảng</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-medium text-foreground-light mb-1">
                            Tiêu đề
                        </label>
                        <h3 className="text-base font-semibold text-foreground">
                            {lecture.title}
                        </h3>
                    </div>

                    {/* ID & Parent ID */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-foreground-light mb-1">
                                ID Bài giảng
                            </label>
                            <p className="text-sm text-foreground">
                                {lecture.lectureId || lecture.id}
                            </p>
                        </div>
                        {lecture.parentId && (
                            <div>
                                <label className="block text-xs font-medium text-foreground-light mb-1">
                                    ID Bài giảng cha
                                </label>
                                <p className="text-sm text-foreground">
                                    {lecture.parentId}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs font-medium text-foreground-light mb-1">
                            Nội dung
                        </label>
                        {lecture.content ? (
                            <div className="text-sm text-foreground whitespace-pre-wrap bg-gray-50 border border-border rounded-sm p-3">
                                {lecture.content}
                            </div>
                        ) : (
                            <p className="text-sm text-foreground-lighter italic">
                                Không có nội dung
                            </p>
                        )}
                    </div>

                    {/* Media */}
                    {lecture.mediaId && lecture.mediaUrl && (
                        <div>
                            <label className="block text-xs font-medium text-foreground-light mb-2">
                                Media đính kèm
                            </label>
                            {isImage ? (
                                <div className="border border-border rounded-sm overflow-hidden">
                                    <img
                                        src={lecture.mediaUrl}
                                        alt={lecture.title}
                                        className="w-full h-auto"
                                    />
                                </div>
                            ) : (
                                <div className="border border-border rounded-sm p-3 bg-gray-50 flex items-center gap-3">
                                    <FileText size={24} className="text-foreground-light flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-foreground truncate">
                                            {lecture.mediaName || 'Tệp đính kèm'}
                                        </p>
                                        <p className="text-xs text-foreground-light truncate">
                                            {lecture.mediaUrl}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.open(lecture.mediaUrl, '_blank')}
                                className="w-full mt-2"
                            >
                                Mở trong tab mới
                            </Button>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="border-t border-border pt-4 space-y-2">
                        {lecture.createdAt && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-foreground-light flex items-center gap-1">
                                    <Calendar size={14} />
                                    Ngày tạo:
                                </span>
                                <span className="text-foreground">
                                    {new Date(lecture.createdAt).toLocaleString('vi-VN')}
                                </span>
                            </div>
                        )}
                        {lecture.updatedAt && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-foreground-light flex items-center gap-1">
                                    <Calendar size={14} />
                                    Cập nhật:
                                </span>
                                <span className="text-foreground">
                                    {new Date(lecture.updatedAt).toLocaleString('vi-VN')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Children info */}
                    {lecture.children && lecture.children.length > 0 && (
                        <div className="border-t border-border pt-4">
                            <label className="block text-xs font-medium text-foreground-light mb-2">
                                Bài giảng con
                            </label>
                            <p className="text-sm text-foreground">
                                Có {lecture.children.length} bài giảng con
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border flex gap-2 flex-shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Đóng
                    </Button>
                </div>
            </div>
        </>
    );
};
