import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '../constants';

export const roleApi = {
  /**
   * Get all roles
   * @returns {Promise<Array>}
   */
  getAll: () => {
    return axiosClient.get(API_ENDPOINTS.ROLES.GET_ALL);
  },

  /**
   * Get role by ID with permissions
   * @param {number} roleId
   * @returns {Promise<Object>}
   */
  getById: (roleId) => {
    return axiosClient.get(API_ENDPOINTS.ROLES.GET_BY_ID(roleId));
  },

  /**
   * Create new role
   * @param {Object} data - { roleName, description, permissionIds }
   * @returns {Promise<Object>}
   */
  create: (data) => {
    return axiosClient.post(API_ENDPOINTS.ROLES.CREATE, data);
  },

  /**
   * Update role
   * @param {number} roleId
   * @param {Object} data - { roleName, description }
   * @returns {Promise<Object>}
   */
  update: (roleId, data) => {
    return axiosClient.put(API_ENDPOINTS.ROLES.UPDATE(roleId), data);
  },

  /**
   * Delete role
   * @param {number} roleId
   * @returns {Promise<Object>}
   */
  delete: (roleId) => {
    return axiosClient.delete(API_ENDPOINTS.ROLES.DELETE(roleId));
  },

  /**
   * Assign permissions to role
   * @param {number} roleId
   * @param {Array<number>} permissionIds
   * @returns {Promise<Object>}
   */
  assignPermissions: (roleId, permissionIds) => {
    return axiosClient.post(API_ENDPOINTS.ROLES.ASSIGN_PERMISSIONS(roleId), permissionIds);
  },

  /**
   * Toggle permission for role
   * @param {number} roleId
   * @param {number} permissionId
   * @returns {Promise<Object>}
   */
  togglePermission: (roleId, permissionId) => {
    return axiosClient.post(API_ENDPOINTS.ROLES.TOGGLE_PERMISSION(roleId, permissionId));
  },
};
