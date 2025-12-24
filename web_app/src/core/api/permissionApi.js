import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const permissionApi = {
  /**
   * Get all permissions
   * @returns {Promise<Array>}
   */
  getAll: () => {
    return axiosClient.get(API_ENDPOINTS.PERMISSIONS.GET_ALL);
  },

  /**
   * Get permission by ID
   * @param {number} permissionId
   * @returns {Promise<Object>}
   */
  getById: (permissionId) => {
    return axiosClient.get(API_ENDPOINTS.PERMISSIONS.GET_BY_ID(permissionId));
  },

  /**
   * Get permissions by module
   * @param {string} module
   * @returns {Promise<Array>}
   */
  getByModule: (module) => {
    return axiosClient.get(API_ENDPOINTS.PERMISSIONS.GET_BY_MODULE(module));
  },

  /**
   * Create new permission
   * @param {Object} data - { permissionName, path, method, module }
   * @returns {Promise<Object>}
   */
  create: (data) => {
    return axiosClient.post(API_ENDPOINTS.PERMISSIONS.CREATE, data);
  },

  /**
   * Update permission
   * @param {number} permissionId
   * @param {Object} data - { permissionName, path, method, module }
   * @returns {Promise<Object>}
   */
  update: (permissionId, data) => {
    return axiosClient.put(API_ENDPOINTS.PERMISSIONS.UPDATE(permissionId), data);
  },

  /**
   * Delete permission
   * @param {number} permissionId
   * @returns {Promise<Object>}
   */
  delete: (permissionId) => {
    return axiosClient.delete(API_ENDPOINTS.PERMISSIONS.DELETE(permissionId));
  },
};
