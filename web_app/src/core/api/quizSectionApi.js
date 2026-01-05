import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const quizSectionApi = {
    /**
     * Create new quiz section
     * @param {Object} data - { quizId, title, description, orderIndex }
     * @returns {Promise<Object>}
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.QUIZ_SECTIONS.CREATE, data);
    },

    /**
     * Update quiz section
     * @param {number} quizSectionId
     * @param {Object} data - { title, description, orderIndex }
     * @returns {Promise<Object>}
     */
    update: (quizSectionId, data) => {
        return axiosClient.put(API_ENDPOINTS.QUIZ_SECTIONS.UPDATE(quizSectionId), data);
    },

    /**
     * Delete quiz section
     * @param {number} quizSectionId
     * @returns {Promise<Object>}
     */
    delete: (quizSectionId) => {
        return axiosClient.delete(API_ENDPOINTS.QUIZ_SECTIONS.DELETE(quizSectionId));
    },
};
