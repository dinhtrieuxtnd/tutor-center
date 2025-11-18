import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface LectureResponse {
    lectureId: number;
    title: string;
    description?: string;
    content?: string;
    videoUrl?: string;
    duration?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLectureRequest {
    title: string;
    description?: string;
    content?: string;
    videoUrl?: string;
    duration?: number;
}

export interface UpdateLectureRequest {
    title?: string;
    description?: string;
    content?: string;
    videoUrl?: string;
    duration?: number;
}

export const lectureApi = {
    // Get all lectures
    getAll: async (): Promise<ApiResponse<LectureResponse[]>> => {
        return await apiService.get<ApiResponse<LectureResponse[]>>(
            API_ENDPOINTS.lectures.getAll
        );
    },

    // Create new lecture
    create: async (data: CreateLectureRequest): Promise<ApiResponse<LectureResponse>> => {
        return await apiService.post<ApiResponse<LectureResponse>>(
            API_ENDPOINTS.lectures.create,
            data
        );
    },

    // Get lecture by ID
    getById: async (id: number | string): Promise<ApiResponse<LectureResponse>> => {
        return await apiService.get<ApiResponse<LectureResponse>>(
            API_ENDPOINTS.lectures.getById(id)
        );
    },

    // Update lecture
    update: async (id: number | string, data: UpdateLectureRequest): Promise<ApiResponse<LectureResponse>> => {
        return await apiService.put<ApiResponse<LectureResponse>>(
            API_ENDPOINTS.lectures.update(id),
            data
        );
    },

    // Delete lecture
    delete: async (id: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.lectures.delete(id)
        );
    },
};
