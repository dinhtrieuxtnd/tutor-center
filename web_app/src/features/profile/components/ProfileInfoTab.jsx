import { useState, useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { updateProfileAsync } from '../store/profileSlice';
import { Save } from 'lucide-react';
import { ButtonLoading } from '../../../shared/components/loading';
import { Input, Button } from '../../../shared/components/ui';
import { AvatarUpload } from './AvatarUpload';

export const ProfileInfoTab = () => {
    const dispatch = useAppDispatch();
    const { profile, loading } = useAppSelector((state) => state.profile);

    // Profile form state
    const [formData, setFormData] = useState({
        fullName: profile?.fullName || '',
        phoneNumber: profile?.phoneNumber || '',
    });

    const [errors, setErrors] = useState({});

    // Track original data
    const originalData = useRef({
        fullName: profile?.fullName || '',
        phoneNumber: profile?.phoneNumber || '',
        avatarUrl: profile?.avatarUrl || null,
    });

    // Update original data when profile changes
    useEffect(() => {
        if (profile) {
            originalData.current = {
                fullName: profile.fullName || '',
                phoneNumber: profile.phoneNumber || '',
                avatarUrl: profile.avatarUrl || null,
            };
            setFormData({
                fullName: profile.fullName || '',
                phoneNumber: profile.phoneNumber || '',
            });
        }
    }, [profile]);

    // Check if form has changes
    const hasChanges = useMemo(() => {
        return (
            formData.fullName !== originalData.current.fullName ||
            formData.phoneNumber !== originalData.current.phoneNumber
        );
    }, [formData]);

    // Validate phone number
    const validatePhoneNumber = (phone) => {
        if (!phone) return true; // Optional field
        const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
        return phoneRegex.test(phone);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Validate phone number
        if (name === 'phoneNumber' && value) {
            if (!validatePhoneNumber(value)) {
                setErrors(prev => ({ ...prev, phoneNumber: 'Số điện thoại không hợp lệ' }));
            }
        }
    };

    const handleAvatarUpdate = (newAvatarUrl) => {
        // Update original data when avatar is successfully uploaded
        originalData.current = {
            ...originalData.current,
            avatarUrl: newAvatarUrl,
        };
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        // Validate before submit
        const newErrors = {};
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Họ và tên không được để trống';
        }

        if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const result = await dispatch(updateProfileAsync({
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            // avatarMediaId sẽ được thêm sau khi implement upload
        }));

        if (updateProfileAsync.fulfilled.match(result)) {
            // Update original data after successful save
            originalData.current = {
                ...originalData.current,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
            };
        }
    };

    return (
        <div className="bg-primary border border-border rounded-sm">
            <form onSubmit={handleUpdateProfile} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Avatar Section */}
                    <AvatarUpload
                        currentAvatarUrl={profile?.avatarUrl}
                        formData={formData}
                        onAvatarUpdate={handleAvatarUpdate}
                    />

                    {/* Form Fields */}
                    <div className="md:col-span-2 space-y-4">
                        <Input
                            label="Họ và tên"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            error={errors.fullName}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            value={profile?.email || ''}
                            disabled
                            helperText="Email không thể thay đổi"
                        />

                        <Input
                            label="Số điện thoại"
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="0123456789"
                            error={errors.phoneNumber}
                        />

                        <Input
                            label="Vai trò"
                            type="text"
                            value={profile?.roleId === 1 ? 'Admin' : profile?.roleId === 2 ? 'Tutor' : 'User'}
                            disabled
                        />

                        {/* Submit Button */}
                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={loading || !hasChanges || Object.keys(errors).length > 0}
                                loading={loading}
                            >
                                {loading ? (
                                    <ButtonLoading message="Đang lưu..." />
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Lưu thay đổi
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
