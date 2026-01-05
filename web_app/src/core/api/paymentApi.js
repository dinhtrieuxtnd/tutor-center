import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const paymentApi = {
    /**
     * Get all payments for a classroom (tutor only)
     * @param {number} classroomId
     * @returns {Promise<Array>}
     */
    getByClassroom: (classroomId) => {
        return axiosClient.get(API_ENDPOINTS.PAYMENTS.GET_BY_CLASSROOM(classroomId));
    },
};
