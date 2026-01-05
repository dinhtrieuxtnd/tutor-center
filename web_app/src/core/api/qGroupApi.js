import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const qGroupApi = {
    /**
     * Create new question group
     * @param {Object} data - { quizId, title, introText, orderIndex, shuffleInside, sectionId }
     * @returns {Promise<Object>}
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.QGROUPS.CREATE, data);
    },

    /**
     * Update question group
     * @param {number} qGroupId
     * @param {Object} data - { title, introText, orderIndex, shuffleInside, sectionId }
     * @returns {Promise<Object>}
     */
    update: (qGroupId, data) => {
        return axiosClient.put(API_ENDPOINTS.QGROUPS.UPDATE(qGroupId), data);
    },

    /**
     * Delete question group
     * @param {number} qGroupId
     * @returns {Promise<Object>}
     */
    delete: (qGroupId) => {
        return axiosClient.delete(API_ENDPOINTS.QGROUPS.DELETE(qGroupId));
    },

    /**
     * Attach media to question group
     * @param {number} qGroupId
     * @param {Object} data - { mediaId }
     * @returns {Promise<Object>}
     */
    attachMedia: (qGroupId, data) => {
        return axiosClient.post(API_ENDPOINTS.QGROUPS.ATTACH_MEDIA(qGroupId), data);
    },

    /**
     * Detach media from question group
     * @param {number} qGroupId
     * @param {number} mediaId
     * @returns {Promise<Object>}
     */
    detachMedia: (qGroupId, mediaId) => {
        return axiosClient.delete(API_ENDPOINTS.QGROUPS.DETACH_MEDIA(qGroupId, mediaId));
    },

    /**
     * Get all medias attached to a question group
     * @param {number} qGroupId
     * @returns {Promise<Object>}
     */
    getQGroupMedias: (qGroupId) => {
        return axiosClient.get(API_ENDPOINTS.QGROUPS.GET_MEDIAS(qGroupId));
    },
};
