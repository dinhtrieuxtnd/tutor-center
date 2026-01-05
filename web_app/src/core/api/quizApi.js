import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const quizApi = {
    /**
     * Get quizzes by tutor with pagination and filters
     * @param {Object} params - { pageNumber, pageSize, searchTerm, status, etc. }
     * @returns {Promise<Object>} - PageResultDto with items and pagination info
     */
    getAll: (params) => {
        return axiosClient.get(API_ENDPOINTS.QUIZZES.GET_ALL, { params });
    },

    /**
     * Get quiz by ID
     * @param {number} quizId
     * @returns {Promise<Object>}
     */
    getById: (quizId) => {
        return axiosClient.get(API_ENDPOINTS.QUIZZES.GET_BY_ID(quizId));
    },

    /**
     * Get quiz detail (with questions)
     * @param {number} quizId
     * @returns {Promise<Object>}
     */
    getDetail: (quizId) => {
        return axiosClient.get(API_ENDPOINTS.QUIZZES.GET_DETAIL(quizId));
    },

    /**
     * Get quiz for student (without correct answers)
     * @param {number} lessonId
     * @returns {Promise<Object>}
     */
    getForStudent: (lessonId) => {
        return axiosClient.get(API_ENDPOINTS.QUIZZES.GET_FOR_STUDENT(lessonId));
    },

    /**
     * Create new quiz
     * @param {Object} data - { title, description, questions, etc. }
     * @returns {Promise<Object>}
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.QUIZZES.CREATE, data);
    },

    /**
     * Update quiz
     * @param {number} quizId
     * @param {Object} data - { title, description, questions, etc. }
     * @returns {Promise<Object>}
     */
    update: (quizId, data) => {
        return axiosClient.put(API_ENDPOINTS.QUIZZES.UPDATE(quizId), data);
    },
    /**
     * Delete quiz (soft delete)
     * @param {number} quizId
     * @returns {Promise<Object>}
     */
    delete: (quizId) => {
        return axiosClient.delete(API_ENDPOINTS.QUIZZES.DELETE(quizId));
    },};
