import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiDocumentApi } from '../../../core/api/aiDocumentApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    documents: [],
    currentDocument: null,
    documentText: null,
    loading: false,
    uploadLoading: false,
    deleteLoading: false,
    textLoading: false,
    error: null,
};

// Async thunks
export const uploadDocumentAsync = createAsyncThunk(
    'aiDocument/upload',
    async (formData, thunkAPI) => {
        return handleAsyncThunk(
            () => aiDocumentApi.upload(formData),
            thunkAPI,
            {
                successTitle: 'Tải tài liệu thành công',
                successMessage: 'Tài liệu đã được tải lên và đang xử lý',
                errorTitle: 'Tải tài liệu thất bại',
            }
        );
    }
);

export const getDocumentByIdAsync = createAsyncThunk(
    'aiDocument/getById',
    async (documentId, thunkAPI) => {
        return handleAsyncThunk(
            () => aiDocumentApi.getById(documentId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy thông tin tài liệu thất bại',
            }
        );
    }
);

export const getAllDocumentsAsync = createAsyncThunk(
    'aiDocument/getAll',
    async (params, thunkAPI) => {
        return handleAsyncThunk(
            () => aiDocumentApi.getAll(params),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy danh sách tài liệu thất bại',
            }
        );
    }
);

export const getDocumentTextAsync = createAsyncThunk(
    'aiDocument/getText',
    async (documentId, thunkAPI) => {
        return handleAsyncThunk(
            () => aiDocumentApi.getText(documentId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lấy nội dung tài liệu thất bại',
            }
        );
    }
);

export const deleteDocumentAsync = createAsyncThunk(
    'aiDocument/delete',
    async (documentId, thunkAPI) => {
        return handleAsyncThunk(
            () => aiDocumentApi.delete(documentId),
            thunkAPI,
            {
                successTitle: 'Xóa tài liệu thành công',
                successMessage: 'Tài liệu và các câu hỏi liên quan đã được xóa',
                errorTitle: 'Xóa tài liệu thất bại',
            }
        );
    }
);

// Slice
const aiDocumentSlice = createSlice({
    name: 'aiDocument',
    initialState,
    reducers: {
        clearCurrentDocument: (state) => {
            state.currentDocument = null;
            state.documentText = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Upload document
            .addCase(uploadDocumentAsync.pending, (state) => {
                state.uploadLoading = true;
                state.error = null;
            })
            .addCase(uploadDocumentAsync.fulfilled, (state, action) => {
                state.uploadLoading = false;
                state.currentDocument = action.payload;
            })
            .addCase(uploadDocumentAsync.rejected, (state, action) => {
                state.uploadLoading = false;
                state.error = action.payload;
            })

            // Get document by ID
            .addCase(getDocumentByIdAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDocumentByIdAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDocument = action.payload;
            })
            .addCase(getDocumentByIdAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get all documents
            .addCase(getAllDocumentsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllDocumentsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload;
            })
            .addCase(getAllDocumentsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get document text
            .addCase(getDocumentTextAsync.pending, (state) => {
                state.textLoading = true;
                state.error = null;
            })
            .addCase(getDocumentTextAsync.fulfilled, (state, action) => {
                state.textLoading = false;
                state.documentText = action.payload.text;
            })
            .addCase(getDocumentTextAsync.rejected, (state, action) => {
                state.textLoading = false;
                state.error = action.payload;
            })

            // Delete document
            .addCase(deleteDocumentAsync.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteDocumentAsync.fulfilled, (state, action) => {
                state.deleteLoading = false;
            })
            .addCase(deleteDocumentAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentDocument, clearError } = aiDocumentSlice.actions;
export default aiDocumentSlice.reducer;
