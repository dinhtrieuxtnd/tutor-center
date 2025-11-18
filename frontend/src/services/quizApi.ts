import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface QuizResponse {
    quizId: number;
    title: string;
    description?: string;
    duration?: number;
    totalPoints?: number;
    passingScore?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateQuizRequest {
    title: string;
    description?: string;
    duration?: number;
    totalPoints?: number;
    passingScore?: number;
}

export interface UpdateQuizRequest {
    title?: string;
    description?: string;
    duration?: number;
    totalPoints?: number;
    passingScore?: number;
}

export const quizApi = {
    // Get all quizzes
    getAll: async (): Promise<ApiResponse<QuizResponse[]>> => {
        return await apiService.get<ApiResponse<QuizResponse[]>>(
            API_ENDPOINTS.quizzes.getAll
        );
    },

    // Create new quiz
    create: async (data: CreateQuizRequest): Promise<ApiResponse<QuizResponse>> => {
        return await apiService.post<ApiResponse<QuizResponse>>(
            API_ENDPOINTS.quizzes.create,
            data
        );
    },

    // Get quiz by ID
    getById: async (id: number | string): Promise<ApiResponse<QuizResponse>> => {
        return await apiService.get<ApiResponse<QuizResponse>>(
            API_ENDPOINTS.quizzes.getById(id)
        );
    },

    // Update quiz
    update: async (id: number | string, data: UpdateQuizRequest): Promise<ApiResponse<QuizResponse>> => {
        return await apiService.put<ApiResponse<QuizResponse>>(
            API_ENDPOINTS.quizzes.update(id),
            data
        );
    },

    // Delete quiz
    delete: async (id: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.quizzes.delete(id)
        );
    },
};
