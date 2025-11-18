import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import {
  login,
  register,
  logout,
} from "@/store/features"
import type { LoginRequest, RegisterStudentRequest } from "@/types"
import { authApi } from "@/services"

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch()

  // Lấy state từ slice
  const {
    user,
    accessToken,
    refreshToken: rToken,
    isLoading,
    error,
    isAuthenticated,
  } = useSelector((state: RootState) => state.auth)

  // Action handlers
  const handleLogin = useCallback(
    (credentials: LoginRequest) =>
      dispatch(login(credentials)),
    [dispatch]
  )

  const handleRegister = useCallback(
    (data: RegisterStudentRequest) => dispatch(register(data)),
    [dispatch]
  )

  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  // Forgot password - gửi OTP
  const handleForgotPassword = useCallback(
    async (email: string) => {
      return await authApi.forgotPassword(email)
    },
    []
  )

  // Reset password - sử dụng OTP
  const handleResetPassword = useCallback(
    async (data: {
      email: string;
      otpCode: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      return await authApi.resetPassword(data)
    },
    []
  )

  return {
    user,
    accessToken,
    refreshToken: rToken,
    isLoading,
    error,
    isAuthenticated,

    // actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    
    // Legacy alias for backward compatibility
    student: user,
  }
}
