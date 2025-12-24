import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { classroomChatApi } from '../../../core/api/classroomChatApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  messages: [],
  currentMessage: null,
  loading: false,
  sendLoading: false,
  editLoading: false,
  deleteLoading: false,
  error: null,
  selectedClassroomId: null,
  // Server-side pagination
  pagination: {
    pageNumber: 1,
    pageSize: 50, // Default 50 messages per page for chat
    totalPages: 0,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
  // For infinite scroll
  beforeDate: null,
  hasMore: true,
};

// Async thunks
export const sendMessageAsync = createAsyncThunk(
  'classroomChat/sendMessage',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomChatApi.sendMessage(data),
      thunkAPI,
      {
        showSuccess: false, // Don't show notification for every message
        errorTitle: 'Gửi tin nhắn thất bại',
      }
    );
  }
);

export const editMessageAsync = createAsyncThunk(
  'classroomChat/editMessage',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomChatApi.editMessage(data),
      thunkAPI,
      {
        successTitle: 'Chỉnh sửa tin nhắn thành công',
        successMessage: 'Tin nhắn đã được cập nhật',
        errorTitle: 'Chỉnh sửa tin nhắn thất bại',
      }
    );
  }
);

export const deleteMessageAsync = createAsyncThunk(
  'classroomChat/deleteMessage',
  async (messageId, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomChatApi.deleteMessage(messageId),
      thunkAPI,
      {
        successTitle: 'Xóa tin nhắn thành công',
        successMessage: 'Tin nhắn đã được xóa',
        errorTitle: 'Xóa tin nhắn thất bại',
      }
    );
  }
);

export const getMessagesAsync = createAsyncThunk(
  'classroomChat/getMessages',
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomChatApi.getMessages(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải tin nhắn',
      }
    );
  }
);

const classroomChatSlice = createSlice({
  name: 'classroomChat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedClassroomId: (state, action) => {
      state.selectedClassroomId = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.selectedClassroomId = null;
      state.pagination = initialState.pagination;
      state.beforeDate = null;
      state.hasMore = true;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setBeforeDate: (state, action) => {
      state.beforeDate = action.payload;
    },
    // Optimistic update: add message immediately before server response
    addMessageOptimistic: (state, action) => {
      state.messages.push(action.payload);
    },
    // Update message locally (for realtime updates via SignalR)
    updateMessageLocally: (state, action) => {
      const index = state.messages.findIndex(m => m.messageId === action.payload.messageId);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    // Remove message locally
    removeMessageLocally: (state, action) => {
      state.messages = state.messages.filter(m => m.messageId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessageAsync.pending, (state) => {
        state.sendLoading = true;
        state.error = null;
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.sendLoading = false;
        const newMessage = action.payload.data || action.payload;
        
        // Add message to the list if not already present (avoid duplicates)
        const exists = state.messages.some(m => m.messageId === newMessage.messageId);
        if (!exists) {
          state.messages.push(newMessage);
        }
        
        state.error = null;
      })
      .addCase(sendMessageAsync.rejected, (state, action) => {
        state.sendLoading = false;
        state.error = action.payload;
      })
      // Edit message
      .addCase(editMessageAsync.pending, (state) => {
        state.editLoading = true;
        state.error = null;
      })
      .addCase(editMessageAsync.fulfilled, (state, action) => {
        state.editLoading = false;
        const updatedMessage = action.payload.data || action.payload;
        
        const index = state.messages.findIndex(m => m.messageId === updatedMessage.messageId);
        if (index !== -1) {
          state.messages[index] = updatedMessage;
        }
        
        state.error = null;
      })
      .addCase(editMessageAsync.rejected, (state, action) => {
        state.editLoading = false;
        state.error = action.payload;
      })
      // Delete message
      .addCase(deleteMessageAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteMessageAsync.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove message from list or mark as deleted
        // Depending on backend implementation
        state.error = null;
      })
      .addCase(deleteMessageAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      // Get messages
      .addCase(getMessagesAsync.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        
        // Set selected classroom from params
        if (action.meta.arg?.classroomId) {
          state.selectedClassroomId = action.meta.arg.classroomId;
        }
      })
      .addCase(getMessagesAsync.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload.data || action.payload;
        const newMessages = response.items || [];
        
        // For infinite scroll: append old messages
        if (state.beforeDate) {
          state.messages = [...state.messages, ...newMessages];
        } else {
          // Initial load or refresh: replace messages
          state.messages = newMessages;
        }
        
        state.pagination = {
          pageNumber: response.pageNumber || 1,
          pageSize: response.pageSize || 50,
          totalPages: response.totalPages || 0,
          totalCount: response.totalCount || 0,
          hasPreviousPage: response.hasPreviousPage || false,
          hasNextPage: response.hasNextPage || false,
        };
        
        state.hasMore = response.hasNextPage || false;
        state.error = null;
      })
      .addCase(getMessagesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setSelectedClassroomId,
  clearMessages,
  setPagination,
  setBeforeDate,
  addMessageOptimistic,
  updateMessageLocally,
  removeMessageLocally,
} = classroomChatSlice.actions;

export default classroomChatSlice.reducer;
