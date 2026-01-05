import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quizAttemptApi } from '../../../core/api/quizAttemptApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    attempts: [],
    currentAttempt: null,
    loading: false,
    createLoading: false,
    error: null,
};

// Async thunks
export const createQuizAttemptAsync = createAsyncThunk(
    'quizAttempt/create',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => quizAttemptApi.create(data),
            thunkAPI,
            {
                successTitle: 'Bắt đầu làm bài',
                successMessage: 'Bài kiểm tra đã được khởi tạo',
                errorTitle: 'Không thể bắt đầu làm bài',
            }
        );
    }
);

export const getQuizAttemptByLessonAndStudentAsync = createAsyncThunk(
    'quizAttempt/getByLessonAndStudent',
    async (lessonId, thunkAPI) => {
        return handleAsyncThunk(
            () => quizAttemptApi.getByLessonAndStudent(lessonId),
            thunkAPI,
            {
                successTitle: null, // Silent success
                errorTitle: 'Lấy thông tin bài làm thất bại',
            }
        );
    }
);

export const getQuizAttemptsByLessonAsync = createAsyncThunk(
    'quizAttempt/getByLesson',
    async (lessonId, thunkAPI) => {
        return handleAsyncThunk(
            () => quizAttemptApi.getByLesson(lessonId),
            thunkAPI,
            {
                successTitle: null, // Silent success
                errorTitle: 'Lấy danh sách bài làm thất bại',
            }
        );
    }
);

// Slice
const quizAttemptSlice = createSlice({
    name: 'quizAttempt',
    initialState,
    reducers: {
        clearCurrentAttempt: (state) => {
            state.currentAttempt = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create quiz attempt
            .addCase(createQuizAttemptAsync.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createQuizAttemptAsync.fulfilled, (state, action) => {
                state.createLoading = false;
                state.currentAttempt = action.payload;
            })
            .addCase(createQuizAttemptAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })

            // Get quiz attempt by lesson and student
            .addCase(getQuizAttemptByLessonAndStudentAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuizAttemptByLessonAndStudentAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAttempt = action.payload;
            })
            .addCase(getQuizAttemptByLessonAndStudentAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get quiz attempts by lesson (for tutors)
            .addCase(getQuizAttemptsByLessonAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuizAttemptsByLessonAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.attempts = action.payload;
            })
            .addCase(getQuizAttemptsByLessonAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentAttempt, clearError } = quizAttemptSlice.actions;
export default quizAttemptSlice.reducer;
