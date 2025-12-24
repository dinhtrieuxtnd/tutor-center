namespace TutorCenterBackend.Application.DTOs.AIDocument;

public class AIGeneratedQuestionResponseDto
{
    public int GeneratedQuestionId { get; set; }
    public int DocumentId { get; set; }
    public string QuestionText { get; set; } = null!;
    public string QuestionType { get; set; } = null!;
    public string? DifficultyLevel { get; set; }
    public string? ExplanationText { get; set; }
    public string? Topic { get; set; }
    public bool IsImported { get; set; }
    public int? ImportedQuestionId { get; set; }
    public List<AIGeneratedQuestionOptionDto> Options { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? ImportedAt { get; set; }
}

public class AIGeneratedQuestionOptionDto
{
    public int OptionId { get; set; }
    public string OptionText { get; set; } = null!;
    public bool IsCorrect { get; set; }
    public int Order { get; set; }
}
