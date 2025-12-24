using System;

namespace TutorCenterBackend.Domain.Entities;

public partial class AigeneratedQuestionOption
{
    public int OptionId { get; set; }

    public int GeneratedQuestionId { get; set; }

    public string OptionText { get; set; } = null!;

    public bool IsCorrect { get; set; } = false;

    public int Order { get; set; } = 0;

    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public virtual AigeneratedQuestion GeneratedQuestion { get; set; } = null!;
}
