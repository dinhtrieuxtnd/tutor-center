import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface QuestionOptionResponse {
    optionId: number;
    questionId: number;
    optionText: string;
    isCorrect: boolean;
    orderIndex: number;
    createdAt: string;
}

export interface CreateQuestionOptionRequest {
    optionText: string;
    isCorrect: boolean;
    orderIndex?: number;
}

export interface UpdateQuestionOptionRequest {
    optionText?: string;
    isCorrect?: boolean;
    orderIndex?: number;
}

export interface AddOptionMediaRequest {
    mediaId: number;
}

export const questionOptionApi = {
    // Create new question option
    create: async (questionId: number | string, data: CreateQuestionOptionRequest): Promise<ApiResponse<QuestionOptionResponse>> => {
        return await apiService.post<ApiResponse<QuestionOptionResponse>>(
            API_ENDPOINTS.questionOptions.create(questionId),
            data
        );
    },

    // Update question option
    update: async (questionId: number | string, id: number | string, data: UpdateQuestionOptionRequest): Promise<ApiResponse<QuestionOptionResponse>> => {
        return await apiService.put<ApiResponse<QuestionOptionResponse>>(
            API_ENDPOINTS.questionOptions.update(questionId, id),
            data
        );
    },

    // Delete question option
    delete: async (questionId: number | string, id: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.questionOptions.delete(questionId, id)
        );
    },

    // Add media to option
    addMedia: async (questionId: number | string, id: number | string, data: AddOptionMediaRequest): Promise<ApiResponse<any>> => {
        return await apiService.post<ApiResponse<any>>(
            API_ENDPOINTS.questionOptions.addMedia(questionId, id),
            data
        );
    },

    // Delete media from option
    deleteMedia: async (questionId: number | string, id: number | string, mediaId: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.questionOptions.deleteMedia(questionId, id, mediaId)
        );
    },
};
