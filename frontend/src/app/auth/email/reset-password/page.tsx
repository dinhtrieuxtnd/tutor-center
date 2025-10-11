"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks"
import { Logo, AuthInput, AuthButton } from "@/components"
import { validateEmail } from "@/utils/validate"

export default function ResetPasswordPage() {
  const { requestPasswordResetEmail, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [countdown, setCountdown] = useState(0) // giây còn lại

  // chạy timer giảm dần mỗi giây
  useEffect(() => {
    if (countdown <= 0) return
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) return

    // const resultAction = await requestPasswordResetEmail(email)
    // if (resultAction.meta.requestStatus === "fulfilled") {
    //   // reset lại countdown về 60s
    //   setCountdown(60)
    // }
    setCountdown(60)
  }

  return (
    <div className="flex w-full justify-center items-center flex-col md:gap-6 gap-3">
      <div className="flex w-full flex-col justify-center items-center md:gap-15 gap-6">
        <Logo />
        <p className="text-primary text-3xl md:text-4xl font-bold font-open-sans">
          Quên mật khẩu
        </p>
        <p className="text-gray-600 text-center text-base">
          Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu
        </p>
      </div>

      <form
        className="space-y-3 md:space-y-6 w-full"
        onSubmit={handleSubmit}
      >
        <AuthInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          type="email"
          required
        />

        <AuthButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={countdown > 0} // disable khi đang countdown
        >
          <div className="text-white">
            {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi yêu cầu"}
          </div>
        </AuthButton>
      </form>

      {/* Quay lại login */}
      <div className="w-full flex justify-center items-center">
        <p>
          <span className="text-black text-base font-normal font-open-sans">
            Nhớ mật khẩu rồi?{" "}
          </span>
          <Link
            href="/auth/login"
            className="hover:underline cursor-pointer text-primary text-base font-semibold font-open-sans"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
