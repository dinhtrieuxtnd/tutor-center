import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tutorStatisticsApi } from '../../../core/api/tutorStatisticsApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  // Overview statistics
  overview: null,
  overviewLoading: false,
  overviewError: null,

  // Classroom statistics
  classroomStats: [],
  classroomStatsLoading: false,
  classroomStatsError: null,

  // Revenue time series
  revenueTimeSeries: [],
  revenueTimeSeriesLoading: false,
  revenueTimeSeriesError: null,

  // Submission time series
  submissionTimeSeries: [],
  submissionTimeSeriesLoading: false,
  submissionTimeSeriesError: null,

  // Student performance
  studentPerformance: [],
  studentPerformanceLoading: false,
  studentPerformanceError: null,
};

// ========== Async Thunks ==========

/**
 * Get tutor overview statistics
 */
export const getOverviewStatisticsAsync = createAsyncThunk(
  'tutorStatistics/getOverview',
  async (_, thunkAPI) => {
    return handleAsyncThunk(
      () => tutorStatisticsApi.getOverview(),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lấy thống kê tổng quan thất bại',
      }
    );
  }
);

/**
 * Get statistics for each classroom
 */
export const getClassroomStatisticsAsync = createAsyncThunk(
  'tutorStatistics/getClassrooms',
  async (_, thunkAPI) => {
    return handleAsyncThunk(
      () => tutorStatisticsApi.getClassroomStatistics(),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lấy thống kê lớp học thất bại',
      }
    );
  }
);

/**
 * Get revenue time series data
 * @param {Object} params - { startDate, endDate, classroomId }
 */
export const getRevenueTimeSeriesAsync = createAsyncThunk(
  'tutorStatistics/getRevenueTimeSeries',
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => tutorStatisticsApi.getRevenueTimeSeries(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lấy dữ liệu doanh thu thất bại',
      }
    );
  }
);

/**
 * Get submission time series data
 * @param {Object} params - { startDate, endDate, classroomId }
 */
export const getSubmissionTimeSeriesAsync = createAsyncThunk(
  'tutorStatistics/getSubmissionTimeSeries',
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => tutorStatisticsApi.getSubmissionTimeSeries(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lấy dữ liệu bài nộp thất bại',
      }
    );
  }
);

/**
 * Get student performance statistics
 * @param {number} classroomId
 */
export const getStudentPerformanceAsync = createAsyncThunk(
  'tutorStatistics/getStudentPerformance',
  async (classroomId, thunkAPI) => {
    return handleAsyncThunk(
      () => tutorStatisticsApi.getStudentPerformance(classroomId),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lấy thống kê học sinh thất bại',
      }
    );
  }
);

// ========== Slice ==========
const tutorStatisticsSlice = createSlice({
  name: 'tutorStatistics',
  initialState,
  reducers: {
    clearOverview: (state) => {
      state.overview = null;
      state.overviewError = null;
    },
    clearClassroomStats: (state) => {
      state.classroomStats = [];
      state.classroomStatsError = null;
    },
    clearRevenueTimeSeries: (state) => {
      state.revenueTimeSeries = [];
      state.revenueTimeSeriesError = null;
    },
    clearSubmissionTimeSeries: (state) => {
      state.submissionTimeSeries = [];
      state.submissionTimeSeriesError = null;
    },
    clearStudentPerformance: (state) => {
      state.studentPerformance = [];
      state.studentPerformanceError = null;
    },
    clearAllStatistics: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Overview Statistics
      .addCase(getOverviewStatisticsAsync.pending, (state) => {
        state.overviewLoading = true;
        state.overviewError = null;
      })
      .addCase(getOverviewStatisticsAsync.fulfilled, (state, action) => {
        state.overviewLoading = false;
        state.overview = action.payload;
      })
      .addCase(getOverviewStatisticsAsync.rejected, (state, action) => {
        state.overviewLoading = false;
        state.overviewError = action.payload;
      })

      // Get Classroom Statistics
      .addCase(getClassroomStatisticsAsync.pending, (state) => {
        state.classroomStatsLoading = true;
        state.classroomStatsError = null;
      })
      .addCase(getClassroomStatisticsAsync.fulfilled, (state, action) => {
        state.classroomStatsLoading = false;
        state.classroomStats = action.payload;
      })
      .addCase(getClassroomStatisticsAsync.rejected, (state, action) => {
        state.classroomStatsLoading = false;
        state.classroomStatsError = action.payload;
      })

      // Get Revenue Time Series
      .addCase(getRevenueTimeSeriesAsync.pending, (state) => {
        state.revenueTimeSeriesLoading = true;
        state.revenueTimeSeriesError = null;
      })
      .addCase(getRevenueTimeSeriesAsync.fulfilled, (state, action) => {
        state.revenueTimeSeriesLoading = false;
        state.revenueTimeSeries = action.payload;
      })
      .addCase(getRevenueTimeSeriesAsync.rejected, (state, action) => {
        state.revenueTimeSeriesLoading = false;
        state.revenueTimeSeriesError = action.payload;
      })

      // Get Submission Time Series
      .addCase(getSubmissionTimeSeriesAsync.pending, (state) => {
        state.submissionTimeSeriesLoading = true;
        state.submissionTimeSeriesError = null;
      })
      .addCase(getSubmissionTimeSeriesAsync.fulfilled, (state, action) => {
        state.submissionTimeSeriesLoading = false;
        state.submissionTimeSeries = action.payload;
      })
      .addCase(getSubmissionTimeSeriesAsync.rejected, (state, action) => {
        state.submissionTimeSeriesLoading = false;
        state.submissionTimeSeriesError = action.payload;
      })

      // Get Student Performance
      .addCase(getStudentPerformanceAsync.pending, (state) => {
        state.studentPerformanceLoading = true;
        state.studentPerformanceError = null;
      })
      .addCase(getStudentPerformanceAsync.fulfilled, (state, action) => {
        state.studentPerformanceLoading = false;
        state.studentPerformance = action.payload;
      })
      .addCase(getStudentPerformanceAsync.rejected, (state, action) => {
        state.studentPerformanceLoading = false;
        state.studentPerformanceError = action.payload;
      });
  },
});

export const {
  clearOverview,
  clearClassroomStats,
  clearRevenueTimeSeries,
  clearSubmissionTimeSeries,
  clearStudentPerformance,
  clearAllStatistics,
} = tutorStatisticsSlice.actions;

export default tutorStatisticsSlice.reducer;
