import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface LessonResponse {
    lessonId: number;
    classroomId: number;
    title: string;
    description?: string;
    lessonType: 'Lecture' | 'Exercise' | 'Quiz';
    contentId: number;
    orderIndex: number;
    createdAt: string;
}

export interface AssignLectureRequest {
    classroomId: number;
    lectureId: number;
    title: string;
    description?: string;
    orderIndex?: number;
}

export interface AssignExerciseRequest {
    classroomId: number;
    exerciseId: number;
    title: string;
    description?: string;
    orderIndex?: number;
}

export interface AssignQuizRequest {
    classroomId: number;
    quizId: number;
    title: string;
    description?: string;
    orderIndex?: number;
}

export const lessonApi = {
    // Assign lecture to classroom
    assignLecture: async (data: AssignLectureRequest): Promise<ApiResponse<LessonResponse>> => {
        return await apiService.post<ApiResponse<LessonResponse>>(
            API_ENDPOINTS.lessons.assignLecture,
            data
        );
    },

    // Assign exercise to classroom
    assignExercise: async (data: AssignExerciseRequest): Promise<ApiResponse<LessonResponse>> => {
        return await apiService.post<ApiResponse<LessonResponse>>(
            API_ENDPOINTS.lessons.assignExercise,
            data
        );
    },

    // Assign quiz to classroom
    assignQuiz: async (data: AssignQuizRequest): Promise<ApiResponse<LessonResponse>> => {
        return await apiService.post<ApiResponse<LessonResponse>>(
            API_ENDPOINTS.lessons.assignQuiz,
            data
        );
    },

    // Delete lesson
    delete: async (lessonId: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.lessons.delete(lessonId)
        );
    },

    // Get lessons by classroom
    getByClassroom: async (classroomId: number | string): Promise<ApiResponse<LessonResponse[]>> => {
        return await apiService.get<ApiResponse<LessonResponse[]>>(
            API_ENDPOINTS.lessons.getByClassroom(classroomId)
        );
    },

    // Get public lessons by classroom
    getByClassroomPublic: async (classroomId: number | string): Promise<ApiResponse<LessonResponse[]>> => {
        return await apiService.get<ApiResponse<LessonResponse[]>>(
            API_ENDPOINTS.lessons.getByClassroomPublic(classroomId)
        );
    },
};
