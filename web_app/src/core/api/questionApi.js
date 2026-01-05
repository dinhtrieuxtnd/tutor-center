import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const questionApi = {
    /**
     * Create new question
     * @param {Object} data - { quizId, content, questionType, points, orderIndex, sectionId, groupId, explanation }
     * @returns {Promise<Object>}
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.QUESTIONS.CREATE, data);
    },

    /**
     * Update question
     * @param {number} questionId
     * @param {Object} data - { content, questionType, points, orderIndex, sectionId, groupId, explanation }
     * @returns {Promise<Object>}
     */
    update: (questionId, data) => {
        return axiosClient.put(API_ENDPOINTS.QUESTIONS.UPDATE(questionId), data);
    },

    /**
     * Delete question
     * @param {number} questionId
     * @returns {Promise<Object>}
     */
    delete: (questionId) => {
        return axiosClient.delete(API_ENDPOINTS.QUESTIONS.DELETE(questionId));
    },

    /**
     * Attach media to question
     * @param {number} questionId
     * @param {Object} data - { mediaId }
     * @returns {Promise<Object>}
     */
    attachMedia: (questionId, data) => {
        return axiosClient.post(API_ENDPOINTS.QUESTIONS.ATTACH_MEDIA(questionId), data);
    },

    /**
     * Detach media from question
     * @param {number} questionId
     * @param {number} mediaId
     * @returns {Promise<Object>}
     */
    detachMedia: (questionId, mediaId) => {
        return axiosClient.delete(API_ENDPOINTS.QUESTIONS.DETACH_MEDIA(questionId, mediaId));
    },

    /**
     * Get all medias attached to a question
     * @param {number} questionId
     * @returns {Promise<Object>}
     */
    getQuestionMedias: (questionId) => {
        return axiosClient.get(API_ENDPOINTS.QUESTIONS.GET_MEDIAS(questionId));
    },
};
