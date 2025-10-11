"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks";
import {
  Logo,
  AuthInput,
  AuthButton,
  SuccessCircle,
  ErrorCircle,
} from "@/components";
import { Eye, EyeOff } from "lucide-react";
import {
  validatePassword,
  validateConfirmPassword,
} from "@/utils/validate";

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPasswordWithToken, isLoading } = useAuth();

  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) return;
    if (!validateConfirmPassword(newPassword, confirmPassword)) return;

    // const resultAction = await resetPasswordWithToken(token, newPassword);
    // if (resultAction.meta.requestStatus === "fulfilled") {
    //   setSuccess(true);
    //   setError(false);
    // } else {
    //   setSuccess(false);
    //   setError(true);
    // }
    setSuccess(true);
    setError(false);
  };

  return (
    <div className="flex w-full justify-center items-center flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10">
      <div className="flex w-full flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-15">
        <Logo />
        <p className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-open-sans text-center">
          Đặt lại mật khẩu
        </p>
      </div>

      <form
        className="space-y-4 sm:space-y-6 md:space-y-8 w-full flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        {success ? (
          <div className="flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 w-full">
            <SuccessCircle />
            <AuthButton
              onClick={() => router.push("/auth/login")}
              variant="outline"
            >
              <div className="text-primary text-sm sm:text-base md:text-lg">Đăng nhập ngay</div>
            </AuthButton>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 w-full">
            <ErrorCircle />
            <AuthButton
              onClick={() => router.push("/auth/email/reset-password")}
              variant="outline"
            >
              <div className="text-red-500 text-sm sm:text-base md:text-lg">Thử lại</div>
            </AuthButton>
          </div>
        ) : (
          <>
            <AuthInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              label="Mật khẩu mới"
              type={showNew ? "text" : "password"}
              required
              rightIcon={
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            <AuthInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Nhập lại mật khẩu"
              type={showConfirm ? "text" : "password"}
              required
              rightIcon={
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            <AuthButton type="submit" variant="primary" isLoading={isLoading}>
              <div className="text-white text-sm sm:text-base md:text-lg">Đổi mật khẩu</div>
            </AuthButton>
          </>
        )}
      </form>
    </div>
  );
}
