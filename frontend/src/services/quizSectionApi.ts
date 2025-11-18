import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface QuizSectionResponse {
    sectionId: number;
    quizId: number;
    title: string;
    description?: string;
    orderIndex: number;
    createdAt: string;
}

export interface CreateQuizSectionRequest {
    title: string;
    description?: string;
    orderIndex?: number;
}

export interface UpdateQuizSectionRequest {
    title?: string;
    description?: string;
    orderIndex?: number;
}

export const quizSectionApi = {
    // Create new quiz section
    create: async (quizId: number | string, data: CreateQuizSectionRequest): Promise<ApiResponse<QuizSectionResponse>> => {
        return await apiService.post<ApiResponse<QuizSectionResponse>>(
            API_ENDPOINTS.quizSections.create(quizId),
            data
        );
    },

    // Update quiz section
    update: async (quizId: number | string, id: number | string, data: UpdateQuizSectionRequest): Promise<ApiResponse<QuizSectionResponse>> => {
        return await apiService.put<ApiResponse<QuizSectionResponse>>(
            API_ENDPOINTS.quizSections.update(quizId, id),
            data
        );
    },

    // Delete quiz section
    delete: async (quizId: number | string, id: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.quizSections.delete(quizId, id)
        );
    },
};
