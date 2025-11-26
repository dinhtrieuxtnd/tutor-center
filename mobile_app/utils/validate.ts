/**
 * Validation utilities for form inputs
 */

export const validateEmail = (email: string): boolean => {
  if (!email || !email.trim()) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  if (!password || password.length < 6) {
    return false;
  }
  return true;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
  if (password !== confirmPassword) {
    return false;
  }
  return true;
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber || !phoneNumber.trim()) {
    return false;
  }
  // Vietnamese phone number regex (10-11 digits starting with 0)
  const phoneRegex = /^0\d{9,10}$/;
  return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
};

export const validateOtpCode = (otpCode: string): boolean => {
  if (!otpCode || !otpCode.trim()) {
    return false;
  }
  // OTP code should be 6 digits
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otpCode);
};

export const validateFullName = (fullName: string): boolean => {
  if (!fullName || !fullName.trim()) {
    return false;
  }
  // Full name should be at least 2 characters
  return fullName.trim().length >= 2;
};
