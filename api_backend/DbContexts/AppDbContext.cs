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

    public virtual DbSet<Lesson> Lessons { get; set; }

    public virtual DbSet<Material> Materials { get; set; }

    public virtual DbSet<Medium> Media { get; set; }

    public virtual DbSet<PaymentTransaction> PaymentTransactions { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

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

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AIAgent>(entity =>
        {
            entity.HasKey(e => e.AgentId).HasName("PK__AIAgents__9AC3BFF1E5CF1564");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(150);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.AIAgents)
                .HasForeignKey(d => d.CreatedBy)
                .HasConstraintName("FK_AIAgents_CreatedBy");
        });

        modelBuilder.Entity<AIConversation>(entity =>
        {
            entity.HasKey(e => e.ConversationId).HasName("PK__AIConver__C050D877DF0B209C");

            entity.HasIndex(e => new { e.OwnerUserId, e.UpdatedAt }, "IX_AIConversations_Owner_Updated").IsDescending(false, true);

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Agent).WithMany(p => p.AIConversations)
                .HasForeignKey(d => d.AgentId)
                .HasConstraintName("FK_AIConversations_Agent");

            entity.HasOne(d => d.Classroom).WithMany(p => p.AIConversations)
                .HasForeignKey(d => d.ClassroomId)
                .HasConstraintName("FK_AIConversations_Classroom");

            entity.HasOne(d => d.OwnerUser).WithMany(p => p.AIConversations)
                .HasForeignKey(d => d.OwnerUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AIConversations_Owner");
        });

        modelBuilder.Entity<AIMessage>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__AIMessag__C87C0C9C8B8BD40A");

            entity.HasIndex(e => new { e.ConversationId, e.CreatedAt }, "IX_AIMessages_Conv_Created");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.SenderRole)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.HasOne(d => d.Conversation).WithMany(p => p.AIMessages)
                .HasForeignKey(d => d.ConversationId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AIMessages_Conversation");

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK_AIMessages_Parent");
        });

        modelBuilder.Entity<AIMessageMedia>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AIMessag__3214EC076FBF3FD1");

            entity.HasIndex(e => new { e.MessageId, e.OrderIndex }, "IX_AIMessageMedias_Message_Order");

            entity.HasIndex(e => new { e.MessageId, e.MediaId }, "UQ_AIMessageMedias").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Purpose)
                .HasMaxLength(30)
                .IsUnicode(false);

            entity.HasOne(d => d.Media).WithMany(p => p.AIMessageMedia)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AIMessageMedias_Media");

            entity.HasOne(d => d.Message).WithMany(p => p.AIMessageMedia)
                .HasForeignKey(d => d.MessageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_AIMessageMedias_Message");
        });

        modelBuilder.Entity<Announcement>(entity =>
        {
            entity.HasKey(e => e.AnnouncementId).HasName("PK__Announce__9DE44574224FFCCB");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.Classroom).WithMany(p => p.Announcements)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Announcem__Class__01142BA1");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Announcements)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Announcem__Creat__02084FDA");
        });

        modelBuilder.Entity<Classroom>(entity =>
        {
            entity.HasKey(e => e.ClassroomId).HasName("PK__Classroo__11618EAAAC983BBB");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.TuitionAmount)
                .HasDefaultValue(0m)
                .HasColumnType("money");
            entity.Property(e => e.TuitionDueAt).HasPrecision(0);
            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.CoverMedia).WithMany(p => p.Classrooms)
                .HasForeignKey(d => d.CoverMediaId)
                .HasConstraintName("FK__Classroom__Cover__5535A963");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.ClassroomCreatedByNavigations)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Classroom__Creat__5441852A");

            entity.HasOne(d => d.Teacher).WithMany(p => p.ClassroomTeachers)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Classroom__Teach__534D60F1");
        });

        modelBuilder.Entity<ClassroomChatMessage>(entity =>
        {
            entity.HasKey(e => e.MessageId).HasName("PK__Classroo__C87C0C9CE8A3C28E");

            entity.HasIndex(e => new { e.ClassroomId, e.SentAt }, "IX_ClassroomChat_Class_SentAt").IsDescending(false, true);

            entity.Property(e => e.SentAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Classroom).WithMany(p => p.ClassroomChatMessages)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Classroom__Class__41EDCAC5");

            entity.HasOne(d => d.Sender).WithMany(p => p.ClassroomChatMessages)
                .HasForeignKey(d => d.SenderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Classroom__Sende__42E1EEFE");
        });

        modelBuilder.Entity<ClassroomChatMessageMedia>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Classroo__3214EC07A5FF61C6");

            entity.HasIndex(e => new { e.MessageId, e.MediaId }, "UQ_CCMMed").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Media).WithMany(p => p.ClassroomChatMessageMedia)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Classroom__Media__634EBE90");

            entity.HasOne(d => d.Message).WithMany(p => p.ClassroomChatMessageMedia)
                .HasForeignKey(d => d.MessageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Classroom__Messa__625A9A57");
        });

        modelBuilder.Entity<ClassroomStudent>(entity =>
        {
            entity.HasKey(e => new { e.ClassroomId, e.StudentId }).HasName("PK__Classroo__924DDC13E757145E");

            entity.HasIndex(e => new { e.ClassroomId, e.IsPaid }, "IX_ClassroomStudents_Class_IsPaid").IsDescending(false, true);

            entity.Property(e => e.JoinedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.PaidAt).HasPrecision(0);
            entity.Property(e => e.Status).HasDefaultValue((byte)1);

            entity.HasOne(d => d.Classroom).WithMany(p => p.ClassroomStudents)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Classroom__Class__5AEE82B9");

            entity.HasOne(d => d.Student).WithMany(p => p.ClassroomStudents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Classroom__Stude__5BE2A6F2");
        });

        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.ExerciseId).HasName("PK__Exercise__A074AD2F34C9F782");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.DueAt).HasPrecision(0);
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.AttachMedia).WithMany(p => p.Exercises)
                .HasForeignKey(d => d.AttachMediaId)
                .HasConstraintName("FK__Exercises__Attac__73BA3083");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Exercises)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Exercises__Creat__74AE54BC");

            entity.HasOne(d => d.Lesson).WithMany(p => p.Exercises)
                .HasForeignKey(d => d.LessonId)
                .HasConstraintName("FK__Exercises__Lesso__72C60C4A");
        });

        modelBuilder.Entity<ExerciseSubmission>(entity =>
        {
            entity.HasKey(e => e.SubmissionId).HasName("PK__Exercise__449EE125E2C2DBCD");

            entity.HasIndex(e => new { e.ExerciseId, e.StudentId }, "UQ_Submission_OnePerStudent").IsUnique();

            entity.Property(e => e.Comment).HasMaxLength(1000);
            entity.Property(e => e.GradedAt).HasPrecision(0);
            entity.Property(e => e.Score).HasColumnType("decimal(4, 2)");
            entity.Property(e => e.SubmittedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Exercise).WithMany(p => p.ExerciseSubmissions)
                .HasForeignKey(d => d.ExerciseId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ExerciseS__Exerc__797309D9");

            entity.HasOne(d => d.GradedByNavigation).WithMany(p => p.ExerciseSubmissionGradedByNavigations)
                .HasForeignKey(d => d.GradedBy)
                .HasConstraintName("FK__ExerciseS__Grade__7C4F7684");

            entity.HasOne(d => d.Media).WithMany(p => p.ExerciseSubmissions)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ExerciseS__Media__7B5B524B");

            entity.HasOne(d => d.Student).WithMany(p => p.ExerciseSubmissionStudents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ExerciseS__Stude__7A672E12");
        });

        modelBuilder.Entity<JoinRequest>(entity =>
        {
            entity.HasKey(e => e.JoinRequestId).HasName("PK__JoinRequ__257393AA927FF800");

            entity.Property(e => e.HandledAt).HasPrecision(0);
            entity.Property(e => e.Note).HasMaxLength(500);
            entity.Property(e => e.RequestedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending");

            entity.HasOne(d => d.Classroom).WithMany(p => p.JoinRequests)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__JoinReque__Class__60A75C0F");

            entity.HasOne(d => d.HandledByNavigation).WithMany(p => p.JoinRequestHandledByNavigations)
                .HasForeignKey(d => d.HandledBy)
                .HasConstraintName("FK__JoinReque__Handl__628FA481");

            entity.HasOne(d => d.Student).WithMany(p => p.JoinRequestStudents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__JoinReque__Stude__619B8048");
        });

        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasKey(e => e.LessonId).HasName("PK__Lessons__B084ACD0942A6CBE");

            entity.Property(e => e.LessonType)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("lesson");
            entity.Property(e => e.PublishedAt).HasPrecision(0);
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.Classroom).WithMany(p => p.Lessons)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Lessons__Classro__68487DD7");
        });

        modelBuilder.Entity<Material>(entity =>
        {
            entity.HasKey(e => e.MaterialId).HasName("PK__Material__C50610F75C3E982D");

            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.UploadedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Lesson).WithMany(p => p.Materials)
                .HasForeignKey(d => d.LessonId)
                .HasConstraintName("FK__Materials__Lesso__6D0D32F4");

            entity.HasOne(d => d.Media).WithMany(p => p.Materials)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Materials__Media__6E01572D");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.Materials)
                .HasForeignKey(d => d.UploadedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Materials__Uploa__6EF57B66");
        });

        modelBuilder.Entity<Medium>(entity =>
        {
            entity.HasKey(e => e.MediaId).HasName("PK__Media__B2C2B5CF58E3A332");

            entity.HasIndex(e => new { e.Bucket, e.ObjectKey }, "UQ_Media_Bucket_Key").IsUnique();

            entity.Property(e => e.Bucket)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ChecksumSha256)
                .HasMaxLength(64)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Disk)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.MimeType)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ObjectKey).HasMaxLength(700);
            entity.Property(e => e.Visibility)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("private");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.Media)
                .HasForeignKey(d => d.UploadedBy)
                .HasConstraintName("FK_Media_UploadedBy");
        });

        modelBuilder.Entity<PaymentTransaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("PK__PaymentT__55433A6B25341EF5");

            entity.HasIndex(e => new { e.ClassroomId, e.StudentId, e.CreatedAt }, "IX_PaymentTransactions_Class_Stu_Created").IsDescending(false, false, true);

            entity.HasIndex(e => e.OrderCode, "UQ_PaymentTransactions_Order").IsUnique();

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Method)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.OrderCode)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.PaidAt).HasPrecision(0);
            entity.Property(e => e.ProviderTxnId)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending");

            entity.HasOne(d => d.Classroom).WithMany(p => p.PaymentTransactions)
                .HasForeignKey(d => d.ClassroomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PaymentTransactions_Classroom");

            entity.HasOne(d => d.Student).WithMany(p => p.PaymentTransactions)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PaymentTransactions_Student");

            entity.HasOne(d => d.ClassroomStudent).WithMany(p => p.PaymentTransactions)
                .HasForeignKey(d => new { d.ClassroomId, d.StudentId })
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PaymentTransactions_Membership");
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PK__Permissi__EFA6FB2F4EE15DE1");

            entity.HasIndex(e => e.Code, "UQ__Permissi__A25C5AA714A220CC").IsUnique();

            entity.Property(e => e.Code)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasMaxLength(255);
        });

        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.QuizId).HasName("PK__Quizzes__8B42AE8E25FF1D1E");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.DueAt).HasPrecision(0);
            entity.Property(e => e.GradingMethod)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("highest");
            entity.Property(e => e.MaxAttempts).HasDefaultValue(1);
            entity.Property(e => e.ShowAnswersAfter)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("after_due");
            entity.Property(e => e.ShuffleOptions).HasDefaultValue(true);
            entity.Property(e => e.ShuffleQuestions).HasDefaultValue(true);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.TotalPoints).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Quizzes)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Quizzes__Created__0E6E26BF");

            entity.HasOne(d => d.Lesson).WithMany(p => p.Quizzes)
                .HasForeignKey(d => d.LessonId)
                .HasConstraintName("FK__Quizzes__LessonI__0D7A0286");
        });

        modelBuilder.Entity<QuizAnswer>(entity =>
        {
            entity.HasKey(e => new { e.AttemptId, e.QuestionId, e.OptionId }).HasName("PK__QuizAnsw__A754A9BD930ED06B");

            entity.HasOne(d => d.Attempt).WithMany(p => p.QuizAnswers)
                .HasForeignKey(d => d.AttemptId)
                .HasConstraintName("FK__QuizAnswe__Attem__30C33EC3");

            entity.HasOne(d => d.Option).WithMany(p => p.QuizAnswers)
                .HasForeignKey(d => d.OptionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizAnswe__Optio__32AB8735");

            entity.HasOne(d => d.Question).WithMany(p => p.QuizAnswers)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizAnswe__Quest__31B762FC");
        });

        modelBuilder.Entity<QuizAttempt>(entity =>
        {
            entity.HasKey(e => e.AttemptId).HasName("PK__QuizAtte__891A68E641D63B82");

            entity.Property(e => e.GradedAt).HasPrecision(0);
            entity.Property(e => e.ScoreRaw).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ScoreScaled10).HasColumnType("decimal(4, 2)");
            entity.Property(e => e.StartedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("in_progress");
            entity.Property(e => e.SubmittedAt).HasPrecision(0);

            entity.HasOne(d => d.GradedByNavigation).WithMany(p => p.QuizAttemptGradedByNavigations)
                .HasForeignKey(d => d.GradedBy)
                .HasConstraintName("FK__QuizAttem__Grade__2DE6D218");

            entity.HasOne(d => d.Quiz).WithMany(p => p.QuizAttempts)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizAttem__QuizI__2BFE89A6");

            entity.HasOne(d => d.Student).WithMany(p => p.QuizAttemptStudents)
                .HasForeignKey(d => d.StudentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizAttem__Stude__2CF2ADDF");
        });

        modelBuilder.Entity<QuizOption>(entity =>
        {
            entity.HasKey(e => e.OptionId).HasName("PK__QuizOpti__92C7A1FFBA2CC2A6");

            entity.HasOne(d => d.Question).WithMany(p => p.QuizOptions)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizOptio__Quest__2739D489");
        });

        modelBuilder.Entity<QuizOptionMedia>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__QuizOpti__3214EC0701C87726");

            entity.HasIndex(e => new { e.OptionId, e.MediaId }, "UQ_QOMed").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Media).WithMany(p => p.QuizOptionMedia)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizOptio__Media__5CA1C101");

            entity.HasOne(d => d.Option).WithMany(p => p.QuizOptionMedia)
                .HasForeignKey(d => d.OptionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizOptio__Optio__5BAD9CC8");
        });

        modelBuilder.Entity<QuizQuestion>(entity =>
        {
            entity.HasKey(e => e.QuestionId).HasName("PK__QuizQues__0DC06FACAA13545F");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Points)
                .HasDefaultValue(1.0m)
                .HasColumnType("decimal(10, 2)");
            entity.Property(e => e.QuestionType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("single_choice");

            entity.HasOne(d => d.Group).WithMany(p => p.QuizQuestions)
                .HasForeignKey(d => d.GroupId)
                .HasConstraintName("FK__QuizQuest__Group__22751F6C");

            entity.HasOne(d => d.Quiz).WithMany(p => p.QuizQuestions)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizQuest__QuizI__208CD6FA");

            entity.HasOne(d => d.Section).WithMany(p => p.QuizQuestions)
                .HasForeignKey(d => d.SectionId)
                .HasConstraintName("FK__QuizQuest__Secti__2180FB33");
        });

        modelBuilder.Entity<QuizQuestionGroup>(entity =>
        {
            entity.HasKey(e => e.GroupId).HasName("PK__QuizQues__149AF36A448D5990");

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.PointsPolicy)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("sum");
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.Quiz).WithMany(p => p.QuizQuestionGroups)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizQuest__QuizI__18EBB532");

            entity.HasOne(d => d.Section).WithMany(p => p.QuizQuestionGroups)
                .HasForeignKey(d => d.SectionId)
                .HasConstraintName("FK__QuizQuest__Secti__19DFD96B");
        });

        modelBuilder.Entity<QuizQuestionGroupMedia>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__QuizQues__3214EC07D36B5BBF");

            entity.HasIndex(e => new { e.GroupId, e.MediaId }, "UQ_QQGroupMed").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Group).WithMany(p => p.QuizQuestionGroupMedia)
                .HasForeignKey(d => d.GroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizQuest__Group__4E53A1AA");

            entity.HasOne(d => d.Media).WithMany(p => p.QuizQuestionGroupMedia)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizQuest__Media__4F47C5E3");
        });

        modelBuilder.Entity<QuizQuestionMedia>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__QuizQues__3214EC07C3DBB3BC");

            entity.HasIndex(e => new { e.QuestionId, e.MediaId }, "UQ_QQMed").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.Media).WithMany(p => p.QuizQuestionMedia)
                .HasForeignKey(d => d.MediaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizQuest__Media__55F4C372");

            entity.HasOne(d => d.Question).WithMany(p => p.QuizQuestionMedia)
                .HasForeignKey(d => d.QuestionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizQuest__Quest__55009F39");
        });

        modelBuilder.Entity<QuizSection>(entity =>
        {
            entity.HasKey(e => e.SectionId).HasName("PK__QuizSect__80EF087261420DB4");

            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.Quiz).WithMany(p => p.QuizSections)
                .HasForeignKey(d => d.QuizId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuizSecti__QuizI__123EB7A3");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.RefreshTokenId).HasName("PK__RefreshT__F5845E39090C8E8B");

            entity.HasIndex(e => e.ReplacedByHash, "IX_RefreshTokens_Replaced");

            entity.HasIndex(e => new { e.UserId, e.ExpiresAt }, "IX_RefreshTokens_User_Expires").IsDescending(false, true);

            entity.HasIndex(e => e.TokenHash, "UQ_RefreshTokens_TokenHash").IsUnique();

            entity.Property(e => e.ExpiresAt).HasPrecision(0);
            entity.Property(e => e.IssuedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ReplacedByHash)
                .HasMaxLength(64)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.RevokedAt).HasPrecision(0);
            entity.Property(e => e.TokenHash)
                .HasMaxLength(64)
                .IsUnicode(false)
                .IsFixedLength();

            entity.HasOne(d => d.User).WithMany(p => p.RefreshTokens)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RefreshTokens_User");
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId).HasName("PK__Reports__D5BD480541D5939C");

            entity.Property(e => e.Category)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.HandledAt).HasPrecision(0);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.Reason).HasMaxLength(500);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("pending");
            entity.Property(e => e.TargetType)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Handler).WithMany(p => p.ReportHandlers)
                .HasForeignKey(d => d.HandlerId)
                .HasConstraintName("FK__Reports__Handler__489AC854");

            entity.HasOne(d => d.Reporter).WithMany(p => p.ReportReporters)
                .HasForeignKey(d => d.ReporterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reports__Reporte__47A6A41B");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE1A2630700E");

            entity.HasIndex(e => e.Name, "UQ__Roles__737584F65F6C020F").IsUnique();

            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(50);

            entity.HasMany(d => d.Permissions).WithMany(p => p.Roles)
                .UsingEntity<Dictionary<string, object>>(
                    "RolePermission",
                    r => r.HasOne<Permission>().WithMany()
                        .HasForeignKey("PermissionId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__RolePermi__Permi__3E52440B"),
                    l => l.HasOne<Role>().WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__RolePermi__RoleI__3D5E1FD2"),
                    j =>
                    {
                        j.HasKey("RoleId", "PermissionId").HasName("PK__RolePerm__6400A1A8704E9C38");
                        j.ToTable("RolePermissions");
                    });
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C00F76279");

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534A41D6E5A").IsUnique();

            entity.Property(e => e.CreatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.FullName).HasMaxLength(150);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.PasswordHash).HasMaxLength(256);
            entity.Property(e => e.Phone)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.UpdatedAt)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())");

            entity.HasOne(d => d.AvatarMedia).WithMany(p => p.Users)
                .HasForeignKey(d => d.AvatarMediaId)
                .HasConstraintName("FK__Users__AvatarMed__4AB81AF0");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Users__RoleId__49C3F6B7");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
