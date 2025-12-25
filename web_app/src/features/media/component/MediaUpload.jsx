import { useState, useRef } from 'react';
import { useAppDispatch } from '../../../core/store/hooks';
import { uploadMediaAsync } from '../../media/store/mediaSlice';
import { Upload, X, FileText } from 'lucide-react';
import { ButtonLoading } from '../../../shared/components/loading';

export const MediaUpload = ({ currentMediaUrl, currentMediaName, onMediaUpdate, label = "Tệp đính kèm", accept = "*/*", disabled = false }) => {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef(null);

    const [mediaPreview, setMediaPreview] = useState({
        url: currentMediaUrl,
        name: currentMediaName
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            setError('Kích thước tệp không được vượt quá 50MB');
            return;
        }

        try {
            setUploading(true);
            setError('');

            // Show preview immediately
            setMediaPreview({
                url: URL.createObjectURL(file),
                name: file.name
            });

            // Upload file to media API
            const uploadResult = await dispatch(uploadMediaAsync({
                file: file,
                visibility: 'public'
            }));

            if (uploadMediaAsync.fulfilled.match(uploadResult)) {
                const mediaId = uploadResult.payload.mediaId;
                const mediaUrl = uploadResult.payload.url;

                setMediaPreview({
                    url: mediaUrl,
                    name: file.name
                });

                // Notify parent component
                onMediaUpdate(mediaId, mediaUrl, file.name);
            }
        } catch (err) {
            console.error('Error uploading media:', err);
            setError('Tải tệp lên thất bại');
            // Revert preview
            setMediaPreview({
                url: currentMediaUrl,
                name: currentMediaName
            });
        } finally {
            setUploading(false);
            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveMedia = () => {
        setMediaPreview({ url: null, name: null });
        onMediaUpdate(null, null, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const isImage = mediaPreview.url && mediaPreview.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

    return (
        <div>
            <label className="block text-sm font-medium text-foreground mb-2">
                {label}
            </label>

            {mediaPreview.url ? (
                <div className="border border-border rounded-sm p-3 bg-gray-50">
                    {isImage ? (
                        <img
                            src={mediaPreview.url}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-sm mb-2"
                        />
                    ) : (
                        <div className="flex items-center gap-2 mb-2 p-3 bg-white rounded-sm">
                            <FileText size={24} className="text-foreground-light" />
                            <span className="text-sm text-foreground flex-1 truncate">
                                {mediaPreview.name || 'Tệp đã tải lên'}
                            </span>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleFileClick}
                            disabled={uploading || disabled}
                            className="flex-1 px-3 py-2 text-sm font-medium border border-border rounded-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Đang tải...' : 'Thay đổi'}
                        </button>
                        <button
                            type="button"
                            onClick={handleRemoveMedia}
                            disabled={uploading || disabled}
                            className="px-3 py-2 text-sm font-medium text-error border border-error rounded-sm hover:bg-error-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleFileClick}
                    disabled={uploading || disabled}
                    className="w-full px-4 py-8 border-2 border-dashed border-border rounded-sm hover:border-foreground hover:bg-gray-50 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <ButtonLoading message="Đang tải lên..." />
                    ) : (
                        <>
                            <Upload size={32} className="text-foreground-light" />
                            <p className="text-sm text-foreground-light">
                                Nhấn để tải tệp lên
                            </p>
                        </>
                    )}
                </button>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading || disabled}
            />

            {error && (
                <p className="text-xs text-error mt-1">{error}</p>
            )}
        </div>
    );
};
