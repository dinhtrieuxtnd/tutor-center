import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";
import { LectureResponse } from "./lectureApi";
import { ExerciseResponse } from "./exerciseApi";
import { QuizResponse } from "./quizApi";

export interface LessonResponse {
    lessonId: number;
    classroomId: number;
    lessonType: 'lecture' | 'exercise' | 'quiz';
    orderIndex: number;
    createdAt: string;
    lecture: LectureResponse | null;
    exercise: ExerciseResponse | null;
    exerciseDueAt: string | null;
    quiz: QuizResponse | null;
    quizStartAt: string | null;
    quizEndAt: string | null;
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
    assignLecture: async (data: AssignLectureRequest): Promise<LessonResponse> => {
        return await apiService.post<LessonResponse>(
            API_ENDPOINTS.lessons.assignLecture,
            data
        );
    },

    // Assign exercise to classroom
    assignExercise: async (data: AssignExerciseRequest): Promise<LessonResponse> => {
        return await apiService.post<LessonResponse>(
            API_ENDPOINTS.lessons.assignExercise,
            data
        );
    },

    // Assign quiz to classroom
    assignQuiz: async (data: AssignQuizRequest): Promise<LessonResponse> => {
        return await apiService.post<LessonResponse>(
            API_ENDPOINTS.lessons.assignQuiz,
            data
        );
    },

    // Delete lesson
    delete: async (lessonId: number | string): Promise<{ message: string }> => {
        return await apiService.delete<{ message: string }>(
            API_ENDPOINTS.lessons.delete(lessonId)
        );
    },

    // Get lessons by classroom
    getByClassroom: async (classroomId: number | string): Promise<LessonResponse[]> => {
        return await apiService.get<LessonResponse[]>(
            API_ENDPOINTS.lessons.getByClassroom(classroomId)
        );
    },

    // Get public lessons by classroom
    getByClassroomPublic: async (classroomId: number | string): Promise<LessonResponse[]> => {
        return await apiService.get<LessonResponse[]>(
            API_ENDPOINTS.lessons.getByClassroomPublic(classroomId)
        );
    },
};
