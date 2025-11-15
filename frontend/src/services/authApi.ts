import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import {
    LoginRequest,
    LoginResponse,
    Tokens,
    ApiResponse,
    RegisterStudentRequest,
    SendOtpRegisterRequest,
} from "@/types";

export const authApi = {
    // Đăng nhập - Backend expects { email, password }
    login: async (data: LoginRequest): Promise<ApiResponse<any>> => {
        const backendData = {
            email: data.email || data.username || '',
            password: data.password
        };
        
        return await apiService.post<ApiResponse<any>>(
            API_ENDPOINTS.auth.login,
            backendData
        );
    },

    // Gửi OTP đăng ký - Backend expects { email }
    sendOtpRegister: async (data: SendOtpRegisterRequest): Promise<ApiResponse<{ message: string }>> => {
        return await apiService.post<ApiResponse<{ message: string }>>(
            API_ENDPOINTS.auth.sendOtpRegister,
            data
        );
    },

    // Đăng ký - Backend expects { email, otpCode, fullName, password, confirmPassword, phoneNumber }
    register: async (data: RegisterStudentRequest): Promise<ApiResponse<any>> => {
        return await apiService.post<ApiResponse<any>>(
            API_ENDPOINTS.auth.register,
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

    // Get current user info
    getMe: async (): Promise<ApiResponse<any>> => {
        return await apiService.get<ApiResponse<any>>(API_ENDPOINTS.profile.me);
    },

    // Gửi OTP forgot password - Backend expects { email }
    forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
        return await apiService.post<ApiResponse<{ message: string }>>(
            API_ENDPOINTS.auth.forgotPassword,
            { email }
        );
    },

    // Reset password với OTP - Backend expects { email, otpCode, newPassword, confirmNewPassword }
    resetPassword: async (data: {
        email: string;
        otpCode: string;
        newPassword: string;
        confirmNewPassword: string;
    }): Promise<ApiResponse<{ message: string }>> => {
        return await apiService.post<ApiResponse<{ message: string }>>(
            API_ENDPOINTS.auth.resetPassword,
            data
        );
    }
};
