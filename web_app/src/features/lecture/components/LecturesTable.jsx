import { Eye, Edit, Trash2, FileText, Image } from 'lucide-react';
import { ButtonLoading } from '../../../shared/components/loading';

export const LecturesTable = ({ lectures, loading, onView, onEdit, onDelete, deletingLectureId }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <ButtonLoading message="Đang tải danh sách bài giảng..." />
            </div>
        );
    }

    if (lectures.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-sm text-foreground-light">Không có bài giảng nào</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-border">
                    <tr>
                        <th className="px-3 py-2 text-left font-semibold text-foreground w-12">ID</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Tiêu đề</th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">Nội dung</th>
                        <th className="px-3 py-2 text-center font-semibold text-foreground w-24">Media</th>
                        <th className="px-3 py-2 text-center font-semibold text-foreground w-32">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {lectures.map((lecture) => (
                        <tr key={lecture.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-foreground-light">
                                {lecture.id}
                            </td>
                            <td className="px-3 py-3 text-foreground font-medium">
                                {lecture.title}
                            </td>
                            <td className="px-3 py-3 text-foreground-light">
                                <div className="max-w-md truncate">
                                    {lecture.content || <span className="text-foreground-lighter italic">Không có nội dung</span>}
                                </div>
                            </td>
                            <td className="px-3 py-3 text-center">
                                {lecture.mediaId ? (
                                    lecture.mediaUrl ? (
                                        <button
                                            onClick={() => window.open(lecture.mediaUrl, '_blank')}
                                            className="p-1 hover:bg-info-bg rounded-sm transition-colors"
                                            title="Xem media"
                                        >
                                            <Image size={16} className="text-info" />
                                        </button>
                                    ) : (
                                        <FileText size={16} className="inline text-foreground-light" />
                                    )
                                ) : (
                                    <span className="text-foreground-lighter text-xs">-</span>
                                )}
                            </td>
                            <td className="px-3 py-3">
                                <div className="flex items-center justify-center gap-1">
                                    <button
                                        onClick={() => onView(lecture)}
                                        className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-info transition-colors"
                                        title="Xem chi tiết"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(lecture)}
                                        className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(lecture)}
                                        disabled={deletingLectureId === lecture.id}
                                        className="p-2 hover:bg-error-bg rounded-sm text-foreground-light hover:text-error transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Xóa"
                                    >
                                        {deletingLectureId === lecture.id ? (
                                            <ButtonLoading message="" size="sm" />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
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
