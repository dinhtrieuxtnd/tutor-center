import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface ExerciseResponse {
    exerciseId: number;
    title: string;
    description?: string;
    content?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateExerciseRequest {
    title: string;
    description?: string;
    content?: string;
}

export interface UpdateExerciseRequest {
    title?: string;
    description?: string;
    content?: string;
}

export const exerciseApi = {
    // Get my exercises
    getMyExercises: async (): Promise<ApiResponse<ExerciseResponse[]>> => {
        return await apiService.get<ApiResponse<ExerciseResponse[]>>(
            API_ENDPOINTS.exercises.myExercises
        );
    },

    // Create new exercise
    create: async (data: CreateExerciseRequest): Promise<ApiResponse<ExerciseResponse>> => {
        return await apiService.post<ApiResponse<ExerciseResponse>>(
            API_ENDPOINTS.exercises.create,
            data
        );
    },

    // Update exercise
    update: async (id: number | string, data: UpdateExerciseRequest): Promise<ApiResponse<ExerciseResponse>> => {
        return await apiService.put<ApiResponse<ExerciseResponse>>(
            API_ENDPOINTS.exercises.update(id),
            data
        );
    },

    // Delete exercise
    delete: async (id: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.exercises.delete(id)
        );
    },
};
