import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface ClassroomResponse {
    classroomId: number;
    name: string;
    description?: string;
    tutorId: number;
    tutorName: string;
    isArchived: boolean;
    studentCount: number;
    price: number;
    coverMediaId?: number;
    createdAt: string;
}

export interface ClassroomQueryRequest {
    q?: string;
    tutorId?: number;
    isArchived?: boolean;
    page?: number;
    pageSize?: number;
}

export interface CreateClassroomRequest {
    name: string;
    description?: string;
    tutorId: number;
    coverMediaId?: number;
    price: number;
}

export interface UpdateClassroomRequest {
    name?: string;
    description?: string;
    coverMediaId?: number;
    isArchived?: boolean;
    price?: number;
}

export interface ClassroomStudentResponse {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ClassroomQueryResponse {
    items: ClassroomResponse[];
    total: number;
    page: number;
    pageSize: number;
}

export const classroomApi = {
    // Admin, Student: Query classrooms with filters (GET /api/Classrooms)
    query: async (params?: ClassroomQueryRequest): Promise<ClassroomQueryResponse> => {
        const queryString = new URLSearchParams();
        if (params?.q) queryString.append('Q', params.q);
        if (params?.tutorId) queryString.append('TutorId', params.tutorId.toString());
        if (params?.isArchived !== undefined) queryString.append('IsArchived', params.isArchived.toString());
        if (params?.page) queryString.append('Page', params.page.toString());
        if (params?.pageSize) queryString.append('PageSize', params.pageSize.toString());
        
        const url = `${API_ENDPOINTS.classrooms.getAll}${queryString.toString() ? `?${queryString}` : ''}`;
        return await apiService.get<ClassroomQueryResponse>(url);
    },

    // Admin: Create new classroom (POST /api/Classrooms)
    create: async (data: CreateClassroomRequest): Promise<ApiResponse<ClassroomResponse>> => {
        return await apiService.post<ApiResponse<ClassroomResponse>>(
            API_ENDPOINTS.classrooms.create,
            data
        );
    },

    // Tutor: Get my classrooms (GET /api/Classrooms/my-classrooms)
    getMyClassrooms: async (): Promise<ClassroomQueryResponse> => {
        return await apiService.get<ClassroomQueryResponse>(
            API_ENDPOINTS.classrooms.myClassrooms
        );
    },

    // Student: Get my enrollments (GET /api/Classrooms/my-enrollments)
    getMyEnrollments: async (): Promise<ClassroomResponse[]> => {
        return await apiService.get<ClassroomResponse[]>(
            API_ENDPOINTS.classrooms.myEnrollments
        );
    },

    // Admin, Tutor, Student: Get classroom by ID (GET /api/Classrooms/:id)
    getById: async (id: number | string): Promise<ClassroomResponse> => {
        return await apiService.get<ClassroomResponse>(
            API_ENDPOINTS.classrooms.getById(id)
        );
    },

    // Admin: Update classroom (PUT /api/Classrooms/:id)
    update: async (id: number | string, data: UpdateClassroomRequest): Promise<void> => {
        return await apiService.put<void>(
            API_ENDPOINTS.classrooms.update(id),
            data
        );
    },

    // Admin: Archive classroom (POST /api/Classrooms/:id/archive)
    archive: async (id: number | string): Promise<ApiResponse<{ message: string }>> => {
        return await apiService.post<ApiResponse<{ message: string }>>(
            API_ENDPOINTS.classrooms.archive(id)
        );
    },

    // Admin: Soft delete classroom (DELETE /api/Classrooms/:id)
    delete: async (id: number | string): Promise<void> => {
        return await apiService.delete<void>(
            API_ENDPOINTS.classrooms.delete(id)
        );
    },

    // Tutor: Get all students in classroom (GET /api/Classrooms/:id/students)
    getStudents: async (classroomId: number | string): Promise<ClassroomStudentResponse[]> => {
        return await apiService.get<ClassroomStudentResponse[]>(
            API_ENDPOINTS.classrooms.students.getAll(classroomId)
        );
    },

    // Tutor: Remove student from classroom (DELETE /api/Classrooms/:id/students/:studentId)
    removeStudent: async (classroomId: number | string, studentId: number | string): Promise<void> => {
        return await apiService.delete<void>(
            API_ENDPOINTS.classrooms.students.remove(classroomId, studentId)
        );
    },
};
