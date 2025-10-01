using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class Quiz
{
    public int QuizId { get; set; }

    public int? LessonId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int? TimeLimitSec { get; set; }

    public int MaxAttempts { get; set; }

    public bool ShuffleQuestions { get; set; }

    public bool ShuffleOptions { get; set; }

    public string GradingMethod { get; set; } = null!;

    public string ShowAnswersAfter { get; set; } = null!;

    public DateTime? DueAt { get; set; }

    public bool IsPublished { get; set; }

    public decimal TotalPoints { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User CreatedByNavigation { get; set; } = null!;

    public virtual Lesson? Lesson { get; set; }

    public virtual ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();

    public virtual ICollection<QuizQuestionGroup> QuizQuestionGroups { get; set; } = new List<QuizQuestionGroup>();

    public virtual ICollection<QuizQuestion> QuizQuestions { get; set; } = new List<QuizQuestion>();

    public virtual ICollection<QuizSection> QuizSections { get; set; } = new List<QuizSection>();
}
