import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileApi } from '../../../core/api';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';
import { STORAGE_KEYS } from '../../../core/constants';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

// Async thunks
export const getProfileAsync = createAsyncThunk(
  'profile/getProfile',
  async (_, thunkAPI) => {
    return handleAsyncThunk(
      () => profileApi.getProfile(),
      thunkAPI,
      {
        showSuccess: false, // Không hiện thông báo khi lấy profile
        errorTitle: 'Lỗi tải thông tin',
      }
    );
  }
);

export const updateProfileAsync = createAsyncThunk(
  'profile/updateProfile',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => profileApi.updateProfile(data),
      thunkAPI,
      {
        successTitle: 'Cập nhật thành công',
        successMessage: 'Thông tin của bạn đã được cập nhật',
        errorTitle: 'Cập nhật thất bại',
      }
    );
  }
);

export const changePasswordAsync = createAsyncThunk(
  'profile/changePassword',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => profileApi.changePassword(data),
      thunkAPI,
      {
        successTitle: 'Đổi mật khẩu thành công',
        successMessage: 'Mật khẩu của bạn đã được thay đổi',
        errorTitle: 'Đổi mật khẩu thất bại',
      }
    );
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
        
        // Lưu vào localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
        
        // Cập nhật localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload));
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Change Password
      .addCase(changePasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
