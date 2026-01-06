import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const tutorStatisticsApi = {
  /**
   * Get tutor overview statistics
   * @returns {Promise<Object>} - Overview statistics including total classrooms, students, revenue, etc.
   */
  getOverview: () => {
    return axiosClient.get(API_ENDPOINTS.TUTOR_STATISTICS.GET_OVERVIEW);
  },

  /**
   * Get statistics for each classroom
   * @returns {Promise<Array>} - Array of classroom statistics
   */
  getClassroomStatistics: () => {
    return axiosClient.get(API_ENDPOINTS.TUTOR_STATISTICS.GET_CLASSROOMS);
  },

  /**
   * Get revenue time series data for line chart
   * @param {Object} params - { startDate, endDate, classroomId }
   * @returns {Promise<Array>} - Array of revenue data by date
   */
  getRevenueTimeSeries: (params) => {
    return axiosClient.get(API_ENDPOINTS.TUTOR_STATISTICS.GET_REVENUE_TIME_SERIES, { params });
  },

  /**
   * Get submission time series data for line chart
   * @param {Object} params - { startDate, endDate, classroomId }
   * @returns {Promise<Array>} - Array of submission data by date
   */
  getSubmissionTimeSeries: (params) => {
    return axiosClient.get(API_ENDPOINTS.TUTOR_STATISTICS.GET_SUBMISSION_TIME_SERIES, { params });
  },

  /**
   * Get student performance statistics for a classroom
   * @param {number} classroomId
   * @returns {Promise<Array>} - Array of student performance data
   */
  getStudentPerformance: (classroomId) => {
    return axiosClient.get(API_ENDPOINTS.TUTOR_STATISTICS.GET_STUDENT_PERFORMANCE(classroomId));
  },
};
