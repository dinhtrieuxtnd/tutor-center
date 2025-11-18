import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface UserResponse {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateTutorRequest {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface UpdateUserStatusRequest {
    isActive: boolean;
}

export const userApi = {
    // Get all students
    getStudents: async (): Promise<ApiResponse<UserResponse[]>> => {
        return await apiService.get<ApiResponse<UserResponse[]>>(
            API_ENDPOINTS.users.getStudents
        );
    },

    // Get all tutors
    getTutors: async (): Promise<ApiResponse<UserResponse[]>> => {
        return await apiService.get<ApiResponse<UserResponse[]>>(
            API_ENDPOINTS.users.getTutors
        );
    },

    // Create new tutor
    createTutor: async (data: CreateTutorRequest): Promise<ApiResponse<UserResponse>> => {
        return await apiService.post<ApiResponse<UserResponse>>(
            API_ENDPOINTS.users.createTutor,
            data
        );
    },

    // Update user status (activate/deactivate)
    updateStatus: async (userId: number | string, data: UpdateUserStatusRequest): Promise<ApiResponse<UserResponse>> => {
        return await apiService.patch<ApiResponse<UserResponse>>(
            API_ENDPOINTS.users.updateStatus(userId),
            data
        );
    },
};
