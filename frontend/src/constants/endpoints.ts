// lib/endpoints.ts

// Base paths
const AUTH_BASE = "/Auth"
const STUDENT_BASE = "/students"
const ADMIN_BASE = "/admins"
const PROFILE_BASE = "/Profile"
const CLASSROOM_BASE = "/Classrooms"
const EXERCISE_BASE = "/Exercises"
const EXERCISE_SUBMISSION_BASE = "/ExerciseSubmissions"
const JOIN_REQUEST_BASE = "/JoinRequests"
const LECTURE_BASE = "/Lectures"
const LESSON_BASE = "/Lessons"
const MEDIA_BASE = "/Media"
const QUIZ_BASE = "/quizzes"
const QUESTION_BASE = "/quizzes/questions"
const QUIZ_ATTEMPT_BASE = "/QuizAttempts"
const QUIZ_ANSWER_BASE = "/quiz-attempts"
const QUIZZES_BASE = "/Quizzes"
const USER_BASE = "/Users"


export const API_ENDPOINTS = {
    auth: {
        login: `${AUTH_BASE}/login`,
        register: `${AUTH_BASE}/register`,
        sendOtpRegister: `${AUTH_BASE}/send-otp-register`,
        refresh: `${AUTH_BASE}/refresh`,
        logout: `${AUTH_BASE}/logout`,
        me: `${AUTH_BASE}/me`,
        forgotPassword: `${AUTH_BASE}/forgot-password`,
        resetPassword: `${AUTH_BASE}/reset-password`,
    },

    profile: {
        changePassword: `${PROFILE_BASE}/change-password`, // POST /Profile/change-password
        me: `${PROFILE_BASE}/me`, // GET /Profile/me
        update: `${PROFILE_BASE}/update`, // PUT /Profile/update
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

    classrooms: {
        getAll: CLASSROOM_BASE, // GET /Classrooms
        create: CLASSROOM_BASE, // POST /Classrooms
        myClassrooms: `${CLASSROOM_BASE}/my-classrooms`, // GET /Classrooms/my-classrooms
        myEnrollments: `${CLASSROOM_BASE}/my-enrollments`, // GET /Classrooms/my-enrollments
        getById: (id: number | string) => `${CLASSROOM_BASE}/${id}`, // GET /Classrooms/:id
        update: (id: number | string) => `${CLASSROOM_BASE}/${id}`, // PUT /Classrooms/:id
        delete: (id: number | string) => `${CLASSROOM_BASE}/${id}`, // DELETE /Classrooms/:id
        archive: (id: number | string) => `${CLASSROOM_BASE}/${id}/archive`, // POST /Classrooms/:id/archive
        students: {
            getAll: (classroomId: number | string) => `${CLASSROOM_BASE}/${classroomId}/students`, // GET /Classrooms/:id/students
            remove: (classroomId: number | string, studentId: number | string) => 
                `${CLASSROOM_BASE}/${classroomId}/students/${studentId}`, // DELETE /Classrooms/:id/students/:studentId
        },
    },

    exercises: {
        myExercises: `${EXERCISE_BASE}/my-exercises`, // GET /Exercises/my-exercises
        create: EXERCISE_BASE, // POST /Exercises
        update: (id: number | string) => `${EXERCISE_BASE}/${id}`, // PUT /Exercises/:id
        delete: (id: number | string) => `${EXERCISE_BASE}/${id}`, // DELETE /Exercises/:id
    },

    exerciseSubmissions: {
        submit: (lessonId: number | string) => `${EXERCISE_SUBMISSION_BASE}/lessons/${lessonId}/submit`, // POST /ExerciseSubmissions/lessons/:lessonId/submit
        getById: (submissionId: number | string) => `${EXERCISE_SUBMISSION_BASE}/${submissionId}`, // GET /ExerciseSubmissions/:submissionId
        delete: (submissionId: number | string) => `${EXERCISE_SUBMISSION_BASE}/${submissionId}`, // DELETE /ExerciseSubmissions/:submissionId
        getByLesson: (lessonId: number | string) => `${EXERCISE_SUBMISSION_BASE}/lessons/${lessonId}`, // GET /ExerciseSubmissions/lessons/:lessonId
        grade: (submissionId: number | string) => `${EXERCISE_SUBMISSION_BASE}/${submissionId}/grade`, // PUT /ExerciseSubmissions/:submissionId/grade
    },

    joinRequests: {
        create: JOIN_REQUEST_BASE, // POST /JoinRequests
        my: `${JOIN_REQUEST_BASE}/my`, // GET /JoinRequests/my
        getByClassroom: (classroomId: number | string) => `${JOIN_REQUEST_BASE}/by-classroom/${classroomId}`, // GET /JoinRequests/by-classroom/:classroomId
        updateStatus: (joinRequestId: number | string) => `${JOIN_REQUEST_BASE}/${joinRequestId}/status`, // PATCH /JoinRequests/:joinRequestId/status
    },

    lectures: {
        getAll: LECTURE_BASE, // GET /Lectures
        create: LECTURE_BASE, // POST /Lectures
        getById: (id: number | string) => `${LECTURE_BASE}/${id}`, // GET /Lectures/:id
        update: (id: number | string) => `${LECTURE_BASE}/${id}`, // PUT /Lectures/:id
        delete: (id: number | string) => `${LECTURE_BASE}/${id}`, // DELETE /Lectures/:id
    },

    lessons: {
        assignLecture: `${LESSON_BASE}/assign-lecture`, // POST /Lessons/assign-lecture
        assignExercise: `${LESSON_BASE}/assign-exercise`, // POST /Lessons/assign-exercise
        assignQuiz: `${LESSON_BASE}/assign-quiz`, // POST /Lessons/assign-quiz
        delete: (lessonId: number | string) => `${LESSON_BASE}/${lessonId}`, // DELETE /Lessons/:lessonId
        getByClassroom: (classroomId: number | string) => `${LESSON_BASE}/classroom/${classroomId}`, // GET /Lessons/classroom/:classroomId
        getByClassroomPublic: (classroomId: number | string) => `${LESSON_BASE}/classroom/${classroomId}/public`, // GET /Lessons/classroom/:classroomId/public
    },

    media: {
        upload: MEDIA_BASE, // POST /Media/upload
        getAll: MEDIA_BASE, // GET /Media
        getById: (mediaId: number | string) => `${MEDIA_BASE}/${mediaId}`, // GET /Media/:mediaId
        update: (mediaId: number | string) => `${MEDIA_BASE}/${mediaId}`, // PATCH /Media/:mediaId
        delete: (mediaId: number | string) => `${MEDIA_BASE}/${mediaId}`, // DELETE /Media/:mediaId
        getByUser: (userId: number | string) => `${MEDIA_BASE}/user/${userId}`, // GET /Media/user/:userId
        getPresigned: (mediaId: number | string) => `${MEDIA_BASE}/${mediaId}/presigned`, // GET /Media/:mediaId/presigned
        download: (mediaId: number | string) => `${MEDIA_BASE}/${mediaId}/download`, // GET /Media/:mediaId/download
    },

    questionGroups: {
        create: (quizId: number | string) => `${QUIZ_BASE}/${quizId}/question-groups`, // POST /quizzes/:quizId/question-groups
        update: (quizId: number | string, id: number | string) => `${QUIZ_BASE}/${quizId}/question-groups/${id}`, // PUT /quizzes/:quizId/question-groups/:id
        delete: (quizId: number | string, id: number | string) => `${QUIZ_BASE}/${quizId}/question-groups/${id}`, // DELETE /quizzes/:quizId/question-groups/:id
        addMedia: (quizId: number | string, id: number | string) => `${QUIZ_BASE}/${quizId}/question-groups/${id}/media`, // POST /quizzes/:quizId/question-groups/:id/media
        deleteMedia: (quizId: number | string, id: number | string, mediaId: number | string) => `${QUIZ_BASE}/${quizId}/question-groups/${id}/media/${mediaId}`, // DELETE /quizzes/:quizId/question-groups/:id/media/:mediaId
    },

    questionOptions: {
        create: (questionId: number | string) => `${QUESTION_BASE}/${questionId}/options`, // POST /quizzes/questions/:questionId/options
        update: (questionId: number | string, id: number | string) => `${QUESTION_BASE}/${questionId}/options/${id}`, // PUT /quizzes/questions/:questionId/options/:id
        delete: (questionId: number | string, id: number | string) => `${QUESTION_BASE}/${questionId}/options/${id}`, // DELETE /quizzes/questions/:questionId/options/:id
        addMedia: (questionId: number | string, id: number | string) => `${QUESTION_BASE}/${questionId}/options/${id}/media`, // POST /quizzes/questions/:questionId/options/:id/media
        deleteMedia: (questionId: number | string, id: number | string, mediaId: number | string) => `${QUESTION_BASE}/${questionId}/options/${id}/media/${mediaId}`, // DELETE /quizzes/questions/:questionId/options/:id/media/:mediaId
    },

    quizAnswers: {
        create: (attemptId: number | string) => `${QUIZ_ANSWER_BASE}/${attemptId}/answers`, // POST /quiz-attempts/:attemptId/answers
        update: (attemptId: number | string, questionId: number | string) => `${QUIZ_ANSWER_BASE}/${attemptId}/answers/${questionId}`, // PUT /quiz-attempts/:attemptId/answers/:questionId
        delete: (attemptId: number | string, questionId: number | string) => `${QUIZ_ANSWER_BASE}/${attemptId}/answers/${questionId}`, // DELETE /quiz-attempts/:attemptId/answers/:questionId
    },

    quizAttempts: {
        create: (lessonId: number | string) => `${QUIZ_ATTEMPT_BASE}/lessons/${lessonId}`, // POST /QuizAttempts/lessons/:lessonId
        getById: (attemptId: number | string) => `${QUIZ_ATTEMPT_BASE}/${attemptId}`, // GET /QuizAttempts/:attemptId
        getScores: (lessonId: number | string) => `${QUIZ_ATTEMPT_BASE}/lessons/${lessonId}/scores`, // GET /QuizAttempts/lessons/:lessonId/scores
        getDetail: (attemptId: number | string) => `${QUIZ_ATTEMPT_BASE}/${attemptId}/detail`, // GET /QuizAttempts/:attemptId/detail
    },

    quizQuestions: {
        create: (quizId: number | string) => `${QUIZ_BASE}/${quizId}/questions`, // POST /quizzes/:quizId/questions
        update: (quizId: number | string, id: number | string) => `${QUIZ_BASE}/${quizId}/questions/${id}`, // PUT /quizzes/:quizId/questions/:id
        delete: (quizId: number | string, id: number | string) => `${QUIZ_BASE}/${quizId}/questions/${id}`, // DELETE /quizzes/:quizId/questions/:id
        addMedia: (quizId: number | string, id: number | string) => `${QUIZ_BASE}/${quizId}/questions/${id}/media`, // POST /quizzes/:quizId/questions/:id/media
        deleteMedia: (quizId: number | string, id: number | string, mediaId: number | string) => `${QUIZ_BASE}/${quizId}/questions/${id}/media/${mediaId}`, // DELETE /quizzes/:quizId/questions/:id/media/:mediaId
    },

    quizSections: {
        create: (quizId: number | string) => `${QUIZ_BASE}/${quizId}/sections`, // POST /quizzes/:quizId/sections
        update: (quizId: number | string, id: number | string) => `${QUIZ_BASE}/${quizId}/sections/${id}`, // PUT /quizzes/:quizId/sections/:id
        delete: (quizId: number | string, id: number | string) => `${QUIZ_BASE}/${quizId}/sections/${id}`, // DELETE /quizzes/:quizId/sections/:id
    },

    quizzes: {
        getAll: QUIZZES_BASE, // GET /Quizzes
        create: QUIZZES_BASE, // POST /Quizzes
        getById: (id: number | string) => `${QUIZZES_BASE}/${id}`, // GET /Quizzes/:id
        update: (id: number | string) => `${QUIZZES_BASE}/${id}`, // PUT /Quizzes/:id
        delete: (id: number | string) => `${QUIZZES_BASE}/${id}`, // DELETE /Quizzes/:id
    },

    users: {
        getStudents: `${USER_BASE}/students`, // GET /Users/students
        getTutors: `${USER_BASE}/tutors`, // GET /Users/tutors
        createTutor: `${USER_BASE}/tutors`, // POST /Users/tutors
        updateStatus: (userId: number | string) => `${USER_BASE}/${userId}/status`, // PATCH /Users/:userId/status
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

