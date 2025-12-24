import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const clrStudentApi = {
  /**
   * Get all students in a classroom
   * @param {number} classroomId
   * @returns {Promise<Array>} - Array of UserResponseDto (students)
   */
  getStudentsByClassroomId: (classroomId) => {
    return axiosClient.get(API_ENDPOINTS.CLASSROOM_STUDENTS.GET_STUDENTS(classroomId));
  },

  /**
   * Remove a student from classroom
   * @param {number} classroomId
   * @param {number} studentId
   * @returns {Promise<Object>} - Success message
   */
  removeStudentFromClassroom: (classroomId, studentId) => {
    return axiosClient.delete(API_ENDPOINTS.CLASSROOM_STUDENTS.REMOVE_STUDENT(classroomId, studentId));
  },
};
