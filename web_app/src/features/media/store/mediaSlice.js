import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mediaApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  mediaList: [],
  currentMedia: null,
  totalCount: 0,
  loading: false,
  uploadProgress: 0,
  error: null,
};

// Async thunks
export const uploadMediaAsync = createAsyncThunk(
  'media/upload',
  async ({ file, visibility }, thunkAPI) => {
    return handleAsyncThunk(
      () => mediaApi.upload(file, visibility),
      thunkAPI,
      {
        successTitle: 'Tải lên thành công',
        successMessage: 'File đã được tải lên',
        errorTitle: 'Tải lên thất bại',
      }
    );
  }
);

export const getMediaByIdAsync = createAsyncThunk(
  'media/getById',
  async (mediaId, thunkAPI) => {
    return handleAsyncThunk(
      () => mediaApi.getById(mediaId),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải media',
      }
    );
  }
);

export const getMediaPagedAsync = createAsyncThunk(
  'media/getPaged',
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => mediaApi.getPaged(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải danh sách media',
      }
    );
  }
);

export const getUserMediaAsync = createAsyncThunk(
  'media/getUserMedia',
  async (userId, thunkAPI) => {
    return handleAsyncThunk(
      () => mediaApi.getUserMedia(userId),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải media người dùng',
      }
    );
  }
);

export const updateMediaAsync = createAsyncThunk(
  'media/update',
  async ({ mediaId, data }, thunkAPI) => {
    return handleAsyncThunk(
      () => mediaApi.update(mediaId, data),
      thunkAPI,
      {
        successTitle: 'Cập nhật thành công',
        successMessage: 'Thông tin media đã được cập nhật',
        errorTitle: 'Cập nhật thất bại',
      }
    );
  }
);

export const deleteMediaAsync = createAsyncThunk(
  'media/delete',
  async (mediaId, thunkAPI) => {
    return handleAsyncThunk(
      () => mediaApi.delete(mediaId),
      thunkAPI,
      {
        successTitle: 'Xóa thành công',
        successMessage: 'Media đã được xóa',
        errorTitle: 'Xóa thất bại',
      }
    );
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearCurrentMedia: (state) => {
      state.currentMedia = null;
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearMediaList: (state) => {
      state.mediaList = [];
      state.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadMediaAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadMediaAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMedia = action.payload;
        state.uploadProgress = 100;
        state.error = null;
      })
      .addCase(uploadMediaAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      // Get by ID
      .addCase(getMediaByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMediaByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMedia = action.payload;
        state.error = null;
      })
      .addCase(getMediaByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get paged
      .addCase(getMediaPagedAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMediaPagedAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaList = action.payload.items || [];
        state.totalCount = action.payload.totalCount || 0;
        state.error = null;
      })
      .addCase(getMediaPagedAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user media
      .addCase(getUserMediaAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserMediaAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaList = action.payload;
        state.error = null;
      })
      .addCase(getUserMediaAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateMediaAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMediaAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMedia = action.payload;
        
        // Update in list if exists
        const index = state.mediaList.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.mediaList[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMediaAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteMediaAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMediaAsync.fulfilled, (state, action) => {
        state.loading = false;
        
        // Remove from list
        state.mediaList = state.mediaList.filter(m => m.id !== action.meta.arg);
        state.totalCount = Math.max(0, state.totalCount - 1);
        state.error = null;
      })
      .addCase(deleteMediaAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentMedia, setUploadProgress, clearMediaList } = mediaSlice.actions;
export default mediaSlice.reducer;
