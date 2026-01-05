import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quizAnswerApi } from '../../../core/api/quizAnswerApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    answers: [],
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
};

// Async thunks
export const createQuizAnswerAsync = createAsyncThunk(
    'quizAnswer/create',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => quizAnswerApi.create(data),
            thunkAPI,
            {
                successTitle: 'Lưu câu trả lời thành công',
                successMessage: 'Câu trả lời đã được lưu',
                errorTitle: 'Lưu câu trả lời thất bại',
            }
        );
    }
);

export const updateQuizAnswerAsync = createAsyncThunk(
    'quizAnswer/update',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => quizAnswerApi.update(data),
            thunkAPI,
            {
                successTitle: 'Cập nhật câu trả lời thành công',
                successMessage: 'Câu trả lời đã được cập nhật',
                errorTitle: 'Cập nhật câu trả lời thất bại',
            }
        );
    }
);

export const deleteQuizAnswerAsync = createAsyncThunk(
    'quizAnswer/delete',
    async ({ attemptId, questionId }, thunkAPI) => {
        return handleAsyncThunk(
            () => quizAnswerApi.delete(attemptId, questionId),
            thunkAPI,
            {
                successTitle: 'Xóa câu trả lời thành công',
                successMessage: 'Câu trả lời đã được xóa',
                errorTitle: 'Xóa câu trả lời thất bại',
            }
        );
    }
);

// Slice
const quizAnswerSlice = createSlice({
    name: 'quizAnswer',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create quiz answer
            .addCase(createQuizAnswerAsync.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createQuizAnswerAsync.fulfilled, (state, action) => {
                state.createLoading = false;
            })
            .addCase(createQuizAnswerAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })

            // Update quiz answer
            .addCase(updateQuizAnswerAsync.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateQuizAnswerAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
            })
            .addCase(updateQuizAnswerAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })

            // Delete quiz answer
            .addCase(deleteQuizAnswerAsync.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteQuizAnswerAsync.fulfilled, (state, action) => {
                state.deleteLoading = false;
            })
            .addCase(deleteQuizAnswerAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = quizAnswerSlice.actions;
export default quizAnswerSlice.reducer;
