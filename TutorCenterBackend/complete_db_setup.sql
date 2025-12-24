-- =========================================
-- COMPLETE DATABASE SETUP SCRIPT
-- Creates all tables, seeds roles, permissions, and assigns permissions to roles
-- Run this script once to set up the entire database
-- =========================================

CREATE DATABASE TutorCenterDb;
GO
USE TutorCenterDb;
GO

-- =========================================
-- CORE TABLES
-- =========================================

CREATE TABLE OtpRecords (
    OtpRecordId BIGINT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL,
    OtpCode CHAR(6) NOT NULL,
    CodeType NVARCHAR(50) NOT NULL CHECK (CodeType IN ('email_verification', 'password_reset')),
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    ExpiresAt DATETIME2(0) NOT NULL
);
GO

CREATE INDEX IX_OtpRecords_Email_Code 
ON OtpRecords(Email, OtpCode, CodeType, ExpiresAt DESC);
GO

-- =========================================
-- MEDIA
-- =========================================

CREATE TABLE Media (
    MediaId INT IDENTITY(1,1) PRIMARY KEY,
    [Disk] NVARCHAR(30) NOT NULL,
    Bucket NVARCHAR(100) NULL,
    ObjectKey NVARCHAR(700) NOT NULL,
    MimeType NVARCHAR(100) NULL,
    SizeBytes BIGINT NULL,
    Visibility NVARCHAR(10) NOT NULL DEFAULT 'private',
    UploadedBy INT NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2(0) NULL,
    CONSTRAINT UQ_Media_Bucket_Key UNIQUE (Bucket, ObjectKey)
);
GO

CREATE INDEX IX_Media_UploadedBy ON Media(UploadedBy) WHERE UploadedBy IS NOT NULL;
CREATE INDEX IX_Media_DeletedAt ON Media(DeletedAt) WHERE DeletedAt IS NOT NULL;
GO

-- =========================================
-- ROLES AND PERMISSIONS
-- =========================================
CREATE TABLE Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    [Description] NVARCHAR(200) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2(0) NULL
);
GO

CREATE TABLE Permissions (
    PermissionId INT IDENTITY(1,1) PRIMARY KEY,
    PermissionName NVARCHAR(100) NOT NULL UNIQUE,
    [Path] NVARCHAR(200) NOT NULL,
    [Method] NVARCHAR(10) NOT NULL,
    [Module] NVARCHAR(50) NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2(0) NULL
);
GO

CREATE TABLE RolePermissions (
    RoleId INT NOT NULL,
    PermissionId INT NOT NULL,
    PRIMARY KEY (RoleId, PermissionId),
    CONSTRAINT FK_RolePermissions_Role FOREIGN KEY (RoleId) REFERENCES Roles(RoleId) ON DELETE CASCADE,
    CONSTRAINT FK_RolePermissions_Permission FOREIGN KEY (PermissionId) REFERENCES Permissions(PermissionId) ON DELETE CASCADE
);
GO

-- =========================================
-- USERS
-- =========================================

CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    PhoneNumber NVARCHAR(30) NOT NULL UNIQUE,
    RoleId INT NOT NULL DEFAULT 1,
    AvatarMediaId INT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Users_AvatarMedia FOREIGN KEY (AvatarMediaId) REFERENCES Media(MediaId),
    CONSTRAINT FK_Users_Role FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);
GO

-- Add foreign key for Media.UploadedBy after Users table is created
ALTER TABLE Media
ADD CONSTRAINT FK_Media_UploadedBy FOREIGN KEY (UploadedBy) REFERENCES Users(UserId);
GO

-- =========================================
-- REFRESH TOKENS
-- =========================================

CREATE TABLE RefreshTokens (
    [Token] NVARCHAR(1000) PRIMARY KEY,
    UserId INT NOT NULL,
    ExpiresAt DATETIME2(0) NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_RefreshTokens_User FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_RefreshTokens_ExpiresAt ON RefreshTokens(ExpiresAt);
GO

-- =========================================
-- CLASSROOMS
-- =========================================

CREATE TABLE Classrooms (
    ClassroomId INT IDENTITY(1,1) PRIMARY KEY,
    TutorId INT NOT NULL,
    [Name] NVARCHAR(200) NOT NULL UNIQUE,
    [Description] NVARCHAR(2000) NULL,
    Price DECIMAL(18,2) NOT NULL DEFAULT 0 CHECK (Price >= 0),
    CoverMediaId INT NULL,
    IsArchived BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2(0) NULL,
    CreatedBy INT NOT NULL,
    UpdatedBy INT NOT NULL,
    DeletedBy INT NULL,
    CONSTRAINT FK_Classrooms_Tutor FOREIGN KEY (TutorId) REFERENCES Users(UserId),
    CONSTRAINT FK_Classrooms_CoverMedia FOREIGN KEY (CoverMediaId) REFERENCES Media(MediaId),
    CONSTRAINT FK_Classrooms_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId),
    CONSTRAINT FK_Classrooms_UpdatedBy FOREIGN KEY (UpdatedBy) REFERENCES Users(UserId),
    CONSTRAINT FK_Classrooms_DeletedBy FOREIGN KEY (DeletedBy) REFERENCES Users(UserId)
);
GO

CREATE INDEX IX_Classrooms_TutorId ON Classrooms(TutorId);
CREATE INDEX IX_Classrooms_DeletedAt ON Classrooms(DeletedAt) WHERE DeletedAt IS NOT NULL;
GO

-- =========================================
-- PAYMENT TRANSACTIONS
-- =========================================

CREATE TABLE PaymentTransactions (
    TransactionId   INT IDENTITY PRIMARY KEY,
    ClassroomId     INT NOT NULL,
    StudentId       INT NOT NULL,
    Amount          DECIMAL(18,2) NOT NULL CHECK (Amount >= 0),
    [Method]        VARCHAR(30)   NOT NULL CHECK ([Method] IN ('cash', 'momo', 'vnpay')),
    [Status]        VARCHAR(20)   NOT NULL DEFAULT 'pending' CHECK ([Status] IN ('pending','paid','failed','refunded')),
    OrderCode       VARCHAR(100)  NOT NULL,
    ProviderTxnId   VARCHAR(200)  NULL,
    MetaData        NVARCHAR(MAX) NULL,
    CreatedAt       DATETIME2(0)  NOT NULL DEFAULT SYSUTCDATETIME(),
    PaidAt          DATETIME2(0)  NULL,
    CONSTRAINT UQ_PaymentTransactions_Order UNIQUE (OrderCode),
    CONSTRAINT FK_PaymentTransactions_Classroom FOREIGN KEY (ClassroomId) REFERENCES Classrooms (ClassroomId),
    CONSTRAINT FK_PaymentTransactions_Student FOREIGN KEY (StudentId) REFERENCES Users (UserId)
);
GO

CREATE INDEX IX_PaymentTransactions_Class_Stu_Created ON PaymentTransactions (ClassroomId, StudentId, CreatedAt DESC);
CREATE INDEX IX_PaymentTransactions_Status_Paid ON PaymentTransactions ([Status], PaidAt) WHERE [Status] = 'paid';
GO

-- =========================================
-- CLASSROOM STUDENTS
-- =========================================

CREATE TABLE ClassroomStudents (
    ClassroomId INT NOT NULL,
    StudentId INT NOT NULL,
    JoinedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    HasPaid BIT NOT NULL DEFAULT 0,
    PaidAt DATETIME2(0) NULL,
    PaymentTransactionId INT NULL,
    DeletedAt DATETIME2(0) NULL,
    PRIMARY KEY (ClassroomId, StudentId),
    CONSTRAINT FK_ClassroomStudents_Classroom FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId) ON DELETE CASCADE,
    CONSTRAINT FK_ClassroomStudents_Student FOREIGN KEY (StudentId) REFERENCES Users(UserId) ON DELETE NO ACTION,
    CONSTRAINT FK_ClassroomStudents_PaymentTransaction FOREIGN KEY (PaymentTransactionId) REFERENCES PaymentTransactions(TransactionId),
    CONSTRAINT CK_ClassroomStudents_PaidAt CHECK ((HasPaid = 0 AND PaidAt IS NULL) OR (HasPaid = 1 AND PaidAt IS NOT NULL))
);
GO

CREATE INDEX IX_ClassroomStudents_HasPaid ON ClassroomStudents(ClassroomId, HasPaid) WHERE DeletedAt IS NULL;
CREATE INDEX IX_ClassroomStudents_Unpaid ON ClassroomStudents(ClassroomId, StudentId) WHERE HasPaid = 0 AND DeletedAt IS NULL;
GO

-- =========================================
-- JOIN REQUESTS
-- =========================================

CREATE TABLE JoinRequests (
    JoinRequestId INT IDENTITY(1,1) PRIMARY KEY,
    ClassroomId INT NOT NULL,
    StudentId INT NOT NULL,
    [Status] NVARCHAR(20) NOT NULL DEFAULT 'pending' CHECK ([Status] IN ('pending', 'approved', 'rejected')),
    RequestedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    HandledAt DATETIME2(0) NULL,
    CONSTRAINT FK_JoinRequests_Classroom FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId),
    CONSTRAINT FK_JoinRequests_Student FOREIGN KEY (StudentId) REFERENCES Users(UserId),
    CONSTRAINT UQ_JoinRequests_Classroom_Student UNIQUE (ClassroomId, StudentId)
);
GO

CREATE INDEX IX_JoinRequests_Status ON JoinRequests(ClassroomId, [Status]);
GO

-- =========================================
-- LECTURES
-- =========================================

CREATE TABLE Lectures (
    LectureId INT IDENTITY(1,1) PRIMARY KEY,
    ParentId INT NULL,
    Title NVARCHAR(200) NOT NULL,
    [Content] NVARCHAR(2000) NULL,
    MediaId INT NULL,
    UploadedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UploadedBy INT NOT NULL,
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2(0) NULL,
    CONSTRAINT FK_Lectures_UploadedBy FOREIGN KEY (UploadedBy) REFERENCES Users(UserId),
    CONSTRAINT FK_Lectures_Parent FOREIGN KEY (ParentId) REFERENCES Lectures(LectureId),
    CONSTRAINT FK_Lectures_Media FOREIGN KEY (MediaId) REFERENCES Media(MediaId)
);
GO

CREATE INDEX IX_Lectures_UploadedBy ON Lectures(UploadedBy);
CREATE INDEX IX_Lectures_ParentId ON Lectures(ParentId) WHERE ParentId IS NOT NULL;
CREATE INDEX IX_Lectures_DeletedAt ON Lectures(DeletedAt) WHERE DeletedAt IS NOT NULL;
GO

-- =========================================
-- EXERCISES
-- =========================================

CREATE TABLE Exercises (
    ExerciseId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    AttachMediaId INT NULL,
    CreatedBy INT NOT NULL,  
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2(0) NULL,
    CONSTRAINT FK_Exercises_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId),
    CONSTRAINT FK_Exercises_AttachMedia FOREIGN KEY (AttachMediaId) REFERENCES Media(MediaId)
);
GO

CREATE INDEX IX_Exercises_CreatedBy ON Exercises(CreatedBy);
CREATE INDEX IX_Exercises_DeletedAt ON Exercises(DeletedAt) WHERE DeletedAt IS NOT NULL;
GO

-- =========================================
-- QUIZZES
-- =========================================

CREATE TABLE Quizzes (
    QuizId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    TimeLimitSec INT NOT NULL,
    MaxAttempts INT NOT NULL DEFAULT 1,
    ShuffleQuestions BIT NOT NULL DEFAULT 1,
    ShuffleOptions BIT NOT NULL DEFAULT 1,
    GradingMethod NVARCHAR(20) NOT NULL DEFAULT 'first' CHECK (GradingMethod IN ('first', 'highest', 'average', 'latest')),
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2(0) NULL,
    CONSTRAINT FK_Quizzes_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);
GO

CREATE INDEX IX_Quizzes_CreatedBy ON Quizzes(CreatedBy);
CREATE INDEX IX_Quizzes_DeletedAt ON Quizzes(DeletedAt) WHERE DeletedAt IS NOT NULL;
GO

-- =========================================
-- LESSONS
-- =========================================

CREATE TABLE Lessons (
    LessonId INT IDENTITY(1,1) PRIMARY KEY,
    ClassroomId INT NOT NULL,
    LessonType NVARCHAR(20) NOT NULL CHECK (LessonType IN ('lecture', 'exercise', 'quiz')),
    LectureId INT NULL,
    ExerciseId INT NULL,
    QuizId INT NULL,
    ExerciseDueAt DATETIME2(0) NULL,
    QuizStartAt DATETIME2(0) NULL,
    QuizEndAt DATETIME2(0) NULL,
    ShowQuizAnswers BIT NOT NULL DEFAULT 0,
    ShowQuizScore BIT NOT NULL DEFAULT 0,
    OrderIndex INT NOT NULL DEFAULT 0,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    DeletedAt DATETIME2(0) NULL,
    CONSTRAINT FK_Lessons_Classroom FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId) ON DELETE CASCADE,
    CONSTRAINT FK_Lessons_Lecture FOREIGN KEY (LectureId) REFERENCES Lectures(LectureId),
    CONSTRAINT FK_Lessons_Exercise FOREIGN KEY (ExerciseId) REFERENCES Exercises(ExerciseId),
    CONSTRAINT FK_Lessons_Quiz FOREIGN KEY (QuizId) REFERENCES Quizzes(QuizId),
    CONSTRAINT FK_Lessons_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);
GO

CREATE INDEX IX_Lessons_Classroom ON Lessons(ClassroomId);
CREATE INDEX IX_Lessons_Lecture ON Lessons(LectureId);
CREATE INDEX IX_Lessons_Exercise ON Lessons(ExerciseId);
CREATE INDEX IX_Lessons_Quiz ON Lessons(QuizId);
GO

-- =========================================
-- EXERCISE SUBMISSIONS
-- =========================================

CREATE TABLE ExerciseSubmissions (
    ExerciseSubmissionId INT IDENTITY(1,1) PRIMARY KEY,
    LessonId INT NOT NULL,
    ExerciseId INT NOT NULL,
    StudentId INT NOT NULL,
    MediaId INT NOT NULL,
    SubmittedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    Score DECIMAL(4, 2) NULL,
    [Comment] NVARCHAR(1000) NULL,
    GradedAt DATETIME2(0) NULL,
    CONSTRAINT FK_ExerciseSubmissions_Lesson FOREIGN KEY (LessonId) REFERENCES Lessons(LessonId),
    CONSTRAINT FK_ExerciseSubmissions_Exercise FOREIGN KEY (ExerciseId) REFERENCES Exercises(ExerciseId),
    CONSTRAINT FK_ExerciseSubmissions_Student FOREIGN KEY (StudentId) REFERENCES Users(UserId),
    CONSTRAINT FK_ExerciseSubmissions_Media FOREIGN KEY (MediaId) REFERENCES Media(MediaId),
    CONSTRAINT UQ_Submission_OnePerStudentPerLesson UNIQUE (LessonId, StudentId)
);
GO

CREATE INDEX IX_Submissions_Exercise ON ExerciseSubmissions(ExerciseId);
CREATE INDEX IX_Submissions_Lesson ON ExerciseSubmissions(LessonId);
GO

-- =========================================
-- QUIZ SECTIONS
-- =========================================

CREATE TABLE QuizSections (
    QuizSectionId INT IDENTITY(1,1) PRIMARY KEY,
    QuizId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    OrderIndex INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_QuizSections_Quiz FOREIGN KEY (QuizId) REFERENCES Quizzes(QuizId) ON DELETE CASCADE
);
GO

-- =========================================
-- QUESTION GROUPS
-- =========================================

CREATE TABLE QuestionGroups (
    QuestionGroupId INT IDENTITY(1,1) PRIMARY KEY,
    QuizId INT NOT NULL,
    SectionId INT NULL,
    Title NVARCHAR(200) NOT NULL,
    IntroText NVARCHAR(1000) NULL,
    OrderIndex INT NOT NULL DEFAULT 0,
    ShuffleInside BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_QuestionGroups_Quiz FOREIGN KEY (QuizId) REFERENCES Quizzes(QuizId) ON DELETE CASCADE,
    CONSTRAINT FK_QuestionGroups_Section FOREIGN KEY (SectionId) REFERENCES QuizSections(QuizSectionId) ON DELETE NO ACTION
);
GO

-- =========================================
-- QUESTIONS
-- =========================================

CREATE TABLE Questions (
    QuestionId INT IDENTITY(1,1) PRIMARY KEY,
    QuizId INT NOT NULL,
    SectionId INT NULL,
    GroupId INT NULL,
    [Content] NVARCHAR(1000) NOT NULL,
    Explanation NVARCHAR(1000) NULL,
    QuestionType NVARCHAR(20) NOT NULL DEFAULT 'single_choice' CHECK (QuestionType IN ('single_choice', 'multiple_choice')),
    Points FLOAT NOT NULL DEFAULT 1.0,
    OrderIndex INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Questions_Quiz FOREIGN KEY (QuizId) REFERENCES Quizzes(QuizId) ON DELETE CASCADE,
    CONSTRAINT FK_Questions_Section FOREIGN KEY (SectionId) REFERENCES QuizSections(QuizSectionId) ON DELETE NO ACTION,
    CONSTRAINT FK_Questions_Group FOREIGN KEY (GroupId) REFERENCES QuestionGroups(QuestionGroupId) ON DELETE NO ACTION
);
GO

-- =========================================
-- QUESTION OPTIONS
-- =========================================

CREATE TABLE QuestionOptions (
    QuestionOptionId INT IDENTITY(1,1) PRIMARY KEY,
    QuestionId INT NOT NULL,
    [Content] NVARCHAR(500) NOT NULL,
    IsCorrect BIT NOT NULL DEFAULT 0,
    OrderIndex INT NOT NULL DEFAULT 0,
    CONSTRAINT FK_QuestionOptions_Question FOREIGN KEY (QuestionId) REFERENCES Questions(QuestionId) ON DELETE CASCADE
);
GO

-- =========================================
-- QUIZ ATTEMPTS
-- =========================================

CREATE TABLE QuizAttempts (
    QuizAttemptId INT IDENTITY(1,1) PRIMARY KEY,
    LessonId INT NOT NULL,
    QuizId INT NOT NULL,
    StudentId INT NOT NULL,
    StartedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    SubmittedAt DATETIME2(0) NULL,
    [Status] NVARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (Status IN ('in_progress', 'submitted', 'graded')),
    ScoreRaw DECIMAL(10, 2) NULL,
    ScoreScaled10 DECIMAL(4, 2) NULL,
    CONSTRAINT FK_QuizAttempts_Lesson FOREIGN KEY (LessonId) REFERENCES Lessons(LessonId),
    CONSTRAINT FK_QuizAttempts_Quiz FOREIGN KEY (QuizId) REFERENCES Quizzes(QuizId),
    CONSTRAINT FK_QuizAttempts_Student FOREIGN KEY (StudentId) REFERENCES Users(UserId)
);
GO

CREATE INDEX IX_QuizAttempts_Quiz ON QuizAttempts(QuizId);
CREATE INDEX IX_QuizAttempts_Student ON QuizAttempts(StudentId);
CREATE INDEX IX_QuizAttempts_Lesson ON QuizAttempts(LessonId);
CREATE INDEX IX_QuizAttempts_Status ON QuizAttempts(Status);
CREATE INDEX IX_QuizAttempts_Lesson_Student_Submitted ON QuizAttempts(LessonId, StudentId, SubmittedAt DESC);
GO

-- =========================================
-- QUIZ ANSWERS
-- =========================================

CREATE TABLE QuizAnswers (
    AttemptId INT NOT NULL,
    QuestionId INT NOT NULL,
    OptionId INT NOT NULL,
    PRIMARY KEY (AttemptId, QuestionId, OptionId),
    CONSTRAINT FK_QuizAnswers_Attempt FOREIGN KEY (AttemptId) REFERENCES QuizAttempts(QuizAttemptId) ON DELETE CASCADE,
    CONSTRAINT FK_QuizAnswers_Question FOREIGN KEY (QuestionId) REFERENCES Questions(QuestionId) ON DELETE NO ACTION,
    CONSTRAINT FK_QuizAnswers_Option FOREIGN KEY (OptionId) REFERENCES QuestionOptions(QuestionOptionId) ON DELETE NO ACTION
);
GO

-- =========================================
-- MEDIA RELATIONS
-- =========================================

CREATE TABLE QuestionGroupMedias (
    QuestionGroupMediaId INT IDENTITY(1,1) PRIMARY KEY,
    GroupId INT NOT NULL,
    MediaId INT NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_QuestionGroupMedias_Group FOREIGN KEY (GroupId) REFERENCES QuestionGroups(QuestionGroupId) ON DELETE CASCADE,
    CONSTRAINT FK_QuestionGroupMedias_Media FOREIGN KEY (MediaId) REFERENCES Media(MediaId),
    CONSTRAINT UQ_QuestionGroupMed UNIQUE (GroupId, MediaId)
);
GO

CREATE TABLE QuestionMedias (
    QuestionMediaId INT IDENTITY(1,1) PRIMARY KEY,
    QuestionId INT NOT NULL,
    MediaId INT NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_QuestionMedias_Question FOREIGN KEY (QuestionId) REFERENCES Questions(QuestionId) ON DELETE CASCADE,
    CONSTRAINT FK_QuestionMedias_Media FOREIGN KEY (MediaId) REFERENCES Media(MediaId),
    CONSTRAINT UQ_QuestionMed UNIQUE (QuestionId, MediaId)
);
GO

CREATE TABLE QuestionOptionMedias (
    QuestionOptionMediaId INT IDENTITY(1,1) PRIMARY KEY,
    OptionId INT NOT NULL,
    MediaId INT NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_QuestionOptionMedias_Option FOREIGN KEY (OptionId) REFERENCES QuestionOptions(QuestionOptionId) ON DELETE CASCADE,
    CONSTRAINT FK_QuestionOptionMedias_Media FOREIGN KEY (MediaId) REFERENCES Media(MediaId),
    CONSTRAINT UQ_QuestionOptionMed UNIQUE (OptionId, MediaId)
);
GO

-- =========================================
-- ACTIVITY LOGS
-- =========================================

CREATE TABLE ActivityLogs (
    ActivityLogId BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    [Action] NVARCHAR(100) NOT NULL,
    EntityType NVARCHAR(50) NOT NULL,
    EntityId INT NULL,
    Metadata NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_ActivityLogs_User FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

CREATE INDEX IX_ActivityLogs_User_Created ON ActivityLogs(UserId, CreatedAt DESC);
CREATE INDEX IX_ActivityLogs_Entity ON ActivityLogs(EntityType, EntityId);
CREATE INDEX IX_ActivityLogs_Action_Created ON ActivityLogs([Action], CreatedAt DESC);
GO

-- =========================================
-- ANNOUNCEMENTS
-- =========================================

CREATE TABLE Announcements (
    AnnouncementId INT IDENTITY PRIMARY KEY,
    ClassroomId    INT NULL,
    Title          NVARCHAR(200) NOT NULL,
    Body           NVARCHAR(MAX) NOT NULL,
    CreatedBy      INT NOT NULL,
    CreatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Announcements_Classroom FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId),
    CONSTRAINT FK_Announcements_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);
GO

-- =========================================
-- REPORTS
-- =========================================

CREATE TABLE Reports (
    ReportId     INT IDENTITY PRIMARY KEY,
    ReporterId   INT NOT NULL,
    TargetType   VARCHAR(50) NOT NULL,
    TargetId     INT NOT NULL,
    Reason       NVARCHAR(500) NULL,
    Category     VARCHAR(50) NULL,
    [Status]     VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK ([Status] IN ('pending','reviewed','resolved','dismissed')),
    HandledBy    INT NULL,
    CreatedAt    DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    HandledAt    DATETIME2(0) NULL,
    Notes        NVARCHAR(1000) NULL,
    CONSTRAINT FK_Reports_Reporter FOREIGN KEY (ReporterId) REFERENCES Users(UserId),
    CONSTRAINT FK_Reports_HandledBy FOREIGN KEY (HandledBy) REFERENCES Users(UserId)
);
GO

-- =========================================
-- CLASSROOM CHAT
-- =========================================

CREATE TABLE ClassroomChatMessages (
    MessageId    INT IDENTITY PRIMARY KEY,
    ClassroomId  INT NOT NULL,
    SenderId     INT NOT NULL,
    [Content]    NVARCHAR(MAX) NULL,
    SentAt       DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    IsEdited     BIT NOT NULL DEFAULT 0,
    IsDeleted    BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_ClassroomChat_Classroom FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId),
    CONSTRAINT FK_ClassroomChat_Sender FOREIGN KEY (SenderId) REFERENCES Users(UserId)
);
GO

CREATE INDEX IX_ClassroomChat_Class_SentAt ON ClassroomChatMessages(ClassroomId, SentAt DESC);
GO

CREATE TABLE ClassroomChatMessageMedias (
    ChatMediaId INT IDENTITY PRIMARY KEY,
    MessageId   INT NOT NULL,
    MediaId     INT NOT NULL,
    OrderIndex  INT NOT NULL DEFAULT 0,
    CreatedAt   DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_ChatMessageMedias_Message FOREIGN KEY (MessageId) REFERENCES ClassroomChatMessages(MessageId),
    CONSTRAINT FK_ChatMessageMedias_Media FOREIGN KEY (MediaId) REFERENCES Media(MediaId),
    CONSTRAINT UQ_CCMMed UNIQUE (MessageId, MediaId)
);
GO

-- =========================================
-- AI CHAT SYSTEM
-- =========================================

CREATE TABLE AIAgents (
    AgentId        INT IDENTITY(1,1) PRIMARY KEY,
    [Name]         NVARCHAR(150) NOT NULL,
    SystemPrompt   NVARCHAR(MAX) NULL,
    IsActive       BIT NOT NULL DEFAULT 1,
    CreatedBy      INT NULL,
    CreatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AIAgents_CreatedBy FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);
GO

CREATE TABLE AIConversations (
    ConversationId INT IDENTITY(1,1) PRIMARY KEY,
    AgentId        INT NULL,
    OwnerUserId    INT NOT NULL,
    ClassroomId    INT NULL,
    Title          NVARCHAR(200) NULL,
    CreatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AIConversations_Agent FOREIGN KEY (AgentId) REFERENCES AIAgents(AgentId),
    CONSTRAINT FK_AIConversations_Owner FOREIGN KEY (OwnerUserId) REFERENCES Users(UserId),
    CONSTRAINT FK_AIConversations_Classroom FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId)
);
GO

CREATE INDEX IX_AIConversations_Owner_Updated ON AIConversations(OwnerUserId, UpdatedAt DESC);
GO

CREATE TABLE AIMessages (
    MessageId      INT IDENTITY(1,1) PRIMARY KEY,
    ConversationId INT NOT NULL,
    SenderRole     VARCHAR(20) NOT NULL,
    [Content]      NVARCHAR(MAX) NULL,
    ParentId       INT NULL,
    CreatedAt      DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AIMessages_Conversation FOREIGN KEY (ConversationId) REFERENCES AIConversations(ConversationId),
    CONSTRAINT FK_AIMessages_Parent FOREIGN KEY (ParentId) REFERENCES AIMessages(MessageId),
    CONSTRAINT CK_AIMessages_SenderRole CHECK (SenderRole IN ('user','assistant','system'))
);
GO

CREATE INDEX IX_AIMessages_Conv_Created ON AIMessages(ConversationId, CreatedAt ASC);
GO

CREATE TABLE AIMessageMedias (
    MessageMediaId INT IDENTITY(1,1) PRIMARY KEY,
    MessageId  INT NOT NULL,
    MediaId    INT NOT NULL,
    Purpose    VARCHAR(30) NULL CHECK (Purpose IN ('input', 'output', 'context')),
    CreatedAt  DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AIMessageMedias_Message FOREIGN KEY (MessageId) REFERENCES AIMessages(MessageId),
    CONSTRAINT FK_AIMessageMedias_Media FOREIGN KEY (MediaId) REFERENCES Media(MediaId),
    CONSTRAINT UQ_AIMessageMedias UNIQUE (MessageId, MediaId)
);
GO

CREATE INDEX IX_AIMessageMedias_Message_Order ON AIMessageMedias(MessageId);
GO

-- =========================================
-- AI DOCUMENT & QUESTION GENERATION
-- =========================================

CREATE TABLE AIDocuments (
    DocumentId INT IDENTITY(1,1) PRIMARY KEY,
    MediaId INT NOT NULL,
    ClassroomId INT NULL,
    UploadedBy INT NOT NULL,
    ExtractedText NVARCHAR(MAX) NULL,
    ProcessingStatus NVARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (ProcessingStatus IN ('pending', 'processing', 'completed', 'failed')),
    ErrorMessage NVARCHAR(1000) NULL,
    FileType NVARCHAR(10) NULL,
    PageCount INT NULL,
    CharacterCount INT NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    ProcessedAt DATETIME2(0) NULL,
    CONSTRAINT FK_AIDocuments_Media FOREIGN KEY (MediaId) REFERENCES Media(MediaId),
    CONSTRAINT FK_AIDocuments_Classroom FOREIGN KEY (ClassroomId) REFERENCES Classrooms(ClassroomId),
    CONSTRAINT FK_AIDocuments_UploadedBy FOREIGN KEY (UploadedBy) REFERENCES Users(UserId)
);
GO

CREATE INDEX IX_AIDocuments_UploadedBy ON AIDocuments(UploadedBy);
CREATE INDEX IX_AIDocuments_Classroom ON AIDocuments(ClassroomId) WHERE ClassroomId IS NOT NULL;
CREATE INDEX IX_AIDocuments_Status ON AIDocuments(ProcessingStatus);
CREATE INDEX IX_AIDocuments_Created ON AIDocuments(CreatedAt DESC);
GO

CREATE TABLE AIGenerationJobs (
    JobId INT IDENTITY(1,1) PRIMARY KEY,
    DocumentId INT NOT NULL,
    RequestedBy INT NOT NULL,
    QuestionType NVARCHAR(20) NOT NULL CHECK (QuestionType IN ('MultipleChoice', 'TrueFalse', 'ShortAnswer', 'FillInBlank', 'Mixed')),
    QuestionCount INT NOT NULL CHECK (QuestionCount BETWEEN 1 AND 50),
    DifficultyLevel NVARCHAR(20) NULL CHECK (DifficultyLevel IN ('Easy', 'Medium', 'Hard')),
    [Language] NVARCHAR(5) NOT NULL DEFAULT 'vi' CHECK ([Language] IN ('vi', 'en')),
    JobStatus NVARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (JobStatus IN ('pending', 'processing', 'completed', 'failed')),
    GeneratedCount INT NOT NULL DEFAULT 0,
    ErrorMessage NVARCHAR(1000) NULL,
    StartedAt DATETIME2(0) NULL,
    CompletedAt DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AIGenerationJobs_Document FOREIGN KEY (DocumentId) REFERENCES AIDocuments(DocumentId) ON DELETE CASCADE,
    CONSTRAINT FK_AIGenerationJobs_RequestedBy FOREIGN KEY (RequestedBy) REFERENCES Users(UserId)
);
GO

CREATE INDEX IX_AIGenerationJobs_Document ON AIGenerationJobs(DocumentId);
CREATE INDEX IX_AIGenerationJobs_RequestedBy ON AIGenerationJobs(RequestedBy);
CREATE INDEX IX_AIGenerationJobs_Status ON AIGenerationJobs(JobStatus);
CREATE INDEX IX_AIGenerationJobs_Created ON AIGenerationJobs(CreatedAt DESC);
GO

CREATE TABLE AIGeneratedQuestions (
    GeneratedQuestionId INT IDENTITY(1,1) PRIMARY KEY,
    DocumentId INT NOT NULL,
    QuestionText NVARCHAR(MAX) NOT NULL,
    QuestionType NVARCHAR(20) NOT NULL CHECK (QuestionType IN ('MultipleChoice', 'TrueFalse', 'ShortAnswer', 'FillInBlank')),
    DifficultyLevel NVARCHAR(20) NULL CHECK (DifficultyLevel IN ('Easy', 'Medium', 'Hard')),
    ExplanationText NVARCHAR(MAX) NULL,
    Topic NVARCHAR(200) NULL,
    IsImported BIT NOT NULL DEFAULT 0,
    ImportedQuestionId INT NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    ImportedAt DATETIME2(0) NULL,
    CONSTRAINT FK_AIGeneratedQuestions_Document FOREIGN KEY (DocumentId) REFERENCES AIDocuments(DocumentId) ON DELETE CASCADE,
    CONSTRAINT FK_AIGeneratedQuestions_ImportedQuestion FOREIGN KEY (ImportedQuestionId) REFERENCES Questions(QuestionId)
);
GO

CREATE INDEX IX_AIGeneratedQuestions_Document ON AIGeneratedQuestions(DocumentId);
CREATE INDEX IX_AIGeneratedQuestions_IsImported ON AIGeneratedQuestions(IsImported);
CREATE INDEX IX_AIGeneratedQuestions_Type ON AIGeneratedQuestions(QuestionType);
CREATE INDEX IX_AIGeneratedQuestions_Difficulty ON AIGeneratedQuestions(DifficultyLevel) WHERE DifficultyLevel IS NOT NULL;
GO

CREATE TABLE AIGeneratedQuestionOptions (
    OptionId INT IDENTITY(1,1) PRIMARY KEY,
    GeneratedQuestionId INT NOT NULL,
    OptionText NVARCHAR(1000) NOT NULL,
    IsCorrect BIT NOT NULL DEFAULT 0,
    [Order] INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AIGeneratedQuestionOptions_Question FOREIGN KEY (GeneratedQuestionId) REFERENCES AIGeneratedQuestions(GeneratedQuestionId) ON DELETE CASCADE
);
GO

CREATE INDEX IX_AIGeneratedQuestionOptions_Question ON AIGeneratedQuestionOptions(GeneratedQuestionId, [Order]);
GO

-- =========================================
-- SEED DATA - ROLES
-- =========================================

INSERT INTO Roles (RoleName, [Description], CreatedAt, UpdatedAt) VALUES
('Admin', 'System Administrator with full access', GETDATE(), GETDATE()),
('Tutor', 'Teacher who can manage classrooms and lessons', GETDATE(), GETDATE()),
('Student', 'Student who can attend classes and do assignments', GETDATE(), GETDATE());
GO

-- =========================================
-- SEED DATA - PERMISSIONS
-- =========================================

INSERT INTO Permissions (PermissionName, [Path], [Method], [Module], CreatedAt, UpdatedAt) VALUES
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
('activity_log.view', '/api/activity-logs', 'GET', 'System Administration', GETDATE(), GETDATE()),

-- AI Document permissions
('ai_document.view', '/api/ai-documents', 'GET', 'AI Document Management', GETDATE(), GETDATE()),
('ai_document.create', '/api/ai-documents/upload', 'POST', 'AI Document Management', GETDATE(), GETDATE()),
('ai_document.delete', '/api/ai-documents/{id}', 'DELETE', 'AI Document Management', GETDATE(), GETDATE()),

-- AI Question permissions
('ai_question.view', '/api/ai-questions', 'GET', 'AI Question Management', GETDATE(), GETDATE()),
('ai_question.create', '/api/ai-questions/generate', 'POST', 'AI Question Management', GETDATE(), GETDATE()),
('ai_question.edit', '/api/ai-questions/{id}', 'PUT', 'AI Question Management', GETDATE(), GETDATE()),
('ai_question.import', '/api/ai-questions/import', 'POST', 'AI Question Management', GETDATE(), GETDATE()),
('ai_question.delete', '/api/ai-questions/{id}', 'DELETE', 'AI Question Management', GETDATE(), GETDATE());
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

-- Tutor: Can manage classrooms, lessons, exercises, quizzes, AI documents
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
    'payment.view',
    -- AI Document
    'ai_document.view',
    'ai_document.create',
    'ai_document.delete',
    -- AI Question
    'ai_question.view',
    'ai_question.create',
    'ai_question.edit',
    'ai_question.import',
    'ai_question.delete'
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

PRINT '✓ Database setup completed successfully!';
PRINT '✓ All tables created';
PRINT '✓ Roles and permissions seeded';
PRINT '✓ Permissions assigned to roles';
GO
