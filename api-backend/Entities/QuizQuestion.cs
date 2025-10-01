using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class QuizQuestion
{
    public int QuestionId { get; set; }

    public int QuizId { get; set; }

    public int? SectionId { get; set; }

    public int? GroupId { get; set; }

    public string Content { get; set; } = null!;

    public string? Explanation { get; set; }

    public string QuestionType { get; set; } = null!;

    public decimal Points { get; set; }

    public byte? Difficulty { get; set; }

    public int OrderIndex { get; set; }

    public bool IsActive { get; set; }

    public virtual QuizQuestionGroup? Group { get; set; }

    public virtual Quiz Quiz { get; set; } = null!;

    public virtual ICollection<QuizAnswer> QuizAnswers { get; set; } = new List<QuizAnswer>();

    public virtual ICollection<QuizOption> QuizOptions { get; set; } = new List<QuizOption>();

    public virtual ICollection<QuizQuestionMedia> QuizQuestionMedia { get; set; } = new List<QuizQuestionMedia>();

    public virtual QuizSection? Section { get; set; }
}
