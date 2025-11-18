import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface QuizResponse {
    quizId: number;
    title: string;
    description: string | null;
    timeLimitSec: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    gradingMethod: string;
    showAnswers: boolean;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateQuizRequest {
    title: string;
    description?: string | null;
    timeLimitSec?: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    gradingMethod?: string;
    showAnswers?: boolean;
}

export interface UpdateQuizRequest {
    title?: string;
    description?: string | null;
    timeLimitSec?: number;
    maxAttempts?: number;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    gradingMethod?: string;
    showAnswers?: boolean;
}

export interface QuizSearchRequest {
    searchTerm?: string;
    gradingMethod?: string;
    page?: number;
    pageSize?: number;
}

export interface QuizSearchResponse {
    items: QuizResponse[];
    total: number;
    page: number;
    pageSize: number;
}

export const quizApi = {
    // Search quizzes
    search: async (params?: QuizSearchRequest): Promise<QuizSearchResponse> => {
        const queryString = new URLSearchParams();
        if (params?.searchTerm) queryString.append('SearchTerm', params.searchTerm);
        if (params?.gradingMethod) queryString.append('GradingMethod', params.gradingMethod);
        if (params?.page) queryString.append('Page', params.page.toString());
        if (params?.pageSize) queryString.append('PageSize', params.pageSize.toString());
        
        const url = `${API_ENDPOINTS.quizzes.getAll}${queryString.toString() ? `?${queryString}` : ''}`;
        return await apiService.get<QuizSearchResponse>(url);
    },

    // Get all quizzes (deprecated - use search instead)
    getAll: async (): Promise<ApiResponse<QuizResponse[]>> => {
        return await apiService.get<ApiResponse<QuizResponse[]>>(
            API_ENDPOINTS.quizzes.getAll
        );
    },

    // Create new quiz
    create: async (data: CreateQuizRequest): Promise<QuizResponse> => {
        return await apiService.post<QuizResponse>(
            API_ENDPOINTS.quizzes.create,
            data
        );
    },

    // Get quiz by ID
    getById: async (id: number | string): Promise<QuizResponse> => {
        return await apiService.get<QuizResponse>(
            API_ENDPOINTS.quizzes.getById(id)
        );
    },

    // Update quiz
    update: async (id: number | string, data: UpdateQuizRequest): Promise<{ message: string }> => {
        return await apiService.put<{ message: string }>(
            API_ENDPOINTS.quizzes.update(id),
            data
        );
    },

    // Delete quiz
    delete: async (id: number | string): Promise<{ message: string }> => {
        return await apiService.delete<{ message: string }>(
            API_ENDPOINTS.quizzes.delete(id)
        );
    },
};
