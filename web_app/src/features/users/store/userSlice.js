import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../../core/api/userApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  createLoading: false,
  statusLoading: false,
  error: null,
  // Server-side pagination
  pagination: {
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
  // Filters
  filters: {
    searchTerm: '',
    role: null,
    isActive: null,
  },
};

// Async thunks
export const getAllUsersAsync = createAsyncThunk(
  'user/getAll',
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => userApi.getAll(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải danh sách người dùng',
      }
    );
  }
);

export const createTutorAsync = createAsyncThunk(
  'user/createTutor',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => userApi.createTutor(data),
      thunkAPI,
      {
        successTitle: 'Tạo tài khoản giáo viên thành công',
        successMessage: `Tài khoản "${data.email}" đã được tạo`,
        errorTitle: 'Tạo tài khoản thất bại',
      }
    );
  }
);

export const changeUserStatusAsync = createAsyncThunk(
  'user/changeStatus',
  async (userId, thunkAPI) => {
    return handleAsyncThunk(
      () => userApi.changeStatus(userId),
      thunkAPI,
      {
        successTitle: 'Cập nhật trạng thái thành công',
        successMessage: 'Trạng thái người dùng đã được thay đổi',
        errorTitle: 'Cập nhật trạng thái thất bại',
      }
    );
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.pageNumber = 1; // Reset to first page when filters change
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getAllUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload.data || action.payload;
        state.users = response.items || [];
        state.pagination = {
          pageNumber: response.pageNumber || 1,
          pageSize: response.pageSize || 20,
          totalPages: response.totalPages || 0,
          totalCount: response.totalCount || 0,
          hasPreviousPage: response.hasPreviousPage || false,
          hasNextPage: response.hasNextPage || false,
        };
        state.error = null;
      })
      .addCase(getAllUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create tutor
      .addCase(createTutorAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createTutorAsync.fulfilled, (state, action) => {
        state.createLoading = false;
        state.error = null;
      })
      .addCase(createTutorAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Change user status
      .addCase(changeUserStatusAsync.pending, (state) => {
        state.statusLoading = true;
        state.error = null;
      })
      .addCase(changeUserStatusAsync.fulfilled, (state, action) => {
        state.statusLoading = false;
        const updatedUser = action.payload.data || action.payload;

        // Update in users list
        const index = state.users.findIndex(u => u.userId === updatedUser.userId);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }

        state.error = null;
      })
      .addCase(changeUserStatusAsync.rejected, (state, action) => {
        state.statusLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCurrentUser,
  clearError,
  setFilters,
  setPagination,
} = userSlice.actions;

export default userSlice.reducer;
