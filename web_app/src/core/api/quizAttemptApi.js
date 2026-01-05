import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const quizAttemptApi = {
    /**
     * Create or continue a quiz attempt
     * @param {Object} data - { lessonId }
     * @returns {Promise<Object>}
     */
    create: (data) => {
        return axiosClient.post(API_ENDPOINTS.QUIZ_ATTEMPTS.CREATE, data);
    },

    /**
     * Get quiz attempt by lesson and student (current user)
     * @param {number} lessonId
     * @returns {Promise<Object>}
     */
    getByLessonAndStudent: (lessonId) => {
        return axiosClient.get(API_ENDPOINTS.QUIZ_ATTEMPTS.GET_BY_LESSON_AND_STUDENT(lessonId));
    },

    /**
     * Get all quiz attempts by lesson (for tutors)
     * @param {number} lessonId
     * @returns {Promise<Array>}
     */
    getByLesson: (lessonId) => {
        return axiosClient.get(API_ENDPOINTS.QUIZ_ATTEMPTS.GET_BY_LESSON(lessonId));
    },
};
