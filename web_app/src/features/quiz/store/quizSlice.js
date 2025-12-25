import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quizApi } from '../../../core/api/quizApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    quizzes: [],
    currentQuiz: null,
    currentQuizDetail: null,
    loading: false,
    quizDetailLoading: false,
    createLoading: false,
    updateLoading: false,
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
export const getAllQuizzesAsync = createAsyncThunk(
    'quiz/getAll',
    async (params, thunkAPI) => {
        return handleAsyncThunk(
            () => quizApi.getAll(params),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải danh sách bài kiểm tra',
            }
        );
    }
);

export const getQuizByIdAsync = createAsyncThunk(
    'quiz/getById',
    async (quizId, thunkAPI) => {
        return handleAsyncThunk(
            () => quizApi.getById(quizId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải thông tin bài kiểm tra',
            }
        );
    }
);

export const getQuizDetailAsync = createAsyncThunk(
    'quiz/getDetail',
    async (quizId, thunkAPI) => {
        return handleAsyncThunk(
            () => quizApi.getDetail(quizId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải chi tiết bài kiểm tra',
            }
        );
    }
);

export const getQuizForStudentAsync = createAsyncThunk(
    'quiz/getForStudent',
    async (lessonId, thunkAPI) => {
        return handleAsyncThunk(
            () => quizApi.getForStudent(lessonId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải bài kiểm tra',
            }
        );
    }
);

export const createQuizAsync = createAsyncThunk(
    'quiz/create',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => quizApi.create(data),
            thunkAPI,
            {
                successTitle: 'Tạo bài kiểm tra thành công',
                successMessage: `Bài kiểm tra "${data.title}" đã được tạo`,
                errorTitle: 'Tạo bài kiểm tra thất bại',
            }
        );
    }
);

export const updateQuizAsync = createAsyncThunk(
    'quiz/update',
    async ({ quizId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => quizApi.update(quizId, data),
            thunkAPI,
            {
                successTitle: 'Cập nhật bài kiểm tra thành công',
                successMessage: 'Thông tin bài kiểm tra đã được cập nhật',
                errorTitle: 'Cập nhật bài kiểm tra thất bại',
            }
        );
    }
);

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        clearCurrentQuiz: (state) => {
            state.currentQuiz = null;
            state.currentQuizDetail = null;
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
            // Get all quizzes
            .addCase(getAllQuizzesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllQuizzesAsync.fulfilled, (state, action) => {
                state.loading = false;
                const response = action.payload.data || action.payload;
                state.quizzes = response.items || [];
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
            .addCase(getAllQuizzesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get quiz by ID
            .addCase(getQuizByIdAsync.pending, (state) => {
                state.quizDetailLoading = true;
                state.error = null;
            })
            .addCase(getQuizByIdAsync.fulfilled, (state, action) => {
                state.quizDetailLoading = false;
                state.currentQuiz = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(getQuizByIdAsync.rejected, (state, action) => {
                state.quizDetailLoading = false;
                state.error = action.payload;
            })
            // Get quiz detail
            .addCase(getQuizDetailAsync.pending, (state) => {
                state.quizDetailLoading = true;
                state.error = null;
            })
            .addCase(getQuizDetailAsync.fulfilled, (state, action) => {
                state.quizDetailLoading = false;
                state.currentQuizDetail = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(getQuizDetailAsync.rejected, (state, action) => {
                state.quizDetailLoading = false;
                state.error = action.payload;
            })
            // Get quiz for student
            .addCase(getQuizForStudentAsync.pending, (state) => {
                state.quizDetailLoading = true;
                state.error = null;
            })
            .addCase(getQuizForStudentAsync.fulfilled, (state, action) => {
                state.quizDetailLoading = false;
                state.currentQuizDetail = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(getQuizForStudentAsync.rejected, (state, action) => {
                state.quizDetailLoading = false;
                state.error = action.payload;
            })
            // Create quiz
            .addCase(createQuizAsync.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createQuizAsync.fulfilled, (state, action) => {
                state.createLoading = false;
                state.error = null;
            })
            .addCase(createQuizAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })
            // Update quiz
            .addCase(updateQuizAsync.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateQuizAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedQuiz = action.payload.data || action.payload;

                // Update in quizzes list
                const index = state.quizzes.findIndex(q => q.quizId === updatedQuiz.quizId);
                if (index !== -1) {
                    state.quizzes[index] = updatedQuiz;
                }

                // Update current quiz if it's the same
                if (state.currentQuiz?.quizId === updatedQuiz.quizId) {
                    state.currentQuiz = updatedQuiz;
                }

                state.error = null;
            })
            .addCase(updateQuizAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentQuiz,
    clearError,
    setFilters,
    setPagination,
} = quizSlice.actions;

export default quizSlice.reducer;
