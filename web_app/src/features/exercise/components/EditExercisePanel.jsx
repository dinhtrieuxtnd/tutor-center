import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';
import { MediaUpload } from '../../media/component';

export const EditExercisePanel = ({ isOpen, onClose, onSubmit, exercise, isLoading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        attachMediaId: null,
    });
    const [mediaInfo, setMediaInfo] = useState({
        url: null,
        name: null
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (exercise) {
            setFormData({
                title: exercise.title || '',
                description: exercise.description || '',
                attachMediaId: exercise.attachMediaId || null,
            });
            setMediaInfo({
                url: exercise.attachMediaUrl || null,
                name: null
            });
        }
    }, [exercise]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleMediaUpdate = (mediaId, mediaUrl, mediaName) => {
        setFormData(prev => ({ ...prev, attachMediaId: mediaId }));
        setMediaInfo({ url: mediaUrl, name: mediaName });
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

        // Only send fields that have values
        const submitData = {
            title: formData.title.trim(),
            description: formData.description.trim() || undefined,
            attachMediaId: formData.attachMediaId || undefined,
        };

        onSubmit(submitData);
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    if (!isOpen || !exercise) return null;

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
                    <h2 className="text-lg font-semibold text-foreground">Chỉnh sửa bài tập</h2>
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
                        <Input
                            label="Tiêu đề"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Nhập tiêu đề bài tập"
                            required
                            error={errors.title}
                            disabled={isLoading}
                        />

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Mô tả
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Nhập mô tả bài tập (tùy chọn)"
                                disabled={isLoading}
                                rows={6}
                                className="w-full px-3 py-2 text-sm border border-border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                            />
                        </div>

                        {/* Current attachment display */}
                        {exercise.attachMediaUrl && (
                            <div className="border border-border rounded-sm p-3 bg-secondary">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-medium text-foreground-light">File đính kèm hiện tại</p>
                                    <button
                                        type="button"
                                        onClick={() => window.open(exercise.attachMediaUrl, '_blank')}
                                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        Mở trong tab mới
                                        <ExternalLink size={12} />
                                    </button>
                                </div>
                                <p className="text-xs text-foreground break-all">{exercise.attachMediaUrl}</p>
                            </div>
                        )}

                        <MediaUpload
                            currentMediaUrl={mediaInfo.url}
                            currentMediaName={mediaInfo.name}
                            onMediaUpdate={handleMediaUpdate}
                            label="Thay đổi file đính kèm (tùy chọn)"
                            accept="*/*"
                            disabled={isLoading}
                        />

                        <div className="border-t border-border pt-4 mt-4">
                            <p className="text-xs text-foreground-light mb-2">
                                <strong>Lưu ý:</strong> Nếu không upload file mới, file hiện tại sẽ được giữ nguyên.
                            </p>
                        </div>
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
                            Cập nhật
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};
