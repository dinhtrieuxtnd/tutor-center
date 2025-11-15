"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks"
import { Logo, AuthInput, AuthButton, SuccessCircle } from "@/components"
import { Eye, EyeOff } from "lucide-react"
import { validateEmail, validatePassword, validateConfirmPassword } from "@/utils/validate"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { forgotPassword, resetPassword } = useAuth()
  
  const [email, setEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [countdown, setCountdown] = useState(0)
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // chạy timer giảm dần mỗi giây
  useEffect(() => {
    if (countdown <= 0) return
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [countdown])

  const handleSendOtp = async () => {
    if (!validateEmail(email)) return

    setIsLoading(true)
    try {
      const response = await forgotPassword(email)
      setOtpSent(true)
      setCountdown(60)
      alert(response.data?.message || "Mã OTP đã được gửi đến email của bạn.")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Gửi OTP thất bại. Vui lòng thử lại."
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) return
    if (!otpCode.trim()) {
      alert("Vui lòng nhập mã OTP")
      return
    }
    if (!validatePassword(newPassword)) return
    if (!validateConfirmPassword(newPassword, confirmPassword)) return

    setIsLoading(true)
    try {
      const response = await resetPassword({
        email,
        otpCode,
        newPassword,
        confirmNewPassword: confirmPassword
      })
      setSuccess(true)
      alert(response.data?.message || "Đặt lại mật khẩu thành công!")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Đặt lại mật khẩu thất bại. Vui lòng thử lại."
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex w-full justify-center items-center flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        <div className="flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8">
          <SuccessCircle />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center">
            Đặt lại mật khẩu thành công!
          </h2>
          <p className="text-gray-600 text-center text-sm sm:text-base md:text-lg">
            Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.
          </p>
        </div>
        <AuthButton
          onClick={() => router.push("/auth/login")}
          variant="primary"
        >
          <div className="text-white text-sm sm:text-base md:text-lg">
            Đăng nhập ngay
          </div>
        </AuthButton>
      </div>
    )
  }

  return (
    <div className="flex w-full justify-center items-center flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10">
      <div className="flex w-full flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-15">
        <Logo />
        <p className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-open-sans text-center">
          Quên mật khẩu
        </p>
        <p className="text-gray-600 text-center text-base sm:text-lg md:text-xl max-w-md">
          Nhập email và mã OTP để đặt lại mật khẩu
        </p>
      </div>

      <form
        className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 w-full"
        onSubmit={handleSubmit}
      >
        <div className="w-full">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <AuthInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                type="email"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading || countdown > 0 || !email}
              className="h-[54px] px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap text-sm"
            >
              {isLoading && !otpSent
                ? "Đang gửi..."
                : countdown > 0
                ? `${countdown}s`
                : otpSent
                ? "Gửi lại OTP"
                : "Gửi OTP"}
            </button>
          </div>
        </div>

        <AuthInput
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          label="Mã OTP"
          type="text"
          required
        />

        <AuthInput
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          label="Mật khẩu mới"
          type={showPassword ? "text" : "password"}
          required
          rightIcon={
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
        />

        <AuthInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Nhập lại mật khẩu"
          type={showConfirmPassword ? "text" : "password"}
          required
          rightIcon={
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
        />

        <AuthButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          <div className="text-white text-sm sm:text-base md:text-lg">
            Đặt lại mật khẩu
          </div>
        </AuthButton>
      </form>

      {/* Quay lại login */}
      <div className="w-full flex justify-center items-center">
        <p className="text-center">
          <span className="text-black text-sm sm:text-base md:text-lg font-normal font-open-sans">
            Nhớ mật khẩu rồi?{" "}
          </span>
          <Link
            href="/auth/login"
            className="hover:underline cursor-pointer text-primary text-sm sm:text-base md:text-lg font-semibold font-open-sans"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
