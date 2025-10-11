-- =========================================
-- SCHEMA
-- =========================================
CREATE DATABASE TutorCenterDb;
GO

USE TutorCenterDb
GO

-- =========================================
-- ROLES & USERS
-- =========================================
CREATE TABLE Roles (
    RoleId          INT IDENTITY PRIMARY KEY,
    [Name]          NVARCHAR(50) NOT NULL UNIQUE,   -- Admin, Tutor, Student
    [Description]   NVARCHAR(255) NULL
);
GO

CREATE TABLE Permissions (
    PermissionId    INT IDENTITY PRIMARY KEY,
    Code            VARCHAR(100) NOT NULL UNIQUE,     -- e.g. CLASS_CREATE, QUIZ_GRADE
    [Description]   NVARCHAR(255) NULL
);
GO

CREATE TABLE RolePermissions (
    RoleId       INT NOT NULL,
    PermissionId INT NOT NULL,
    PRIMARY KEY (RoleId, PermissionId),
    FOREIGN KEY (RoleId)       REFERENCES Roles(RoleId),
    FOREIGN KEY (PermissionId) REFERENCES Permissions(PermissionId)
);
GO


CREATE TABLE Media (
    MediaId        INT IDENTITY PRIMARY KEY,
    [Disk]           VARCHAR(30) NOT NULL,                -- 's3', 'r2', 'local'
    Bucket         VARCHAR(100) NULL,
    ObjectKey      NVARCHAR(700) NOT NULL,              -- key trong bucket
    MimeType       VARCHAR(100) NULL,
    SizeBytes      BIGINT NULL,
    ChecksumSha256 CHAR(64) NULL,
    Visibility     VARCHAR(10) NOT NULL DEFAULT 'private', -- public|private
    UploadedBy     INT NULL,
    CreatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Media_Bucket_Key UNIQUE (Bucket, ObjectKey)
);
GO

CREATE TABLE Users (
    UserId        INT IDENTITY PRIMARY KEY,
    FullName      NVARCHAR(150) NOT NULL,
    Email         VARCHAR(255)  NOT NULL UNIQUE,
    PasswordHash  VARBINARY(256) NOT NULL,
    Phone         VARCHAR(30) NULL,
    RoleId        INT NOT NULL,
    AvatarMediaId INT NULL,
    IsActive      BIT NOT NULL DEFAULT 1,
    CreatedAt     DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt     DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (RoleId)        REFERENCES Roles(RoleId),
    FOREIGN KEY (AvatarMediaId) REFERENCES Media(MediaId)
);
GO

ALTER TABLE Media
ADD CONSTRAINT FK_Media_UploadedBy FOREIGN KEY (UploadedBy) REFERENCES Users(UserId);

-- =========================================
-- CLASSROOMS & MEMBERSHIP
-- =========================================
CREATE TABLE Classrooms (
    ClassroomId         INT IDENTITY PRIMARY KEY,
    Title               NVARCHAR(200) NOT NULL,
    [Description]       NVARCHAR(MAX) NULL,
    TeacherId           INT NOT NULL,
    CoverMediaId        INT NULL,
    IsArchived          BIT NOT NULL DEFAULT 0,     -- Sau 1 năm thì khóa lớp học lại không cho phép đăng nội dung mới nhưng vẫn giữ lại tài liệu để báo cáo
    TuitionAmount       MONEY NULL DEFAULT 0,
    TuitionDueAt        DATETIME2(0) NULL,          -- Hạn đóng học phí
    IsTuitionRequired   BIT NOT NULL DEFAULT (0),   -- Thông báo yêu cầu đóng học phí
    CreatedBy           INT NOT NULL,
    CreatedAt           DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt           DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (TeacherId)    REFERENCES Users(UserId),
    FOREIGN KEY (CreatedBy)    REFERENCES Users(UserId),
    FOREIGN KEY (CoverMediaId) REFERENCES Media(MediaId)
);
GO

CREATE TABLE ClassroomStudents (
    ClassroomId INT NOT NULL,
    StudentId   INT NOT NULL,
    JoinedAt    DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    [Status]    TINYINT NOT NULL DEFAULT 1,
    IsPaid      BIT NOT NULL DEFAULT (0), -- Đã đóng học phí chưa
    PaidAt      DATETIME2(0) NULL,
    PRIMARY KEY (ClassroomId, StudentId),
    FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId),
    FOREIGN KEY (StudentId)   REFERENCES Users(UserId)
);
CREATE INDEX IX_ClassroomStudents_Class_IsPaid ON ClassroomStudents(ClassroomId, IsPaid DESC);
GO

CREATE TABLE JoinRequests (
    JoinRequestId INT IDENTITY PRIMARY KEY,
    ClassroomId   INT NOT NULL,
    StudentId     INT NOT NULL,
    [Status]      VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending|accepted|denied
    Note          NVARCHAR(500) NULL,
    RequestedAt   DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    HandledBy     INT NULL,
    HandledAt     DATETIME2(0) NULL,
    FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId),
    FOREIGN KEY (StudentId)   REFERENCES Users(UserId),
    FOREIGN KEY (HandledBy)   REFERENCES Users(UserId),
    CONSTRAINT CK_JoinRequests_Status CHECK (Status IN ('pending','accepted','denied'))
);
GO

-- =========================================
-- LESSONS & MATERIALS
-- =========================================
CREATE TABLE Lessons (
    LessonId     INT IDENTITY PRIMARY KEY,
    ClassroomId  INT NOT NULL,
    Title        NVARCHAR(200) NOT NULL,
    Content      NVARCHAR(MAX) NULL,
    LessonType   VARCHAR(30) NOT NULL DEFAULT 'lesson', -- lesson|video|quiz|exercise
    OrderIndex   INT NOT NULL DEFAULT 0,
    PublishedAt  DATETIME2(0) NULL,
    FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId),
    CONSTRAINT CK_Lessons_Type CHECK (LessonType IN ('lesson','video','quiz','exercise'))
);
GO

CREATE TABLE Materials (
    MaterialId   INT IDENTITY PRIMARY KEY,
    LessonId     INT NULL,
    Title        NVARCHAR(200) NOT NULL,
    MediaId      INT NOT NULL,
    UploadedBy   INT NOT NULL,
    UploadedAt   DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (LessonId)    REFERENCES Lessons(LessonId),
    FOREIGN KEY (MediaId)     REFERENCES Media(MediaId),
    FOREIGN KEY (UploadedBy)  REFERENCES Users(UserId)
);
GO

-- =========================================
-- EXERCISES & SUBMISSIONS
-- =========================================
CREATE TABLE Exercises (
    ExerciseId    INT IDENTITY PRIMARY KEY,
    LessonId      INT NULL,
    Title         NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    AttachMediaId INT NULL,
    DueAt         DATETIME2(0) NULL,    -- Hạn nộp
    CreatedBy     INT NOT NULL,
    CreatedAt     DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (LessonId)      REFERENCES Lessons(LessonId),
    FOREIGN KEY (AttachMediaId) REFERENCES Media(MediaId),
    FOREIGN KEY (CreatedBy)     REFERENCES Users(UserId)
);
GO

CREATE TABLE ExerciseSubmissions (
    SubmissionId  INT IDENTITY PRIMARY KEY,
    ExerciseId    INT NOT NULL,
    StudentId     INT NOT NULL,
    MediaId       INT NOT NULL,
    SubmittedAt   DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    Score         DECIMAL(4,2) NULL,
    Comment       NVARCHAR(1000) NULL,
    GradedBy      INT NULL,
    GradedAt      DATETIME2(0) NULL,
    FOREIGN KEY (ExerciseId) REFERENCES Exercises(ExerciseId),
    FOREIGN KEY (StudentId)  REFERENCES Users(UserId),
    FOREIGN KEY (MediaId)    REFERENCES Media(MediaId),
    FOREIGN KEY (GradedBy)   REFERENCES Users(UserId),
    CONSTRAINT UQ_Submission_OnePerStudent UNIQUE (ExerciseId, StudentId),
    CONSTRAINT CK_Submission_Score CHECK (Score IS NULL OR (Score >= 0 AND Score <= 10))
);
GO

-- =========================================
-- ANNOUNCEMENTS
-- =========================================
CREATE TABLE Announcements (
    AnnouncementId INT IDENTITY PRIMARY KEY,
    ClassroomId    INT NOT NULL,
    Title          NVARCHAR(200) NOT NULL,
    Body           NVARCHAR(MAX) NOT NULL,
    CreatedBy      INT NOT NULL,
    CreatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId),
    FOREIGN KEY (CreatedBy)   REFERENCES Users(UserId)
);
GO

-- =========================================
-- QUIZZES
-- =========================================
CREATE TABLE Quizzes (
    QuizId           INT IDENTITY PRIMARY KEY,
    LessonId         INT NULL,
    Title            NVARCHAR(200) NOT NULL,
    [Description]    NVARCHAR(MAX) NULL,
    TimeLimitSec     INT NULL,
    MaxAttempts      INT NOT NULL DEFAULT 1,    -- Số lần nộp
    ShuffleQuestions BIT NOT NULL DEFAULT 1,    -- Có đảo vị trí câu hỏi không
    ShuffleOptions   BIT NOT NULL DEFAULT 1,    -- Có đảo vị trí câu trả lời không
    GradingMethod    VARCHAR(20) NOT NULL DEFAULT 'highest',   -- highest|latest|first      Cách lấy điểm khi có nhiều lần nộp
    ShowAnswersAfter VARCHAR(20) NOT NULL DEFAULT 'after_due', -- none|immediate|after_due
    DueAt            DATETIME2(0) NULL,
    IsPublished      BIT NOT NULL DEFAULT 0,    -- Chưa publish cho hs thấy để có thể sửa đổi trước khi cho hs làm
    TotalPoints      DECIMAL(10,2) NOT NULL DEFAULT 0,
    CreatedBy        INT NOT NULL,
    CreatedAt        DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt        DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (LessonId)    REFERENCES Lessons(LessonId),
    FOREIGN KEY (CreatedBy)   REFERENCES Users(UserId)
);
GO

CREATE TABLE QuizSections (
    SectionId       INT IDENTITY PRIMARY KEY,
    QuizId          INT NOT NULL,
    Title           NVARCHAR(200) NOT NULL,
    [Description]   NVARCHAR(MAX) NULL,
    OrderIndex      INT NOT NULL DEFAULT 0,     -- Để sắp xếp các section
    FOREIGN KEY (QuizId) REFERENCES Quizzes(QuizId)
);
GO

CREATE TABLE QuizQuestionGroups (
    GroupId        INT IDENTITY PRIMARY KEY,
    QuizId         INT NOT NULL,
    SectionId      INT NULL,
    Title          NVARCHAR(200) NULL,
    IntroText      NVARCHAR(MAX) NULL,
    OrderIndex     INT NOT NULL DEFAULT 0,
    ShuffleInside  BIT NOT NULL DEFAULT 0,                  -- Có đảo câu hỏi trong nhóm câu hỏi không
    PointsPolicy   VARCHAR(20) NOT NULL DEFAULT 'sum',      -- Cách tính điểm trong nhóm câu hỏi
    CreatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (QuizId)         REFERENCES Quizzes(QuizId),
    FOREIGN KEY (SectionId)      REFERENCES QuizSections(SectionId),
);
GO

CREATE TABLE QuizQuestions (
    QuestionId    INT IDENTITY PRIMARY KEY,
    QuizId        INT NOT NULL,
    SectionId     INT NULL,
    GroupId       INT NULL,
    Content       NVARCHAR(MAX) NOT NULL,
    Explanation   NVARCHAR(MAX) NULL,
    QuestionType  VARCHAR(20) NOT NULL DEFAULT 'single_choice', -- single_choice|multiple_select|true_false
    Points        DECIMAL(10,2) NOT NULL DEFAULT 1.0,
    Difficulty    TINYINT NULL,
    OrderIndex    INT NOT NULL DEFAULT 0,
    IsActive      BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (QuizId)    REFERENCES Quizzes(QuizId),
    FOREIGN KEY (SectionId) REFERENCES QuizSections(SectionId),
    FOREIGN KEY (GroupId)   REFERENCES QuizQuestionGroups(GroupId)
);
GO

CREATE TABLE QuizOptions (
    OptionId     INT IDENTITY PRIMARY KEY,
    QuestionId   INT NOT NULL,
    Content      NVARCHAR(MAX) NOT NULL,
    IsCorrect    BIT NOT NULL DEFAULT 0,
    OrderIndex   INT NOT NULL DEFAULT 0,
    FOREIGN KEY (QuestionId) REFERENCES QuizQuestions(QuestionId),
);
GO

CREATE TABLE QuizAttempts (
    AttemptId     INT IDENTITY PRIMARY KEY,
    QuizId        INT NOT NULL,
    StudentId     INT NOT NULL,
    StartedAt     DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    SubmittedAt   DATETIME2(0) NULL,
    DurationSec   INT NULL,
    [Status]      VARCHAR(20) NOT NULL DEFAULT 'in_progress', -- in_progress|submitted|graded|expired
    ScoreRaw      DECIMAL(10,2) NULL,
    ScoreScaled10 DECIMAL(4,2) NULL,
    GradedAt      DATETIME2(0) NULL,
    GradedBy      INT NULL,
    FOREIGN KEY (QuizId)    REFERENCES Quizzes(QuizId),
    FOREIGN KEY (StudentId) REFERENCES Users(UserId),
    FOREIGN KEY (GradedBy)  REFERENCES Users(UserId)
);
GO

CREATE TABLE QuizAnswers (
    AttemptId   INT NOT NULL,
    QuestionId  INT NOT NULL,
    OptionId    INT NOT NULL,
    PRIMARY KEY (AttemptId, QuestionId, OptionId),
    FOREIGN KEY (AttemptId)  REFERENCES QuizAttempts(AttemptId) ON DELETE CASCADE,
    FOREIGN KEY (QuestionId) REFERENCES QuizQuestions(QuestionId),
    FOREIGN KEY (OptionId)   REFERENCES QuizOptions(OptionId)
);
GO

-- =========================================
-- PAYMENTS
-- =========================================
CREATE TABLE dbo.PaymentTransactions (
    TransactionId   INT IDENTITY PRIMARY KEY,
    ClassroomId     INT NOT NULL,
    StudentId       INT NOT NULL,
    Amount          DECIMAL(18,2) NOT NULL CHECK (Amount >= 0),
    Method          VARCHAR(30)   NOT NULL,  -- 'CASH' | 'MOMO' | 'VNPAY' | ...
    [Status]        VARCHAR(20)   NOT NULL DEFAULT 'pending', -- pending|paid|failed|refunded
    OrderCode       VARCHAR(100)  NOT NULL,  -- mã đơn nội bộ (unique tuỳ ý)
    ProviderTxnId   VARCHAR(200)  NULL,      -- mã từ cổng thanh toán
    MetaData        NVARCHAR(MAX) NULL,
    CreatedAt       DATETIME2(0)  NOT NULL DEFAULT SYSUTCDATETIME(),
    PaidAt          DATETIME2(0)  NULL,

    CONSTRAINT UQ_PaymentTransactions_Order UNIQUE (OrderCode),
    CONSTRAINT CK_PaymentTransactions_Status CHECK (Status IN ('pending','paid','failed','refunded')),

    CONSTRAINT FK_PaymentTransactions_Classroom FOREIGN KEY (ClassroomId)
        REFERENCES dbo.Classrooms (ClassroomId),
    CONSTRAINT FK_PaymentTransactions_Student FOREIGN KEY (StudentId)
        REFERENCES dbo.Users (UserId),
    CONSTRAINT FK_PaymentTransactions_Membership FOREIGN KEY (ClassroomId, StudentId)
        REFERENCES dbo.ClassroomStudents (ClassroomId, StudentId)
);
CREATE INDEX IX_PaymentTransactions_Class_Stu_Created ON dbo.PaymentTransactions (ClassroomId, StudentId, CreatedAt DESC);
GO

CREATE TABLE ClassroomChatMessages (
    MessageId    INT IDENTITY PRIMARY KEY,
    ClassroomId  INT NOT NULL,
    SenderId     INT NOT NULL,
    Content      NVARCHAR(MAX) NULL,          -- nội dung text
    SentAt       DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    IsEdited     BIT NOT NULL DEFAULT 0,
    IsDeleted    BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId),
    FOREIGN KEY (SenderId)   REFERENCES Users(UserId),
);
CREATE INDEX IX_ClassroomChat_Class_SentAt
    ON ClassroomChatMessages(ClassroomId, SentAt DESC);
GO

CREATE TABLE Reports (
    ReportId     INT IDENTITY PRIMARY KEY,
    ReporterId   INT NOT NULL,              -- người gửi report
    TargetType   VARCHAR(50) NOT NULL,      -- loại đối tượng bị báo cáo: user, class, message, post, quiz, submission,...
    TargetId     INT NOT NULL,              -- id cụ thể của đối tượng
    Reason       NVARCHAR(500) NULL,        -- lý do báo cáo (người dùng nhập)
    Category     VARCHAR(50) NULL,          -- loại lý do: spam, cheat, abuse, bug,...
    [Status]     VARCHAR(20) NOT NULL DEFAULT 'pending', -- trạng thái xử lý: pending|reviewed|resolved|dismissed
    HandlerId    INT NULL,                  -- admin/mod xử lý
    CreatedAt    DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    HandledAt    DATETIME2(0) NULL,
    Notes        NVARCHAR(1000) NULL,       -- ghi chú nội bộ khi xử lý
    FOREIGN KEY (ReporterId) REFERENCES Users(UserId),
    FOREIGN KEY (HandlerId)  REFERENCES Users(UserId)
);
GO

CREATE TABLE QuizQuestionGroupMedias (
    Id         INT IDENTITY PRIMARY KEY,
    GroupId    INT NOT NULL,
    MediaId    INT NOT NULL,
    OrderIndex INT NOT NULL DEFAULT 0,
    CreatedAt  DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (GroupId) REFERENCES QuizQuestionGroups(GroupId),
    FOREIGN KEY (MediaId) REFERENCES Media(MediaId),
    CONSTRAINT UQ_QQGroupMed UNIQUE (GroupId, MediaId)
);
GO

CREATE TABLE QuizQuestionMedias (
    Id         INT IDENTITY PRIMARY KEY,
    QuestionId INT NOT NULL,
    MediaId    INT NOT NULL,
    OrderIndex INT NOT NULL DEFAULT 0,
    CreatedAt  DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (QuestionId) REFERENCES QuizQuestions(QuestionId),
    FOREIGN KEY (MediaId)    REFERENCES Media(MediaId),
    CONSTRAINT UQ_QQMed UNIQUE (QuestionId, MediaId)
);
GO

CREATE TABLE QuizOptionMedias (
    Id         INT IDENTITY PRIMARY KEY,
    OptionId   INT NOT NULL,
    MediaId    INT NOT NULL,
    OrderIndex INT NOT NULL DEFAULT 0,
    CreatedAt  DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (OptionId) REFERENCES QuizOptions(OptionId),
    FOREIGN KEY (MediaId)  REFERENCES Media(MediaId),
    CONSTRAINT UQ_QOMed UNIQUE (OptionId, MediaId)
);
GO

CREATE TABLE ClassroomChatMessageMedias (
    Id         INT IDENTITY PRIMARY KEY,
    MessageId  INT NOT NULL,
    MediaId    INT NOT NULL,
    OrderIndex INT NOT NULL DEFAULT 0,
    CreatedAt  DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    FOREIGN KEY (MessageId) REFERENCES ClassroomChatMessages(MessageId),
    FOREIGN KEY (MediaId)   REFERENCES Media(MediaId),
    CONSTRAINT UQ_CCMMed UNIQUE (MessageId, MediaId)
);
GO

CREATE TABLE AIAgents (
    AgentId        INT IDENTITY(1,1) PRIMARY KEY,
    [Name]         NVARCHAR(150) NOT NULL,
    SystemPrompt   NVARCHAR(MAX) NULL,
    IsActive       BIT NOT NULL DEFAULT 1,
    CreatedBy      INT NULL,                              -- User tạo (tuỳ chọn)
    CreatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AIAgents_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);
GO

CREATE TABLE AIConversations (
    ConversationId INT IDENTITY(1,1) PRIMARY KEY,
    AgentId        INT NULL,
    OwnerUserId    INT NOT NULL,                          -- ai mở hội thoại
    ClassroomId    INT NULL,                              -- ngữ cảnh lớp (tuỳ chọn)
    Title          NVARCHAR(200) NULL,
    CreatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AIConversations_Agent     FOREIGN KEY (AgentId)     REFERENCES AIAgents(AgentId),
    CONSTRAINT FK_AIConversations_Owner     FOREIGN KEY (OwnerUserId) REFERENCES Users(UserId),
    CONSTRAINT FK_AIConversations_Classroom FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId)
);
CREATE INDEX IX_AIConversations_Owner_Updated ON AIConversations(OwnerUserId, UpdatedAt DESC);
GO

CREATE TABLE AIMessages (
    MessageId      INT IDENTITY(1,1) PRIMARY KEY,
    ConversationId INT NOT NULL,
    SenderRole     VARCHAR(20) NOT NULL,                  -- 'user' | 'assistant' | 'system'
    Content        NVARCHAR(MAX) NULL,                    -- nội dung text
    ParentId       INT NULL,                              -- threading (tuỳ chọn)
    CreatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AIMessages_Conversation FOREIGN KEY (ConversationId) REFERENCES AIConversations(ConversationId),
    CONSTRAINT FK_AIMessages_Parent       FOREIGN KEY (ParentId)       REFERENCES AIMessages(MessageId),
    CONSTRAINT CK_AIMessages_SenderRole CHECK (SenderRole IN ('user','assistant','system'))
);
CREATE INDEX IX_AIMessages_Conv_Created ON AIMessages(ConversationId, CreatedAt ASC);
GO

CREATE TABLE AIMessageMedias (
    Id         INT IDENTITY(1,1) PRIMARY KEY,
    MessageId  INT NOT NULL,
    MediaId    INT NOT NULL,
    Purpose    VARCHAR(30) NULL,                          -- 'input' | 'output' | 'context' | ...
    OrderIndex INT NOT NULL DEFAULT 0,
    CreatedAt  DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AIMessageMedias_Message FOREIGN KEY (MessageId) REFERENCES AIMessages(MessageId),
    CONSTRAINT FK_AIMessageMedias_Media   FOREIGN KEY (MediaId)   REFERENCES Media(MediaId),
    CONSTRAINT UQ_AIMessageMedias UNIQUE (MessageId, MediaId)
);
CREATE INDEX IX_AIMessageMedias_Message_Order ON AIMessageMedias(MessageId, OrderIndex);
GO

CREATE TABLE dbo.RefreshTokens (
    RefreshTokenId   BIGINT IDENTITY PRIMARY KEY,
    UserId           INT NOT NULL,
    TokenHash        CHAR(64) NOT NULL,           -- SHA-256 hex
    IssuedAt         DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    ExpiresAt        DATETIME2(0) NOT NULL,       -- ví dụ +30 ngày
    RevokedAt        DATETIME2(0) NULL,
    ReplacedByHash   CHAR(64) NULL,               -- hash của token mới khi rotation
    CONSTRAINT UQ_RefreshTokens_TokenHash UNIQUE (TokenHash),
    CONSTRAINT FK_RefreshTokens_User FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
);
-- Index phục vụ dọn dẹp & tra cứu
CREATE INDEX IX_RefreshTokens_User_Expires ON dbo.RefreshTokens(UserId, ExpiresAt DESC);
CREATE INDEX IX_RefreshTokens_Replaced ON dbo.RefreshTokens(ReplacedByHash);
GO

INSERT INTO Roles ([Name], [Description]) VALUES
('Admin', N'Quản trị viên hệ thống, có quyền cao nhất'),
('Tutor', N'Giáo viên, người tạo và quản lý lớp học'),
('Student', N'Học sinh, người tham gia lớp học');
GO

INSERT INTO Permissions (Code, [Description]) VALUES
-- Class management permissions
('CLASS_CREATE', N'Tạo lớp học mới'),
('CLASS_EDIT', N'Chỉnh sửa thông tin lớp học'),
('CLASS_DELETE', N'Xoá lớp học'),
('CLASS_ARCHIVE', N'Lưu trữ lớp học'),
('CLASS_VIEW', N'Xem thông tin lớp học'),
('CLASS_VIEW_PRIVATE', N'Xem lớp học riêng tư/đã archive'),
('CLASS_ENROLL', N'Tham gia lớp học'),
('CLASS_MANAGE_STUDENTS', N'Quản lý học sinh trong lớp học'),
('CLASS_MANAGE_JOIN_REQUESTS', N'Quản lý yêu cầu tham gia lớp học'),
('CLASS_MANAGE_PAYMENTS', N'Quản lý thanh toán của lớp học'),

-- Announcement permissions
('CLASS_POST_ANNOUNCEMENT', N'Đăng thông báo trong lớp học'),
('ANNOUNCEMENT_EDIT', N'Chỉnh sửa thông báo'),
('ANNOUNCEMENT_DELETE', N'Xóa thông báo'),

-- Lesson management permissions
('LESSON_CREATE', N'Tạo bài học mới'),
('LESSON_EDIT', N'Chỉnh sửa bài học'),
('LESSON_DELETE', N'Xoá bài học'),
('LESSON_VIEW', N'Xem bài học và tài liệu'),

-- Material management permissions
('MATERIAL_UPLOAD', N'Tải tài liệu lên bài học'),
('MATERIAL_DELETE', N'Xoá tài liệu khỏi bài học'),
('MATERIAL_MANAGE', N'Quản lý tài liệu (sửa thông tin, di chuyển)'),

-- Exercise permissions
('EXERCISE_CREATE', N'Tạo bài tập mới'),
('EXERCISE_EDIT', N'Chỉnh sửa bài tập'),
('EXERCISE_DELETE', N'Xóa bài tập'),
('EXERCISE_GRADE', N'Chấm điểm bài tập'),
('EXERCISE_SUBMIT', N'Nộp bài tập'),
('EXERCISE_VIEW', N'Xem bài tập và nộp bài'),

-- Quiz permissions
('QUIZ_CREATE', N'Tạo bài kiểm tra mới'),
('QUIZ_EDIT', N'Chỉnh sửa bài kiểm tra'),
('QUIZ_DELETE', N'Xoá bài kiểm tra'),
('QUIZ_PUBLISH', N'Phát hành bài kiểm tra cho học sinh'),
('QUIZ_GRADE', N'Chấm điểm bài kiểm tra'),
('QUIZ_TAKE', N'Tham gia làm bài kiểm tra'),
('QUIZ_VIEW', N'Xem bài kiểm tra và làm bài'),
('QUIZ_VIEW_RESULTS', N'Xem kết quả bài kiểm tra của học sinh'),
('QUIZ_RESET_ATTEMPTS', N'Reset số lần làm bài của học sinh'),

-- User management permissions
('USER_MANAGE', N'Quản lý người dùng hệ thống'),
('USER_VIEW', N'Xem thông tin người dùng'),

-- Report permissions
('REPORT_CREATE', N'Tạo báo cáo vi phạm'),
('REPORT_VIEW', N'Xem báo cáo vi phạm'),
('REPORT_HANDLE', N'Xử lý báo cáo vi phạm'),

-- Payment permissions
('PAYMENT_MAKE', N'Thực hiện thanh toán cho lớp học'),
('PAYMENT_MANAGE', N'Quản lý giao dịch thanh toán'),

-- AI permissions
('AI_AGENT_MANAGE', N'Quản lý AI Agents'),
('AI_CONVERSATION_VIEW', N'Xem hội thoại AI của người dùng'),
('AI_CONVERSATION_MANAGE', N'Quản lý hội thoại AI của người dùng'),

-- Chat permissions
('CHAT_VIEW', N'Xem tin nhắn trong lớp học'),
('CHAT_MANAGE', N'Quản lý tin nhắn trong lớp học'),

-- Media permissions
('MEDIA_UPLOAD', N'Tải tệp lên hệ thống'),
('MEDIA_VIEW', N'Xem tệp đã tải lên hệ thống'),
('MEDIA_DELETE', N'Xoá tệp đã tải lên hệ thống'),
('MEDIA_MANAGE', N'Quản lý tệp media (sửa thông tin, chuyển visibility)'),

-- System permissions
('REFRESH_TOKEN_MANAGE', N'Quản lý refresh token của người dùng'),
('STATISTICS_VIEW', N'Xem thống kê hệ thống'),
('DASHBOARD_VIEW', N'Xem dashboard quản trị'),
('SYSTEM_SETTINGS_MANAGE', N'Quản lý cài đặt hệ thống'),
('AUDIT_LOG_VIEW', N'Xem nhật ký hoạt động hệ thống');
GO

-- =========================================
-- ROLE PERMISSIONS SETUP
-- =========================================

-- Admin có tất cả quyền
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 1, PermissionId FROM Permissions;
GO

-- Tutor permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 2, PermissionId FROM Permissions 
WHERE Code IN (
    -- Class management
    'CLASS_CREATE', 'CLASS_EDIT', 'CLASS_ARCHIVE', 'CLASS_VIEW', 'CLASS_MANAGE_STUDENTS',
    'CLASS_MANAGE_JOIN_REQUESTS', 'CLASS_MANAGE_PAYMENTS',
    
    -- Announcements
    'CLASS_POST_ANNOUNCEMENT', 'ANNOUNCEMENT_EDIT', 'ANNOUNCEMENT_DELETE',
    
    -- Lessons & Materials
    'LESSON_CREATE', 'LESSON_EDIT', 'LESSON_DELETE', 'LESSON_VIEW',
    'MATERIAL_UPLOAD', 'MATERIAL_DELETE', 'MATERIAL_MANAGE',
    
    -- Exercises
    'EXERCISE_CREATE', 'EXERCISE_EDIT', 'EXERCISE_DELETE', 'EXERCISE_GRADE', 'EXERCISE_VIEW',
    
    -- Quizzes
    'QUIZ_CREATE', 'QUIZ_EDIT', 'QUIZ_DELETE', 'QUIZ_PUBLISH', 'QUIZ_GRADE', 
    'QUIZ_VIEW', 'QUIZ_VIEW_RESULTS', 'QUIZ_RESET_ATTEMPTS',
    
    -- Users & Reports
    'USER_VIEW', 'REPORT_VIEW', 'REPORT_CREATE',
    
    -- Media & Chat
    'MEDIA_UPLOAD', 'MEDIA_VIEW', 'MEDIA_DELETE', 'MEDIA_MANAGE',
    'CHAT_VIEW', 'CHAT_MANAGE',
    
    -- AI (basic)
    'AI_CONVERSATION_VIEW'
);
GO

-- Student permissions
INSERT INTO RolePermissions (RoleId, PermissionId)
SELECT 3, PermissionId FROM Permissions 
WHERE Code IN (
    -- Class participation
    'CLASS_ENROLL', 'CLASS_VIEW', 'LESSON_VIEW',
    
    -- Exercises & Quizzes
    'EXERCISE_SUBMIT', 'EXERCISE_VIEW', 'QUIZ_TAKE', 'QUIZ_VIEW',
    
    -- Basic interactions
    'PAYMENT_MAKE', 'REPORT_CREATE', 'USER_VIEW',
    'MEDIA_UPLOAD', 'MEDIA_VIEW', 'CHAT_VIEW',
    
    -- AI interactions
    'AI_CONVERSATION_VIEW'
);
GO

-- Tạo Super Admin user (password: Admin@123456)
-- Hash được tạo từ PBKDF2-SHA256 với 100,000 iterations, salt 16 bytes + hash 32 bytes = 48 bytes total
INSERT INTO Users (FullName, Email, PasswordHash, Phone, RoleId, IsActive, CreatedAt, UpdatedAt)
VALUES (
    N'Super Administrator',
    'admin@tutorcenter.com',
    0x31E112645723C96AC97488E1A34A98BEEBD87C4F2FB5F3EE361E42406C16A50B6B398A24DD2C3AD55CC2A781EC20B867, -- Admin@123456
    '+84901234567',
    1, -- Admin role
    1,
    SYSUTCDATETIME(),
    SYSUTCDATETIME()
);
GO