using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class QuizOption
{
    public int QuestionOptionId { get; set; }

    public int QuestionId { get; set; }

    public string Content { get; set; } = null!;

    public bool IsCorrect { get; set; }

    public int OrderIndex { get; set; }

    public virtual QuizQuestion Question { get; set; } = null!;

    public virtual ICollection<QuizAnswer> QuizAnswers { get; set; } = new List<QuizAnswer>();

    public virtual ICollection<QuizOptionMedia> QuizOptionMedia { get; set; } = new List<QuizOptionMedia>();
}
