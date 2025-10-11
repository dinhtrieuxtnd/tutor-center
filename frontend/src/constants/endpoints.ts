// lib/endpoints.ts

// Base paths
const AUTH_BASE = "/Auth"
const STUDENT_BASE = "/students"
const ADMIN_BASE = "/admins"

export const API_ENDPOINTS = {
    auth: {
        login: `${AUTH_BASE}/login`,
        register: `${AUTH_BASE}/register`,
        refresh: `${AUTH_BASE}/refresh`,
        logout: `${AUTH_BASE}/logout`,
        me: `${AUTH_BASE}/me`,
        reset_password_token: `${AUTH_BASE}/reset-password/token`,
        send_email: {
            reset_password: `${AUTH_BASE}/send-reset-password`
        },
    },


    students: {
        getAll: STUDENT_BASE, // GET /students
        me: {
            get: `${STUDENT_BASE}/me`, // GET /students/me
            update: `${STUDENT_BASE}/me`, // PUT /students/me
        },
        getById: (id: number | string) => `${STUDENT_BASE}/${id}`, // GET /students/:id
        updateByAdmin: (id: number | string) => `${STUDENT_BASE}/${id}`, // PUT /students/:id
    },

    admins: {
        getAll: ADMIN_BASE, // GET /admins
        me: {
            get: `${ADMIN_BASE}/me`, // GET /admins/me
            update: `${ADMIN_BASE}/me`, // PUT /admins/me
        },
        getById: (id: number | string) => `${ADMIN_BASE}/${id}`, // GET /admins/:id
        update: (id: number | string) => `${ADMIN_BASE}/${id}`, // PUT /admins/:id
    },
}

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

