import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const authApi = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<{accessToken: string, refreshToken: string}>}
   */
  login: (credentials) => {
    return axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  /**
   * Register new user
   * @param {Object} data - { email, password, fullName, otp }
   * @returns {Promise}
   */
  register: (data) => {
    return axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  /**
   * Send OTP for registration
   * @param {Object} data - { email }
   * @returns {Promise}
   */
  sendOtpRegister: (data) => {
    return axiosClient.post(API_ENDPOINTS.AUTH.SEND_OTP_REGISTER, data);
  },

  /**
   * Refresh access token
   * @param {Object} data - { refreshToken }
   * @returns {Promise<{accessToken: string, refreshToken: string}>}
   */
  refreshToken: (data) => {
    return axiosClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, data);
  },

  /**
   * Logout user
   * @param {Object} data - { refreshToken }
   * @returns {Promise}
   */
  logout: (data) => {
    return axiosClient.delete(API_ENDPOINTS.AUTH.LOGOUT, { data });
  },

  /**
   * Send forgot password request
   * @param {Object} data - { email }
   * @returns {Promise}
   */
  forgotPassword: (data) => {
    return axiosClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  /**
   * Reset password
   * @param {Object} data - { email, password, otp }
   * @returns {Promise}
   */
  resetPassword: (data) => {
    return axiosClient.put(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },
};
