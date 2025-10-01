using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class Exercise
{
    public int ExerciseId { get; set; }

    public int? LessonId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int? AttachMediaId { get; set; }

    public DateTime? DueAt { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Medium? AttachMedia { get; set; }

    public virtual User CreatedByNavigation { get; set; } = null!;

    public virtual ICollection<ExerciseSubmission> ExerciseSubmissions { get; set; } = new List<ExerciseSubmission>();

    public virtual Lesson? Lesson { get; set; }
}
