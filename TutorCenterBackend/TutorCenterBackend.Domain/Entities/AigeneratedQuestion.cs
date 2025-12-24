using System;

namespace TutorCenterBackend.Domain.Entities;

public partial class AigeneratedQuestion
{
    public int GeneratedQuestionId { get; set; }

    public int DocumentId { get; set; }

    public string QuestionText { get; set; } = null!;

    public string QuestionType { get; set; } = null!;

    public string? DifficultyLevel { get; set; }

    public string? ExplanationText { get; set; }

    public string? Topic { get; set; }

    public bool IsImported { get; set; } = false;

    public int? ImportedQuestionId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ImportedAt { get; set; }

    // Navigation properties
    public virtual Aidocument Document { get; set; } = null!;

    public virtual Question? ImportedQuestion { get; set; }

    public virtual ICollection<AigeneratedQuestionOption> AigeneratedQuestionOptions { get; set; } = new List<AigeneratedQuestionOption>();
}
