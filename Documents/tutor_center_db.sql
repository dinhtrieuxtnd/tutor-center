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
    ClassroomId   INT IDENTITY PRIMARY KEY,
    Title         NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    TeacherId     INT NOT NULL,
    CoverMediaId  INT NULL,
    IsArchived    BIT NOT NULL DEFAULT 0,   -- Sau 1 năm thì khóa lớp học lại không cho phép đăng nội dung mới nhưng vẫn giữ lại tài liệu để báo cáo
    CreatedBy     INT NOT NULL,
    CreatedAt     DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt     DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
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
    PRIMARY KEY (ClassroomId, StudentId),
    FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId),
    FOREIGN KEY (StudentId)   REFERENCES Users(UserId)
);
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
CREATE TABLE PaymentMethods (
    MethodId    INT IDENTITY PRIMARY KEY,
    Code        VARCHAR(30) NOT NULL UNIQUE,
    DisplayName NVARCHAR(100) NOT NULL
);
GO

CREATE TABLE PaymentStatuses (
    StatusId    INT IDENTITY PRIMARY KEY,
    Code        VARCHAR(30) NOT NULL UNIQUE,
    DisplayName NVARCHAR(100) NOT NULL
);
GO

CREATE TABLE Payments (
    PaymentId     INT IDENTITY PRIMARY KEY,
    UserId        INT NOT NULL,
    Amount        DECIMAL(18,2) NOT NULL,
    Currency      VARCHAR(10) NOT NULL DEFAULT 'VND',
    MethodId      INT NOT NULL,
    StatusId      INT NOT NULL,
    OrderCode     VARCHAR(100) NOT NULL,
    ProviderTxnId VARCHAR(200) NULL,
    MetaData      NVARCHAR(MAX) NULL,
    CreatedAt     DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    PaidAt        DATETIME2(0) NULL,
    FOREIGN KEY (UserId)   REFERENCES Users(UserId),
    FOREIGN KEY (MethodId) REFERENCES PaymentMethods(MethodId),
    FOREIGN KEY (StatusId) REFERENCES PaymentStatuses(StatusId)
);
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