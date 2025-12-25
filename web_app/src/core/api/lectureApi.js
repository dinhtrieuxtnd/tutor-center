import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const lectureApi = {
    /**
     * Get lectures by tutor with pagination and filters
     * @param {Object} params - { pageNumber, pageSize, searchTerm, status, etc. }
     * @returns {Promise<Object>} - PageResultDto with items and pagination info
     */
    getAll: (params) => {
        return axiosClient.get(API_ENDPOINTS.LECTURES.GET_ALL, { params });
    },

    /**
     * Get lecture by ID
     * @param {number} lectureId
     * @returns {Promise<Object>}
     */
    getById: (lectureId) => {
        return axiosClient.get(API_ENDPOINTS.LECTURES.GET_BY_ID(lectureId));
    },

    /**
     * Create new lecture
     * @param {Object} data - { title, description, mediaId, durationMinutes, etc. }
     * @returns {Promise<Object>}
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.LECTURES.CREATE, data);
    },

    /**
     * Update lecture
     * @param {number} lectureId
     * @param {Object} data - { title, description, mediaId, durationMinutes, etc. }
     * @returns {Promise<Object>}
     */
    update: (lectureId, data) => {
        return axiosClient.put(API_ENDPOINTS.LECTURES.UPDATE(lectureId), data);
    },

    /**
     * Delete lecture
     * @param {number} lectureId
     * @returns {Promise<Object>}
     */
    delete: (lectureId) => {
        return axiosClient.delete(API_ENDPOINTS.LECTURES.DELETE(lectureId));
    },
};
