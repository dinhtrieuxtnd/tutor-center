import { apiService } from "@/services";
import { API_ENDPOINTS } from "@/constants";

export interface MediaResponse {
    mediaId: number;
    disk: string;
    bucket: string | null;
    objectKey: string;
    mimeType: string | null;
    sizeBytes: number | null;
    visibility: string;
    uploadedBy: number | null;
    createdAt: string;
    uploadedByName: string | null;
    previewUrl: string | null;
}

export interface UploadMediaRequest {
    file: File;
    visibility?: 'public' | 'private';
}

export interface UpdateMediaRequest {
    visibility?: 'public' | 'private';
}

export interface ListMediaRequest {
    visibility?: 'public' | 'private';
    uploadedBy?: number;
    mimeType?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    pageSize?: number;
}

export interface ListMediaResponse {
    items: MediaResponse[];
    total: number;
    page: number;
    pageSize: number;
}

export interface PresignedUrlResponse {
    url: string;
    expirySeconds?: number;
    visibility?: string;
}

export const mediaApi = {
    // Upload media file
    upload: async (data: UploadMediaRequest, onProgress?: (progress: number) => void): Promise<MediaResponse> => {
        const formData = new FormData();
        formData.append('file', data.file);
        if (data.visibility) {
            formData.append('visibility', data.visibility);
        }
        
        return await apiService.uploadFile<MediaResponse>(
            API_ENDPOINTS.media.upload,
            data.file,
            onProgress
        );
    },

    // Get list of media files with filters and pagination
    getList: async (params?: ListMediaRequest): Promise<ListMediaResponse> => {
        const queryString = new URLSearchParams();
        if (params?.visibility) queryString.append('Visibility', params.visibility);
        if (params?.uploadedBy) queryString.append('UploadedBy', params.uploadedBy.toString());
        if (params?.mimeType) queryString.append('MimeType', params.mimeType);
        if (params?.fromDate) queryString.append('FromDate', params.fromDate);
        if (params?.toDate) queryString.append('ToDate', params.toDate);
        if (params?.page) queryString.append('Page', params.page.toString());
        if (params?.pageSize) queryString.append('PageSize', params.pageSize.toString());
        
        const url = `${API_ENDPOINTS.media.getAll}${queryString.toString() ? `?${queryString}` : ''}`;
        return await apiService.get<ListMediaResponse>(url);
    },

    // Get media by ID
    getById: async (mediaId: number | string): Promise<MediaResponse> => {
        return await apiService.get<MediaResponse>(
            API_ENDPOINTS.media.getById(mediaId)
        );
    },

    // Update media visibility
    update: async (mediaId: number | string, data: UpdateMediaRequest): Promise<MediaResponse> => {
        return await apiService.patch<MediaResponse>(
            API_ENDPOINTS.media.update(mediaId),
            data
        );
    },

    // Delete media (soft delete)
    delete: async (mediaId: number | string): Promise<{ message: string }> => {
        return await apiService.delete<{ message: string }>(
            API_ENDPOINTS.media.delete(mediaId)
        );
    },

    // Get media by user ID
    getByUser: async (userId: number | string): Promise<MediaResponse[]> => {
        return await apiService.get<MediaResponse[]>(
            API_ENDPOINTS.media.getByUser(userId)
        );
    },

    // Get presigned URL for media download
    getPresigned: async (mediaId: number | string, expirySeconds: number = 900): Promise<PresignedUrlResponse> => {
        const url = `${API_ENDPOINTS.media.getPresigned(mediaId)}?expirySeconds=${expirySeconds}`;
        return await apiService.get<PresignedUrlResponse>(url);
    },
};
