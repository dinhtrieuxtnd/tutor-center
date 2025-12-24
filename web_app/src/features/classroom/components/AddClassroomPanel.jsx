import { useState } from 'react';
import { useAppDispatch } from '../../../core/store/hooks';
import { uploadMediaAsync } from '../../media/store/mediaSlice';
import { X } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';
import { CoverImageUpload } from './CoverImageUpload';

export const AddClassroomPanel = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        tutorId: '',
        coverMediaId: null,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 
                  : name === 'tutorId' ? value.trim() 
                  : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.tutorId.trim()) {
            newErrors.tutorId = 'ID giáo viên không được để trống';
        }
        if (!formData.name.trim()) {
            newErrors.name = 'Tên lớp học không được để trống';
        }
        if (formData.price < 0) {
            newErrors.price = 'Học phí không được âm';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        onSubmit({
            tutorId: formData.tutorId.trim(),
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            price: formData.price,
            coverMediaId: formData.coverMediaId,
        });
    };

    const handleClose = () => {tutorId: '', 
        setFormData({ name: '', description: '', price: 0, coverMediaId: null });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleClose}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-screen w-[500px] bg-primary shadow-lg z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">Thêm lớp học mới</h2>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-sm text-foreground-light hover:text-foreground transition-colors"
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Ảnh bìa
                            </label>
                            <CoverImageUpload
                                currentCoverUrl={null}
                                currentCoverMediaId={null}
                                onCoverChange={(mediaId) => setFormData(prev => ({ ...prev, coverMediaId: mediaId }))}
                            />
                        </div>

                        <Input
                            label="Tên lớp học"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên lớp học"
                            required
                            error={errors.name}
                            disabled={isLoading}
                        />
                        <Input    
                            label="ID Giáo viên"
                            name="tutorId"
                            value={formData.tutorId}
                            onChange={handleChange}
                            placeholder="Nhập ID giáo viên phụ trách"
                            required
                            error={errors.tutorId}
                            disabled={isLoading}
                        />
                        
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
                                    isLoading
                                        ? 'bg-gray-50 text-foreground-light cursor-not-allowed'
                                        : 'bg-primary'
                                } border-border`}
                                placeholder="Nhập mô tả lớp học"
                                disabled={isLoading}
                            />
                        </div>

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
                            disabled={isLoading}
                        />
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-border flex gap-2 flex-shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            loading={isLoading}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Thêm
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};
