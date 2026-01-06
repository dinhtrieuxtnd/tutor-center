// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_BASE_URL = 'http://localhost:5038/api';
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
  // User endpoints
  USERS: {
    GET_ALL: '/User',
    CREATE_TUTOR: '/User/tutors',
    CHANGE_STATUS: (userId) => `/User/${userId}/status`,
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
  // Classroom Student endpoints
  CLASSROOM_STUDENTS: {
    GET_STUDENTS: (classroomId) => `/ClrStudent/${classroomId}/students`,
    REMOVE_STUDENT: (classroomId, studentId) => `/ClrStudent/${classroomId}/students/${studentId}`,
  },
  // Classroom Chat endpoints
  CLASSROOM_CHAT: {
    SEND_MESSAGE: '/ClassroomChat/messages/send',
    EDIT_MESSAGE: '/ClassroomChat/messages/edit',
    DELETE_MESSAGE: (messageId) => `/ClassroomChat/messages/${messageId}`,
    GET_MESSAGES: '/ClassroomChat/messages',
  },
  // Lesson endpoints
  LESSONS: {
    ASSIGN_LECTURE: '/Lesson/assign-lecture',
    ASSIGN_EXERCISE: '/Lesson/assign-exercise',
    ASSIGN_QUIZ: '/Lesson/assign-quiz',
    GET_BY_CLASSROOM: (classroomId) => `/Lesson/classroom/${classroomId}`,
  },
  // Lecture endpoints
  LECTURES: {
    GET_ALL: '/Lecture',
    GET_BY_ID: (lectureId) => `/Lecture/${lectureId}`,
    CREATE: '/Lecture',
    UPDATE: (lectureId) => `/Lecture/${lectureId}`,
    DELETE: (lectureId) => `/Lecture/${lectureId}`,
  },
  // Exercise endpoints
  EXERCISES: {
    GET_ALL: '/Exercise',
    GET_BY_ID: (exerciseId) => `/Exercise/${exerciseId}`,
    CREATE: '/Exercise',
    UPDATE: (exerciseId) => `/Exercise/${exerciseId}`,
    DELETE: (exerciseId) => `/Exercise/${exerciseId}`,
  },
  // Quiz endpoints
  QUIZZES: {
    GET_ALL: '/Quiz',
    GET_BY_ID: (quizId) => `/Quiz/${quizId}`,
    GET_DETAIL: (quizId) => `/Quiz/${quizId}/detail`,
    GET_FOR_STUDENT: (lessonId) => `/Quiz/lesson/${lessonId}/student`,
    CREATE: '/Quiz',
    UPDATE: (quizId) => `/Quiz/${quizId}`,
    DELETE: (quizId) => `/Quiz/${quizId}`,
  },
  // Question endpoints
  QUESTIONS: {
    CREATE: '/Question',
    UPDATE: (questionId) => `/Question/${questionId}`,
    DELETE: (questionId) => `/Question/${questionId}`,
    ATTACH_MEDIA: (questionId) => `/Question/${questionId}/media`,
    DETACH_MEDIA: (questionId, mediaId) => `/Question/${questionId}/media/${mediaId}`,
    GET_MEDIAS: (questionId) => `/Question/${questionId}/media`,
  },
  // Question Group endpoints
  QGROUPS: {
    CREATE: '/QGroup',
    UPDATE: (qGroupId) => `/QGroup/${qGroupId}`,
    DELETE: (qGroupId) => `/QGroup/${qGroupId}`,
    ATTACH_MEDIA: (qGroupId) => `/QGroup/${qGroupId}/media`,
    DETACH_MEDIA: (qGroupId, mediaId) => `/QGroup/${qGroupId}/media/${mediaId}`,
    GET_MEDIAS: (qGroupId) => `/QGroup/${qGroupId}/media`,
  },
  // Quiz Section endpoints
  QUIZ_SECTIONS: {
    CREATE: '/QuizSection',
    UPDATE: (quizSectionId) => `/QuizSection/${quizSectionId}`,
    DELETE: (quizSectionId) => `/QuizSection/${quizSectionId}`,
  },
  // Question Option endpoints
  OPTIONS: {
    CREATE: '/Option',
    UPDATE: (optionId) => `/Option/${optionId}`,
    DELETE: (optionId) => `/Option/${optionId}`,
    ATTACH_MEDIA: (optionId) => `/Option/${optionId}/media`,
    DETACH_MEDIA: (optionId, mediaId) => `/Option/${optionId}/media/${mediaId}`,
    GET_MEDIAS: (optionId) => `/Option/${optionId}/media`,
  },
  // Quiz Attempt endpoints
  QUIZ_ATTEMPTS: {
    CREATE: '/QuizAttempt',
    GET_BY_LESSON_AND_STUDENT: (lessonId) => `/QuizAttempt/lesson/${lessonId}/student`,
    GET_BY_LESSON: (lessonId) => `/QuizAttempt/lesson/${lessonId}`,
  },
  // Quiz Answer endpoints
  QUIZ_ANSWERS: {
    CREATE: '/QuizAnswer',
    UPDATE: '/QuizAnswer',
    DELETE: (attemptId, questionId) => `/QuizAnswer/attempt/${attemptId}/question/${questionId}`,
  },
  // Payment endpoints
  PAYMENTS: {
    GET_BY_CLASSROOM: (classroomId) => `/Payment/classroom/${classroomId}`,
  },
  // Join Request endpoints
  JOIN_REQUESTS: {
    CREATE: '/JoinRequest',
    GET_BY_CLASSROOM: (classroomId) => `/JoinRequest/classroom/${classroomId}`,
    HANDLE_STATUS: (joinRequestId) => `/JoinRequest/${joinRequestId}/handle`,
    GET_MY_REQUESTS: '/JoinRequest/my-requests',
  },
  // AI Document endpoints
  AI_DOCUMENTS: {
    UPLOAD: '/ai-documents/upload',
    GET_BY_ID: (documentId) => `/ai-documents/${documentId}`,
    GET_ALL: '/ai-documents',
    GET_TEXT: (documentId) => `/ai-documents/${documentId}/text`,
    DELETE: (documentId) => `/ai-documents/${documentId}`,
  },
  // AI Question endpoints
  AI_QUESTIONS: {
    GENERATE: '/ai-questions/generate',
    GET_JOB_STATUS: (jobId) => `/ai-questions/jobs/${jobId}`,
    GET_ALL_JOBS: '/ai-questions/jobs',
    GET_BY_DOCUMENT: (documentId) => `/ai-questions/document/${documentId}`,
    GET_BY_ID: (questionId) => `/ai-questions/${questionId}`,
    UPDATE: (questionId) => `/ai-questions/${questionId}`,
    IMPORT: '/ai-questions/import',
    DELETE: (questionId) => `/ai-questions/${questionId}`,
  },
  // Tutor Statistics endpoints
  TUTOR_STATISTICS: {
    GET_OVERVIEW: '/tutor/statistics/overview',
    GET_CLASSROOMS: '/tutor/statistics/classrooms',
    GET_REVENUE_TIME_SERIES: '/tutor/statistics/revenue-time-series',
    GET_SUBMISSION_TIME_SERIES: '/tutor/statistics/submission-time-series',
    GET_STUDENT_PERFORMANCE: (classroomId) => `/tutor/statistics/students/performance/${classroomId}`,
  },
  // Admin Statistics endpoints
  ADMIN_STATISTICS: {
    GET_OVERVIEW: '/admin/statistics/overview',
    GET_TOP_TUTORS: '/admin/statistics/top-tutors',
    GET_GROWTH_TIME_SERIES: '/admin/statistics/growth-time-series',
    GET_REVENUE_TIME_SERIES: '/admin/statistics/revenue-time-series',
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
  ADMIN_CLASSROOM_DETAIL: '/admin/classrooms/:id',
  ADMIN_TUTORS: '/admin/tutors',
  ADMIN_STUDENTS: '/admin/students',
  TUTOR_DASHBOARD: '/tutor/dashboard',
  TUTOR_CLASSROOMS: '/tutor/classrooms',
  TUTOR_CLASSROOM_DETAIL: '/tutor/classrooms/:id',
  TUTOR_PROFILE: '/tutor/profile',
  TUTOR_LECTURES: '/tutor/lectures',
  TUTOR_EXERCISES: '/tutor/exercises',
  TUTOR_QUIZZES: '/tutor/quizzes',
  TUTOR_QUIZ_DETAIL: '/tutor/quizzes/:id',
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

// Grading method constants for quiz scoring
export const GRADING_METHOD = {
  FIRST: 0,     // Điểm lần đầu tiên
  HIGHEST: 1,   // Điểm cao nhất
  AVERAGE: 2,   // Điểm trung bình
  LATEST: 3,    // Điểm lần cuối
};

// Helper to get label for grading method
export const GRADING_METHOD_LABELS = {
  [GRADING_METHOD.FIRST]: 'Lần đầu tiên',
  [GRADING_METHOD.HIGHEST]: 'Điểm cao nhất',
  [GRADING_METHOD.AVERAGE]: 'Điểm trung bình',
  [GRADING_METHOD.LATEST]: 'Lần cuối cùng',
};
