import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';

export const EditQGroupPanel = ({ isOpen, onClose, onSubmit, isLoading, group }) => {
    const [formData, setFormData] = useState({
        title: '',
        introText: '',
        orderIndex: 0,
        shuffleInside: true,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (group) {
            setFormData({
                title: group.title || '',
                introText: group.introText || '',
                orderIndex: group.orderIndex || 0,
                shuffleInside: group.shuffleInside ?? true,
            });
        }
    }, [group]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề nhóm không được để trống';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const submitData = {
            sectionId: group.sectionId || undefined,
            title: formData.title.trim(),
            introText: formData.introText.trim() || undefined,
            orderIndex: parseInt(formData.orderIndex) || 0,
            shuffleInside: formData.shuffleInside,
        };

        onSubmit(submitData);
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
            <div className="fixed right-0 top-0 h-screen w-[600px] bg-primary shadow-lg z-50 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Sửa nhóm câu hỏi</h2>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-sm" disabled={isLoading}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                        <Input
                            label="Tiêu đề nhóm"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Nhập tiêu đề nhóm câu hỏi"
                            error={errors.title}
                            disabled={isLoading}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Văn bản giới thiệu</label>
                            <textarea
                                name="introText"
                                value={formData.introText}
                                onChange={handleChange}
                                placeholder="Nhập văn bản giới thiệu cho nhóm (tùy chọn)"
                                disabled={isLoading}
                                rows={4}
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

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="shuffleInside"
                                name="shuffleInside"
                                checked={formData.shuffleInside}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-4 h-4 rounded border-border focus:ring-2 focus:ring-info"
                            />
                            <label htmlFor="shuffleInside" className="text-sm text-foreground cursor-pointer">
                                Xáo trộn câu hỏi trong nhóm
                            </label>
                        </div>
                    </div>

                    <div className="p-4 border-t border-border flex gap-2">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1">
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};
