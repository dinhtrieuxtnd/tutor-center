import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { exerciseApi } from '../../../core/api/exerciseApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    exercises: [],
    currentExercise: null,
    loading: false,
    exerciseDetailLoading: false,
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
export const getAllExercisesAsync = createAsyncThunk(
    'exercise/getAll',
    async (params, thunkAPI) => {
        return handleAsyncThunk(
            () => exerciseApi.getAll(params),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải danh sách bài tập',
            }
        );
    }
);

export const getExerciseByIdAsync = createAsyncThunk(
    'exercise/getById',
    async (exerciseId, thunkAPI) => {
        return handleAsyncThunk(
            () => exerciseApi.getById(exerciseId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải thông tin bài tập',
            }
        );
    }
);

export const createExerciseAsync = createAsyncThunk(
    'exercise/create',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => exerciseApi.create(data),
            thunkAPI,
            {
                successTitle: 'Tạo bài tập thành công',
                successMessage: `Bài tập "${data.title}" đã được tạo`,
                errorTitle: 'Tạo bài tập thất bại',
            }
        );
    }
);

export const updateExerciseAsync = createAsyncThunk(
    'exercise/update',
    async ({ exerciseId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => exerciseApi.update(exerciseId, data),
            thunkAPI,
            {
                successTitle: 'Cập nhật bài tập thành công',
                successMessage: 'Thông tin bài tập đã được cập nhật',
                errorTitle: 'Cập nhật bài tập thất bại',
            }
        );
    }
);

export const deleteExerciseAsync = createAsyncThunk(
    'exercise/delete',
    async (exerciseId, thunkAPI) => {
        return handleAsyncThunk(
            () => exerciseApi.delete(exerciseId),
            thunkAPI,
            {
                successTitle: 'Xóa bài tập thành công',
                successMessage: 'Bài tập đã được xóa',
                errorTitle: 'Xóa bài tập thất bại',
            }
        );
    }
);

const exerciseSlice = createSlice({
    name: 'exercise',
    initialState,
    reducers: {
        clearCurrentExercise: (state) => {
            state.currentExercise = null;
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
            // Get all exercises
            .addCase(getAllExercisesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllExercisesAsync.fulfilled, (state, action) => {
                state.loading = false;
                const response = action.payload.data || action.payload;
                state.exercises = response.items || [];
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
            .addCase(getAllExercisesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get exercise by ID
            .addCase(getExerciseByIdAsync.pending, (state) => {
                state.exerciseDetailLoading = true;
                state.error = null;
            })
            .addCase(getExerciseByIdAsync.fulfilled, (state, action) => {
                state.exerciseDetailLoading = false;
                state.currentExercise = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(getExerciseByIdAsync.rejected, (state, action) => {
                state.exerciseDetailLoading = false;
                state.error = action.payload;
            })
            // Create exercise
            .addCase(createExerciseAsync.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createExerciseAsync.fulfilled, (state, action) => {
                state.createLoading = false;
                state.error = null;
            })
            .addCase(createExerciseAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })
            // Update exercise
            .addCase(updateExerciseAsync.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateExerciseAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedExercise = action.payload.data || action.payload;

                // Update in exercises list
                const index = state.exercises.findIndex(e => e.exerciseId === updatedExercise.exerciseId);
                if (index !== -1) {
                    state.exercises[index] = updatedExercise;
                }

                // Update current exercise if it's the same
                if (state.currentExercise?.exerciseId === updatedExercise.exerciseId) {
                    state.currentExercise = updatedExercise;
                }

                state.error = null;
            })
            .addCase(updateExerciseAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })
            // Delete exercise
            .addCase(deleteExerciseAsync.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteExerciseAsync.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.error = null;
            })
            .addCase(deleteExerciseAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentExercise,
    clearError,
    setFilters,
    setPagination,
} = exerciseSlice.actions;

export default exerciseSlice.reducer;
