import { useState } from 'react';
import { User, Archive, Calendar, Phone, Mail } from 'lucide-react';
import { ClassroomBasicInfo } from './ClassroomBasicInfo';
import { ClassroomBasicInfoEdit } from './ClassroomBasicInfoEdit';

export const ClassroomInfo = ({ classroom }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);

    const formatDate = (dateString) =>
        dateString
            ? new Date(dateString).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
            : '--';

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                {/* Left Column - Main Info */}
                <div className="col-span-2 space-y-4">
                    {/* Thông tin cơ bản - Switch between view and edit mode */}
                    {isEditMode ? (
                        <ClassroomBasicInfoEdit
                            classroom={classroom}
                            onCancel={() => setIsEditMode(false)}
                        />
                    ) : (
                        <ClassroomBasicInfo
                            classroom={classroom}
                            onEdit={() => setIsEditMode(true)}
                        />
                    )}

                    {/* Giáo viên */}
                    {classroom.tutor && (
                        <div className="bg-primary border border-border rounded-sm p-4">
                            <h2 className="text-base font-semibold text-foreground mb-4">Giáo viên phụ trách</h2>
                            <div className="flex items-start gap-3">
                                {classroom.tutor.avatarUrl ? (
                                    <img
                                        src={classroom.tutor.avatarUrl}
                                        alt={classroom.tutor.fullName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User size={20} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">
                                        {classroom.tutor.fullName}
                                    </p>
                                    {classroom.tutor.email && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <Mail size={12} className="text-foreground-light" />
                                            <p className="text-xs text-foreground-light">
                                                {classroom.tutor.email}
                                            </p>
                                        </div>
                                    )}
                                    {classroom.tutor.phoneNumber && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <Phone size={12} className="text-foreground-light" />
                                            <p className="text-xs text-foreground-light">
                                                {classroom.tutor.phoneNumber}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Metadata */}
                <div className="col-span-1 space-y-4">
                    {/* Trạng thái */}
                    <div className="bg-primary border border-border rounded-sm p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Trạng thái</h3>
                        <div className="space-y-2">
                            <div>
                                <p className="text-xs text-foreground-light mb-1">Tình trạng</p>
                                {classroom.isArchived ? (
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-sm">
                                        <Archive size={12} className="inline mr-1" />
                                        Đã lưu trữ
                                    </span>
                                ) : (
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-success-bg text-success-text rounded-sm">
                                        Đang hoạt động
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Thời gian */}
                    <div className="bg-primary border border-border rounded-sm p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Thời gian</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-foreground-light mb-1">Ngày tạo</p>
                                <div className="flex items-center gap-2 text-xs text-foreground">
                                    <Calendar size={14} className="text-foreground-light" />
                                    {formatDate(classroom.createdAt)}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-foreground-light mb-1">Cập nhật lần cuối</p>
                                <div className="flex items-center gap-2 text-xs text-foreground">
                                    <Calendar size={14} className="text-foreground-light" />
                                    {formatDate(classroom.updatedAt)}
                                </div>
                            </div>
                            {classroom.deletedAt && (
                                <div>
                                    <p className="text-xs text-foreground-light mb-1">Ngày xóa</p>
                                    <div className="flex items-center gap-2 text-xs text-error">
                                        <Calendar size={14} className="text-error" />
                                        {formatDate(classroom.deletedAt)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Cover Image Info */}
                    {classroom.coverMediaId && (
                        <div className="bg-primary border border-border rounded-sm p-4">
                            <h3 className="text-sm font-semibold text-foreground mb-3">Ảnh bìa</h3>
                            <p className="text-xs text-foreground-light">
                                Media ID: {classroom.coverMediaId}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
