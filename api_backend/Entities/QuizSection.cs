using System;
using System.Collections.Generic;

namespace api_backend.Entities;

public partial class QuizSection
{
    public int SectionId { get; set; }

    public int QuizId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int OrderIndex { get; set; }

    public virtual Quiz Quiz { get; set; } = null!;

    public virtual ICollection<QuizQuestionGroup> QuizQuestionGroups { get; set; } = new List<QuizQuestionGroup>();

    public virtual ICollection<QuizQuestion> QuizQuestions { get; set; } = new List<QuizQuestion>();
}
