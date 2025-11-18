import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface QuestionGroupResponse {
    groupId: number;
    quizId: number;
    groupText: string;
    orderIndex: number;
    createdAt: string;
}

export interface CreateQuestionGroupRequest {
    groupText: string;
    orderIndex?: number;
}

export interface UpdateQuestionGroupRequest {
    groupText?: string;
    orderIndex?: number;
}

export interface AddGroupMediaRequest {
    mediaId: number;
}

export const questionGroupApi = {
    // Create new question group
    create: async (quizId: number | string, data: CreateQuestionGroupRequest): Promise<ApiResponse<QuestionGroupResponse>> => {
        return await apiService.post<ApiResponse<QuestionGroupResponse>>(
            API_ENDPOINTS.questionGroups.create(quizId),
            data
        );
    },

    // Update question group
    update: async (quizId: number | string, id: number | string, data: UpdateQuestionGroupRequest): Promise<ApiResponse<QuestionGroupResponse>> => {
        return await apiService.put<ApiResponse<QuestionGroupResponse>>(
            API_ENDPOINTS.questionGroups.update(quizId, id),
            data
        );
    },

    // Delete question group
    delete: async (quizId: number | string, id: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.questionGroups.delete(quizId, id)
        );
    },

    // Add media to group
    addMedia: async (quizId: number | string, id: number | string, data: AddGroupMediaRequest): Promise<ApiResponse<any>> => {
        return await apiService.post<ApiResponse<any>>(
            API_ENDPOINTS.questionGroups.addMedia(quizId, id),
            data
        );
    },

    // Delete media from group
    deleteMedia: async (quizId: number | string, id: number | string, mediaId: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.questionGroups.deleteMedia(quizId, id, mediaId)
        );
    },
};
