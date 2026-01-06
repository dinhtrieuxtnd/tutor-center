import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiQuestionApi } from '../../../core/api/aiQuestionApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    questions: [],
    currentQuestion: null,
    generationJobs: [],
    currentJob: null,
    loading: false,
    jobStatusLoading: false,
    generateLoading: false,
    updateLoading: false,
    deleteLoading: false,
    importLoading: false,
    error: null,
};

// Async thunks
export const generateQuestionsAsync = createAsyncThunk(
    'aiQuestion/generate',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => aiQuestionApi.generate(data),
            thunkAPI,
            {
                successTitle: 'Đã gửi yêu cầu tạo câu hỏi',
                successMessage: 'AI đang xử lý và tạo câu hỏi từ tài liệu',
                errorTitle: 'Tạo câu hỏi thất bại',
            }
        );
    }
);

export const getJobStatusAsync = createAsyncThunk(
    'aiQuestion/getJobStatus',
    async (jobId, thunkAPI) => {
        return handleAsyncThunk(
            () => aiQuestionApi.getJobStatus(jobId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy trạng thái công việc thất bại',
            }
        );
    }
);

export const getAllJobsAsync = createAsyncThunk(
    'aiQuestion/getAllJobs',
    async (_, thunkAPI) => {
        return handleAsyncThunk(
            () => aiQuestionApi.getAllJobs(),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách công việc thất bại',
            }
        );
    }
);

export const getQuestionsByDocumentAsync = createAsyncThunk(
    'aiQuestion/getByDocument',
    async (documentId, thunkAPI) => {
        return handleAsyncThunk(
            () => aiQuestionApi.getByDocument(documentId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách câu hỏi thất bại',
            }
        );
    }
);

export const getQuestionByIdAsync = createAsyncThunk(
    'aiQuestion/getById',
    async (questionId, thunkAPI) => {
        return handleAsyncThunk(
            () => aiQuestionApi.getById(questionId),
            thunkAPI,
            {
                showSuccessMessage: false,
                errorTitle: 'Lấy thông tin câu hỏi thất bại',
            }
        );
    }
);

export const updateQuestionAsync = createAsyncThunk(
    'aiQuestion/update',
    async ({ questionId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => aiQuestionApi.update(questionId, data),
            thunkAPI,
            {
                successTitle: 'Cập nhật câu hỏi thành công',
                successMessage: 'Câu hỏi đã được chỉnh sửa',
                errorTitle: 'Cập nhật câu hỏi thất bại',
            }
        );
    }
);

export const importQuestionsAsync = createAsyncThunk(
    'aiQuestion/import',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => aiQuestionApi.import(data),
            thunkAPI,
            {
                successTitle: 'Nhập câu hỏi thành công',
                successMessage: `Đã nhập ${data.generatedQuestionIds.length} câu hỏi vào bài kiểm tra`,
                errorTitle: 'Nhập câu hỏi thất bại',
            }
        );
    }
);

export const deleteQuestionAsync = createAsyncThunk(
    'aiQuestion/delete',
    async (questionId, thunkAPI) => {
        return handleAsyncThunk(
            () => aiQuestionApi.delete(questionId),
            thunkAPI,
            {
                successTitle: 'Xóa câu hỏi thành công',
                successMessage: 'Câu hỏi đã được xóa',
                errorTitle: 'Xóa câu hỏi thất bại',
            }
        );
    }
);

// Slice
const aiQuestionSlice = createSlice({
    name: 'aiQuestion',
    initialState,
    reducers: {
        clearCurrentQuestion: (state) => {
            state.currentQuestion = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Generate questions
            .addCase(generateQuestionsAsync.pending, (state) => {
                state.generateLoading = true;
                state.error = null;
            })
            .addCase(generateQuestionsAsync.fulfilled, (state, action) => {
                state.generateLoading = false;
                state.currentJob = action.payload;
            })
            .addCase(generateQuestionsAsync.rejected, (state, action) => {
                state.generateLoading = false;
                state.error = action.payload;
            })

            // Get job status
            .addCase(getJobStatusAsync.pending, (state) => {
                state.jobStatusLoading = true;
                state.error = null;
            })
            .addCase(getJobStatusAsync.fulfilled, (state, action) => {
                state.jobStatusLoading = false;
                state.currentJob = action.payload;
            })
            .addCase(getJobStatusAsync.rejected, (state, action) => {
                state.jobStatusLoading = false;
                state.error = action.payload;
            })

            // Get all jobs
            .addCase(getAllJobsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllJobsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.generationJobs = action.payload;
            })
            .addCase(getAllJobsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get questions by document
            .addCase(getQuestionsByDocumentAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuestionsByDocumentAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
            })
            .addCase(getQuestionsByDocumentAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get question by ID
            .addCase(getQuestionByIdAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuestionByIdAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.currentQuestion = action.payload;
            })
            .addCase(getQuestionByIdAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update question
            .addCase(updateQuestionAsync.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateQuestionAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedQuestion = action.payload;
                const index = state.questions.findIndex(q => q.id === updatedQuestion.id);
                if (index !== -1) {
                    state.questions[index] = updatedQuestion;
                }
            })
            .addCase(updateQuestionAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })

            // Import questions
            .addCase(importQuestionsAsync.pending, (state) => {
                state.importLoading = true;
                state.error = null;
            })
            .addCase(importQuestionsAsync.fulfilled, (state, action) => {
                state.importLoading = false;
            })
            .addCase(importQuestionsAsync.rejected, (state, action) => {
                state.importLoading = false;
                state.error = action.payload;
            })

            // Delete question
            .addCase(deleteQuestionAsync.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteQuestionAsync.fulfilled, (state, action) => {
                state.deleteLoading = false;
            })
            .addCase(deleteQuestionAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentQuestion, clearError } = aiQuestionSlice.actions;
export default aiQuestionSlice.reducer;
