import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import { ApiResponse } from "@/types";

export interface MediaResponse {
    mediaId: number;
    userId: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadedAt: string;
}

export interface UpdateMediaRequest {
    fileName?: string;
}

export interface PresignedUrlResponse {
    presignedUrl: string;
    expiresAt: string;
}

export const mediaApi = {
    // Upload media file
    upload: async (file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<MediaResponse>> => {
        return await apiService.uploadFile<ApiResponse<MediaResponse>>(
            API_ENDPOINTS.media.upload,
            file,
            onProgress
        );
    },

    // Get all media files
    getAll: async (): Promise<ApiResponse<MediaResponse[]>> => {
        return await apiService.get<ApiResponse<MediaResponse[]>>(
            API_ENDPOINTS.media.getAll
        );
    },

    // Get media by ID
    getById: async (mediaId: number | string): Promise<ApiResponse<MediaResponse>> => {
        return await apiService.get<ApiResponse<MediaResponse>>(
            API_ENDPOINTS.media.getById(mediaId)
        );
    },

    // Update media
    update: async (mediaId: number | string, data: UpdateMediaRequest): Promise<ApiResponse<MediaResponse>> => {
        return await apiService.patch<ApiResponse<MediaResponse>>(
            API_ENDPOINTS.media.update(mediaId),
            data
        );
    },

    // Delete media
    delete: async (mediaId: number | string): Promise<ApiResponse<any>> => {
        return await apiService.delete<ApiResponse<any>>(
            API_ENDPOINTS.media.delete(mediaId)
        );
    },

    // Get media by user ID
    getByUser: async (userId: number | string): Promise<ApiResponse<MediaResponse[]>> => {
        return await apiService.get<ApiResponse<MediaResponse[]>>(
            API_ENDPOINTS.media.getByUser(userId)
        );
    },

    // Get presigned URL for media
    getPresigned: async (mediaId: number | string): Promise<ApiResponse<PresignedUrlResponse>> => {
        return await apiService.get<ApiResponse<PresignedUrlResponse>>(
            API_ENDPOINTS.media.getPresigned(mediaId)
        );
    },
};
