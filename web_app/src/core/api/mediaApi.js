import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const mediaApi = {
  /**
   * Upload media file
   * @param {File} file - File to upload
   * @param {string} visibility - 'public' or 'private'
   * @returns {Promise<Object>} Upload result with media info
   */
  upload: (file, visibility = 'public') => {
    const formData = new FormData();
    formData.append('File', file);
    formData.append('Visibility', visibility);

    return axiosClient.post(API_ENDPOINTS.MEDIA.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Get media by ID
   * @param {number} mediaId - Media ID
   * @returns {Promise<Object>} Media details
   */
  getById: (mediaId) => {
    return axiosClient.get(API_ENDPOINTS.MEDIA.GET_BY_ID(mediaId));
  },

  /**
   * Get paged list of media
   * @param {Object} params - Query parameters (page, pageSize, etc.)
   * @returns {Promise<Object>} Paged result
   */
  getPaged: (params) => {
    return axiosClient.get(API_ENDPOINTS.MEDIA.GET_PAGED, { params });
  },

  /**
   * Get user's media
   * @param {number} userId - User ID
   * @returns {Promise<Array>} List of user's media
   */
  getUserMedia: (userId) => {
    return axiosClient.get(API_ENDPOINTS.MEDIA.GET_USER_MEDIA(userId));
  },

  /**
   * Update media info
   * @param {number} mediaId - Media ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated media
   */
  update: (mediaId, data) => {
    return axiosClient.put(API_ENDPOINTS.MEDIA.UPDATE(mediaId), data);
  },

  /**
   * Delete media
   * @param {number} mediaId - Media ID
   * @returns {Promise}
   */
  delete: (mediaId) => {
    return axiosClient.delete(API_ENDPOINTS.MEDIA.DELETE(mediaId));
  },
};
