import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const classroomApi = {
  /**
   * Get classrooms with pagination and filters
   * @param {Object} params - { pageNumber, pageSize, searchTerm, status, etc. }
   * @returns {Promise<Object>} - PageResultDto with items and pagination info
   */
  getAll: (params) => {
    return axiosClient.get(API_ENDPOINTS.CLASSROOMS.GET_ALL, { params });
  },

  /**
   * Get my enrolled classrooms
   * @param {Object} params - { pageNumber, pageSize, searchTerm }
   * @returns {Promise<Object>}
   */
  getMyEnrollments: (params) => {
    return axiosClient.get(API_ENDPOINTS.CLASSROOMS.GET_MY_ENROLLMENTS, { params });
  },

  /**
   * Get deleted classrooms
   * @param {Object} params - { pageNumber, pageSize, searchTerm }
   * @returns {Promise<Object>}
   */
  getDeletedList: (params) => {
    return axiosClient.get(API_ENDPOINTS.CLASSROOMS.GET_DELETED_LIST, { params });
  },

  /**
   * Get classroom by ID
   * @param {number} classroomId
   * @returns {Promise<Object>}
   */
  getById: (classroomId) => {
    return axiosClient.get(API_ENDPOINTS.CLASSROOMS.GET_BY_ID(classroomId));
  },

  /**
   * Create new classroom
   * @param {Object} data - { name, description, startDate, endDate, etc. }
   * @returns {Promise<Object>}
   */
  create: (data) => {
    return axiosClient.post(API_ENDPOINTS.CLASSROOMS.CREATE, data);
  },

  /**
   * Update classroom
   * @param {number} classroomId
   * @param {Object} data - { name, description, startDate, endDate, etc. }
   * @returns {Promise<Object>}
   */
  update: (classroomId, data) => {
    return axiosClient.put(API_ENDPOINTS.CLASSROOMS.UPDATE(classroomId), data);
  },

  /**
   * Toggle archive status
   * @param {number} classroomId
   * @returns {Promise<Object>}
   */
  toggleArchiveStatus: (classroomId) => {
    return axiosClient.patch(API_ENDPOINTS.CLASSROOMS.TOGGLE_ARCHIVE(classroomId));
  },

  /**
   * Delete classroom (soft delete)
   * @param {number} classroomId
   * @returns {Promise<Object>}
   */
  delete: (classroomId) => {
    return axiosClient.delete(API_ENDPOINTS.CLASSROOMS.DELETE(classroomId));
  },

  /**
   * Restore deleted classroom
   * @param {number} classroomId
   * @returns {Promise<Object>}
   */
  restore: (classroomId) => {
    return axiosClient.patch(API_ENDPOINTS.CLASSROOMS.RESTORE(classroomId));
  },
};
