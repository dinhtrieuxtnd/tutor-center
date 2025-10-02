using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class User
{
    public int UserId { get; set; }

    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public byte[] PasswordHash { get; set; } = null!;

    public string? Phone { get; set; }

    public int RoleId { get; set; }

    public int? AvatarMediaId { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<AIAgent> AIAgents { get; set; } = new List<AIAgent>();

    public virtual ICollection<AIConversation> AIConversations { get; set; } = new List<AIConversation>();

    public virtual ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();

    public virtual Medium? AvatarMedia { get; set; }

    public virtual ICollection<ClassroomChatMessage> ClassroomChatMessages { get; set; } = new List<ClassroomChatMessage>();

    public virtual ICollection<Classroom> ClassroomCreatedByNavigations { get; set; } = new List<Classroom>();

    public virtual ICollection<ClassroomStudent> ClassroomStudents { get; set; } = new List<ClassroomStudent>();

    public virtual ICollection<Classroom> ClassroomTeachers { get; set; } = new List<Classroom>();

    public virtual ICollection<ExerciseSubmission> ExerciseSubmissionGradedByNavigations { get; set; } = new List<ExerciseSubmission>();

    public virtual ICollection<ExerciseSubmission> ExerciseSubmissionStudents { get; set; } = new List<ExerciseSubmission>();

    public virtual ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();

    public virtual ICollection<JoinRequest> JoinRequestHandledByNavigations { get; set; } = new List<JoinRequest>();

    public virtual ICollection<JoinRequest> JoinRequestStudents { get; set; } = new List<JoinRequest>();

    public virtual ICollection<Material> Materials { get; set; } = new List<Material>();

    public virtual ICollection<Medium> Media { get; set; } = new List<Medium>();

    public virtual ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();

    public virtual ICollection<QuizAttempt> QuizAttemptGradedByNavigations { get; set; } = new List<QuizAttempt>();

    public virtual ICollection<QuizAttempt> QuizAttemptStudents { get; set; } = new List<QuizAttempt>();

    public virtual ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual ICollection<Report> ReportHandlers { get; set; } = new List<Report>();

    public virtual ICollection<Report> ReportReporters { get; set; } = new List<Report>();

    public virtual Role Role { get; set; } = null!;
}
