import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface LectureResponse {
    lectureId: number;
    parentId: number | null;
    title: string;
    content: string | null;
    mediaId: number | null;
    uploadedAt: string;
    uploadedBy: number;
    uploadedByName: string;
    updatedAt: string;
    children: LectureResponse[];
}

export interface CreateLectureRequest {
    parentId?: number | null;
    title: string;
    content?: string | null;
    mediaId?: number | null;
}

export interface UpdateLectureRequest {
    parentId?: number | null;
    title: string;
    content?: string | null;
    mediaId?: number | null;
}

export interface LectureQueryResponse {
    items: LectureResponse[];
    total: number;
    page: number;
    pageSize: number;
}

export interface LectureQueryRequest {
    q?: string;
    page?: number;
    pageSize?: number;
}

export const lectureApi = {
    // Get all lectures (Query with pagination)
    query: async (params?: LectureQueryRequest): Promise<LectureQueryResponse> => {
        const queryString = new URLSearchParams();
        if (params?.q) queryString.append('Q', params.q);
        if (params?.page) queryString.append('Page', params.page.toString());
        if (params?.pageSize) queryString.append('PageSize', params.pageSize.toString());
        
        const url = `${API_ENDPOINTS.lectures.getAll}${queryString.toString() ? `?${queryString}` : ''}`;
        return await apiService.get<LectureQueryResponse>(url);
    },

    // Create new lecture
    create: async (data: CreateLectureRequest): Promise<LectureResponse> => {
        return await apiService.post<LectureResponse>(
            API_ENDPOINTS.lectures.create,
            data
        );
    },

    // Get lecture by ID
    getById: async (id: number | string): Promise<LectureResponse> => {
        return await apiService.get<LectureResponse>(
            API_ENDPOINTS.lectures.getById(id)
        );
    },

    // Update lecture
    update: async (id: number | string, data: UpdateLectureRequest): Promise<{ message: string }> => {
        return await apiService.put<{ message: string }>(
            API_ENDPOINTS.lectures.update(id),
            data
        );
    },

    // Delete lecture
    delete: async (id: number | string): Promise<{ message: string }> => {
        return await apiService.delete<{ message: string }>(
            API_ENDPOINTS.lectures.delete(id)
        );
    },
};
