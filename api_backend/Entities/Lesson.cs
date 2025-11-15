using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class Lesson
{
    public int LessonId { get; set; }

    public int ClassroomId { get; set; }

    public string LessonType { get; set; } = null!;

    public int? LectureId { get; set; }

    public int? ExerciseId { get; set; }

    public int? QuizId { get; set; }

    public DateTime? ExerciseDueAt { get; set; }

    public DateTime? QuizStartAt { get; set; }

    public DateTime? QuizEndAt { get; set; }

    public int OrderIndex { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual Classroom Classroom { get; set; } = null!;

    public virtual Exercise? Exercise { get; set; }

    public virtual ICollection<ExerciseSubmission> ExerciseSubmissions { get; set; } = new List<ExerciseSubmission>();

    public virtual Lecture? Lecture { get; set; }

    public virtual Quiz? Quiz { get; set; }

    public virtual ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
}
