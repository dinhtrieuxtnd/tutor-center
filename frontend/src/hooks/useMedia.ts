import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
    fetchMediaList,
    fetchMediaById,
    fetchUserMedia,
    uploadMedia,
    updateMedia,
    deleteMedia,
    fetchPresignedUrl,
    clearError,
    clearCurrentMedia,
    clearUserMedia,
    setPage,
    setPageSize,
    setUploadProgress,
} from "@/store/features/media/mediaSlice";
import {
    mediaApi,
    ListMediaRequest,
    UploadMediaRequest,
    UpdateMediaRequest,
} from "@/services/mediaApi";

export const useMedia = () => {
    const dispatch: AppDispatch = useDispatch();

    // Lấy state từ slice
    const {
        mediaList,
        userMedia,
        currentMedia,
        total,
        page,
        pageSize,
        isLoading,
        isUploading,
        uploadProgress,
        error,
    } = useSelector((state: RootState) => state.media);

    // Action handlers
    const handleFetchMediaList = useCallback(
        (params?: ListMediaRequest) => {
            return dispatch(fetchMediaList(params));
        },
        [dispatch]
    );

    const handleFetchMediaById = useCallback(
        (id: number | string) => {
            return dispatch(fetchMediaById(id));
        },
        [dispatch]
    );

    const handleFetchUserMedia = useCallback(
        (userId: number | string) => {
            return dispatch(fetchUserMedia(userId));
        },
        [dispatch]
    );

    const handleUploadMedia = useCallback(
        async (data: UploadMediaRequest, onProgress?: (progress: number) => void) => {
            try {
                dispatch(setUploadProgress(0));
                const result = await mediaApi.upload(data, onProgress);
                return result;
            } catch (error) {
                console.error('Upload media error:', error);
                throw error;
            }
        },
        [dispatch]
    );

    const handleUpdateMedia = useCallback(
        (id: number | string, data: UpdateMediaRequest) => {
            return dispatch(updateMedia({ id, data }));
        },
        [dispatch]
    );

    const handleDeleteMedia = useCallback(
        (id: number | string) => {
            return dispatch(deleteMedia(id));
        },
        [dispatch]
    );

    const handleFetchPresignedUrl = useCallback(
        (mediaId: number | string, expirySeconds?: number) => {
            return dispatch(fetchPresignedUrl({ mediaId, expirySeconds }));
        },
        [dispatch]
    );

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleClearCurrentMedia = useCallback(() => {
        dispatch(clearCurrentMedia());
    }, [dispatch]);

    const handleClearUserMedia = useCallback(() => {
        dispatch(clearUserMedia());
    }, [dispatch]);

    const handleSetPage = useCallback(
        (newPage: number) => {
            dispatch(setPage(newPage));
        },
        [dispatch]
    );

    const handleSetPageSize = useCallback(
        (newPageSize: number) => {
            dispatch(setPageSize(newPageSize));
        },
        [dispatch]
    );

    const handleSetUploadProgress = useCallback(
        (progress: number) => {
            dispatch(setUploadProgress(progress));
        },
        [dispatch]
    );

    const handleDownloadMedia = useCallback(
        async (mediaId: number | string) => {
            try {
                const { blob, filename } = await mediaApi.download(mediaId);
                
                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                
                // Cleanup
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                return { success: true, filename };
            } catch (error) {
                console.error('Download media error:', error);
                throw error;
            }
        },
        []
    );

    return {
        // State
        mediaList,
        userMedia,
        currentMedia,
        total,
        page,
        pageSize,
        isLoading,
        isUploading,
        uploadProgress,
        error,

        // Actions
        fetchMediaList: handleFetchMediaList,
        fetchMediaById: handleFetchMediaById,
        fetchUserMedia: handleFetchUserMedia,
        uploadMedia: handleUploadMedia,
        downloadMedia: handleDownloadMedia,
        updateMedia: handleUpdateMedia,
        deleteMedia: handleDeleteMedia,
        fetchPresignedUrl: handleFetchPresignedUrl,
        clearError: handleClearError,
        clearCurrentMedia: handleClearCurrentMedia,
        clearUserMedia: handleClearUserMedia,
        setPage: handleSetPage,
        setPageSize: handleSetPageSize,
        setUploadProgress: handleSetUploadProgress,
    };
};
