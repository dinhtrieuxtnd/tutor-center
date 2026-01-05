import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const quizAnswerApi = {
    /**
     * Create/submit an answer for a quiz question
     * @param {Object} data - { attemptId, questionId, selectedOptionIds }
     * @returns {Promise<Object>}
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.QUIZ_ANSWERS.CREATE, data);
    },

    /**
     * Update an answer for a quiz question
     * @param {Object} data - { attemptId, questionId, selectedOptionIds }
     * @returns {Promise<Object>}
     */
    update: (data) => {
        return axiosClient.put(API_ENDPOINTS.QUIZ_ANSWERS.UPDATE, data);
    },

    /**
     * Delete an answer for a quiz question
     * @param {number} attemptId
     * @param {number} questionId
     * @returns {Promise<Object>}
     */
    delete: (attemptId, questionId) => {
        return axiosClient.delete(API_ENDPOINTS.QUIZ_ANSWERS.DELETE(attemptId, questionId));
    },
};
