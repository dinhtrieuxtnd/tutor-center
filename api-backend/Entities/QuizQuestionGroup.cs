using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class QuizQuestionGroup
{
    public int GroupId { get; set; }

    public int QuizId { get; set; }

    public int? SectionId { get; set; }

    public string? Title { get; set; }

    public string? IntroText { get; set; }

    public int OrderIndex { get; set; }

    public bool ShuffleInside { get; set; }

    public string PointsPolicy { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Quiz Quiz { get; set; } = null!;

    public virtual ICollection<QuizQuestionGroupMedia> QuizQuestionGroupMedia { get; set; } = new List<QuizQuestionGroupMedia>();

    public virtual ICollection<QuizQuestion> QuizQuestions { get; set; } = new List<QuizQuestion>();

    public virtual QuizSection? Section { get; set; }
}
