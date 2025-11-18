import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { lectureApi } from "@/services";
import {
    LectureResponse,
    LectureQueryRequest,
    CreateLectureRequest,
    UpdateLectureRequest,
} from "@/services/lectureApi";

export interface LectureState {
    lectures: LectureResponse[];
    currentLecture: LectureResponse | null;
    total: number;
    page: number;
    pageSize: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: LectureState = {
    lectures: [],
    currentLecture: null,
    total: 0,
    page: 1,
    pageSize: 20,
    isLoading: false,
    error: null,
};

// Async Thunks
export const fetchLectures = createAsyncThunk<
    { items: LectureResponse[]; total: number; page: number; pageSize: number },
    LectureQueryRequest | undefined
>(
    "lecture/fetchLectures",
    async (params, { rejectWithValue }) => {
        try {
            const response = await lectureApi.query(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải danh sách bài giảng");
        }
    }
);

export const fetchLectureById = createAsyncThunk<LectureResponse, number | string>(
    "lecture/fetchLectureById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await lectureApi.getById(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tải thông tin bài giảng");
        }
    }
);

export const createLecture = createAsyncThunk<
    LectureResponse,
    CreateLectureRequest
>(
    "lecture/createLecture",
    async (data, { rejectWithValue }) => {
        try {
            const response = await lectureApi.create(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể tạo bài giảng");
        }
    }
);

export const updateLecture = createAsyncThunk<
    { id: number | string; data: UpdateLectureRequest },
    { id: number | string; data: UpdateLectureRequest }
>(
    "lecture/updateLecture",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            await lectureApi.update(id, data);
            return { id, data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể cập nhật bài giảng");
        }
    }
);

export const deleteLecture = createAsyncThunk<number | string, number | string>(
    "lecture/deleteLecture",
    async (id, { rejectWithValue }) => {
        try {
            await lectureApi.delete(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Không thể xóa bài giảng");
        }
    }
);

// Slice
const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentLecture: (state) => {
            state.currentLecture = null;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch lectures
        builder
            .addCase(fetchLectures.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLectures.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lectures = action.payload.items;
                state.total = action.payload.total;
                state.page = action.payload.page;
                state.pageSize = action.payload.pageSize;
            })
            .addCase(fetchLectures.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch lecture by ID
        builder
            .addCase(fetchLectureById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLectureById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentLecture = action.payload;
            })
            .addCase(fetchLectureById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create lecture
        builder
            .addCase(createLecture.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createLecture.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lectures.unshift(action.payload);
                state.total += 1;
            })
            .addCase(createLecture.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update lecture
        builder
            .addCase(updateLecture.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateLecture.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.lectures.findIndex(
                    (l) => l.lectureId === action.payload.id
                );
                if (index !== -1) {
                    state.lectures[index] = {
                        ...state.lectures[index],
                        ...action.payload.data,
                    };
                }
                if (state.currentLecture?.lectureId === action.payload.id) {
                    state.currentLecture = {
                        ...state.currentLecture,
                        ...action.payload.data,
                    };
                }
            })
            .addCase(updateLecture.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Delete lecture
        builder
            .addCase(deleteLecture.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteLecture.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lectures = state.lectures.filter(
                    (l) => l.lectureId !== action.payload
                );
                state.total -= 1;
                if (state.currentLecture?.lectureId === action.payload) {
                    state.currentLecture = null;
                }
            })
            .addCase(deleteLecture.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    clearError,
    clearCurrentLecture,
    setPage,
    setPageSize,
} = lectureSlice.actions;

export default lectureSlice.reducer;
