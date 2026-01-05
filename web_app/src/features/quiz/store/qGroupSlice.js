import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { qGroupApi } from '../../../core/api/qGroupApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    qGroups: [],
    currentQGroup: null,
    qGroupMedias: [],
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    mediaLoading: false,
    error: null,
};

// Async thunks
export const createQGroupAsync = createAsyncThunk(
    'qGroup/create',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => qGroupApi.create(data),
            thunkAPI,
            {
                successTitle: 'Tạo nhóm câu hỏi thành công',
                successMessage: 'Nhóm câu hỏi đã được thêm vào bài kiểm tra',
                errorTitle: 'Tạo nhóm câu hỏi thất bại',
            }
        );
    }
);

export const updateQGroupAsync = createAsyncThunk(
    'qGroup/update',
    async ({ qGroupId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => qGroupApi.update(qGroupId, data),
            thunkAPI,
            {
                successTitle: 'Cập nhật nhóm câu hỏi thành công',
                successMessage: 'Thông tin nhóm câu hỏi đã được cập nhật',
                errorTitle: 'Cập nhật nhóm câu hỏi thất bại',
            }
        );
    }
);

export const deleteQGroupAsync = createAsyncThunk(
    'qGroup/delete',
    async (qGroupId, thunkAPI) => {
        return handleAsyncThunk(
            () => qGroupApi.delete(qGroupId),
            thunkAPI,
            {
                successTitle: 'Xóa nhóm câu hỏi thành công',
                successMessage: 'Nhóm câu hỏi đã được xóa khỏi bài kiểm tra',
                errorTitle: 'Xóa nhóm câu hỏi thất bại',
            }
        );
    }
);

export const attachMediaToQGroupAsync = createAsyncThunk(
    'qGroup/attachMedia',
    async ({ qGroupId, mediaId }, thunkAPI) => {
        return handleAsyncThunk(
            () => qGroupApi.attachMedia(qGroupId, { mediaId }),
            thunkAPI,
            {
                successTitle: 'Đính kèm media thành công',
                successMessage: 'Media đã được thêm vào nhóm câu hỏi',
                errorTitle: 'Đính kèm media thất bại',
            }
        );
    }
);

export const detachMediaFromQGroupAsync = createAsyncThunk(
    'qGroup/detachMedia',
    async ({ qGroupId, mediaId }, thunkAPI) => {
        return handleAsyncThunk(
            () => qGroupApi.detachMedia(qGroupId, mediaId),
            thunkAPI,
            {
                successTitle: 'Gỡ media thành công',
                successMessage: 'Media đã được gỡ khỏi nhóm câu hỏi',
                errorTitle: 'Gỡ media thất bại',
            }
        );
    }
);

export const getQGroupMediasAsync = createAsyncThunk(
    'qGroup/getMedias',
    async (qGroupId, thunkAPI) => {
        return handleAsyncThunk(
            () => qGroupApi.getQGroupMedias(qGroupId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải danh sách media',
            }
        );
    }
);

const qGroupSlice = createSlice({
    name: 'qGroup',
    initialState,
    reducers: {
        clearCurrentQGroup: (state) => {
            state.currentQGroup = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearQGroupMedias: (state) => {
            state.qGroupMedias = [];
        },
        setCurrentQGroup: (state, action) => {
            state.currentQGroup = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create question group
            .addCase(createQGroupAsync.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createQGroupAsync.fulfilled, (state, action) => {
                state.createLoading = false;
                const newQGroup = action.payload.data || action.payload;
                state.qGroups.push(newQGroup);
                state.error = null;
            })
            .addCase(createQGroupAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })
            // Update question group
            .addCase(updateQGroupAsync.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateQGroupAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedQGroup = action.payload.data || action.payload;

                // Update in qGroups list
                const index = state.qGroups.findIndex(q => q.id === updatedQGroup.id);
                if (index !== -1) {
                    state.qGroups[index] = updatedQGroup;
                }

                // Update current qGroup if it's the same
                if (state.currentQGroup?.id === updatedQGroup.id) {
                    state.currentQGroup = updatedQGroup;
                }

                state.error = null;
            })
            .addCase(updateQGroupAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })
            // Delete question group
            .addCase(deleteQGroupAsync.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteQGroupAsync.fulfilled, (state, action) => {
                state.deleteLoading = false;
                const deletedQGroupId = action.meta.arg;

                // Remove from qGroups list
                state.qGroups = state.qGroups.filter(q => q.id !== deletedQGroupId);

                // Clear current qGroup if it's the deleted one
                if (state.currentQGroup?.id === deletedQGroupId) {
                    state.currentQGroup = null;
                }

                state.error = null;
            })
            .addCase(deleteQGroupAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            })
            // Attach media
            .addCase(attachMediaToQGroupAsync.pending, (state) => {
                state.mediaLoading = true;
                state.error = null;
            })
            .addCase(attachMediaToQGroupAsync.fulfilled, (state, action) => {
                state.mediaLoading = false;
                state.error = null;
            })
            .addCase(attachMediaToQGroupAsync.rejected, (state, action) => {
                state.mediaLoading = false;
                state.error = action.payload;
            })
            // Detach media
            .addCase(detachMediaFromQGroupAsync.pending, (state) => {
                state.mediaLoading = true;
                state.error = null;
            })
            .addCase(detachMediaFromQGroupAsync.fulfilled, (state, action) => {
                state.mediaLoading = false;
                const { mediaId } = action.meta.arg;

                // Remove from qGroup medias list
                state.qGroupMedias = state.qGroupMedias.filter(m => m.id !== mediaId);

                state.error = null;
            })
            .addCase(detachMediaFromQGroupAsync.rejected, (state, action) => {
                state.mediaLoading = false;
                state.error = action.payload;
            })
            // Get question group medias
            .addCase(getQGroupMediasAsync.pending, (state) => {
                state.mediaLoading = true;
                state.error = null;
            })
            .addCase(getQGroupMediasAsync.fulfilled, (state, action) => {
                state.mediaLoading = false;
                state.qGroupMedias = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(getQGroupMediasAsync.rejected, (state, action) => {
                state.mediaLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentQGroup,
    clearError,
    clearQGroupMedias,
    setCurrentQGroup,
} = qGroupSlice.actions;

export default qGroupSlice.reducer;
