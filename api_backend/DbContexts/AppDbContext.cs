using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using api_backend.Entities;

namespace api_backend.DbContexts;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ActivityLog> ActivityLogs { get; set; }

    public virtual DbSet<AIAgent> AIAgents { get; set; }

    public virtual DbSet<AIConversation> AIConversations { get; set; }

    public virtual DbSet<AIMessage> AIMessages { get; set; }

    public virtual DbSet<AIMessageMedia> AIMessageMedias { get; set; }

    public virtual DbSet<Announcement> Announcements { get; set; }

    public virtual DbSet<Classroom> Classrooms { get; set; }

    public virtual DbSet<ClassroomChatMessage> ClassroomChatMessages { get; set; }

    public virtual DbSet<ClassroomChatMessageMedia> ClassroomChatMessageMedias { get; set; }

    public virtual DbSet<ClassroomStudent> ClassroomStudents { get; set; }

    public virtual DbSet<Exercise> Exercises { get; set; }

    public virtual DbSet<ExerciseSubmission> ExerciseSubmissions { get; set; }

    public virtual DbSet<JoinRequest> JoinRequests { get; set; }

    public virtual DbSet<Lecture> Lectures { get; set; }

    public virtual DbSet<Lesson> Lessons { get; set; }

    public virtual DbSet<Medium> Media { get; set; }

    public virtual DbSet<OtpRecord> OtpRecords { get; set; }

    public virtual DbSet<PaymentTransaction> PaymentTransactions { get; set; }

    public virtual DbSet<Quiz> Quizzes { get; set; }

    public virtual DbSet<QuizAnswer> QuizAnswers { get; set; }

    public virtual DbSet<QuizAttempt> QuizAttempts { get; set; }

    public virtual DbSet<QuizOption> QuizOptions { get; set; }

    public virtual DbSet<QuizOptionMedia> QuizOptionMedias { get; set; }

    public virtual DbSet<QuizQuestion> QuizQuestions { get; set; }

    public virtual DbSet<QuizQuestionGroup> QuizQuestionGroups { get; set; }

    public virtual DbSet<QuizQuestionGroupMedia> QuizQuestionGroupMedias { get; set; }

    public virtual DbSet<QuizQuestionMedia> QuizQuestionMedias { get; set; }

    public virtual DbSet<QuizSection> QuizSections { get; set; }

    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }

    public virtual DbSet<Report> Reports { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // OtpRecords
        modelBuilder.Entity<OtpRecord>(entity =>
        {
            entity.HasKey(e => e.OtpRecordId);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.OtpCode)
                .IsRequired()
                .HasMaxLength(6)
                .IsFixedLength();

            entity.Property(e => e.CodeType)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.ExpiresAt)
                .HasPrecision(0);

            entity.HasIndex(e => new { e.Email, e.OtpCode, e.CodeType, e.ExpiresAt }, "IX_OtpRecords_Email_Code")
                .IsDescending(false, false, false, true);
        });

        // Media
        modelBuilder.Entity<Medium>(entity =>
        {
            entity.HasKey(e => e.MediaId);

            entity.Property(e => e.Disk)
                .IsRequired()
                .HasMaxLength(30);

            entity.Property(e => e.Bucket)
                .HasMaxLength(100);

            entity.Property(e => e.ObjectKey)
                .IsRequired()
                .HasMaxLength(700);

            entity.Property(e => e.MimeType)
                .HasMaxLength(100);

            entity.Property(e => e.Visibility)
                .IsRequired()
                .HasMaxLength(10)
                .HasDefaultValue("private");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.DeletedAt)
                .HasPrecision(0);

            entity.HasIndex(e => e.UploadedBy, "IX_Media_UploadedBy")
                .HasFilter("[UploadedBy] IS NOT NULL");

            entity.HasIndex(e => e.DeletedAt, "IX_Media_DeletedAt")
                .HasFilter("[DeletedAt] IS NOT NULL");

            entity.HasIndex(e => new { e.Bucket, e.ObjectKey }, "UQ_Media_Bucket_Key")
                .IsUnique();

            entity.HasOne(d => d.UploadedByNavigation)
                .WithMany(p => p.Media)
                .HasForeignKey(d => d.UploadedBy)
                .HasConstraintName("FK_Media_UploadedBy");
        });

        // Users
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);

            entity.Property(e => e.FullName)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.PhoneNumber)
                .IsRequired()
                .HasMaxLength(30);

            entity.Property(e => e.Role)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("student");

            entity.Property(e => e.IsActive)
                .HasDefaultValue(true);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasIndex(e => e.Email, "UQ_Users_Email").IsUnique();
            entity.HasIndex(e => e.PhoneNumber, "UQ_Users_PhoneNumber").IsUnique();

            entity.HasOne(d => d.AvatarMedia)
                .WithMany(p => p.Users)
                .HasForeignKey(d => d.AvatarMediaId)
                .HasConstraintName("FK_Users_AvatarMedia");
        });

        // RefreshTokens
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Token);

            entity.Property(e => e.Token)
                .HasMaxLength(1000);

            entity.Property(e => e.ExpiresAt)
                .HasPrecision(0);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasIndex(e => e.ExpiresAt, "IX_RefreshTokens_ExpiresAt");

            entity.HasOne(d => d.User)
                .WithMany(p => p.RefreshTokens)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_RefreshTokens_User");
        });

        // Classrooms
        modelBuilder.Entity<Classroom>(entity =>
        {
            entity.HasKey(e => e.ClassroomId);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Description)
                .HasMaxLength(2000);

            entity.Property(e => e.Price)
                .HasColumnType("decimal(18,2)")
                .HasDefaultValue(0);

            entity.Property(e => e.IsArchived)
                .HasDefaultValue(false);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.DeletedAt)
                .HasPrecision(0);

            entity.HasIndex(e => e.TutorId, "IX_Classrooms_TutorId");
            entity.HasIndex(e => e.DeletedAt, "IX_Classrooms_DeletedAt")
                .HasFilter("[DeletedAt] IS NOT NULL");
            entity.HasIndex(e => e.Name, "UQ_Classrooms_Name").IsUnique();

            entity.HasOne(d => d.Tutor)
                .WithMany(p => p.ClassroomTutors)
                .HasForeignKey(d => d.TutorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Classrooms_Tutor");

            entity.HasOne(d => d.CoverMedia)
                .WithMany(p => p.Classrooms)
                .HasForeignKey(d => d.CoverMediaId)
                .HasConstraintName("FK_Classrooms_CoverMedia");
        });

        // ClassroomStudents
        modelBuilder.Entity<ClassroomStudent>(entity =>
        {
            entity.HasKey(e => new { e.ClassroomId, e.StudentId });

            entity.Property(e => e.JoinedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.HasPaid)
                .HasDefaultValue(false);

            entity.Property(e => e.PaidAt)
                .HasPrecision(0);

            entity.Property(e => e.DeletedAt)
                .HasPrecision(0);

            entity.HasIndex(e => new { e.ClassroomId, e.HasPaid }, "IX_ClassroomStudents_HasPaid")
                .HasFilter("[DeletedAt] IS NULL");

            entity.HasIndex(e => new { e.ClassroomId, e.StudentId }, "IX_ClassroomStudents_Unpaid")
                .HasFilter("[HasPaid] = 0 AND [DeletedAt] IS NULL");

            entity.HasOne(d => d.Classroom)
                .WithMany(p => p.ClassroomStudents)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_ClassroomStudents_Classroom");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.ClassroomStudents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_ClassroomStudents_Student");

            entity.HasOne(d => d.PaymentTransaction)
                .WithMany(p => p.ClassroomStudents)
                .HasForeignKey(d => d.PaymentTransactionId)
                .HasConstraintName("FK_ClassroomStudents_PaymentTransaction");
        });

        // JoinRequests
        modelBuilder.Entity<JoinRequest>(entity =>
        {
            entity.HasKey(e => e.JoinRequestId);

            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("pending");

            entity.Property(e => e.RequestedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.HandledAt)
                .HasPrecision(0);

            entity.HasIndex(e => new { e.ClassroomId, e.Status }, "IX_JoinRequests_Status");
            entity.HasIndex(e => new { e.ClassroomId, e.StudentId }, "UQ_JoinRequests_Classroom_Student")
                .IsUnique();

            entity.HasOne(d => d.Classroom)
                .WithMany(p => p.JoinRequests)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JoinRequests_Classroom");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.JoinRequests)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_JoinRequests_Student");
        });

        // Lectures
        modelBuilder.Entity<Lecture>(entity =>
        {
            entity.HasKey(e => e.LectureId);

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Content)
                .HasMaxLength(2000);

            entity.Property(e => e.UploadedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.DeletedAt)
                .HasPrecision(0);

            entity.HasIndex(e => e.UploadedBy, "IX_Lectures_UploadedBy");
            entity.HasIndex(e => e.ParentId, "IX_Lectures_ParentId")
                .HasFilter("[ParentId] IS NOT NULL");
            entity.HasIndex(e => e.DeletedAt, "IX_Lectures_DeletedAt")
                .HasFilter("[DeletedAt] IS NOT NULL");

            entity.HasOne(d => d.UploadedByNavigation)
                .WithMany(p => p.Lectures)
                .HasForeignKey(d => d.UploadedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Lectures_UploadedBy");

            entity.HasOne(d => d.Parent)
                .WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK_Lectures_Parent");

            entity.HasOne(d => d.Media)
                .WithMany(p => p.Lectures)
                .HasForeignKey(d => d.MediaId)
                .HasConstraintName("FK_Lectures_Media");
        });

        // Exercises
        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.ExerciseId);

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.DeletedAt)
                .HasPrecision(0);

            entity.HasIndex(e => e.CreatedBy, "IX_Exercises_CreatedBy");
            entity.HasIndex(e => e.DeletedAt, "IX_Exercises_DeletedAt")
                .HasFilter("[DeletedAt] IS NOT NULL");

            entity.HasOne(d => d.CreatedByNavigation)
                .WithMany(p => p.Exercises)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Exercises_CreatedBy");

            entity.HasOne(d => d.AttachMedia)
                .WithMany(p => p.Exercises)
                .HasForeignKey(d => d.AttachMediaId)
                .HasConstraintName("FK_Exercises_AttachMedia");
        });

        // Quizzes
        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.QuizId);

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.MaxAttempts)
                .HasDefaultValue(1);

            entity.Property(e => e.ShuffleQuestions)
                .HasDefaultValue(true);

            entity.Property(e => e.ShuffleOptions)
                .HasDefaultValue(true);

            entity.Property(e => e.GradingMethod)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("first");

            entity.Property(e => e.ShowAnswers)
                .HasDefaultValue(false);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.DeletedAt)
                .HasPrecision(0);

            entity.HasIndex(e => e.CreatedBy, "IX_Quizzes_CreatedBy");
            entity.HasIndex(e => e.DeletedAt, "IX_Quizzes_DeletedAt")
                .HasFilter("[DeletedAt] IS NOT NULL");

            entity.HasOne(d => d.CreatedByNavigation)
                .WithMany(p => p.Quizzes)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Quizzes_CreatedBy");
        });

        // Lessons
        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasKey(e => e.LessonId);

            entity.Property(e => e.LessonType)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(e => e.OrderIndex)
                .HasDefaultValue(0);

            entity.Property(e => e.ExerciseDueAt)
                .HasPrecision(0);

            entity.Property(e => e.QuizStartAt)
                .HasPrecision(0);

            entity.Property(e => e.QuizEndAt)
                .HasPrecision(0);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.DeletedAt)
                .HasPrecision(0);

            entity.HasIndex(e => e.ClassroomId, "IX_Lessons_Classroom");
            entity.HasIndex(e => e.LectureId, "IX_Lessons_Lecture");
            entity.HasIndex(e => e.ExerciseId, "IX_Lessons_Exercise");
            entity.HasIndex(e => e.QuizId, "IX_Lessons_Quiz");

            entity.HasOne(d => d.Classroom)
                .WithMany(p => p.Lessons)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Lessons_Classroom");

            entity.HasOne(d => d.Lecture)
                .WithMany(p => p.Lessons)
                .HasForeignKey(d => d.LectureId)
                .HasConstraintName("FK_Lessons_Lecture");

            entity.HasOne(d => d.Exercise)
                .WithMany(p => p.Lessons)
                .HasForeignKey(d => d.ExerciseId)
                .HasConstraintName("FK_Lessons_Exercise");

            entity.HasOne(d => d.Quiz)
                .WithMany(p => p.Lessons)
                .HasForeignKey(d => d.QuizId)
                .HasConstraintName("FK_Lessons_Quiz");
        });

        // ExerciseSubmissions
        modelBuilder.Entity<ExerciseSubmission>(entity =>
        {
            entity.HasKey(e => e.ExerciseSubmissionId);

            entity.Property(e => e.SubmittedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.Score)
                .HasColumnType("decimal(4,2)");

            entity.Property(e => e.Comment)
                .HasMaxLength(1000);

            entity.Property(e => e.GradedAt)
                .HasPrecision(0);

            entity.HasIndex(e => e.ExerciseId, "IX_Submissions_Exercise");
            entity.HasIndex(e => e.LessonId, "IX_Submissions_Lesson");
            entity.HasIndex(e => new { e.LessonId, e.StudentId }, "UQ_Submission_OnePerStudentPerLesson")
                .IsUnique();

            entity.HasOne(d => d.Lesson)
                .WithMany(p => p.ExerciseSubmissions)
                .HasForeignKey(d => d.LessonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ExerciseSubmissions_Lesson");

            entity.HasOne(d => d.Exercise)
                .WithMany(p => p.ExerciseSubmissions)
                .HasForeignKey(d => d.ExerciseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ExerciseSubmissions_Exercise");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.ExerciseSubmissions)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ExerciseSubmissions_Student");

            entity.HasOne(d => d.Media)
                .WithMany(p => p.ExerciseSubmissions)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ExerciseSubmissions_Media");
        });

        // QuizSections
        modelBuilder.Entity<QuizSection>(entity =>
        {
            entity.HasKey(e => e.QuizSectionId);

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.OrderIndex)
                .HasDefaultValue(0);

            entity.HasOne(d => d.Quiz)
                .WithMany(p => p.QuizSections)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_QuizSections_Quiz");
        });

        // QuestionGroups
        modelBuilder.Entity<QuizQuestionGroup>(entity =>
        {
            entity.HasKey(e => e.QuestionGroupId);

            entity.ToTable("QuestionGroups");

            entity.Property(e => e.Title)
                .HasMaxLength(200);

            entity.Property(e => e.IntroText)
                .HasMaxLength(1000);

            entity.Property(e => e.OrderIndex)
                .HasDefaultValue(0);

            entity.Property(e => e.ShuffleInside)
                .HasDefaultValue(false);

            entity.HasOne(d => d.Quiz)
                .WithMany(p => p.QuizQuestionGroups)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_QuestionGroups_Quiz");

            entity.HasOne(d => d.Section)
                .WithMany(p => p.QuizQuestionGroups)
                .HasForeignKey(d => d.SectionId)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_QuestionGroups_Section");
        });

        // Questions
        modelBuilder.Entity<QuizQuestion>(entity =>
        {
            entity.HasKey(e => e.QuestionId);

            entity.ToTable("Questions");

            entity.Property(e => e.Content)
                .IsRequired()
                .HasMaxLength(1000);

            entity.Property(e => e.Explanation)
                .HasMaxLength(1000);

            entity.Property(e => e.QuestionType)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("single_choice");

            entity.Property(e => e.Points)
                .HasDefaultValue(1.0);

            entity.Property(e => e.OrderIndex)
                .HasDefaultValue(0);

            entity.HasOne(d => d.Quiz)
                .WithMany(p => p.QuizQuestions)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Questions_Quiz");

            entity.HasOne(d => d.Section)
                .WithMany(p => p.QuizQuestions)
                .HasForeignKey(d => d.SectionId)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_Questions_Section");

            entity.HasOne(d => d.Group)
                .WithMany(p => p.QuizQuestions)
                .HasForeignKey(d => d.GroupId)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_Questions_Group");
        });

        // QuestionOptions
        modelBuilder.Entity<QuizOption>(entity =>
        {
            entity.HasKey(e => e.QuestionOptionId);

            entity.ToTable("QuestionOptions");

            entity.Property(e => e.Content)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.IsCorrect)
                .HasDefaultValue(false);

            entity.Property(e => e.OrderIndex)
                .HasDefaultValue(0);

            entity.HasOne(d => d.Question)
                .WithMany(p => p.QuizOptions)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_QuestionOptions_Question");
        });

        // QuizAttempts
        modelBuilder.Entity<QuizAttempt>(entity =>
        {
            entity.HasKey(e => e.QuizAttemptId);

            entity.Property(e => e.StartedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.SubmittedAt)
                .HasPrecision(0);

            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20)
                .HasDefaultValue("in_progress");

            entity.Property(e => e.ScoreRaw)
                .HasColumnType("decimal(10,2)");

            entity.Property(e => e.ScoreScaled10)
                .HasColumnType("decimal(4,2)");

            entity.HasIndex(e => e.QuizId, "IX_QuizAttempts_Quiz");
            entity.HasIndex(e => e.StudentId, "IX_QuizAttempts_Student");
            entity.HasIndex(e => e.LessonId, "IX_QuizAttempts_Lesson");
            entity.HasIndex(e => e.Status, "IX_QuizAttempts_Status");
            entity.HasIndex(e => new { e.LessonId, e.StudentId, e.SubmittedAt }, "IX_QuizAttempts_Lesson_Student_Submitted")
                .IsDescending(false, false, true);

            entity.HasOne(d => d.Lesson)
                .WithMany(p => p.QuizAttempts)
                .HasForeignKey(d => d.LessonId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuizAttempts_Lesson");

            entity.HasOne(d => d.Quiz)
                .WithMany(p => p.QuizAttempts)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuizAttempts_Quiz");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.QuizAttempts)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuizAttempts_Student");
        });

        // QuizAnswers
        modelBuilder.Entity<QuizAnswer>(entity =>
        {
            entity.HasKey(e => new { e.AttemptId, e.QuestionId, e.OptionId });

            entity.HasOne(d => d.Attempt)
                .WithMany(p => p.QuizAnswers)
                .HasForeignKey(d => d.AttemptId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_QuizAnswers_Attempt");

            entity.HasOne(d => d.Question)
                .WithMany(p => p.QuizAnswers)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_QuizAnswers_Question");

            entity.HasOne(d => d.Option)
                .WithMany(p => p.QuizAnswers)
                .HasForeignKey(d => d.OptionId)
                .OnDelete(DeleteBehavior.NoAction)
                .HasConstraintName("FK_QuizAnswers_Option");
        });

        // Media Relations
        modelBuilder.Entity<QuizQuestionGroupMedia>(entity =>
        {
            entity.HasKey(e => e.QuestionGroupMediaId);

            entity.ToTable("QuestionGroupMedias");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(getdate())");

            entity.HasIndex(e => new { e.GroupId, e.MediaId }, "UQ_QuestionGroupMed")
                .IsUnique();

            entity.HasOne(d => d.Group)
                .WithMany(p => p.QuizQuestionGroupMedia)
                .HasForeignKey(d => d.GroupId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_QuestionGroupMedias_Group");

            entity.HasOne(d => d.Media)
                .WithMany(p => p.QuizQuestionGroupMedia)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionGroupMedias_Media");
        });

        modelBuilder.Entity<QuizQuestionMedia>(entity =>
        {
            entity.HasKey(e => e.QuestionMediaId);

            entity.ToTable("QuestionMedias");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(getdate())");

            entity.HasIndex(e => new { e.QuestionId, e.MediaId }, "UQ_QuestionMed")
                .IsUnique();

            entity.HasOne(d => d.Question)
                .WithMany(p => p.QuizQuestionMedia)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_QuestionMedias_Question");

            entity.HasOne(d => d.Media)
                .WithMany(p => p.QuizQuestionMedia)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionMedias_Media");
        });

        modelBuilder.Entity<QuizOptionMedia>(entity =>
        {
            entity.HasKey(e => e.QuestionOptionMediaId);

            entity.ToTable("QuestionOptionMedias");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(getdate())");

            entity.HasIndex(e => new { e.OptionId, e.MediaId }, "UQ_QuestionOptionMed")
                .IsUnique();

            entity.HasOne(d => d.Option)
                .WithMany(p => p.QuizOptionMedia)
                .HasForeignKey(d => d.OptionId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_QuestionOptionMedias_Option");

            entity.HasOne(d => d.Media)
                .WithMany(p => p.QuizOptionMedia)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QuestionOptionMedias_Media");
        });

        // ActivityLogs
        modelBuilder.Entity<ActivityLog>(entity =>
        {
            entity.HasKey(e => e.ActivityLogId);

            entity.Property(e => e.Action)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.EntityType)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasIndex(e => new { e.UserId, e.CreatedAt }, "IX_ActivityLogs_User_Created")
                .IsDescending(false, true);

            entity.HasIndex(e => new { e.EntityType, e.EntityId }, "IX_ActivityLogs_Entity");

            entity.HasIndex(e => new { e.Action, e.CreatedAt }, "IX_ActivityLogs_Action_Created")
                .IsDescending(false, true);

            entity.HasOne(d => d.User)
                .WithMany(p => p.ActivityLogs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ActivityLogs_User");
        });

        // Announcements
        modelBuilder.Entity<Announcement>(entity =>
        {
            entity.HasKey(e => e.AnnouncementId);

            entity.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Body)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Classroom)
                .WithMany(p => p.Announcements)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Announcements_Classroom");

            entity.HasOne(d => d.CreatedByNavigation)
                .WithMany(p => p.Announcements)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Announcements_CreatedBy");
        });

        // PaymentTransactions
        modelBuilder.Entity<PaymentTransaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId);

            entity.Property(e => e.Amount)
                .HasColumnType("decimal(18,2)");

            entity.Property(e => e.Method)
                .IsRequired()
                .HasMaxLength(30)
                .IsUnicode(false);

            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending");

            entity.Property(e => e.OrderCode)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.Property(e => e.ProviderTxnId)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.PaidAt)
                .HasPrecision(0);

            entity.HasIndex(e => e.OrderCode, "UQ_PaymentTransactions_Order")
                .IsUnique();

            entity.HasIndex(e => new { e.ClassroomId, e.StudentId, e.CreatedAt }, "IX_PaymentTransactions_Class_Stu_Created")
                .IsDescending(false, false, true);

            entity.HasIndex(e => new { e.Status, e.PaidAt }, "IX_PaymentTransactions_Status_Paid")
                .HasFilter("[Status] = 'paid'");

            entity.HasOne(d => d.Classroom)
                .WithMany(p => p.PaymentTransactions)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PaymentTransactions_Classroom");

            entity.HasOne(d => d.Student)
                .WithMany(p => p.PaymentTransactions)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PaymentTransactions_Student");
        });

        // ClassroomChatMessages
        modelBuilder.Entity<ClassroomChatMessage>(entity =>
        {
            entity.HasKey(e => e.MessageId);

            entity.Property(e => e.SentAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.IsEdited)
                .HasDefaultValue(false);

            entity.Property(e => e.IsDeleted)
                .HasDefaultValue(false);

            entity.HasIndex(e => new { e.ClassroomId, e.SentAt }, "IX_ClassroomChat_Class_SentAt")
                .IsDescending(false, true);

            entity.HasOne(d => d.Classroom)
                .WithMany(p => p.ClassroomChatMessages)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClassroomChatMessages_Classroom");

            entity.HasOne(d => d.Sender)
                .WithMany(p => p.ClassroomChatMessages)
                .HasForeignKey(d => d.SenderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClassroomChatMessages_Sender");
        });

        // Reports
        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId);

            entity.Property(e => e.TargetType)
                .IsRequired()
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.Reason)
                .HasMaxLength(500);

            entity.Property(e => e.Category)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.Status)
                .IsRequired()
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.HandledAt)
                .HasPrecision(0);

            entity.Property(e => e.Notes)
                .HasMaxLength(1000);

            entity.HasOne(d => d.Reporter)
                .WithMany(p => p.ReportReporters)
                .HasForeignKey(d => d.ReporterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Reports_Reporter");

            entity.HasOne(d => d.HandledByNavigation)
                .WithMany(p => p.ReportHandledByNavigations)
                .HasForeignKey(d => d.HandledBy)
                .HasConstraintName("FK_Reports_HandledBy");
        });

        // ClassroomChatMessageMedias
        modelBuilder.Entity<ClassroomChatMessageMedia>(entity =>
        {
            entity.HasKey(e => e.ChatMediaId);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasIndex(e => new { e.MessageId, e.MediaId }, "UQ_CCMMed")
                .IsUnique();

            entity.HasOne(d => d.Message)
                .WithMany(p => p.ClassroomChatMessageMedia)
                .HasForeignKey(d => d.MessageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClassroomChatMessageMedias_Message");

            entity.HasOne(d => d.Media)
                .WithMany(p => p.ClassroomChatMessageMedia)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ClassroomChatMessageMedias_Media");
        });

        // AIAgents
        modelBuilder.Entity<AIAgent>(entity =>
        {
            entity.HasKey(e => e.AgentId);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(e => e.IsActive)
                .HasDefaultValue(true);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.CreatedByNavigation)
                .WithMany(p => p.AIAgents)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_AIAgents_CreatedBy");
        });

        // AIConversations
        modelBuilder.Entity<AIConversation>(entity =>
        {
            entity.HasKey(e => e.ConversationId);

            entity.Property(e => e.Title)
                .HasMaxLength(200);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasIndex(e => new { e.OwnerUserId, e.UpdatedAt }, "IX_AIConversations_Owner_Updated")
                .IsDescending(false, true);

            entity.HasOne(d => d.Agent)
                .WithMany(p => p.AIConversations)
                .HasForeignKey(d => d.AgentId)
                .HasConstraintName("FK_AIConversations_Agent");

            entity.HasOne(d => d.OwnerUser)
                .WithMany(p => p.AIConversations)
                .HasForeignKey(d => d.OwnerUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AIConversations_Owner");

            entity.HasOne(d => d.Classroom)
                .WithMany(p => p.AIConversations)
                .HasForeignKey(d => d.ClassroomId)
                .HasConstraintName("FK_AIConversations_Classroom");
        });

        // AIMessages
        modelBuilder.Entity<AIMessage>(entity =>
        {
            entity.HasKey(e => e.MessageId);

            entity.Property(e => e.SenderRole)
                .IsRequired()
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasIndex(e => new { e.ConversationId, e.CreatedAt }, "IX_AIMessages_Conv_Created");

            entity.HasOne(d => d.Conversation)
                .WithMany(p => p.AIMessages)
                .HasForeignKey(d => d.ConversationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AIMessages_Conversation");

            entity.HasOne(d => d.Parent)
                .WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK_AIMessages_Parent");
        });

        // AIMessageMedias
        modelBuilder.Entity<AIMessageMedia>(entity =>
        {
            entity.HasKey(e => e.MessageMediaId);

            entity.Property(e => e.Purpose)
                .HasMaxLength(30)
                .IsUnicode(false);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasIndex(e => new { e.MessageId, e.MediaId }, "UQ_AIMessageMedias")
                .IsUnique();

            entity.HasIndex(e => e.MessageId, "IX_AIMessageMedias_Message_Order");

            entity.HasOne(d => d.Message)
                .WithMany(p => p.AIMessageMedia)
                .HasForeignKey(d => d.MessageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AIMessageMedias_Message");

            entity.HasOne(d => d.Media)
                .WithMany(p => p.AIMessageMedia)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AIMessageMedias_Media");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
