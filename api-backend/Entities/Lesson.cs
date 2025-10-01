using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class Lesson
{
    public int LessonId { get; set; }

    public int ClassroomId { get; set; }

    public string Title { get; set; } = null!;

    public string? Content { get; set; }

    public string LessonType { get; set; } = null!;

    public int OrderIndex { get; set; }

    public DateTime? PublishedAt { get; set; }

    public virtual Classroom Classroom { get; set; } = null!;

    public virtual ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();

    public virtual ICollection<Material> Materials { get; set; } = new List<Material>();

    public virtual ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
}
