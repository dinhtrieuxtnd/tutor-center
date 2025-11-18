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
        (data: UploadMediaRequest) => {
            return dispatch(uploadMedia(data));
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
