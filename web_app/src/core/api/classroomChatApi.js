import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const classroomChatApi = {
  /**
   * Send a message in classroom chat
   * @param {Object} data - { classroomId, content, mediaIds }
   * @returns {Promise<Object>} - ChatMessageResponseDto
   */
  sendMessage: (data) => {
    return axiosClient.post(API_ENDPOINTS.CLASSROOM_CHAT.SEND_MESSAGE, data);
  },

  /**
   * Edit an existing message
   * @param {Object} data - { messageId, content, mediaIds }
   * @returns {Promise<Object>} - ChatMessageResponseDto
   */
  editMessage: (data) => {
    return axiosClient.put(API_ENDPOINTS.CLASSROOM_CHAT.EDIT_MESSAGE, data);
  },

  /**
   * Delete a message
   * @param {number} messageId
   * @returns {Promise<Object>} - Success message
   */
  deleteMessage: (messageId) => {
    return axiosClient.delete(API_ENDPOINTS.CLASSROOM_CHAT.DELETE_MESSAGE(messageId));
  },

  /**
   * Get messages in a classroom chat with pagination
   * @param {Object} params - { classroomId, pageNumber, pageSize, beforeDate }
   * @returns {Promise<Object>} - PageResultDto with ChatMessageResponseDto items
   */
  getMessages: (params) => {
    return axiosClient.get(API_ENDPOINTS.CLASSROOM_CHAT.GET_MESSAGES, { params });
  },
};
