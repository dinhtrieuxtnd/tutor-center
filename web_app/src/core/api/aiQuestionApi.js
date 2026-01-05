import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const aiQuestionApi = {
    /**
     * Generate questions from a document using AI
     * @param {Object} data - { documentId, numberOfQuestions, difficultyLevel, questionTypes }
     * @returns {Promise<Object>}
     */
    generate: (data) => {
        return axiosClient.post(API_ENDPOINTS.AI_QUESTIONS.GENERATE, data);
    },

    /**
     * Get generation job status and results
     * @param {number} jobId
     * @returns {Promise<Object>}
     */
    getJobStatus: (jobId) => {
        return axiosClient.get(API_ENDPOINTS.AI_QUESTIONS.GET_JOB_STATUS(jobId));
    },

    /**
     * Get all generation jobs for current user
     * @returns {Promise<Array>}
     */
    getAllJobs: () => {
        return axiosClient.get(API_ENDPOINTS.AI_QUESTIONS.GET_ALL_JOBS);
    },

    /**
     * Get all generated questions from a document
     * @param {number} documentId
     * @returns {Promise<Array>}
     */
    getByDocument: (documentId) => {
        return axiosClient.get(API_ENDPOINTS.AI_QUESTIONS.GET_BY_DOCUMENT(documentId));
    },

    /**
     * Get a specific generated question by ID
     * @param {number} questionId
     * @returns {Promise<Object>}
     */
    getById: (questionId) => {
        return axiosClient.get(API_ENDPOINTS.AI_QUESTIONS.GET_BY_ID(questionId));
    },

    /**
     * Edit a generated question before importing to quiz
     * @param {number} questionId
     * @param {Object} data - { generatedQuestionId, questionText, options, correctAnswerIndexes, explanation }
     * @returns {Promise<Object>}
     */
    update: (questionId, data) => {
        return axiosClient.put(API_ENDPOINTS.AI_QUESTIONS.UPDATE(questionId), data);
    },

    /**
     * Import selected generated questions to an existing quiz
     * @param {Object} data - { quizId, generatedQuestionIds, sectionId?, groupId? }
     * @returns {Promise<Object>}
     */
    import: (data) => {
        return axiosClient.post(API_ENDPOINTS.AI_QUESTIONS.IMPORT, data);
    },

    /**
     * Delete a generated question
     * @param {number} questionId
     * @returns {Promise<Object>}
     */
    delete: (questionId) => {
        return axiosClient.delete(API_ENDPOINTS.AI_QUESTIONS.DELETE(questionId));
    },
};
