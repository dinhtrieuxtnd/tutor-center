import { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { Button, Input } from '../../../shared/components/ui';
import { uploadMediaAsync } from '../../media/store/mediaSlice';
import { 
    attachMediaToOptionAsync, 
    detachMediaFromOptionAsync,
    getOptionMediasAsync
} from '../store/optionSlice';

export const EditOptionPanel = ({ isOpen, onClose, onSubmit, isLoading, option }) => {
    const dispatch = useAppDispatch();
    const { optionMedias, mediaLoading } = useAppSelector(state => state.option);
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        content: '',
        isCorrect: false,
        orderIndex: 0,
    });
    const [errors, setErrors] = useState({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (option) {
            setFormData({
                content: option.content || '',
                isCorrect: option.isCorrect ?? false,
                orderIndex: option.orderIndex || 0,
            });
            
            // Load existing medias
            if (option.id) {
                dispatch(getOptionMediasAsync(option.id));
            }
        }
    }, [option, dispatch]);

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
        if (!formData.content.trim()) {
            newErrors.content = 'Nội dung đáp án không được để trống';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const submitData = {
            content: formData.content.trim(),
            isCorrect: formData.isCorrect,
            orderIndex: parseInt(formData.orderIndex) || 0,
        };

        onSubmit(submitData);
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !option?.id) return;

        if (file.size > 50 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, media: 'Kích thước file không được vượt quá 50MB' }));
            return;
        }

        try {
            setUploading(true);
            setErrors(prev => ({ ...prev, media: '' }));

            const uploadResult = await dispatch(uploadMediaAsync({
                file: file,
                visibility: 'public'
            }));

            if (uploadMediaAsync.fulfilled.match(uploadResult)) {
                const mediaId = uploadResult.payload.mediaId;

                await dispatch(attachMediaToOptionAsync({
                    optionId: option.id,
                    mediaId: mediaId
                }));

                // Reload medias
                dispatch(getOptionMediasAsync(option.id));
            }
        } catch (err) {
            setErrors(prev => ({ ...prev, media: 'Tải lên thất bại' }));
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveMedia = async (mediaId) => {
        if (!option?.id) return;

        try {
            await dispatch(detachMediaFromOptionAsync({
                optionId: option.id,
                mediaId: mediaId
            }));

            // Reload medias
            dispatch(getOptionMediasAsync(option.id));
        } catch (err) {
            console.error('Remove media error:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
            <div className="fixed right-0 top-0 h-screen w-[600px] bg-primary shadow-lg z-50 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Sửa đáp án</h2>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-sm" disabled={isLoading}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                Nội dung đáp án <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Nhập nội dung đáp án"
                                disabled={isLoading}
                                rows={4}
                                className={`w-full px-3 py-2 text-sm border rounded-sm focus:outline-none focus:border-foreground bg-primary disabled:opacity-50 resize-none ${
                                    errors.content ? 'border-red-500' : 'border-border'
                                }`}
                            />
                            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isCorrect"
                                name="isCorrect"
                                checked={formData.isCorrect}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-4 h-4 rounded border-border focus:ring-2 focus:ring-info"
                            />
                            <label htmlFor="isCorrect" className="text-sm text-foreground cursor-pointer">
                                Đây là đáp án đúng
                            </label>
                        </div>

                        <Input
                            label="Thứ tự"
                            name="orderIndex"
                            type="number"
                            value={formData.orderIndex}
                            onChange={handleChange}
                            disabled={isLoading}
                        />

                        {/* Media Section */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Hình ảnh đính kèm
                            </label>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {/* Media List */}
                            {optionMedias && optionMedias.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {optionMedias.map((media) => (
                                        <div key={media.mediaId} className="relative group">
                                            <img
                                                src={media.mediaUrl}
                                                alt="Option media"
                                                className="w-full h-32 object-cover rounded border border-border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMedia(media.mediaId)}
                                                disabled={mediaLoading}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Button */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleFileSelect}
                                disabled={uploading || isLoading}
                                className="w-full gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-foreground border-t-transparent" />
                                        Đang tải lên...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        Thêm hình ảnh
                                    </>
                                )}
                            </Button>
                            {errors.media && <p className="text-xs text-red-500 mt-1">{errors.media}</p>}
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
