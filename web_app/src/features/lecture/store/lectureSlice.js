import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { lectureApi } from '../../../core/api/lectureApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    lectures: [],
    currentLecture: null,
    loading: false,
    lectureDetailLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
    // Server-side pagination
    pagination: {
        pageNumber: 1,
        pageSize: 20,
        totalPages: 0,
        totalCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
    },
    // Filters
    filters: {
        searchTerm: '',
        status: null,
    },
};

// Async thunks
export const getAllLecturesAsync = createAsyncThunk(
    'lecture/getAll',
    async (params, thunkAPI) => {
        return handleAsyncThunk(
            () => lectureApi.getAll(params),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải danh sách bài giảng',
            }
        );
    }
);

export const getLectureByIdAsync = createAsyncThunk(
    'lecture/getById',
    async (lectureId, thunkAPI) => {
        return handleAsyncThunk(
            () => lectureApi.getById(lectureId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải thông tin bài giảng',
            }
        );
    }
);

export const createLectureAsync = createAsyncThunk(
    'lecture/create',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => lectureApi.create(data),
            thunkAPI,
            {
                successTitle: 'Tạo bài giảng thành công',
                successMessage: `Bài giảng "${data.title}" đã được tạo`,
                errorTitle: 'Tạo bài giảng thất bại',
            }
        );
    }
);

export const updateLectureAsync = createAsyncThunk(
    'lecture/update',
    async ({ lectureId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => lectureApi.update(lectureId, data),
            thunkAPI,
            {
                successTitle: 'Cập nhật bài giảng thành công',
                successMessage: 'Thông tin bài giảng đã được cập nhật',
                errorTitle: 'Cập nhật bài giảng thất bại',
            }
        );
    }
);

export const deleteLectureAsync = createAsyncThunk(
    'lecture/delete',
    async (lectureId, thunkAPI) => {
        return handleAsyncThunk(
            () => lectureApi.delete(lectureId),
            thunkAPI,
            {
                successTitle: 'Xóa bài giảng thành công',
                successMessage: 'Bài giảng đã được xóa',
                errorTitle: 'Xóa bài giảng thất bại',
            }
        );
    }
);

const lectureSlice = createSlice({
    name: 'lecture',
    initialState,
    reducers: {
        clearCurrentLecture: (state) => {
            state.currentLecture = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.pageNumber = 1; // Reset to first page when filters change
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all lectures
            .addCase(getAllLecturesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllLecturesAsync.fulfilled, (state, action) => {
                state.loading = false;
                const response = action.payload.data || action.payload;
                state.lectures = response.items || [];
                state.pagination = {
                    pageNumber: response.pageNumber || 1,
                    pageSize: response.pageSize || 20,
                    totalPages: response.totalPages || 0,
                    totalCount: response.totalCount || 0,
                    hasPreviousPage: response.hasPreviousPage || false,
                    hasNextPage: response.hasNextPage || false,
                };
                state.error = null;
            })
            .addCase(getAllLecturesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get lecture by ID
            .addCase(getLectureByIdAsync.pending, (state) => {
                state.lectureDetailLoading = true;
                state.error = null;
            })
            .addCase(getLectureByIdAsync.fulfilled, (state, action) => {
                state.lectureDetailLoading = false;
                state.currentLecture = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(getLectureByIdAsync.rejected, (state, action) => {
                state.lectureDetailLoading = false;
                state.error = action.payload;
            })
            // Create lecture
            .addCase(createLectureAsync.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createLectureAsync.fulfilled, (state, action) => {
                state.createLoading = false;
                state.error = null;
            })
            .addCase(createLectureAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })
            // Update lecture
            .addCase(updateLectureAsync.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateLectureAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedLecture = action.payload.data || action.payload;

                // Update in lectures list
                const index = state.lectures.findIndex(l => l.lectureId === updatedLecture.lectureId);
                if (index !== -1) {
                    state.lectures[index] = updatedLecture;
                }

                // Update current lecture if it's the same
                if (state.currentLecture?.lectureId === updatedLecture.lectureId) {
                    state.currentLecture = updatedLecture;
                }

                state.error = null;
            })
            .addCase(updateLectureAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })
            // Delete lecture
            .addCase(deleteLectureAsync.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteLectureAsync.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.error = null;
            })
            .addCase(deleteLectureAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentLecture,
    clearError,
    setFilters,
    setPagination,
} = lectureSlice.actions;

export default lectureSlice.reducer;
