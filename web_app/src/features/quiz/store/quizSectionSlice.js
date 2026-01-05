import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quizSectionApi } from '../../../core/api/quizSectionApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    quizSections: [],
    currentQuizSection: null,
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
};

// Async thunks
export const createQuizSectionAsync = createAsyncThunk(
    'quizSection/create',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => quizSectionApi.create(data),
            thunkAPI,
            {
                successTitle: 'Tạo phần thi thành công',
                successMessage: 'Phần thi đã được thêm vào bài kiểm tra',
                errorTitle: 'Tạo phần thi thất bại',
            }
        );
    }
);

export const updateQuizSectionAsync = createAsyncThunk(
    'quizSection/update',
    async ({ quizSectionId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => quizSectionApi.update(quizSectionId, data),
            thunkAPI,
            {
                successTitle: 'Cập nhật phần thi thành công',
                successMessage: 'Thông tin phần thi đã được cập nhật',
                errorTitle: 'Cập nhật phần thi thất bại',
            }
        );
    }
);

export const deleteQuizSectionAsync = createAsyncThunk(
    'quizSection/delete',
    async (quizSectionId, thunkAPI) => {
        return handleAsyncThunk(
            () => quizSectionApi.delete(quizSectionId),
            thunkAPI,
            {
                successTitle: 'Xóa phần thi thành công',
                successMessage: 'Phần thi đã được xóa khỏi bài kiểm tra',
                errorTitle: 'Xóa phần thi thất bại',
            }
        );
    }
);

const quizSectionSlice = createSlice({
    name: 'quizSection',
    initialState,
    reducers: {
        clearCurrentQuizSection: (state) => {
            state.currentQuizSection = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setCurrentQuizSection: (state, action) => {
            state.currentQuizSection = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create quiz section
            .addCase(createQuizSectionAsync.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createQuizSectionAsync.fulfilled, (state, action) => {
                state.createLoading = false;
                const newQuizSection = action.payload.data || action.payload;
                state.quizSections.push(newQuizSection);
                state.error = null;
            })
            .addCase(createQuizSectionAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })
            // Update quiz section
            .addCase(updateQuizSectionAsync.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateQuizSectionAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedQuizSection = action.payload.data || action.payload;

                // Update in quizSections list
                const index = state.quizSections.findIndex(s => s.id === updatedQuizSection.id);
                if (index !== -1) {
                    state.quizSections[index] = updatedQuizSection;
                }

                // Update current quizSection if it's the same
                if (state.currentQuizSection?.id === updatedQuizSection.id) {
                    state.currentQuizSection = updatedQuizSection;
                }

                state.error = null;
            })
            .addCase(updateQuizSectionAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })
            // Delete quiz section
            .addCase(deleteQuizSectionAsync.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteQuizSectionAsync.fulfilled, (state, action) => {
                state.deleteLoading = false;
                const deletedQuizSectionId = action.meta.arg;

                // Remove from quizSections list
                state.quizSections = state.quizSections.filter(s => s.id !== deletedQuizSectionId);

                // Clear current quizSection if it's the deleted one
                if (state.currentQuizSection?.id === deletedQuizSectionId) {
                    state.currentQuizSection = null;
                }

                state.error = null;
            })
            .addCase(deleteQuizSectionAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentQuizSection,
    clearError,
    setCurrentQuizSection,
} = quizSectionSlice.actions;

export default quizSectionSlice.reducer;
