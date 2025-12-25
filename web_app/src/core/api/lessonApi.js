import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const lessonApi = {
  /**
   * Assign a lecture to a classroom (Tutor only)
   * @param {Object} data - { classroomId, lectureId, scheduledDate, dueDate, isActive }
   * @returns {Promise<Object>} - LessonResponseDto
   */
  assignLecture: (data) => {
    return axiosClient.post(API_ENDPOINTS.LESSONS.ASSIGN_LECTURE, data);
  },

  /**
   * Assign an exercise to a classroom (Tutor only)
   * @param {Object} data - { classroomId, exerciseId, scheduledDate, dueDate, isActive }
   * @returns {Promise<Object>} - LessonResponseDto
   */
  assignExercise: (data) => {
    return axiosClient.post(API_ENDPOINTS.LESSONS.ASSIGN_EXERCISE, data);
  },

  /**
   * Assign a quiz to a classroom (Tutor only)
   * @param {Object} data - { classroomId, quizId, scheduledDate, dueDate, isActive }
   * @returns {Promise<Object>} - LessonResponseDto
   */
  assignQuiz: (data) => {
    return axiosClient.post(API_ENDPOINTS.LESSONS.ASSIGN_QUIZ, data);
  },

  /**
   * Get all lessons for a classroom
   * For lectures: returns lecture tree
   * For exercises: returns full information
   * For quizzes: returns basic info with start/end times (no sensitive data)
   * @param {number} classroomId
   * @returns {Promise<Object>} - List<LessonResponseDto>
   */
  getLessonsByClassroom: (classroomId) => {
    return axiosClient.get(API_ENDPOINTS.LESSONS.GET_BY_CLASSROOM(classroomId));
  },
};
