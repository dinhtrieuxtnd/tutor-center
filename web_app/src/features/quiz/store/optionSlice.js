import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { optionApi } from '../../../core/api/optionApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
    options: [],
    currentOption: null,
    optionMedias: [],
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    mediaLoading: false,
    error: null,
};

// Async thunks
export const createOptionAsync = createAsyncThunk(
    'option/create',
    async (data, thunkAPI) => {
        return handleAsyncThunk(
            () => optionApi.create(data),
            thunkAPI,
            {
                successTitle: 'Tạo đáp án thành công',
                successMessage: 'Đáp án đã được thêm vào câu hỏi',
                errorTitle: 'Tạo đáp án thất bại',
            }
        );
    }
);

export const updateOptionAsync = createAsyncThunk(
    'option/update',
    async ({ optionId, data }, thunkAPI) => {
        return handleAsyncThunk(
            () => optionApi.update(optionId, data),
            thunkAPI,
            {
                successTitle: 'Cập nhật đáp án thành công',
                successMessage: 'Thông tin đáp án đã được cập nhật',
                errorTitle: 'Cập nhật đáp án thất bại',
            }
        );
    }
);

export const deleteOptionAsync = createAsyncThunk(
    'option/delete',
    async (optionId, thunkAPI) => {
        return handleAsyncThunk(
            () => optionApi.delete(optionId),
            thunkAPI,
            {
                successTitle: 'Xóa đáp án thành công',
                successMessage: 'Đáp án đã được xóa khỏi câu hỏi',
                errorTitle: 'Xóa đáp án thất bại',
            }
        );
    }
);

export const attachMediaToOptionAsync = createAsyncThunk(
    'option/attachMedia',
    async ({ optionId, mediaId }, thunkAPI) => {
        return handleAsyncThunk(
            () => optionApi.attachMedia(optionId, { mediaId }),
            thunkAPI,
            {
                successTitle: 'Đính kèm media thành công',
                successMessage: 'Media đã được thêm vào đáp án',
                errorTitle: 'Đính kèm media thất bại',
            }
        );
    }
);

export const detachMediaFromOptionAsync = createAsyncThunk(
    'option/detachMedia',
    async ({ optionId, mediaId }, thunkAPI) => {
        return handleAsyncThunk(
            () => optionApi.detachMedia(optionId, mediaId),
            thunkAPI,
            {
                successTitle: 'Gỡ media thành công',
                successMessage: 'Media đã được gỡ khỏi đáp án',
                errorTitle: 'Gỡ media thất bại',
            }
        );
    }
);

export const getOptionMediasAsync = createAsyncThunk(
    'option/getMedias',
    async (optionId, thunkAPI) => {
        return handleAsyncThunk(
            () => optionApi.getOptionMedias(optionId),
            thunkAPI,
            {
                showSuccess: false,
                errorTitle: 'Lỗi tải danh sách media',
            }
        );
    }
);

const optionSlice = createSlice({
    name: 'option',
    initialState,
    reducers: {
        clearCurrentOption: (state) => {
            state.currentOption = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearOptionMedias: (state) => {
            state.optionMedias = [];
        },
        setCurrentOption: (state, action) => {
            state.currentOption = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create option
            .addCase(createOptionAsync.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createOptionAsync.fulfilled, (state, action) => {
                state.createLoading = false;
                const newOption = action.payload.data || action.payload;
                state.options.push(newOption);
                state.error = null;
            })
            .addCase(createOptionAsync.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })
            // Update option
            .addCase(updateOptionAsync.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateOptionAsync.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedOption = action.payload.data || action.payload;

                // Update in options list
                const index = state.options.findIndex(o => o.id === updatedOption.id);
                if (index !== -1) {
                    state.options[index] = updatedOption;
                }

                // Update current option if it's the same
                if (state.currentOption?.id === updatedOption.id) {
                    state.currentOption = updatedOption;
                }

                state.error = null;
            })
            .addCase(updateOptionAsync.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })
            // Delete option
            .addCase(deleteOptionAsync.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteOptionAsync.fulfilled, (state, action) => {
                state.deleteLoading = false;
                const deletedOptionId = action.meta.arg;

                // Remove from options list
                state.options = state.options.filter(o => o.id !== deletedOptionId);

                // Clear current option if it's the deleted one
                if (state.currentOption?.id === deletedOptionId) {
                    state.currentOption = null;
                }

                state.error = null;
            })
            .addCase(deleteOptionAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            })
            // Attach media
            .addCase(attachMediaToOptionAsync.pending, (state) => {
                state.mediaLoading = true;
                state.error = null;
            })
            .addCase(attachMediaToOptionAsync.fulfilled, (state, action) => {
                state.mediaLoading = false;
                state.error = null;
            })
            .addCase(attachMediaToOptionAsync.rejected, (state, action) => {
                state.mediaLoading = false;
                state.error = action.payload;
            })
            // Detach media
            .addCase(detachMediaFromOptionAsync.pending, (state) => {
                state.mediaLoading = true;
                state.error = null;
            })
            .addCase(detachMediaFromOptionAsync.fulfilled, (state, action) => {
                state.mediaLoading = false;
                const { mediaId } = action.meta.arg;

                // Remove from option medias list
                state.optionMedias = state.optionMedias.filter(m => m.id !== mediaId);

                state.error = null;
            })
            .addCase(detachMediaFromOptionAsync.rejected, (state, action) => {
                state.mediaLoading = false;
                state.error = action.payload;
            })
            // Get option medias
            .addCase(getOptionMediasAsync.pending, (state) => {
                state.mediaLoading = true;
                state.error = null;
            })
            .addCase(getOptionMediasAsync.fulfilled, (state, action) => {
                state.mediaLoading = false;
                state.optionMedias = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(getOptionMediasAsync.rejected, (state, action) => {
                state.mediaLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearCurrentOption,
    clearError,
    clearOptionMedias,
    setCurrentOption,
} = optionSlice.actions;

export default optionSlice.reducer;
