import { Edit2, Trash2, Archive, ArchiveRestore } from 'lucide-react';
import { Button } from '../../../shared/components/ui';

export const ClassroomsTable = ({ 
    classrooms = [], 
    loading, 
    onEdit, 
    onDelete, 
    onToggleArchive,
    deletingClassroomId,
    archivingClassroomId 
}) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
            </div>
        );
    }

    if (!classrooms.length) {
        return (
            <div className="text-center py-12 text-foreground-light">
                Không có lớp học nào
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Tên lớp
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Giáo viên
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Học phí
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Trạng thái
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Ngày tạo
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-foreground-light uppercase tracking-wider">
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {classrooms.map((classroom) => (
                        <tr key={classroom.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    {classroom.coverImageUrl && (
                                        <img 
                                            src={classroom.coverImageUrl} 
                                            alt={classroom.name}
                                            className="w-10 h-10 rounded object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            {classroom.name}
                                        </p>
                                        {classroom.description && (
                                            <p className="text-xs text-foreground-light line-clamp-1">
                                                {classroom.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <p className="text-sm text-foreground">
                                    {classroom.tutor?.fullName || 'N/A'}
                                </p>
                            </td>
                            <td className="px-4 py-3">
                                <p className="text-sm font-medium text-foreground">
                                    {formatCurrency(classroom.price)}
                                </p>
                            </td>
                            <td className="px-4 py-3">
                                {classroom.isArchived ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-gray-100 text-gray-700">
                                        Đã lưu trữ
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-success-bg text-success">
                                        Đang hoạt động
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground-light">
                                {formatDate(classroom.createdAt)}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onToggleArchive(classroom)}
                                        disabled={archivingClassroomId === classroom.id}
                                        title={classroom.isArchived ? 'Bỏ lưu trữ' : 'Lưu trữ'}
                                    >
                                        {classroom.isArchived ? (
                                            <ArchiveRestore size={16} />
                                        ) : (
                                            <Archive size={16} />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(classroom)}
                                    >
                                        <Edit2 size={16} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(classroom)}
                                        disabled={deletingClassroomId === classroom.id}
                                    >
                                        <Trash2 size={16} className="text-danger" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
