using System;

namespace TutorCenterBackend.Domain.Entities;

public partial class AigenerationJob
{
    public int JobId { get; set; }

    public int DocumentId { get; set; }

    public int RequestedBy { get; set; }

    public string QuestionType { get; set; } = null!;

    public int QuestionCount { get; set; }

    public string? DifficultyLevel { get; set; }

    public string Language { get; set; } = "vi";

    public string JobStatus { get; set; } = "pending";

    public int GeneratedCount { get; set; } = 0;

    public string? ErrorMessage { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public virtual Aidocument Document { get; set; } = null!;

    public virtual User RequestedByUser { get; set; } = null!;
}
