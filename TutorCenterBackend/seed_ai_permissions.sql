-- =========================================
-- SEED AI PERMISSIONS
-- =========================================
USE TutorCenterDb;
GO

-- Insert AI Document Permissions
INSERT INTO Permissions (PermissionName, Path, Method, Module, CreatedAt, UpdatedAt) VALUES
('ai_document.view', '/api/ai-documents', 'GET', 'AI Document Management', GETDATE(), GETDATE()),
('ai_document.create', '/api/ai-documents/upload', 'POST', 'AI Document Management', GETDATE(), GETDATE()),
('ai_document.delete', '/api/ai-documents/{id}', 'DELETE', 'AI Document Management', GETDATE(), GETDATE());
GO

-- Insert AI Question Permissions
INSERT INTO Permissions (PermissionName, Path, Method, Module, CreatedAt, UpdatedAt) VALUES
('ai_question.view', '/api/ai-questions', 'GET', 'AI Question Management', GETDATE(), GETDATE()),
('ai_question.create', '/api/ai-questions/generate', 'POST', 'AI Question Management', GETDATE(), GETDATE()),
('ai_question.edit', '/api/ai-questions/{id}', 'PUT', 'AI Question Management', GETDATE(), GETDATE()),
('ai_question.import', '/api/ai-questions/import', 'POST', 'AI Question Management', GETDATE(), GETDATE()),
('ai_question.delete', '/api/ai-questions/{id}', 'DELETE', 'AI Question Management', GETDATE(), GETDATE());
GO

-- =========================================
-- ASSIGN AI PERMISSIONS TO TUTOR ROLE
-- =========================================

-- Assign all AI permissions to Tutor role
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT r.RoleId, p.PermissionId
FROM Roles r
CROSS JOIN Permissions p
WHERE r.RoleName = 'Tutor'
AND p.PermissionName IN (
    'ai_document.view',
    'ai_document.create',
    'ai_document.delete',
    'ai_question.view',
    'ai_question.create',
    'ai_question.edit',
    'ai_question.import',
    'ai_question.delete'
);
GO

PRINT 'AI permissions seeded successfully!';
GO
