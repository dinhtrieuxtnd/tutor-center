import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
    fetchClassrooms,
    fetchMyClassrooms,
    fetchMyEnrollments,
    fetchClassroomById,
    createClassroom,
    updateClassroom,
    archiveClassroom,
    deleteClassroom,
    fetchClassroomStudents,
    removeStudentFromClassroom,
    clearError,
    clearCurrentClassroom,
    clearStudents,
    setPage,
    setPageSize,
} from "@/store/features/classroom/classroomSlice";
import {
    ClassroomQueryRequest,
    CreateClassroomRequest,
    UpdateClassroomRequest,
} from "@/services/classroomApi";

export const useClassroom = () => {
    const dispatch: AppDispatch = useDispatch();

    // Lấy state từ slice
    const {
        classrooms,
        myEnrollments,
        currentClassroom,
        students,
        total,
        page,
        pageSize,
        isLoading,
        isLoadingEnrollments,
        error,
    } = useSelector((state: RootState) => state.classroom);

    // Action handlers
    const handleFetchClassrooms = useCallback(
        (params?: ClassroomQueryRequest) => {
            return dispatch(fetchClassrooms(params));
        },
        [dispatch]
    );

    const handleFetchMyClassrooms = useCallback(() => {
        return dispatch(fetchMyClassrooms());
    }, [dispatch]);

    const handleFetchMyEnrollments = useCallback(() => {
        return dispatch(fetchMyEnrollments());
    }, [dispatch]);

    const handleFetchClassroomById = useCallback(
        (id: number | string) => {
            return dispatch(fetchClassroomById(id));
        },
        [dispatch]
    );

    const handleCreateClassroom = useCallback(
        (data: CreateClassroomRequest) => {
            return dispatch(createClassroom(data));
        },
        [dispatch]
    );

    const handleUpdateClassroom = useCallback(
        (id: number | string, data: UpdateClassroomRequest) => {
            return dispatch(updateClassroom({ id, data }));
        },
        [dispatch]
    );

    const handleArchiveClassroom = useCallback(
        (id: number | string) => {
            return dispatch(archiveClassroom(id));
        },
        [dispatch]
    );

    const handleDeleteClassroom = useCallback(
        (id: number | string) => {
            return dispatch(deleteClassroom(id));
        },
        [dispatch]
    );

    const handleFetchClassroomStudents = useCallback(
        (classroomId: number | string) => {
            return dispatch(fetchClassroomStudents(classroomId));
        },
        [dispatch]
    );

    const handleRemoveStudent = useCallback(
        (classroomId: number | string, studentId: number | string) => {
            return dispatch(removeStudentFromClassroom({ classroomId, studentId }));
        },
        [dispatch]
    );

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleClearCurrentClassroom = useCallback(() => {
        dispatch(clearCurrentClassroom());
    }, [dispatch]);

    const handleClearStudents = useCallback(() => {
        dispatch(clearStudents());
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
        classrooms,
        myEnrollments,
        currentClassroom,
        students,
        total,
        page,
        pageSize,
        isLoading,
        isLoadingEnrollments,
        error,

        // Actions
        fetchClassrooms: handleFetchClassrooms,
        fetchMyClassrooms: handleFetchMyClassrooms,
        fetchMyEnrollments: handleFetchMyEnrollments,
        fetchClassroomById: handleFetchClassroomById,
        createClassroom: handleCreateClassroom,
        updateClassroom: handleUpdateClassroom,
        archiveClassroom: handleArchiveClassroom,
        deleteClassroom: handleDeleteClassroom,
        fetchClassroomStudents: handleFetchClassroomStudents,
        removeStudent: handleRemoveStudent,
        clearError: handleClearError,
        clearCurrentClassroom: handleClearCurrentClassroom,
        clearStudents: handleClearStudents,
        setPage: handleSetPage,
        setPageSize: handleSetPageSize,
    };
};
