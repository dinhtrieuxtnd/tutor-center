import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminStatisticsApi } from '../../../core/api/adminStatisticsApi';
import { handleAsyncThunk } from '../../../shared/utils/asyncThunkHelper';

const initialState = {
  // Overview statistics
  overview: null,
  overviewLoading: false,
  overviewError: null,

  // Top tutors
  topTutors: [],
  topTutorsLoading: false,
  topTutorsError: null,

  // Growth time series
  growthTimeSeries: [],
  growthTimeSeriesLoading: false,
  growthTimeSeriesError: null,

  // Revenue time series
  revenueTimeSeries: [],
  revenueTimeSeriesLoading: false,
  revenueTimeSeriesError: null,
};

// ========== Async Thunks ==========

/**
 * Get admin overview statistics (system-wide)
 */
export const getOverviewStatisticsAsync = createAsyncThunk(
  'adminStatistics/getOverview',
  async (_, thunkAPI) => {
    return handleAsyncThunk(
      () => adminStatisticsApi.getOverview(),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lấy thống kê tổng quan thất bại',
      }
    );
  }
);

/**
 * Get top tutors ranked by revenue
 * @param {number} limit - Number of top tutors to retrieve
 */
export const getTopTutorsAsync = createAsyncThunk(
  'adminStatistics/getTopTutors',
  async (limit = 10, thunkAPI) => {
    return handleAsyncThunk(
      () => adminStatisticsApi.getTopTutors(limit),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lấy danh sách gia sư hàng đầu thất bại',
      }
    );
  }
);

/**
 * Get growth time series data
 * @param {Object} params - { startDate, endDate }
 */
export const getGrowthTimeSeriesAsync = createAsyncThunk(
  'adminStatistics/getGrowthTimeSeries',
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => adminStatisticsApi.getGrowthTimeSeries(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lấy dữ liệu tăng trưởng thất bại',
      }
    );
  }
);

/**
 * Get system-wide revenue time series data
 * @param {Object} params - { startDate, endDate }
 */
export const getRevenueTimeSeriesAsync = createAsyncThunk(
  'adminStatistics/getRevenueTimeSeries',
  async (params, thunkAPI) => {
    return handleAsyncThunk(
      () => adminStatisticsApi.getRevenueTimeSeries(params),
      thunkAPI,
      {
        showSuccess: false,
        errorTitle: 'Lấy dữ liệu doanh thu thất bại',
      }
    );
  }
);

// ========== Slice ==========
const adminStatisticsSlice = createSlice({
  name: 'adminStatistics',
  initialState,
  reducers: {
    clearOverview: (state) => {
      state.overview = null;
      state.overviewError = null;
    },
    clearTopTutors: (state) => {
      state.topTutors = [];
      state.topTutorsError = null;
    },
    clearGrowthTimeSeries: (state) => {
      state.growthTimeSeries = [];
      state.growthTimeSeriesError = null;
    },
    clearRevenueTimeSeries: (state) => {
      state.revenueTimeSeries = [];
      state.revenueTimeSeriesError = null;
    },
    clearAllStatistics: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ===== Get Overview Statistics =====
    builder
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
        state.overviewError = action.error.message;
      });

    // ===== Get Top Tutors =====
    builder
      .addCase(getTopTutorsAsync.pending, (state) => {
        state.topTutorsLoading = true;
        state.topTutorsError = null;
      })
      .addCase(getTopTutorsAsync.fulfilled, (state, action) => {
        state.topTutorsLoading = false;
        state.topTutors = action.payload;
      })
      .addCase(getTopTutorsAsync.rejected, (state, action) => {
        state.topTutorsLoading = false;
        state.topTutorsError = action.error.message;
      });

    // ===== Get Growth Time Series =====
    builder
      .addCase(getGrowthTimeSeriesAsync.pending, (state) => {
        state.growthTimeSeriesLoading = true;
        state.growthTimeSeriesError = null;
      })
      .addCase(getGrowthTimeSeriesAsync.fulfilled, (state, action) => {
        state.growthTimeSeriesLoading = false;
        state.growthTimeSeries = action.payload;
      })
      .addCase(getGrowthTimeSeriesAsync.rejected, (state, action) => {
        state.growthTimeSeriesLoading = false;
        state.growthTimeSeriesError = action.error.message;
      });

    // ===== Get Revenue Time Series =====
    builder
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
        state.revenueTimeSeriesError = action.error.message;
      });
  },
});

export const {
  clearOverview,
  clearTopTutors,
  clearGrowthTimeSeries,
  clearRevenueTimeSeries,
  clearAllStatistics,
} = adminStatisticsSlice.actions;

export default adminStatisticsSlice.reducer;
