import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface QuizAnswerResponse {
    answerId: number;
    attemptId: number;
    questionId: number;
    selectedOptionId?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateQuizAnswerRequest {
    questionId: number;
    selectedOptionId?: number;
}

export interface UpdateQuizAnswerRequest {
    selectedOptionId?: number;
}

export const quizAnswerApi = {
    // Create new quiz answer
    create: async (attemptId: number | string, data: CreateQuizAnswerRequest): Promise<ApiResponse<QuizAnswerResponse>> => {
        return await apiService.post<ApiResponse<QuizAnswerResponse>>(
            API_ENDPOINTS.quizAnswers.create(attemptId),
            data
        );
    },

    // Update quiz answer
    update: async (attemptId: number | string, questionId: number | string, data: UpdateQuizAnswerRequest): Promise<ApiResponse<QuizAnswerResponse>> => {
        return await apiService.put<ApiResponse<QuizAnswerResponse>>(
            API_ENDPOINTS.quizAnswers.update(attemptId, questionId),
            data
        );
    },

    // Delete quiz answer
    delete: async (attemptId: number | string, questionId: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.quizAnswers.delete(attemptId, questionId)
        );
    },
};
