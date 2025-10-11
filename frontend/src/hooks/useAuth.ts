import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import {
  login,
  register,
  logout,
  requestPasswordResetEmail,
  resetPasswordWithToken,
} from "@/store/features"
import type { LoginRequest, RegisterStudentRequest } from "@/types"

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch()

  // Lấy state từ slice
  const {
    student,
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

  const handleRequestPasswordResetEmail = useCallback(
    (email: string) => dispatch(requestPasswordResetEmail(email)),
    [dispatch]
  )

  const handleResetPasswordWithToken = useCallback(
    (token: string, newPassword: string) =>
      dispatch(resetPasswordWithToken({ token, newPassword })),
    [dispatch]
  )

  return {
    student,
    accessToken,
    refreshToken: rToken,
    isLoading,
    error,
    isAuthenticated,

    // actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    requestPasswordResetEmail: handleRequestPasswordResetEmail,
    resetPasswordWithToken: handleResetPasswordWithToken,
  }
}
