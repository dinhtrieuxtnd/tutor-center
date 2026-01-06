-- =========================================
-- ADD EXERCISE SUBMISSION PERMISSIONS
-- =========================================
USE TutorCenterDb;
GO

-- Insert Exercise Submission Permissions
INSERT INTO Permissions (PermissionName, Path, Method, Module, CreatedAt, UpdatedAt) VALUES
('exercise_submission.submit', '/api/ExerciseSubmissions', 'POST', 'Exercise Submission Management', GETDATE(), GETDATE()),
('exercise_submission.view', '/api/ExerciseSubmissions/{id}', 'GET', 'Exercise Submission Management', GETDATE(), GETDATE()),
('exercise_submission.delete', '/api/ExerciseSubmissions/{id}', 'DELETE', 'Exercise Submission Management', GETDATE(), GETDATE()),
('exercise_submission.grade', '/api/ExerciseSubmissions/{id}/grade', 'PATCH', 'Exercise Submission Management', GETDATE(), GETDATE()),
('exercise_submission.view_all', '/api/ExerciseSubmissions/lessons/{lessonId}/submissions', 'GET', 'Exercise Submission Management', GETDATE(), GETDATE()),
('exercise_submission.view_my', '/api/ExerciseSubmissions/lessons/{lessonId}/my-submission', 'GET', 'Exercise Submission Management', GETDATE(), GETDATE());
GO

-- Assign to Admin (all permissions)
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.RoleId, p.PermissionId
FROM Roles r
CROSS JOIN Permissions p
WHERE r.RoleName = 'Admin'
AND p.PermissionName LIKE 'exercise_submission.%'
AND NOT EXISTS (
    SELECT 1 FROM RolePermissions rp 
    WHERE rp.RoleId = r.RoleId AND rp.PermissionId = p.PermissionId
);
GO

-- Assign to Tutor (view, grade submissions)
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.RoleId, p.PermissionId
FROM Roles r
CROSS JOIN Permissions p
WHERE r.RoleName = 'Tutor'
AND p.PermissionName IN (
    'exercise_submission.view',
    'exercise_submission.view_all',
    'exercise_submission.grade'
)
AND NOT EXISTS (
    SELECT 1 FROM RolePermissions rp 
    WHERE rp.RoleId = r.RoleId AND rp.PermissionId = p.PermissionId
);
GO

-- Assign to Student (submit, view own, delete own)
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.RoleId, p.PermissionId
FROM Roles r
CROSS JOIN Permissions p
WHERE r.RoleName = 'Student'
AND p.PermissionName IN (
    'exercise_submission.submit',
    'exercise_submission.view',
    'exercise_submission.view_my',
    'exercise_submission.delete'
)
AND NOT EXISTS (
    SELECT 1 FROM RolePermissions rp 
    WHERE rp.RoleId = r.RoleId AND rp.PermissionId = p.PermissionId
);
GO

PRINT 'Exercise Submission permissions added successfully!';
GO
