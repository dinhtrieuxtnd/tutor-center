import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { joinRequestApi } from '../../../core/api/joinRequestApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  joinRequests: [],
  myRequests: [],
  currentRequest: null,
  loading: false,
  handleLoading: false,
  error: null,
};

// Async thunks
export const createJoinRequestAsync = createAsyncThunk(
  'joinRequest/create',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => joinRequestApi.create(data),
      thunkAPI,
      {
        successTitle: 'Gửi yêu cầu thành công',
        successMessage: 'Yêu cầu tham gia lớp học đã được gửi',
        errorTitle: 'Gửi yêu cầu thất bại',
      }
    );
  }
);

export const getJoinRequestsByClassroomAsync = createAsyncThunk(
  'joinRequest/getByClassroom',
  async (classroomId, thunkAPI) => {
    return handleAsyncThunk(
      () => joinRequestApi.getByClassroomId(classroomId),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải danh sách yêu cầu',
      }
    );
  }
);

export const handleJoinRequestStatusAsync = createAsyncThunk(
  'joinRequest/handleStatus',
  async ({ joinRequestId, data }, thunkAPI) => {
    return handleAsyncThunk(
      () => joinRequestApi.handleStatus(joinRequestId, data),
      thunkAPI,
      {
        successTitle: 'Xử lý thành công',
        successMessage: data.status === 'approved' 
          ? 'Đã chấp nhận yêu cầu tham gia' 
          : 'Đã từ chối yêu cầu tham gia',
        errorTitle: 'Xử lý yêu cầu thất bại',
      }
    );
  }
);

export const getMyJoinRequestsAsync = createAsyncThunk(
  'joinRequest/getMyRequests',
  async (_, thunkAPI) => {
    return handleAsyncThunk(
      () => joinRequestApi.getMyRequests(),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải yêu cầu của tôi',
      }
    );
  }
);

// Slice
const joinRequestSlice = createSlice({
  name: 'joinRequest',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create join request
      .addCase(createJoinRequestAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJoinRequestAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
      })
      .addCase(createJoinRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Get join requests by classroom
      .addCase(getJoinRequestsByClassroomAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJoinRequestsByClassroomAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.joinRequests = action.payload;
      })
      .addCase(getJoinRequestsByClassroomAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Handle join request status
      .addCase(handleJoinRequestStatusAsync.pending, (state) => {
        state.handleLoading = true;
        state.error = null;
      })
      .addCase(handleJoinRequestStatusAsync.fulfilled, (state, action) => {
        state.handleLoading = false;
        // Update the request in the list
        const index = state.joinRequests.findIndex(
          (req) => req.id === action.payload.id
        );
        if (index !== -1) {
          state.joinRequests[index] = action.payload;
        }
      })
      .addCase(handleJoinRequestStatusAsync.rejected, (state, action) => {
        state.handleLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Get my join requests
      .addCase(getMyJoinRequestsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyJoinRequestsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests = action.payload;
      })
      .addCase(getMyJoinRequestsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, clearCurrentRequest } = joinRequestSlice.actions;
export default joinRequestSlice.reducer;
