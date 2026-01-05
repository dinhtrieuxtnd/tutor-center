import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const optionApi = {
    /**
     * Create new question option
     * @param {Object} data - { questionId, content, isCorrect, orderIndex }
     * @returns {Promise<Object>}
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.OPTIONS.CREATE, data);
    },

    /**
     * Update question option
     * @param {number} optionId
     * @param {Object} data - { content, isCorrect, orderIndex }
     * @returns {Promise<Object>}
     */
    update: (optionId, data) => {
        return axiosClient.put(API_ENDPOINTS.OPTIONS.UPDATE(optionId), data);
    },

    /**
     * Delete question option
     * @param {number} optionId
     * @returns {Promise<Object>}
     */
    delete: (optionId) => {
        return axiosClient.delete(API_ENDPOINTS.OPTIONS.DELETE(optionId));
    },

    /**
     * Attach media to question option
     * @param {number} optionId
     * @param {Object} data - { mediaId }
     * @returns {Promise<Object>}
     */
    attachMedia: (optionId, data) => {
        return axiosClient.post(API_ENDPOINTS.OPTIONS.ATTACH_MEDIA(optionId), data);
    },

    /**
     * Detach media from question option
     * @param {number} optionId
     * @param {number} mediaId
     * @returns {Promise<Object>}
     */
    detachMedia: (optionId, mediaId) => {
        return axiosClient.delete(API_ENDPOINTS.OPTIONS.DETACH_MEDIA(optionId, mediaId));
    },

    /**
     * Get all medias attached to a question option
     * @param {number} optionId
     * @returns {Promise<Object>}
     */
    getOptionMedias: (optionId) => {
        return axiosClient.get(API_ENDPOINTS.OPTIONS.GET_MEDIAS(optionId));
    },
};
