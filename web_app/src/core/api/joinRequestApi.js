import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const joinRequestApi = {
  /**
   * Create a join request
   * @param {Object} data - { classRoomId }
   * @returns {Promise<Object>} - JoinRequestResponseDto
   */
  create: (data) => {
    return axiosClient.post(API_ENDPOINTS.JOIN_REQUESTS.CREATE, data);
  },

  /**
   * Get join requests by classroom ID (for tutors)
   * @param {number} classroomId
   * @returns {Promise<Array>} - List<JoinRequestResponseDto>
   */
  getByClassroomId: (classroomId) => {
    return axiosClient.get(API_ENDPOINTS.JOIN_REQUESTS.GET_BY_CLASSROOM(classroomId));
  },

  /**
   * Handle join request status (approve/reject)
   * @param {number} joinRequestId
   * @param {Object} data - { status }
   * @returns {Promise<Object>} - JoinRequestResponseDto
   */
  handleStatus: (joinRequestId, data) => {
    return axiosClient.patch(API_ENDPOINTS.JOIN_REQUESTS.HANDLE_STATUS(joinRequestId), data);
  },

  /**
   * Get my join requests (for students)
   * @returns {Promise<Array>} - List<JoinRequestResponseDto>
   */
  getMyRequests: () => {
    return axiosClient.get(API_ENDPOINTS.JOIN_REQUESTS.GET_MY_REQUESTS);
  },
};
