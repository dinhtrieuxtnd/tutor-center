import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface ProfileResponse {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: string;
}

export interface UpdateProfileRequest {
    fullName: string;
    phoneNumber: string;
    avatarMediaId?: number;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export const profileApi = {
    // Get current user profile
    getProfile: async (): Promise<ApiResponse<ProfileResponse>> => {
        return await apiService.get<ApiResponse<ProfileResponse>>(
            API_ENDPOINTS.profile.me
        );
    },

    // Update profile
    updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<any>> => {
        return await apiService.put<ApiResponse<any>>(
            API_ENDPOINTS.profile.update,
            data
        );
    },

    // Change password
    changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<any>> => {
        return await apiService.post<ApiResponse<any>>(
            API_ENDPOINTS.profile.changePassword,
            data
        );
    },
};
