import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface QuizQuestionResponse {
    questionId: number;
    quizId: number;
    questionText: string;
    questionType: 'MultipleChoice' | 'TrueFalse' | 'Essay';
    points: number;
    orderIndex: number;
    createdAt: string;
}

export interface CreateQuizQuestionRequest {
    questionText: string;
    questionType: 'MultipleChoice' | 'TrueFalse' | 'Essay';
    points: number;
    orderIndex?: number;
}

export interface UpdateQuizQuestionRequest {
    questionText?: string;
    questionType?: 'MultipleChoice' | 'TrueFalse' | 'Essay';
    points?: number;
    orderIndex?: number;
}

export interface AddQuestionMediaRequest {
    mediaId: number;
}

export const quizQuestionApi = {
    // Create new quiz question
    create: async (quizId: number | string, data: CreateQuizQuestionRequest): Promise<ApiResponse<QuizQuestionResponse>> => {
        return await apiService.post<ApiResponse<QuizQuestionResponse>>(
            API_ENDPOINTS.quizQuestions.create(quizId),
            data
        );
    },

    // Update quiz question
    update: async (quizId: number | string, id: number | string, data: UpdateQuizQuestionRequest): Promise<ApiResponse<QuizQuestionResponse>> => {
        return await apiService.put<ApiResponse<QuizQuestionResponse>>(
            API_ENDPOINTS.quizQuestions.update(quizId, id),
            data
        );
    },

    // Delete quiz question
    delete: async (quizId: number | string, id: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.quizQuestions.delete(quizId, id)
        );
    },

    // Add media to question
    addMedia: async (quizId: number | string, id: number | string, data: AddQuestionMediaRequest): Promise<ApiResponse<any>> => {
        return await apiService.post<ApiResponse<any>>(
            API_ENDPOINTS.quizQuestions.addMedia(quizId, id),
            data
        );
    },

    // Delete media from question
    deleteMedia: async (quizId: number | string, id: number | string, mediaId: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.quizQuestions.deleteMedia(quizId, id, mediaId)
        );
    },
};
