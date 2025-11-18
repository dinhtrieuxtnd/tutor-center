import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface QuizAttemptResponse {
    attemptId: number;
    studentId: number;
    lessonId: number;
    quizId: number;
    startedAt: string;
    submittedAt?: string;
    score?: number;
    isPassed?: boolean;
}

export interface QuizAttemptDetailResponse {
    attemptId: number;
    studentId: number;
    lessonId: number;
    quizId: number;
    startedAt: string;
    submittedAt?: string;
    score?: number;
    isPassed?: boolean;
    answers: Array<{
        questionId: number;
        selectedOptionId?: number;
        isCorrect: boolean;
    }>;
}

export interface QuizScoreResponse {
    attemptId: number;
    studentId: number;
    score: number;
    isPassed: boolean;
    submittedAt: string;
}

export const quizAttemptApi = {
    // Create new quiz attempt (start quiz)
    create: async (lessonId: number | string): Promise<ApiResponse<QuizAttemptResponse>> => {
        return await apiService.post<ApiResponse<QuizAttemptResponse>>(
            API_ENDPOINTS.quizAttempts.create(lessonId)
        );
    },

    // Get quiz attempt by ID
    getById: async (attemptId: number | string): Promise<ApiResponse<QuizAttemptResponse>> => {
        return await apiService.get<ApiResponse<QuizAttemptResponse>>(
            API_ENDPOINTS.quizAttempts.getById(attemptId)
        );
    },

    // Get quiz scores for a lesson
    getScores: async (lessonId: number | string): Promise<ApiResponse<QuizScoreResponse[]>> => {
        return await apiService.get<ApiResponse<QuizScoreResponse[]>>(
            API_ENDPOINTS.quizAttempts.getScores(lessonId)
        );
    },

    // Get quiz attempt detail with answers
    getDetail: async (attemptId: number | string): Promise<ApiResponse<QuizAttemptDetailResponse>> => {
        return await apiService.get<ApiResponse<QuizAttemptDetailResponse>>(
            API_ENDPOINTS.quizAttempts.getDetail(attemptId)
        );
    },
};
