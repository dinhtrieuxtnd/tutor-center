import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';

export const AddSectionPanel = ({ isOpen, onClose, onSubmit, isLoading, quizId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        orderIndex: 0,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề không được để trống';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const submitData = {
            quizId,
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            orderIndex: parseInt(formData.orderIndex) || 0,
        };

        onSubmit(submitData);
    };

    const handleClose = () => {
        setFormData({ title: '', description: '', orderIndex: 0 });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
            <div className="fixed right-0 top-0 h-screen w-[500px] bg-primary shadow-lg z-50 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Thêm phần thi mới</h2>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-sm" disabled={isLoading}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <Input
                            label="Tiêu đề phần thi"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Nhập tiêu đề phần thi"
                            required
                            error={errors.title}
                            disabled={isLoading}
                        />

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Mô tả</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Nhập mô tả (tùy chọn)"
                                disabled={isLoading}
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 resize-none"
                            />
                        </div>

                        <Input
                            label="Thứ tự"
                            name="orderIndex"
                            type="number"
                            value={formData.orderIndex}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="p-4 border-t border-border flex gap-2">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1">
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? 'Đang tạo...' : 'Tạo phần thi'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};
