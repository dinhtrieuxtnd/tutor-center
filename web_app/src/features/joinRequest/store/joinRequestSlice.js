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
        successTitle: 'Cập nhật thành công',
        successMessage: data.status === 1 ? 'Đã chấp nhận yêu cầu' : 'Đã từ chối yêu cầu',
        errorTitle: 'Cập nhật thất bại',
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
        errorTitle: 'Lỗi tải danh sách yêu cầu của bạn',
      }
    );
  }
);

const joinRequestSlice = createSlice({
  name: 'joinRequest',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearJoinRequests: (state) => {
      state.joinRequests = [];
      state.error = null;
    },
    clearMyRequests: (state) => {
      state.myRequests = [];
      state.error = null;
    },
    setCurrentRequest: (state, action) => {
      state.currentRequest = action.payload;
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
        state.myRequests.push(action.payload);
      })
      .addCase(createJoinRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create join request';
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
        state.error = action.payload || 'Failed to get join requests';
      })

      // Handle join request status
      .addCase(handleJoinRequestStatusAsync.pending, (state) => {
        state.handleLoading = true;
        state.error = null;
      })
      .addCase(handleJoinRequestStatusAsync.fulfilled, (state, action) => {
        state.handleLoading = false;
        // Update the request in the list
        const index = state.joinRequests.findIndex(r => r.joinRequestId === action.payload.joinRequestId);
        if (index !== -1) {
          state.joinRequests[index] = action.payload;
        }
      })
      .addCase(handleJoinRequestStatusAsync.rejected, (state, action) => {
        state.handleLoading = false;
        state.error = action.payload || 'Failed to handle join request';
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
        state.error = action.payload || 'Failed to get my requests';
      });
  },
});

export const { clearError, clearJoinRequests, clearMyRequests, setCurrentRequest } = joinRequestSlice.actions;

export default joinRequestSlice.reducer;
