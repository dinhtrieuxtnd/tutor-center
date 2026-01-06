import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Trash2 } from 'lucide-react';
import { Button, Input } from '../../../shared/components/ui';
import { MediaUpload } from '../../media/component/MediaUpload';
import {
    getOptionMediasAsync,
    attachMediaToOptionAsync,
    detachMediaFromOptionAsync,
} from '../store/optionSlice';

export const EditOptionPanel = ({ isOpen, onClose, onSubmit, isLoading, option }) => {
    const dispatch = useDispatch();
    const { optionMedias, mediaLoading } = useSelector((state) => state.option);
    
    const [formData, setFormData] = useState({
        content: '',
        isCorrect: false,
        orderIndex: 0,
    });
    const [errors, setErrors] = useState({});
    const [uploadingMedia, setUploadingMedia] = useState(false);

    useEffect(() => {
        if (option) {
            setFormData({
                content: option.content || '',
                isCorrect: option.isCorrect ?? false,
                orderIndex: option.orderIndex || 0,
            });
            // Load option medias
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

    const handleMediaUpdate = async (mediaId, mediaUrl, mediaName) => {
        if (!option?.id || !mediaId) return;

        try {
            setUploadingMedia(true);
            await dispatch(
                attachMediaToOptionAsync({
                    optionId: option.id,
                    mediaId: mediaId,
                })
            ).unwrap();
        } catch (error) {
            console.error('Error attaching media:', error);
        } finally {
            setUploadingMedia(false);
        }
    };

    const handleRemoveMedia = async (mediaId) => {
        if (!option?.id || !mediaId) return;

        try {
            await dispatch(
                detachMediaFromOptionAsync({
                    optionId: option.id,
                    mediaId: mediaId,
                })
            ).unwrap();
            // Reload media list after successful deletion
            await dispatch(getOptionMediasAsync(option.id));
        } catch (error) {
            console.error('Error removing media:', error);
        }
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
                    <h2 className="text-lg font-semibold text-foreground">Sửa đáp án</h2>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-sm" disabled={isLoading}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

                        {/* Media Management Section */}
                        <div className="space-y-3">
                            <div className="border-t border-border pt-4">
                                <h3 className="text-sm font-semibold text-foreground mb-3">Hình ảnh đáp án</h3>
                                
                                {/* Existing medias */}
                                {mediaLoading ? (
                                    <div className="text-center py-4">
                                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-foreground border-r-transparent"></div>
                                    </div>
                                ) : optionMedias.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {optionMedias.map((media) => (
                                            <div key={media.mediaId || media.id} className="relative group border border-border rounded-sm overflow-hidden">
                                                <img
                                                    src={media.mediaUrl}
                                                    alt={media.fileName}
                                                    className="w-full h-32 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMedia(media.mediaId || media.id)}
                                                    className="absolute top-1 right-1 p-1 bg-error text-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                    disabled={isLoading || mediaLoading}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                                    {media.fileName}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}

                                {/* Upload new media */}
                                <MediaUpload
                                    currentMediaUrl={null}
                                    currentMediaName={null}
                                    onMediaUpdate={handleMediaUpdate}
                                    label="Thêm hình ảnh mới"
                                    accept="image/*"
                                    disabled={isLoading || uploadingMedia}
                                />
                            </div>
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
