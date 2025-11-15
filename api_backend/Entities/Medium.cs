using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class Medium
{
    public int MediaId { get; set; }

    public string Disk { get; set; } = null!;

    public string? Bucket { get; set; }

    public string ObjectKey { get; set; } = null!;

    public string? MimeType { get; set; }

    public long? SizeBytes { get; set; }

    public string Visibility { get; set; } = null!;

    public int? UploadedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual ICollection<AIMessageMedia> AIMessageMedia { get; set; } = new List<AIMessageMedia>();

    public virtual ICollection<ClassroomChatMessageMedia> ClassroomChatMessageMedia { get; set; } = new List<ClassroomChatMessageMedia>();

    public virtual ICollection<Classroom> Classrooms { get; set; } = new List<Classroom>();

    public virtual ICollection<ExerciseSubmission> ExerciseSubmissions { get; set; } = new List<ExerciseSubmission>();

    public virtual ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();

    public virtual ICollection<Lecture> Lectures { get; set; } = new List<Lecture>();

    public virtual ICollection<QuizOptionMedia> QuizOptionMedia { get; set; } = new List<QuizOptionMedia>();

    public virtual ICollection<QuizQuestionGroupMedia> QuizQuestionGroupMedia { get; set; } = new List<QuizQuestionGroupMedia>();

    public virtual ICollection<QuizQuestionMedia> QuizQuestionMedia { get; set; } = new List<QuizQuestionMedia>();

    public virtual User? UploadedByNavigation { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
