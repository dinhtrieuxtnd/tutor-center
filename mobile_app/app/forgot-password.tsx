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

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState(false);
  const { forgotPassword, resetPassword } = useAuth();

  const handleSendOtp = async () => {
    // Validate email
    if (!validate.validateEmail(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập email hợp lệ');
      return;
    }

    setSendingOtp(true);
    try {
      const response = await forgotPassword(email.trim());
      setStep('reset');
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

  const handleResetPassword = async () => {
    // Validation
    if (!validate.validateOtpCode(otpCode)) {
      Alert.alert('Lỗi', 'Mã OTP phải có 6 chữ số');
      return;
    }

    if (!validate.validatePassword(newPassword)) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (!validate.validateConfirmPassword(newPassword, confirmNewPassword)) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(
        email.trim(),
        otpCode.trim(),
        newPassword,
        confirmNewPassword
      );
      Alert.alert('Thành công', response.message || 'Đặt lại mật khẩu thành công!');
      setSuccess(true);
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
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
            <Text style={styles.successTitle}>Đặt lại mật khẩu thành công!</Text>
            <Text style={styles.successText}>
              Mật khẩu của bạn đã được thay đổi. Bạn có thể đăng nhập với mật khẩu mới.
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
            <Text style={styles.title}>Quên mật khẩu</Text>
            <Text style={styles.subtitle}>
              {step === 'email' 
                ? 'Nhập email để nhận mã OTP đặt lại mật khẩu'
                : 'Nhập mã OTP và mật khẩu mới'}
            </Text>

            {step === 'email' ? (
              <>
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder=""
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>

                {/* Send OTP Button */}
                <TouchableOpacity 
                  style={[styles.submitButton, sendingOtp && styles.submitButtonDisabled]} 
                  onPress={handleSendOtp}
                  disabled={sendingOtp}
                >
                  {sendingOtp ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.loadingText}>Đang gửi...</Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>Gửi mã OTP</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
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

                {/* New Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Mật khẩu mới</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder=""
                      secureTextEntry={!showNewPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      <Ionicons
                        name={showNewPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm New Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      value={confirmNewPassword}
                      onChangeText={setConfirmNewPassword}
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

                {/* Resend OTP Button */}
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleSendOtp}
                  disabled={countdown > 0}
                >
                  <Text style={[styles.resendButtonText, countdown > 0 && styles.resendButtonTextDisabled]}>
                    {countdown > 0 ? `Gửi lại mã OTP (${countdown}s)` : 'Gửi lại mã OTP'}
                  </Text>
                </TouchableOpacity>

                {/* Reset Password Button */}
                <TouchableOpacity 
                  style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
                  onPress={handleResetPassword}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.loadingText}>Đang xử lý...</Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>Đặt lại mật khẩu</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Back to Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Đã nhớ mật khẩu? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
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
  submitButton: {
    height: 48,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
  resendButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
  },
  resendButtonTextDisabled: {
    color: '#9CA3AF',
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
