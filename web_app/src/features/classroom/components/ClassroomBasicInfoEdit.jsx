import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { updateClassroomAsync, getClassroomByIdAsync } from '../store/classroomSlice';
import { X, Save } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';
import { CoverImageUpload } from './CoverImageUpload';

export const ClassroomBasicInfoEdit = ({ classroom, onCancel }) => {
    const dispatch = useAppDispatch();
    const { updateLoading } = useAppSelector((state) => state.classroom);

    const [formData, setFormData] = useState({
        name: classroom.name || '',
        description: classroom.description || '',
        price: classroom.price || 0,
        coverMediaId: classroom.coverMediaId || null,
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên lớp học là bắt buộc';
        }

        if (formData.price < 0) {
            newErrors.price = 'Học phí không được âm';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const result = await dispatch(
            updateClassroomAsync({
                classroomId: classroom.id,
                data: {
                    name: formData.name.trim(),
                    description: formData.description.trim() || null,
                    price: formData.price,
                    coverMediaId: formData.coverMediaId,
                },
            })
        );

        if (updateClassroomAsync.fulfilled.match(result)) {
            // Refresh classroom data
            await dispatch(getClassroomByIdAsync(classroom.id));
            onCancel();
        }
    };

    return (
        <div className="bg-primary border border-border rounded-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Chỉnh sửa thông tin</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Cover Image */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Ảnh bìa
                    </label>
                    <CoverImageUpload
                        currentCoverUrl={classroom.coverImageUrl}
                        currentCoverMediaId={classroom.coverMediaId}
                        onCoverChange={(mediaId) => setFormData(prev => ({ ...prev, coverMediaId: mediaId }))}
                    />
                </div>

                {/* Name */}
                <Input
                    label="Tên lớp học"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập tên lớp học"
                    required
                    error={errors.name}
                    disabled={updateLoading}
                />

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                        Mô tả
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-3 py-2 text-sm border rounded-sm focus:outline-none focus:border-foreground resize-none ${
                            updateLoading
                                ? 'bg-gray-50 text-foreground-light cursor-not-allowed'
                                : 'bg-primary'
                        } border-border`}
                        placeholder="Nhập mô tả lớp học"
                        disabled={updateLoading}
                    />
                </div>

                {/* Price */}
                <Input
                    label="Học phí (VND)"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Nhập học phí"
                    min="0"
                    step="1000"
                    required
                    error={errors.price}
                    disabled={updateLoading}
                />

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={updateLoading}
                    >
                        <X size={16} />
                        Hủy
                    </Button>
                    <Button 
                        type="submit" 
                        loading={updateLoading}
                        disabled={updateLoading}
                    >
                        <Save size={16} />
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </div>
    );
};
