import { Trash2, Archive, ArchiveRestore, School, Eye } from 'lucide-react';
import { Spinner } from '../../../shared/components/loading/Loading';

export const ClassroomsTable = ({
    classrooms = [],
    loading,
    onView,
    onDelete,
    onToggleArchive,
    deletingClassroomId,
    archivingClassroomId,
}) => {
    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);

    const formatDate = (dateString) =>
        dateString
            ? new Date(dateString).toLocaleDateString('vi-VN')
            : '--';

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-2" />
                    <p className="text-sm text-foreground-light">Đang tải...</p>
                </div>
            </div>
        );
    }

    /* ================= EMPTY ================= */
    if (!classrooms.length) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <School size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-foreground-light">
                        Chưa có lớp học nào
                    </p>
                </div>
            </div>
        );
    }

    /* ================= TABLE ================= */
    return (
        <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
                <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Lớp học
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Giáo viên
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Học phí
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Ngày tạo
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">
                        Thao tác
                    </th>
                </tr>
            </thead>

            <tbody>
                {classrooms.map((classroom, index) => (
                    <tr
                        key={classroom.id}
                        className={`border-b border-border hover:bg-gray-50 transition-colors ${index === classrooms.length - 1 ? 'border-b-0' : ''
                            }`}
                    >
                        {/* LỚP */}
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                                {classroom.coverImageUrl ? (
                                    <img
                                        src={classroom.coverImageUrl}
                                        alt={classroom.name}
                                        className="w-10 h-10 rounded object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                        <School size={18} className="text-gray-400" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-foreground">
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

                        {/* GIÁO VIÊN */}
                        <td className="px-4 py-3 text-foreground">
                            {classroom.tutor?.fullName || 'N/A'}
                        </td>

                        {/* HỌC PHÍ */}
                        <td className="px-4 py-3 font-medium text-foreground">
                            {formatCurrency(classroom.price)}
                        </td>

                        {/* TRẠNG THÁI */}
                        <td className="px-4 py-3">
                            {classroom.isArchived ? (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-sm">
                                    Đã lưu trữ
                                </span>
                            ) : (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-success-bg text-success-text rounded-sm">
                                    Đang hoạt động
                                </span>
                            )}
                        </td>

                        {/* NGÀY TẠO */}
                        <td className="px-4 py-3 text-foreground-light">
                            {formatDate(classroom.createdAt)}
                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => onToggleArchive(classroom)}
                                    disabled={archivingClassroomId === classroom.id}
                                    className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors disabled:opacity-50"
                                    title={
                                        classroom.isArchived
                                            ? 'Bỏ lưu trữ'
                                            : 'Lưu trữ'
                                    }
                                >
                                    {classroom.isArchived ? (
                                        <ArchiveRestore size={16} />
                                    ) : (
                                        <Archive size={16} />
                                    )}
                                </button>

                                <button
                                    onClick={() => onView(classroom)}
                                    className="p-2 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors"
                                    title="Xem chi tiết"
                                >
                                    <Eye size={16} />
                                </button>

                                <button
                                    onClick={() => onDelete(classroom)}
                                    disabled={deletingClassroomId === classroom.id}
                                    className="p-2 hover:bg-red-50 rounded-sm text-foreground-light hover:text-error transition-colors disabled:opacity-50"
                                    title="Xóa"
                                >
                                    {deletingClassroomId === classroom.id ? (
                                        <Spinner size="sm" />
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
    );
};
