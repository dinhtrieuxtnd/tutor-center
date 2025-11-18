import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
    createJoinRequest,
    fetchMyJoinRequests,
    fetchClassroomJoinRequests,
    updateJoinRequestStatus,
    clearError,
    clearCurrentRequest,
    clearClassroomRequests,
} from "@/store/features/joinRequest/joinRequestSlice";
import {
    CreateJoinRequestRequest,
    UpdateJoinRequestStatusRequest,
} from "@/services/joinRequestApi";

export const useJoinRequest = () => {
    const dispatch: AppDispatch = useDispatch();

    // Lấy state từ slice
    const {
        myRequests,
        classroomRequests,
        currentRequest,
        isLoading,
        isLoadingClassroomRequests,
        error,
    } = useSelector((state: RootState) => state.joinRequest);

    // Action handlers
    const handleCreateJoinRequest = useCallback(
        (data: CreateJoinRequestRequest) => {
            return dispatch(createJoinRequest(data));
        },
        [dispatch]
    );

    const handleFetchMyJoinRequests = useCallback(() => {
        return dispatch(fetchMyJoinRequests());
    }, [dispatch]);

    const handleFetchClassroomJoinRequests = useCallback(
        (classroomId: number | string) => {
            return dispatch(fetchClassroomJoinRequests(classroomId));
        },
        [dispatch]
    );

    const handleUpdateJoinRequestStatus = useCallback(
        (joinRequestId: number | string, data: UpdateJoinRequestStatusRequest) => {
            return dispatch(updateJoinRequestStatus({ joinRequestId, data }));
        },
        [dispatch]
    );

    const handleClearError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleClearCurrentRequest = useCallback(() => {
        dispatch(clearCurrentRequest());
    }, [dispatch]);

    const handleClearClassroomRequests = useCallback(() => {
        dispatch(clearClassroomRequests());
    }, [dispatch]);

    return {
        // State
        myRequests,
        classroomRequests,
        currentRequest,
        isLoading,
        isLoadingClassroomRequests,
        error,

        // Actions
        createJoinRequest: handleCreateJoinRequest,
        fetchMyJoinRequests: handleFetchMyJoinRequests,
        fetchClassroomJoinRequests: handleFetchClassroomJoinRequests,
        updateJoinRequestStatus: handleUpdateJoinRequestStatus,
        clearError: handleClearError,
        clearCurrentRequest: handleClearCurrentRequest,
        clearClassroomRequests: handleClearClassroomRequests,
    };
};
