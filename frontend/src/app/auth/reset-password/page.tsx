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
    <div className="flex w-full justify-center items-center flex-col md:gap-6 gap-3">
      <div className="flex w-full flex-col justify-center items-center 2xl:gap-15 md:gap-12 gap-6">
        <Logo />
        <p className="text-primary text-3xl md:text-4xl font-bold font-open-sans">
          Đặt lại mật khẩu
        </p>
      </div>

      <form
        className="space-y-3 md:space-y-6 w-full flex flex-col items-center"
        onSubmit={handleSubmit}
      >
        {success ? (
          <div className="flex flex-col justify-center items-center gap-6">
            <SuccessCircle />
            <AuthButton
              onClick={() => router.push("/auth/login")}
              variant="outline"
            >
              <div className="text-primary">Đăng nhập ngay</div>
            </AuthButton>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center gap-6">
            <ErrorCircle />
            <AuthButton
              onClick={() => router.push("/auth/email/reset-password")}
              variant="outline"
            >
              <div className="text-red-500">Thử lại</div>
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
              <div className="text-white">Đổi mật khẩu</div>
            </AuthButton>
          </>
        )}
      </form>
    </div>
  );
}
