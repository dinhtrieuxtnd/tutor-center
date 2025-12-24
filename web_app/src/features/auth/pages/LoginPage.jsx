import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../core/store/hooks';
import { loginAsync } from '../store/authSlice';
import { AuthLayout } from '../layouts';
import { AuthInput, AuthButton, AuthLink } from '../components';
import { Checkbox } from '../../../shared/components/ui';
import { ButtonLoading } from '../../../shared/components/loading';
import { ROUTES } from '../../../core/constants';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(loginAsync({ email, password }));
    
    if (loginAsync.fulfilled.match(result)) {
      // Redirect to loading page to fetch profile
      navigate(ROUTES.LOADING_REDIRECT);
    }
  };

  return (
    <AuthLayout subtitle="Đăng nhập để tiếp tục">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <AuthInput
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />

        {/* Password Input */}
        <AuthInput
          label="Mật khẩu"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onChange={setRememberMe}
            label="Ghi nhớ"
          />
          <AuthLink to={ROUTES.FORGOT_PASSWORD}>Quên mật khẩu?</AuthLink>
        </div>

        {/* Submit Button */}
        <AuthButton type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? <ButtonLoading message="Đang đăng nhập..." /> : 'Đăng nhập'}
        </AuthButton>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-foreground-light mt-4">
        Chưa có tài khoản?{' '}
        <AuthLink to={ROUTES.REGISTER} className="font-medium">
          Đăng ký ngay
        </AuthLink>
      </p>
    </AuthLayout>
  );
};
