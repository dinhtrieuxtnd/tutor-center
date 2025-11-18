import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
    fetchLectures,
    fetchLectureById,
    createLecture,
    updateLecture,
    deleteLecture,
    clearError,
    clearCurrentLecture,
    setPage,
    setPageSize,
} from "@/store/features/lecture/lectureSlice";
import {
    LectureQueryRequest,
    CreateLectureRequest,
    UpdateLectureRequest,
} from "@/services/lectureApi";

export const useLecture = () => {
    const dispatch: AppDispatch = useDispatch();

    // Lấy state từ slice
    const {
        lectures,
        currentLecture,
        total,
        page,
        pageSize,
        isLoading,
        error,
    } = useSelector((state: RootState) => state.lecture);

    // Action handlers
    const handleFetchLectures = useCallback(
        (params?: LectureQueryRequest) => {
            return dispatch(fetchLectures(params));
        },
        [dispatch]
    );

    const handleFetchLectureById = useCallback(
        (id: number | string) => {
            return dispatch(fetchLectureById(id));
        },
        [dispatch]
    );

    const handleCreateLecture = useCallback(
        (data: CreateLectureRequest) => {
            return dispatch(createLecture(data));
        },
        [dispatch]
    );

    const handleUpdateLecture = useCallback(
        (id: number | string, data: UpdateLectureRequest) => {
            return dispatch(updateLecture({ id, data }));
        },
        [dispatch]
    );

    const handleDeleteLecture = useCallback(
        (id: number | string) => {
            return dispatch(deleteLecture(id));
        },
        [dispatch]
    );

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleClearCurrentLecture = useCallback(() => {
        dispatch(clearCurrentLecture());
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

    return {
        // State
        lectures,
        currentLecture,
        total,
        page,
        pageSize,
        isLoading,
        error,

        // Actions
        fetchLectures: handleFetchLectures,
        fetchLectureById: handleFetchLectureById,
        createLecture: handleCreateLecture,
        updateLecture: handleUpdateLecture,
        deleteLecture: handleDeleteLecture,
        clearError: handleClearError,
        clearCurrentLecture: handleClearCurrentLecture,
        setPage: handleSetPage,
        setPageSize: handleSetPageSize,
    };
};
