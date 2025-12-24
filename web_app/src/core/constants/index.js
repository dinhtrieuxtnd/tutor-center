// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_BASE_URL = 'https://129qfzjl-5038.asse.devtunnels.ms/api';
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    SEND_OTP_REGISTER: '/Auth/send-otp-register',
    REFRESH_TOKEN: '/Auth/refresh-token',
    LOGOUT: '/Auth/logout',
    FORGOT_PASSWORD: '/Auth/forgot-password',
    RESET_PASSWORD: '/Auth/reset-password',
  },
  // Profile endpoints
  PROFILE: {
    GET: '/Profile',
    UPDATE: '/Profile/update',
    CHANGE_PASSWORD: '/Profile/change-password',
  },
  // Media endpoints
  MEDIA: {
    UPLOAD: '/Media/upload',
    GET_BY_ID: (mediaId) => `/Media/${mediaId}`,
    GET_PAGED: '/Media',
    GET_USER_MEDIA: (userId) => `/Media/user/${userId}`,
    UPDATE: (mediaId) => `/Media/${mediaId}`,
    DELETE: (mediaId) => `/Media/${mediaId}`,
  },
  // Role endpoints
  ROLES: {
    GET_ALL: '/Roles',
    GET_BY_ID: (roleId) => `/Roles/${roleId}`,
    CREATE: '/Roles',
    UPDATE: (roleId) => `/Roles/${roleId}`,
    DELETE: (roleId) => `/Roles/${roleId}`,
    ASSIGN_PERMISSIONS: (roleId) => `/Roles/${roleId}/permissions`,
    TOGGLE_PERMISSION: (roleId, permissionId) => `/Roles/${roleId}/permissions/${permissionId}/toggle`,
  },
  // Permission endpoints
  PERMISSIONS: {
    GET_ALL: '/Permissions',
    GET_BY_ID: (permissionId) => `/Permissions/${permissionId}`,
    GET_BY_MODULE: (module) => `/Permissions/module/${module}`,
    CREATE: '/Permissions',
    UPDATE: (permissionId) => `/Permissions/${permissionId}`,
    DELETE: (permissionId) => `/Permissions/${permissionId}`,
  },
  // Classroom endpoints
  CLASSROOMS: {
    GET_ALL: '/Classroom',
    GET_MY_ENROLLMENTS: '/Classroom/my-enrollments',
    GET_DELETED_LIST: '/Classroom/deleted-list',
    GET_BY_ID: (classroomId) => `/Classroom/${classroomId}`,
    CREATE: '/Classroom',
    UPDATE: (classroomId) => `/Classroom/${classroomId}`,
    TOGGLE_ARCHIVE: (classroomId) => `/Classroom/${classroomId}/archive-status`,
    DELETE: (classroomId) => `/Classroom/${classroomId}`,
    RESTORE: (classroomId) => `/Classroom/${classroomId}/restore`,
  },
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  LOADING_REDIRECT: '/loading',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_PERMISSIONS: '/admin/permissions',
  ADMIN_CLASSROOMS: '/admin/classrooms',
  TUTOR_DASHBOARD: '/tutor/dashboard',
  TUTOR_PROFILE: '/tutor/profile',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  NOT_FOUND: '/404',
};

export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};
