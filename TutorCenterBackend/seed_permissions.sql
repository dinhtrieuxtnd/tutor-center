-- =========================================
-- SEED DATA FOR PERMISSIONS & ROLES
-- =========================================
USE TutorCenterDb;
GO

-- Insert Roles
INSERT INTO Roles (RoleName, Description, CreatedAt, UpdatedAt) VALUES
('Admin', 'System Administrator with full access', GETDATE(), GETDATE()),
('Tutor', 'Teacher who can manage classrooms and lessons', GETDATE(), GETDATE()),
('Student', 'Student who can attend classes and do assignments', GETDATE(), GETDATE());
GO

-- Insert Permissions
INSERT INTO Permissions (PermissionName, Path, Method, Module, CreatedAt, UpdatedAt) VALUES
-- User permissions
('user.view', '/api/users', 'GET', 'User Management', GETDATE(), GETDATE()),
('user.create', '/api/users', 'POST', 'User Management', GETDATE(), GETDATE()),
('user.edit', '/api/users/{id}', 'PUT', 'User Management', GETDATE(), GETDATE()),
('user.delete', '/api/users/{id}', 'DELETE', 'User Management', GETDATE(), GETDATE()),

-- Classroom permissions
('classroom.view', '/api/classrooms', 'GET', 'Classroom Management', GETDATE(), GETDATE()),
('classroom.create', '/api/classrooms', 'POST', 'Classroom Management', GETDATE(), GETDATE()),
('classroom.edit', '/api/classrooms/{id}', 'PUT', 'Classroom Management', GETDATE(), GETDATE()),
('classroom.delete', '/api/classrooms/{id}', 'DELETE', 'Classroom Management', GETDATE(), GETDATE()),
('classroom.manage_students', '/api/classrooms/{id}/students', 'POST', 'Classroom Management', GETDATE(), GETDATE()),
('classroom.view-enrollments', '/api/classrooms/my-enrollments', 'GET', 'Classroom Management', GETDATE(), GETDATE()),
('classroom.archive', '/api/classrooms/{id}/archive-status', 'PATCH', 'Classroom Management', GETDATE(), GETDATE()),
('classroom.restore', '/api/classrooms/{id}/restore', 'PATCH', 'Classroom Management', GETDATE(), GETDATE()),
('classroom.view-deleted', '/api/classrooms/deleted-list', 'GET', 'Classroom Management', GETDATE(), GETDATE()),


-- Join Request permissions
('joinrequest.create', '/api/join-requests', 'POST', 'Join Request Management', GETDATE(), GETDATE()),
('joinrequest.view', '/api/join-requests', 'GET', 'Join Request Management', GETDATE(), GETDATE()),
('joinrequest.handle', '/api/join-requests/{id}/approve', 'PATCH', 'Join Request Management', GETDATE(), GETDATE()),
('joinrequest.view-own', '/api/join-requests/my-requests', 'GET', 'Join Request Management', GETDATE(), GETDATE()),

-- Classroom Student permissions
('classroomstudent.view', '/api/classroom-students/{classroomId}/students', 'GET', 'Classroom Student Management', GETDATE(), GETDATE()),
('classroomstudent.delete', '/api/classroom-students/{classroomId}/students/{studentId}', 'DELETE', 'Classroom Student Management', GETDATE(), GETDATE()),

-- Lesson permissions
('lesson.view', '/api/lessons', 'GET', 'Lesson Management', GETDATE(), GETDATE()),
('lesson.create', '/api/lessons', 'POST', 'Lesson Management', GETDATE(), GETDATE()),
('lesson.edit', '/api/lessons/{id}', 'PUT', 'Lesson Management', GETDATE(), GETDATE()),
('lesson.delete', '/api/lessons/{id}', 'DELETE', 'Lesson Management', GETDATE(), GETDATE()),

-- Exercise permissions
('exercise.view', '/api/exercises', 'GET', 'Exercise Management', GETDATE(), GETDATE()),
('exercise.create', '/api/exercises', 'POST', 'Exercise Management', GETDATE(), GETDATE()),
('exercise.edit', '/api/exercises/{id}', 'PUT', 'Exercise Management', GETDATE(), GETDATE()),
('exercise.delete', '/api/exercises/{id}', 'DELETE', 'Exercise Management', GETDATE(), GETDATE()),
('exercise.grade', '/api/exercises/{id}/grade', 'POST', 'Exercise Management', GETDATE(), GETDATE()),

-- Quiz permissions
('quiz.view', '/api/quizzes', 'GET', 'Quiz Management', GETDATE(), GETDATE()),
('quiz.create', '/api/quizzes', 'POST', 'Quiz Management', GETDATE(), GETDATE()),
('quiz.edit', '/api/quizzes/{id}', 'PUT', 'Quiz Management', GETDATE(), GETDATE()),
('quiz.delete', '/api/quizzes/{id}', 'DELETE', 'Quiz Management', GETDATE(), GETDATE()),
('quiz.grade', '/api/quizzes/{id}/grade', 'POST', 'Quiz Management', GETDATE(), GETDATE()),

-- Lecture permissions
('lecture.view', '/api/lectures', 'GET', 'Lecture Management', GETDATE(), GETDATE()),
('lecture.create', '/api/lectures', 'POST', 'Lecture Management', GETDATE(), GETDATE()),
('lecture.edit', '/api/lectures/{id}', 'PUT', 'Lecture Management', GETDATE(), GETDATE()),
('lecture.delete', '/api/lectures/{id}', 'DELETE', 'Lecture Management', GETDATE(), GETDATE()),

-- Media permissions
('media.upload', '/api/media', 'POST', 'Media Management', GETDATE(), GETDATE()),
('media.delete', '/api/media/{id}', 'DELETE', 'Media Management', GETDATE(), GETDATE()),

-- Report permissions
('report.view', '/api/reports', 'GET', 'Report Management', GETDATE(), GETDATE()),
('report.create', '/api/reports', 'POST', 'Report Management', GETDATE(), GETDATE()),
('report.process', '/api/reports/{id}/process', 'PUT', 'Report Management', GETDATE(), GETDATE()),

-- Payment permissions
('payment.view', '/api/payments', 'GET', 'Payment Management', GETDATE(), GETDATE()),
('payment.process', '/api/payments/process', 'POST', 'Payment Management', GETDATE(), GETDATE()),

-- System administration
('role.view', '/api/roles', 'GET', 'System Administration', GETDATE(), GETDATE()),
('role.manage', '/api/roles', 'POST', 'System Administration', GETDATE(), GETDATE()),
('permission.view', '/api/permissions', 'GET', 'System Administration', GETDATE(), GETDATE()),
('permission.manage', '/api/permissions', 'POST', 'System Administration', GETDATE(), GETDATE()),
('system.settings', '/api/settings', 'PUT', 'System Administration', GETDATE(), GETDATE()),
('activity_log.view', '/api/activity-logs', 'GET', 'System Administration', GETDATE(), GETDATE());
GO

-- =========================================
-- ASSIGN PERMISSIONS TO ROLES
-- =========================================

-- Admin: Full access to everything
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.RoleId, p.PermissionId
FROM Roles r
CROSS JOIN Permissions p
WHERE r.RoleName = 'Admin';
GO

-- Tutor: Can manage classrooms, lessons, exercises, quizzes
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.RoleId, p.PermissionId
FROM Roles r
CROSS JOIN Permissions p
WHERE r.RoleName = 'Tutor'
AND p.PermissionName IN (
    -- Classroom management
    'classroom.view',
    'classroom.manage_students',
    -- Join Request management
    'joinrequest.view',
    'joinrequest.handle',
    -- Classroom Student management
    'classroomstudent.view',
    'classroomstudent.delete',
    -- Lesson management
    'lesson.view',
    'lesson.create',
    'lesson.edit',
    'lesson.delete',
    -- Exercise management
    'exercise.view',
    'exercise.create',
    'exercise.edit',
    'exercise.delete',
    'exercise.grade',
    -- Quiz management
    'quiz.view',
    'quiz.create',
    'quiz.edit',
    'quiz.delete',
    'quiz.grade',
    -- Lecture management
    'lecture.view',
    'lecture.create',
    'lecture.edit',
    'lecture.delete',
    -- Media
    'media.upload',
    'media.delete',
    -- Reports
    'report.view',
    -- Payment
    'payment.view'
);
GO

-- Student: Can view and submit assignments
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.RoleId, p.PermissionId
FROM Roles r
CROSS JOIN Permissions p
WHERE r.RoleName = 'Student'
AND p.PermissionName IN (
    'classroom.view',
    'classroom.view-enrollments',
    'joinrequest.create',
    'joinrequest.view-own',
    'classroomstudent.view',
    'lesson.view',
    'exercise.view',
    'quiz.view',
    'lecture.view',
    'media.upload',
    'report.create'
);
GO

PRINT 'Seed data completed successfully!';
GO
