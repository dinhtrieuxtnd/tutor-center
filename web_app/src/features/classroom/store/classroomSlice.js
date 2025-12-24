import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { classroomApi } from '../../../core/api/classroomApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  classrooms: [],
  myEnrollments: [],
  deletedClassrooms: [],
  currentClassroom: null,
  loading: false,
  enrollmentsLoading: false,
  deletedLoading: false,
  classroomDetailLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  restoreLoading: false,
  archiveLoading: false,
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
  enrollmentsPagination: {
    pageNumber: 1,
    pageSize: 20,
    totalPages: 0,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
  deletedPagination: {
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
    status: null,
  },
  enrollmentsFilters: {
    searchTerm: '',
  },
  deletedFilters: {
    searchTerm: '',
  },
};

// Async thunks
export const getAllClassroomsAsync = createAsyncThunk(
  'classroom/getAll',
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomApi.getAll(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải danh sách lớp học',
      }
    );
  }
);

export const getMyEnrollmentsAsync = createAsyncThunk(
  'classroom/getMyEnrollments',
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomApi.getMyEnrollments(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải lớp học của tôi',
      }
    );
  }
);

export const getDeletedClassroomsAsync = createAsyncThunk(
  'classroom/getDeletedList',
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomApi.getDeletedList(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải danh sách lớp đã xóa',
      }
    );
  }
);

export const getClassroomByIdAsync = createAsyncThunk(
  'classroom/getById',
  async (classroomId, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomApi.getById(classroomId),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lỗi tải thông tin lớp học',
      }
    );
  }
);

export const createClassroomAsync = createAsyncThunk(
  'classroom/create',
  async (data, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomApi.create(data),
      thunkAPI,
      {
        successTitle: 'Tạo lớp học thành công',
        successMessage: `Lớp học "${data.name}" đã được tạo`,
        errorTitle: 'Tạo lớp học thất bại',
      }
    );
  }
);

export const updateClassroomAsync = createAsyncThunk(
  'classroom/update',
  async ({ classroomId, data }, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomApi.update(classroomId, data),
      thunkAPI,
      {
        successTitle: 'Cập nhật lớp học thành công',
        successMessage: 'Thông tin lớp học đã được cập nhật',
        errorTitle: 'Cập nhật lớp học thất bại',
      }
    );
  }
);

export const toggleArchiveStatusAsync = createAsyncThunk(
  'classroom/toggleArchive',
  async (classroomId, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomApi.toggleArchiveStatus(classroomId),
      thunkAPI,
      {
        successTitle: 'Cập nhật trạng thái thành công',
        successMessage: 'Trạng thái lưu trữ đã được thay đổi',
        errorTitle: 'Cập nhật trạng thái thất bại',
      }
    );
  }
);

export const deleteClassroomAsync = createAsyncThunk(
  'classroom/delete',
  async (classroomId, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomApi.delete(classroomId),
      thunkAPI,
      {
        successTitle: 'Xóa lớp học thành công',
        successMessage: 'Lớp học đã được xóa',
        errorTitle: 'Xóa lớp học thất bại',
      }
    );
  }
);

export const restoreClassroomAsync = createAsyncThunk(
  'classroom/restore',
  async (classroomId, thunkAPI) => {
    return handleAsyncThunk(
      () => classroomApi.restore(classroomId),
      thunkAPI,
      {
        successTitle: 'Khôi phục lớp học thành công',
        successMessage: 'Lớp học đã được khôi phục',
        errorTitle: 'Khôi phục lớp học thất bại',
      }
    );
  }
);

const classroomSlice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {
    clearCurrentClassroom: (state) => {
      state.currentClassroom = null;
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
    setEnrollmentsFilters: (state, action) => {
      state.enrollmentsFilters = { ...state.enrollmentsFilters, ...action.payload };
      state.enrollmentsPagination.pageNumber = 1;
    },
    setEnrollmentsPagination: (state, action) => {
      state.enrollmentsPagination = { ...state.enrollmentsPagination, ...action.payload };
    },
    setDeletedFilters: (state, action) => {
      state.deletedFilters = { ...state.deletedFilters, ...action.payload };
      state.deletedPagination.pageNumber = 1;
    },
    setDeletedPagination: (state, action) => {
      state.deletedPagination = { ...state.deletedPagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all classrooms
      .addCase(getAllClassroomsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClassroomsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload.data || action.payload;
        state.classrooms = response.items || [];
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
      .addCase(getAllClassroomsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get my enrollments
      .addCase(getMyEnrollmentsAsync.pending, (state) => {
        state.enrollmentsLoading = true;
        state.error = null;
      })
      .addCase(getMyEnrollmentsAsync.fulfilled, (state, action) => {
        state.enrollmentsLoading = false;
        const response = action.payload.data || action.payload;
        state.myEnrollments = response.items || [];
        state.enrollmentsPagination = {
          pageNumber: response.pageNumber || 1,
          pageSize: response.pageSize || 20,
          totalPages: response.totalPages || 0,
          totalCount: response.totalCount || 0,
          hasPreviousPage: response.hasPreviousPage || false,
          hasNextPage: response.hasNextPage || false,
        };
        state.error = null;
      })
      .addCase(getMyEnrollmentsAsync.rejected, (state, action) => {
        state.enrollmentsLoading = false;
        state.error = action.payload;
      })
      // Get deleted classrooms
      .addCase(getDeletedClassroomsAsync.pending, (state) => {
        state.deletedLoading = true;
        state.error = null;
      })
      .addCase(getDeletedClassroomsAsync.fulfilled, (state, action) => {
        state.deletedLoading = false;
        const response = action.payload.data || action.payload;
        state.deletedClassrooms = response.items || [];
        state.deletedPagination = {
          pageNumber: response.pageNumber || 1,
          pageSize: response.pageSize || 20,
          totalPages: response.totalPages || 0,
          totalCount: response.totalCount || 0,
          hasPreviousPage: response.hasPreviousPage || false,
          hasNextPage: response.hasNextPage || false,
        };
        state.error = null;
      })
      .addCase(getDeletedClassroomsAsync.rejected, (state, action) => {
        state.deletedLoading = false;
        state.error = action.payload;
      })
      // Get classroom by ID
      .addCase(getClassroomByIdAsync.pending, (state) => {
        state.classroomDetailLoading = true;
        state.error = null;
      })
      .addCase(getClassroomByIdAsync.fulfilled, (state, action) => {
        state.classroomDetailLoading = false;
        state.currentClassroom = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(getClassroomByIdAsync.rejected, (state, action) => {
        state.classroomDetailLoading = false;
        state.error = action.payload;
      })
      // Create classroom
      .addCase(createClassroomAsync.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createClassroomAsync.fulfilled, (state, action) => {
        state.createLoading = false;
        state.error = null;
      })
      .addCase(createClassroomAsync.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Update classroom
      .addCase(updateClassroomAsync.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateClassroomAsync.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedClassroom = action.payload.data || action.payload;
        
        // Update in classrooms list
        const index = state.classrooms.findIndex(c => c.classroomId === updatedClassroom.classroomId);
        if (index !== -1) {
          state.classrooms[index] = updatedClassroom;
        }
        
        // Update current classroom if it's the same
        if (state.currentClassroom?.classroomId === updatedClassroom.classroomId) {
          state.currentClassroom = updatedClassroom;
        }
        
        state.error = null;
      })
      .addCase(updateClassroomAsync.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Toggle archive status
      .addCase(toggleArchiveStatusAsync.pending, (state) => {
        state.archiveLoading = true;
        state.error = null;
      })
      .addCase(toggleArchiveStatusAsync.fulfilled, (state, action) => {
        state.archiveLoading = false;
        const updatedClassroom = action.payload.data || action.payload;
        
        const index = state.classrooms.findIndex(c => c.classroomId === updatedClassroom.classroomId);
        if (index !== -1) {
          state.classrooms[index] = updatedClassroom;
        }
        
        if (state.currentClassroom?.classroomId === updatedClassroom.classroomId) {
          state.currentClassroom = updatedClassroom;
        }
        
        state.error = null;
      })
      .addCase(toggleArchiveStatusAsync.rejected, (state, action) => {
        state.archiveLoading = false;
        state.error = action.payload;
      })
      // Delete classroom
      .addCase(deleteClassroomAsync.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteClassroomAsync.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.error = null;
      })
      .addCase(deleteClassroomAsync.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })
      // Restore classroom
      .addCase(restoreClassroomAsync.pending, (state) => {
        state.restoreLoading = true;
        state.error = null;
      })
      .addCase(restoreClassroomAsync.fulfilled, (state, action) => {
        state.restoreLoading = false;
        state.error = null;
      })
      .addCase(restoreClassroomAsync.rejected, (state, action) => {
        state.restoreLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCurrentClassroom,
  clearError,
  setFilters,
  setPagination,
  setEnrollmentsFilters,
  setEnrollmentsPagination,
  setDeletedFilters,
  setDeletedPagination,
} = classroomSlice.actions;

export default classroomSlice.reducer;
