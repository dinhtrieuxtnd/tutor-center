import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const exerciseApi = {
    /**
     * Get exercises by tutor with pagination and filters
     * @param {Object} params - { pageNumber, pageSize, searchTerm, status, etc. }
     * @returns {Promise<Object>} - PageResultDto with items and pagination info
     */
    getAll: (params) => {
        return axiosClient.get(API_ENDPOINTS.EXERCISES.GET_ALL, { params });
    },

    /**
     * Get exercise by ID
     * @param {number} exerciseId
     * @returns {Promise<Object>}
     */
    getById: (exerciseId) => {
        return axiosClient.get(API_ENDPOINTS.EXERCISES.GET_BY_ID(exerciseId));
    },

    /**
     * Create new exercise
     * @param {Object} data - { title, description, mediaId, etc. }
     * @returns {Promise<Object>}
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.EXERCISES.CREATE, data);
    },

    /**
     * Update exercise
     * @param {number} exerciseId
     * @param {Object} data - { title, description, mediaId, etc. }
     * @returns {Promise<Object>}
     */
    update: (exerciseId, data) => {
        return axiosClient.put(API_ENDPOINTS.EXERCISES.UPDATE(exerciseId), data);
    },

    /**
     * Delete exercise
     * @param {number} exerciseId
     * @returns {Promise<Object>}
     */
    delete: (exerciseId) => {
        return axiosClient.delete(API_ENDPOINTS.EXERCISES.DELETE(exerciseId));
    },
};
