import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { changePasswordAsync } from '../store/profileSlice';
import { Lock } from 'lucide-react';
import { ButtonLoading } from '../../../shared/components/loading';
import { PasswordInput, Button } from '../../../shared/components/ui';

export const ChangePasswordTab = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.profile);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});

  // Validate password strength
  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return '';
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      passwordData.currentPassword.trim() !== '' &&
      passwordData.newPassword.trim() !== '' &&
      passwordData.confirmNewPassword.trim() !== '' &&
      passwordData.newPassword === passwordData.confirmNewPassword &&
      passwordData.newPassword.length >= 6 &&
      Object.keys(errors).length === 0
    );
  }, [passwordData, errors]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Validate new password
    if (name === 'newPassword' && value) {
      const error = validatePassword(value);
      if (error) {
        setErrors(prev => ({ ...prev, newPassword: error }));
      }
    }

    // Validate confirm password match
    if (name === 'confirmNewPassword' && value) {
      if (value !== passwordData.newPassword) {
        setErrors(prev => ({ ...prev, confirmNewPassword: 'Mật khẩu xác nhận không khớp' }));
      }
    }

    // Also validate confirm password when new password changes
    if (name === 'newPassword' && passwordData.confirmNewPassword) {
      if (value !== passwordData.confirmNewPassword) {
        setErrors(prev => ({ ...prev, confirmNewPassword: 'Mật khẩu xác nhận không khớp' }));
      } else {
        setErrors(prev => ({ ...prev, confirmNewPassword: '' }));
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate before submit
    const newErrors = {};

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Mật khẩu hiện tại không được để trống';
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'Mật khẩu mới không được để trống';
    } else {
      const passwordError = validatePassword(passwordData.newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    if (!passwordData.confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = 'Xác nhận mật khẩu không được để trống';
    } else if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await dispatch(changePasswordAsync({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmNewPassword: passwordData.confirmNewPassword,
    }));

    if (changePasswordAsync.fulfilled.match(result)) {
      // Clear password form and errors
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setErrors({});
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="bg-primary border border-border rounded-sm">
      <form onSubmit={handleChangePassword} className="p-6">
        <div className="max-w-md mx-auto space-y-4">
          <PasswordInput
            label="Mật khẩu hiện tại"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            showPassword={showPasswords.current}
            onToggleVisibility={() => togglePasswordVisibility('current')}
            error={errors.currentPassword}
            required
          />

          <PasswordInput
            label="Mật khẩu mới"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            showPassword={showPasswords.new}
            onToggleVisibility={() => togglePasswordVisibility('new')}
            error={errors.newPassword}
            helperText={!errors.newPassword && "Mật khẩu phải có ít nhất 6 ký tự"}
            required
          />

          <PasswordInput
            label="Xác nhận mật khẩu mới"
            name="confirmNewPassword"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordChange}
            showPassword={showPasswords.confirm}
            onToggleVisibility={() => togglePasswordVisibility('confirm')}
            error={errors.confirmNewPassword}
            required
          />

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              loading={loading}
            >
              {loading ? (
                <ButtonLoading message="Đang đổi..." />
              ) : (
                <>
                  <Lock size={16} />
                  Đổi mật khẩu
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
