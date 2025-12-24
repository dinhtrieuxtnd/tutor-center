import { useState, useRef } from 'react';
import { useAppDispatch } from '../../../core/store/hooks';
import { uploadMediaAsync } from '../../media/store/mediaSlice';
import { School, Camera, X } from 'lucide-react';
import { ButtonLoading } from '../../../shared/components/loading';

export const CoverImageUpload = ({ currentCoverUrl, currentCoverMediaId, onCoverChange }) => {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef(null);

    const [coverPreview, setCoverPreview] = useState(currentCoverUrl);
    const [pendingMediaId, setPendingMediaId] = useState(currentCoverMediaId);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [error, setError] = useState('');

    const handleCoverClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveCover = () => {
        setCoverPreview(null);
        setPendingMediaId(null);
        if (onCoverChange) {
            onCoverChange(null);
        }
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file ảnh');
            return;
        }

        // Validate file size (max 10MB for cover images)
        if (file.size > 10 * 1024 * 1024) {
            setError('Kích thước ảnh không được vượt quá 10MB');
            return;
        }

        try {
            setUploadingCover(true);
            setError('');

            // Show preview immediately for better UX
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload file to media API
            const uploadResult = await dispatch(uploadMediaAsync({
                file: file,
                visibility: 'public'
            }));

            if (uploadMediaAsync.fulfilled.match(uploadResult)) {
                const mediaId = uploadResult.payload.mediaId;
                setPendingMediaId(mediaId);
                
                // Notify parent component about the change
                if (onCoverChange) {
                    onCoverChange(mediaId);
                }
            }
        } catch (err) {
            console.error('Error uploading cover:', err);
            setError('Tải ảnh lên thất bại');
            // Revert preview on error
            setCoverPreview(currentCoverUrl);
            setPendingMediaId(currentCoverMediaId);
        } finally {
            setUploadingCover(false);
            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="relative">
                <div className="w-full h-48 rounded-sm border-2 border-border overflow-hidden bg-gray-100">
                    {uploadingCover && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                            <ButtonLoading message="" />
                        </div>
                    )}
                    {coverPreview ? (
                        <img
                            src={coverPreview}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <School size={48} className="text-gray-400 mb-2" />
                            <p className="text-sm text-foreground-light">Chưa có ảnh bìa</p>
                        </div>
                    )}
                </div>
                <div className="absolute bottom-2 right-2 flex gap-2">
                    {coverPreview && (
                        <button
                            type="button"
                            onClick={handleRemoveCover}
                            disabled={uploadingCover}
                            className="p-2 bg-error text-white rounded-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Xóa ảnh bìa"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleCoverClick}
                        disabled={uploadingCover}
                        className="p-2 bg-foreground text-white rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={coverPreview ? 'Thay đổi ảnh bìa' : 'Thêm ảnh bìa'}
                    >
                        <Camera size={16} />
                    </button>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                    disabled={uploadingCover}
                />
            </div>
            <p className="text-xs text-foreground-light text-center">
                Nhấn vào biểu tượng camera để {coverPreview ? 'thay đổi' : 'thêm'} ảnh bìa
            </p>
            {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
            )}
        </div>
    );
};
