import { useState, useRef } from 'react';
import { useAppDispatch } from '../../../core/store/hooks';
import { uploadMediaAsync } from '../../media/store/mediaSlice';
import { updateProfileAsync } from '../store/profileSlice';
import { User, Camera } from 'lucide-react';
import { ButtonLoading } from '../../../shared/components/loading';

export const AvatarUpload = ({ currentAvatarUrl, formData, onAvatarUpdate }) => {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef(null);

    const [avatarPreview, setAvatarPreview] = useState(currentAvatarUrl);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [error, setError] = useState('');

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file ảnh');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Kích thước ảnh không được vượt quá 5MB');
            return;
        }

        try {
            setUploadingAvatar(true);
            setError('');

            // Show preview immediately for better UX
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload file to media API
            const uploadResult = await dispatch(uploadMediaAsync({
                file: file,
                visibility: 'public'
            }));

            if (uploadMediaAsync.fulfilled.match(uploadResult)) {
                const mediaId = uploadResult.payload.mediaId;

                // Update profile with new avatar media ID
                const updateResult = await dispatch(updateProfileAsync({
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,
                    avatarMediaId: mediaId,
                }));

                if (updateProfileAsync.fulfilled.match(updateResult)) {
                    const newAvatarUrl = updateResult.payload.avatarUrl;
                    setAvatarPreview(newAvatarUrl);
                    // Notify parent component of successful update
                    onAvatarUpdate(newAvatarUrl);
                }
            }
        } catch (err) {
            console.error('Error uploading avatar:', err);
            setError('Tải ảnh lên thất bại');
            // Revert preview on error
            setAvatarPreview(currentAvatarUrl);
        } finally {
            setUploadingAvatar(false);
            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                <div className="w-32 h-32 rounded-sm border-2 border-border overflow-hidden bg-gray-100">
                    {uploadingAvatar && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                            <ButtonLoading message="" />
                        </div>
                    )}
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <User size={48} className="text-gray-400" />
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 p-2 bg-foreground text-white rounded-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Camera size={16} />
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={uploadingAvatar}
                />
            </div>
            <p className="text-xs text-foreground-light text-center">
                Nhấn vào biểu tượng camera để thay đổi ảnh đại diện
            </p>
            {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
            )}
        </div>
    );
};
