import { apiService } from "@/services"; // đổi path theo nơi bạn export apiService
import { API_ENDPOINTS } from "@/constants";
import {
    LoginRequest,
    LoginResponse,
    Tokens,
    ApiResponse,
} from "@/types";

export const authApi = {
    // Đăng nhập Student
    login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        return await apiService.post<ApiResponse<LoginResponse>>(
            API_ENDPOINTS.auth.student.login,
            data
        );
    },

    // Đăng ký Student
    register: async (data: any): Promise<ApiResponse<any>> => {
        return await apiService.post<ApiResponse<any>>(
            API_ENDPOINTS.auth.student.register,
            data
        );
    },

    // Refresh token
    refreshToken: async (refreshToken: string): Promise<ApiResponse<Tokens>> => {
        return await apiService.post<ApiResponse<Tokens>>(API_ENDPOINTS.auth.refresh, {
            refreshToken,
        });
    },

    // Logout
    logout: async (
        refreshToken: string
    ): Promise<ApiResponse<{ success: boolean }>> => {
        return await apiService.post<ApiResponse<{ success: boolean }>>(
            API_ENDPOINTS.auth.logout,
            { refreshToken }
        );
    },

    requestPasswordResetEmail: async (
        email: string
    ): Promise<ApiResponse<{emailSent: string, expiresAt: string}>> =>{
        return await apiService.post<ApiResponse<{emailSent: string, expiresAt: string}>> (
            API_ENDPOINTS.auth.send_email.reset_password,
            { email }
        )
    },

    resetPasswordWithToken: async (
        token: string,
        newPassword: string
    ): Promise<ApiResponse<{ success: boolean }>> => {
        return await apiService.post<ApiResponse<{ success: boolean }>>(
            API_ENDPOINTS.auth.reset_password_token,
            { token, newPassword}
        );
    }
};
