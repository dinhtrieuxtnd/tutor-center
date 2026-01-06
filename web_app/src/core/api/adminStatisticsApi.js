import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const adminStatisticsApi = {
  /**
   * Get admin overview statistics (system-wide)
   * @returns {Promise<Object>} - Overview statistics including total tutors, students, classrooms, revenue, etc.
   */
  getOverview: () => {
    return axiosClient.get(API_ENDPOINTS.ADMIN_STATISTICS.GET_OVERVIEW);
  },

  /**
   * Get top tutors ranked by revenue
   * @param {number} limit - Number of top tutors to retrieve (default: 10)
   * @returns {Promise<Array>} - Array of top tutor data
   */
  getTopTutors: (limit = 10) => {
    return axiosClient.get(API_ENDPOINTS.ADMIN_STATISTICS.GET_TOP_TUTORS, { params: { limit } });
  },

  /**
   * Get growth time series data (new tutors, students, classrooms over time)
   * @param {Object} params - { startDate, endDate }
   * @returns {Promise<Array>} - Array of growth data by date
   */
  getGrowthTimeSeries: (params) => {
    return axiosClient.get(API_ENDPOINTS.ADMIN_STATISTICS.GET_GROWTH_TIME_SERIES, { params });
  },

  /**
   * Get system-wide revenue time series data
   * @param {Object} params - { startDate, endDate }
   * @returns {Promise<Array>} - Array of revenue data by date
   */
  getRevenueTimeSeries: (params) => {
    return axiosClient.get(API_ENDPOINTS.ADMIN_STATISTICS.GET_REVENUE_TIME_SERIES, { params });
  },
};
