import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const profileApi = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: () => {
    return axiosClient.get(API_ENDPOINTS.PROFILE.GET);
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data to update
   * @returns {Promise}
   */
  updateProfile: (data) => {
    return axiosClient.put(API_ENDPOINTS.PROFILE.UPDATE, data);
  },

  /**
   * Change password
   * @param {Object} data - { oldPassword, newPassword }
   * @returns {Promise}
   */
  changePassword: (data) => {
    return axiosClient.put(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, data);
  },
};
