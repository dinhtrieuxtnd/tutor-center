"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components";
import { useNotification } from "@/hooks";
import { auth } from "@/utils";

const AuthCallbackPage: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { success: showSuccess, error: showError } = useNotification();
    const [isProcessed, setIsProcessed] = useState(false);

    useEffect(() => {
        if (isProcessed) return; // tránh xử lý nhiều lần
        const handleAuthCallback = async () => {
            setIsProcessed(true);

            const token = searchParams.get("token");
            const refreshToken = searchParams.get("refresh");
            const error = searchParams.get("error");

            // Nếu có lỗi từ backend
            if (error) {
                console.error("Google OAuth error from backend:", error);
                const errorMessage = decodeURIComponent(error);

                if (errorMessage.includes("Username đã tồn tại")) {
                    showError("Username đã tồn tại. Vui lòng thử lại hoặc liên hệ admin.", "Lỗi đăng nhập");
                } else if (errorMessage.includes("không phải tài khoản sinh viên")) {
                    showError("Tài khoản này không phải tài khoản sinh viên.", "Lỗi phân quyền");
                } else if (errorMessage.includes("Email đã được sử dụng")) {
                    showError("Email này đã được sử dụng bởi tài khoản khác.", "Lỗi đăng nhập");
                } else {
                    showError(errorMessage, "Lỗi đăng nhập Google");
                }

                router.replace("/auth/login");
                return;
            }

            // Nếu có thông tin auth
            if (token && refreshToken) {

                auth.setAccessToken(token)
                auth.setRefreshToken(refreshToken);
                showSuccess("Đăng nhập Google thành công!", "Chào mừng");
                router.replace("/");
            } else {
                showError("Lỗi đăng nhập Google");
                router.replace("/auth/login");
            }
        };

        handleAuthCallback();

        // Timeout fallback 10s
        const timeout = setTimeout(() => {
            if (!isProcessed) {
                showError("Timeout xử lý đăng nhập Google");
                router.replace("/auth/login");
            }
        }, 10000);

        return () => clearTimeout(timeout);
    }, [searchParams, router, showSuccess, showError, isProcessed]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="flex flex-col items-center font-open-sans">
                    <LoadingSpinner size="lg" />
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">Đang xử lý đăng nhập...</h2>
                    <p className="mt-2 text-sm text-gray-600">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
