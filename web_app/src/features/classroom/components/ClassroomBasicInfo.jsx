import { School, DollarSign, Edit2 } from 'lucide-react';
import { Button } from '../../../shared/components';

export const ClassroomBasicInfo = ({ classroom, onEdit }) => {
    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);

    return (
        <div className="bg-primary border border-border rounded-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Thông tin cơ bản</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                >
                    <Edit2 size={14} />
                    Chỉnh sửa
                </Button>
            </div>
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <School size={18} className="text-foreground-light mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-foreground-light mb-1">Tên lớp học</p>
                        <p className="text-sm text-foreground font-medium">{classroom.name}</p>
                    </div>
                </div>

                {classroom.description && (
                    <div className="flex items-start gap-3">
                        <div className="w-[18px]"></div>
                        <div className="flex-1">
                            <p className="text-xs text-foreground-light mb-1">Mô tả</p>
                            <p className="text-sm text-foreground">{classroom.description}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-start gap-3">
                    <DollarSign size={18} className="text-success mt-0.5" />
                    <div className="flex-1">
                        <p className="text-xs text-foreground-light mb-1">Học phí</p>
                        <p className="text-sm text-foreground font-semibold text-success">
                            {formatCurrency(classroom.price)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
