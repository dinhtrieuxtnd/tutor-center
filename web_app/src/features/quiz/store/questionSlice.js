import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { questionApi } from '../../../core/api/questionApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    questions: [],
    currentQuestion: null,
    questionMedias: [],
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    mediaLoading: false,
    error: null,
};

// Async thunks
export const createQuestionAsync = createAsyncThunk(
    'question/create',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => questionApi.create(data),
            thunkAPI,
            {
                successTitle: 'Tạo câu hỏi thành công',
                successMessage: 'Câu hỏi đã được thêm vào bài kiểm tra',
                errorTitle: 'Tạo câu hỏi thất bại',
            }
        );
    }
);

export const updateQuestionAsync = createAsyncThunk(
    'question/update',
    async ({ questionId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => questionApi.update(questionId, data),
            thunkAPI,
            {
                successTitle: 'Cập nhật câu hỏi thành công',
                successMessage: 'Thông tin câu hỏi đã được cập nhật',
                errorTitle: 'Cập nhật câu hỏi thất bại',
            }
        );
    }
);

export const deleteQuestionAsync = createAsyncThunk(
    'question/delete',
    async (questionId, thunkAPI) => {
        return handleAsyncThunk(
            () => questionApi.delete(questionId),
            thunkAPI,
            {
                successTitle: 'Xóa câu hỏi thành công',
                successMessage: 'Câu hỏi đã được xóa khỏi bài kiểm tra',
                errorTitle: 'Xóa câu hỏi thất bại',
            }
        );
    }
);

export const attachMediaToQuestionAsync = createAsyncThunk(
    'question/attachMedia',
    async ({ questionId, mediaId }, thunkAPI) => {
        return handleAsyncThunk(
            () => questionApi.attachMedia(questionId, { mediaId }),
            thunkAPI,
            {
                successTitle: 'Đính kèm media thành công',
                successMessage: 'Media đã được thêm vào câu hỏi',
                errorTitle: 'Đính kèm media thất bại',
            }
        );
    }
);

export const detachMediaFromQuestionAsync = createAsyncThunk(
    'question/detachMedia',
    async ({ questionId, mediaId }, thunkAPI) => {
        return handleAsyncThunk(
            () => questionApi.detachMedia(questionId, mediaId),
            thunkAPI,
            {
                successTitle: 'Gỡ media thành công',
                successMessage: 'Media đã được gỡ khỏi câu hỏi',
                errorTitle: 'Gỡ media thất bại',
            }
        );
    }
);

export const getQuestionMediasAsync = createAsyncThunk(
    'question/getMedias',
    async (questionId, thunkAPI) => {
        return handleAsyncThunk(
            () => questionApi.getQuestionMedias(questionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải danh sách media',
            }
        );
    }
);

const questionSlice = createSlice({
    name: 'question',
    initialState,
    reducers: {
        clearCurrentQuestion: (state) => {
            state.currentQuestion = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearQuestionMedias: (state) => {
            state.questionMedias = [];
        },
        setCurrentQuestion: (state, action) => {
            state.currentQuestion = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create question
            .addCase(createQuestionAsync.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createQuestionAsync.fulfilled, (state, action) => {
                state.createLoading = false;
                const newQuestion = action.payload.data || action.payload;
                state.questions.push(newQuestion);
                state.error = null;
            })
            .addCase(createQuestionAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })
            // Update question
            .addCase(updateQuestionAsync.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateQuestionAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedQuestion = action.payload.data || action.payload;

                // Update in questions list
                const index = state.questions.findIndex(q => q.id === updatedQuestion.id);
                if (index !== -1) {
                    state.questions[index] = updatedQuestion;
                }

                // Update current question if it's the same
                if (state.currentQuestion?.id === updatedQuestion.id) {
                    state.currentQuestion = updatedQuestion;
                }

                state.error = null;
            })
            .addCase(updateQuestionAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })
            // Delete question
            .addCase(deleteQuestionAsync.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteQuestionAsync.fulfilled, (state, action) => {
                state.deleteLoading = false;
                const deletedQuestionId = action.meta.arg;

                // Remove from questions list
                state.questions = state.questions.filter(q => q.id !== deletedQuestionId);

                // Clear current question if it's the deleted one
                if (state.currentQuestion?.id === deletedQuestionId) {
                    state.currentQuestion = null;
                }

                state.error = null;
            })
            .addCase(deleteQuestionAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            })
            // Attach media
            .addCase(attachMediaToQuestionAsync.pending, (state) => {
                state.mediaLoading = true;
                state.error = null;
            })
            .addCase(attachMediaToQuestionAsync.fulfilled, (state, action) => {
                state.mediaLoading = false;
                state.error = null;
            })
            .addCase(attachMediaToQuestionAsync.rejected, (state, action) => {
                state.mediaLoading = false;
                state.error = action.payload;
            })
            // Detach media
            .addCase(detachMediaFromQuestionAsync.pending, (state) => {
                state.mediaLoading = true;
                state.error = null;
            })
            .addCase(detachMediaFromQuestionAsync.fulfilled, (state, action) => {
                state.mediaLoading = false;
                const { mediaId } = action.meta.arg;

                // Remove from question medias list
                state.questionMedias = state.questionMedias.filter(m => m.id !== mediaId);

                state.error = null;
            })
            .addCase(detachMediaFromQuestionAsync.rejected, (state, action) => {
                state.mediaLoading = false;
                state.error = action.payload;
            })
            // Get question medias
            .addCase(getQuestionMediasAsync.pending, (state) => {
                state.mediaLoading = true;
                state.error = null;
            })
            .addCase(getQuestionMediasAsync.fulfilled, (state, action) => {
                state.mediaLoading = false;
                state.questionMedias = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(getQuestionMediasAsync.rejected, (state, action) => {
                state.mediaLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentQuestion,
    clearError,
    clearQuestionMedias,
    setCurrentQuestion,
} = questionSlice.actions;

export default questionSlice.reducer;
