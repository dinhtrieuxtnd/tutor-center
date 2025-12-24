import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const userApi = {
  /**
   * Get users with pagination and filters
   * @param {Object} params - { page, limit, search, roleId, isLocked, etc. }
   * @returns {Promise<Object>} - PageResultDto with items and pagination info
   */
  getAll: (params) => {
    return axiosClient.get(API_ENDPOINTS.USERS.GET_ALL, { params });
  },

  /**
   * Create tutor account
   * @param {Object} data - { email, password, fullName, phoneNumber, etc. }
   * @returns {Promise<Object>}
   */
  createTutor: (data) => {
    return axiosClient.post(API_ENDPOINTS.USERS.CREATE_TUTOR, data);
  },

  /**
   * Change user status (lock/unlock)
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  changeStatus: (userId) => {
    return axiosClient.patch(API_ENDPOINTS.USERS.CHANGE_STATUS(userId));
  },
};
