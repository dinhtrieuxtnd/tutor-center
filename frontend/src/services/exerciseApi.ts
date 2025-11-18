import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface ExerciseResponse {
    exerciseId: number;
    lessonId: number | null;
    title: string;
    description: string | null;
    attachMediaId: number | null;
    dueAt: string | null;
    createdBy: number;
    createdAt: string;
    submissionsCount: number;
}

export interface CreateExerciseRequest {
    lessonId: number;
    title: string;
    description?: string | null;
    attachMediaId?: number | null;
    dueAt?: string | null;
}

export interface UpdateExerciseRequest {
    title?: string;
    description?: string | null;
    attachMediaId?: number | null;
    dueAt?: string | null;
}

export const exerciseApi = {
    // Get my exercises
    getMyExercises: async (): Promise<ExerciseResponse[]> => {
        return await apiService.get<ExerciseResponse[]>(
            API_ENDPOINTS.exercises.myExercises
        );
    },

    // Create new exercise
    create: async (data: CreateExerciseRequest): Promise<ExerciseResponse> => {
        return await apiService.post<ExerciseResponse>(
            API_ENDPOINTS.exercises.create,
            data
        );
    },

    // Update exercise
    update: async (id: number | string, data: UpdateExerciseRequest): Promise<{ message: string }> => {
        return await apiService.put<{ message: string }>(
            API_ENDPOINTS.exercises.update(id),
            data
        );
    },

    // Delete exercise
    delete: async (id: number | string): Promise<{ message: string }> => {
        return await apiService.delete<{ message: string }>(
            API_ENDPOINTS.exercises.delete(id)
        );
    },
};
