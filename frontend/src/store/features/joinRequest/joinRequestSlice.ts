import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { joinRequestApi } from "@/services";
import {
    JoinRequestResponse,
    CreateJoinRequestRequest,
    UpdateJoinRequestStatusRequest,
} from "@/services/joinRequestApi";

export interface JoinRequestState {
    myRequests: JoinRequestResponse[];
    classroomRequests: JoinRequestResponse[];
    currentRequest: JoinRequestResponse | null;
    isLoading: boolean;
    isLoadingClassroomRequests: boolean;
    error: string | null;
}

const initialState: JoinRequestState = {
    myRequests: [],
    classroomRequests: [],
    currentRequest: null,
    isLoading: false,
    isLoadingClassroomRequests: false,
    error: null,
};

// Async Thunks

// Student: Create new join request
export const createJoinRequest = createAsyncThunk<
    JoinRequestResponse,
    CreateJoinRequestRequest
>(
    "joinRequest/createJoinRequest",
    async (data, { rejectWithValue }) => {
        try {
            const response = await joinRequestApi.create(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể gửi yêu cầu tham gia");
        }
    }
);

// Student: Get my join requests
export const fetchMyJoinRequests = createAsyncThunk<JoinRequestResponse[]>(
    "joinRequest/fetchMyJoinRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await joinRequestApi.getMy();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải danh sách yêu cầu của bạn");
        }
    }
);

// Tutor: Get join requests for a classroom
export const fetchClassroomJoinRequests = createAsyncThunk<
    JoinRequestResponse[],
    number | string
>(
    "joinRequest/fetchClassroomJoinRequests",
    async (classroomId, { rejectWithValue }) => {
        try {
            const response = await joinRequestApi.getByClassroom(classroomId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải danh sách yêu cầu tham gia");
        }
    }
);

// Tutor: Update join request status
export const updateJoinRequestStatus = createAsyncThunk<
    { joinRequestId: number | string; status: 'approved' | 'rejected' },
    { joinRequestId: number | string; data: UpdateJoinRequestStatusRequest }
>(
    "joinRequest/updateJoinRequestStatus",
    async ({ joinRequestId, data }, { rejectWithValue }) => {
        try {
            await joinRequestApi.updateStatus(joinRequestId, data);
            return { joinRequestId, status: data.status };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể cập nhật trạng thái yêu cầu");
        }
    }
);

// Slice
const joinRequestSlice = createSlice({
    name: "joinRequest",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentRequest: (state) => {
            state.currentRequest = null;
        },
        clearClassroomRequests: (state) => {
            state.classroomRequests = [];
        },
    },
    extraReducers: (builder) => {
        // Create join request
        builder
            .addCase(createJoinRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createJoinRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                // Cập nhật hoặc thêm mới vào myRequests
                const existingIndex = state.myRequests.findIndex(
                    (r) => r.classroomId === action.payload.classroomId
                );
                if (existingIndex !== -1) {
                    state.myRequests[existingIndex] = action.payload;
                } else {
                    state.myRequests.unshift(action.payload);
                }
            })
            .addCase(createJoinRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch my join requests
        builder
            .addCase(fetchMyJoinRequests.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyJoinRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myRequests = action.payload;
                console.log('Fetched myRequests:', action.payload);
            })
            .addCase(fetchMyJoinRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch classroom join requests
        builder
            .addCase(fetchClassroomJoinRequests.pending, (state) => {
                state.isLoadingClassroomRequests = true;
                state.error = null;
            })
            .addCase(fetchClassroomJoinRequests.fulfilled, (state, action) => {
                state.isLoadingClassroomRequests = false;
                state.classroomRequests = action.payload;
            })
            .addCase(fetchClassroomJoinRequests.rejected, (state, action) => {
                state.isLoadingClassroomRequests = false;
                state.error = action.payload as string;
            });

        // Update join request status
        builder
            .addCase(updateJoinRequestStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateJoinRequestStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                // Cập nhật status trong classroomRequests
                const requestIndex = state.classroomRequests.findIndex(
                    (r) => r.joinRequestId === action.payload.joinRequestId
                );
                if (requestIndex !== -1) {
                    state.classroomRequests[requestIndex].status = action.payload.status;
                    state.classroomRequests[requestIndex].handledAt = new Date().toISOString();
                }
            })
            .addCase(updateJoinRequestStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearError,
    clearCurrentRequest,
    clearClassroomRequests,
} = joinRequestSlice.actions;

export default joinRequestSlice.reducer;
