import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface ExerciseSubmissionResponse {
    submissionId: number;
    studentId: number;
    lessonId: number;
    submittedAt: string;
    content?: string;
    grade?: number;
    feedback?: string;
    gradedAt?: string;
}

export interface SubmitExerciseRequest {
    content: string;
}

export interface GradeSubmissionRequest {
    grade: number;
    feedback?: string;
}

export const exerciseSubmissionApi = {
    // Submit exercise for a lesson
    submit: async (lessonId: number | string, data: SubmitExerciseRequest): Promise<ApiResponse<ExerciseSubmissionResponse>> => {
        return await apiService.post<ApiResponse<ExerciseSubmissionResponse>>(
            API_ENDPOINTS.exerciseSubmissions.submit(lessonId),
            data
        );
    },

    // Get submission by ID
    getById: async (submissionId: number | string): Promise<ApiResponse<ExerciseSubmissionResponse>> => {
        return await apiService.get<ApiResponse<ExerciseSubmissionResponse>>(
            API_ENDPOINTS.exerciseSubmissions.getById(submissionId)
        );
    },

    // Delete submission
    delete: async (submissionId: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.exerciseSubmissions.delete(submissionId)
        );
    },

    // Get all submissions for a lesson
    getByLesson: async (lessonId: number | string): Promise<ApiResponse<ExerciseSubmissionResponse[]>> => {
        return await apiService.get<ApiResponse<ExerciseSubmissionResponse[]>>(
            API_ENDPOINTS.exerciseSubmissions.getByLesson(lessonId)
        );
    },

    // Grade a submission
    grade: async (submissionId: number | string, data: GradeSubmissionRequest): Promise<ApiResponse<ExerciseSubmissionResponse>> => {
        return await apiService.put<ApiResponse<ExerciseSubmissionResponse>>(
            API_ENDPOINTS.exerciseSubmissions.grade(submissionId),
            data
        );
    },
};
