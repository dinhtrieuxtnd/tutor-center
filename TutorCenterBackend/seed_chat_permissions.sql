-- SQL Script để thêm permissions cho module Chat

-- Thêm permission cho module chat
INSERT INTO Permissions (PermissionName, CreatedAt, UpdatedAt)
VALUES 
    ('classroom.chat', GETUTCDATE(), GETUTCDATE());
GO

-- Lấy ID của permission vừa tạo
DECLARE @ChatPermissionId INT;
SELECT @ChatPermissionId = PermissionId FROM Permissions WHERE PermissionName = 'classroom.chat';

-- Gán permission cho role TUTOR (RoleId = 2)
IF NOT EXISTS (SELECT 1 FROM RolePermission WHERE RoleId = 2 AND PermissionId = @ChatPermissionId)
BEGIN
    INSERT INTO RolePermission (RoleId, PermissionId, CreatedAt, UpdatedAt)
    VALUES (2, @ChatPermissionId, GETUTCDATE(), GETUTCDATE());
END
GO

-- Gán permission cho role STUDENT (RoleId = 3)
DECLARE @ChatPermissionId INT;
SELECT @ChatPermissionId = PermissionId FROM Permissions WHERE PermissionName = 'classroom.chat';

IF NOT EXISTS (SELECT 1 FROM RolePermission WHERE RoleId = 3 AND PermissionId = @ChatPermissionId)
BEGIN
    INSERT INTO RolePermission (RoleId, PermissionId, CreatedAt, UpdatedAt)
    VALUES (3, @ChatPermissionId, GETUTCDATE(), GETUTCDATE());
END
GO

-- Kiểm tra kết quả
SELECT 
    r.RoleName,
    p.PermissionName
FROM RolePermission rp
INNER JOIN Roles r ON rp.RoleId = r.RoleId
INNER JOIN Permissions p ON rp.PermissionId = p.PermissionId
WHERE p.PermissionName = 'classroom.chat';
GO
