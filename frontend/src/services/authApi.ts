import { apiService } from "@/services"; // đổi path theo nơi bạn export apiService
import { API_ENDPOINTS } from "@/constants";
import {
    LoginRequest,
    LoginResponse,
    Tokens,
    ApiResponse,
    RegisterStudentRequest,
} from "@/types";

// Types theo backend
interface BackendLoginRequest {
    email: string;
    password: string;
}

interface BackendRegisterRequest {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
}

export const authApi = {
    // Đăng nhập Student
    login: async (data: LoginRequest): Promise<ApiResponse<any>> => {
        // Chuyển đổi format từ frontend sang backend
        const backendData: BackendLoginRequest = {
            email: data.email || data.username || '',
            password: data.password
        };
        
        return await apiService.post<ApiResponse<any>>(
            API_ENDPOINTS.auth.login,
            backendData
        );
    },

    // Đăng ký Student
    register: async (data: RegisterStudentRequest): Promise<ApiResponse<any>> => {
        // Chuyển đổi format từ frontend sang backend
        const backendData: BackendRegisterRequest = {
            fullName: `${data.lastName} ${data.firstName}`.trim(),
            email: data.email || '',
            password: data.password,
            phone: data.studentPhone
        };
        
        return await apiService.post<ApiResponse<any>>(
            API_ENDPOINTS.auth.register,
            backendData
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
        return await apiService.get<ApiResponse<any>>(API_ENDPOINTS.auth.me);
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
