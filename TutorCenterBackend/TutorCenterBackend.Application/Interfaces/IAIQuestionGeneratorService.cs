namespace TutorCenterBackend.Application.Interfaces;

public interface IAIQuestionGeneratorService
{
    Task<List<GeneratedQuestionDto>> GenerateQuestionsAsync(
        string documentText,
        string questionType,
        int count,
        string? difficultyLevel,
        string language,
        CancellationToken ct = default);
}

public class GeneratedQuestionDto
{
    public string QuestionText { get; set; } = null!;
    public string QuestionType { get; set; } = null!;
    public string? DifficultyLevel { get; set; }
    public string? ExplanationText { get; set; }
    public string? Topic { get; set; }
    public List<GeneratedOptionDto> Options { get; set; } = new();
}

public class GeneratedOptionDto
{
    public string OptionText { get; set; } = null!;
    public bool IsCorrect { get; set; }
}
