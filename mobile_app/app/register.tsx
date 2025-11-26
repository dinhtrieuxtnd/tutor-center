import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import * as validate from '../utils/validate';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);
  const { register, sendOtpRegister } = useAuth();

  const handleSendOtp = async () => {
    // Validate email trước khi gửi OTP
    if (!validate.validateEmail(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập email hợp lệ');
      return;
    }

    setSendingOtp(true);
    try {
      const response = await sendOtpRegister(email.trim());
      setOtpSent(true);
      setCountdown(60); // Đếm ngược 60 giây

      // Đếm ngược
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      Alert.alert('Thành công', response.message || 'Mã OTP đã được gửi đến email của bạn.');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Gửi OTP thất bại. Vui lòng thử lại.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleRegister = async () => {
    // Validate các trường
    if (!validate.validateFullName(fullName)) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên hợp lệ (ít nhất 2 ký tự)');
      return;
    }

    if (!validate.validateEmail(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập email hợp lệ');
      return;
    }

    if (!validate.validatePassword(password)) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (!validate.validateConfirmPassword(password, confirmPassword)) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    if (!validate.validatePhoneNumber(phoneNumber)) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hợp lệ');
      return;
    }

    if (!validate.validateOtpCode(otpCode)) {
      Alert.alert('Lỗi', 'Mã OTP phải có 6 chữ số');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Lỗi', 'Vui lòng đồng ý với điều khoản sử dụng');
      return;
    }

    setIsLoading(true);
    
    const timeoutId = setTimeout(() => {
      Alert.alert('Thông báo', 'Đang xử lý đăng ký, vui lòng đợi...');
    }, 3000);

    try {
      await register(
        fullName.trim(),
        email.trim(),
        password,
        confirmPassword,
        phoneNumber.trim(),
        otpCode.trim()
      );
      clearTimeout(timeoutId);
      setSuccess(true);
    } catch (error: any) {
      clearTimeout(timeoutId);
      Alert.alert('Lỗi đăng ký', error.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // Xử lý đăng ký với Google
    Alert.alert('Thông báo', 'Đăng ký với Google');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  // Success screen
  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>Đăng ký thành công!</Text>
            <Text style={styles.successText}>
              Tài khoản của bạn đã được tạo thành công. Bạn có thể đăng nhập ngay bây giờ.
            </Text>
            <TouchableOpacity 
              style={styles.successButton} 
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.successButtonText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <View style={styles.logoIcon}>
                  <View style={styles.logoDot} />
                  <View style={styles.logoDot} />
                  <View style={styles.logoLine} />
                  <View style={styles.logoDot} />
                  <View style={styles.logoDot} />
                </View>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Đăng ký</Text>

            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Họ và tên</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder=""
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

            {/* Email Input with OTP Button */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.emailOtpContainer}>
                <TextInput
                  style={styles.emailInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder=""
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <TouchableOpacity
                  style={[
                    styles.otpButton,
                    (sendingOtp || countdown > 0 || !email) && styles.otpButtonDisabled
                  ]}
                  onPress={handleSendOtp}
                  disabled={sendingOtp || countdown > 0 || !email}
                >
                  <Text style={styles.otpButtonText}>
                    {sendingOtp
                      ? 'Đang gửi...'
                      : countdown > 0
                      ? `${countdown}s`
                      : otpSent
                      ? 'Gửi lại'
                      : 'Gửi OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* OTP Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mã OTP</Text>
              <TextInput
                style={styles.input}
                value={otpCode}
                onChangeText={setOtpCode}
                placeholder=""
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder=""
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder=""
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder=""
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Agreement */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreeTerms(!agreeTerms)}
              >
                <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                  {agreeTerms && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
                <Text style={styles.termsText}>
                  Tôi đồng ý với{' '}
                  <Text style={styles.termsLink}>Điều khoản sử dụng</Text>
                  {' '}và{' '}
                  <Text style={styles.termsLink}>Chính sách bảo mật</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.loadingText}>Đang xử lý...</Text>
                </View>
              ) : (
                <Text style={styles.registerButtonText}>Đăng ký</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Register Button */}
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleRegister}>
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text style={styles.googleButtonText}>Đăng ký với Google</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 32,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
  logoLine: {
    width: 24,
    height: 2,
    backgroundColor: '#9CA3AF',
    position: 'absolute',
    top: 19,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 48,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  termsContainer: {
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 3,
    marginRight: 8,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  termsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: '#4F46E5',
    fontWeight: '500',
  },
  registerButton: {
    height: 48,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#9CA3AF',
  },
  googleButton: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emailOtpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  otpButton: {
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  otpButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  otpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successContent: {
    alignItems: 'center',
    gap: 24,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  successButton: {
    height: 48,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});