namespace TutorCenterBackend.Application.DTOs.AIDocument;

public class EditGeneratedQuestionRequestDto
{
    public int GeneratedQuestionId { get; set; }
    public string QuestionText { get; set; } = null!;
    public string? ExplanationText { get; set; }
    public string? Topic { get; set; }
    public List<EditGeneratedQuestionOptionDto> Options { get; set; } = new();
}

public class EditGeneratedQuestionOptionDto
{
    public int? OptionId { get; set; } // null nếu là option mới
    public string OptionText { get; set; } = null!;
    public bool IsCorrect { get; set; }
    public int Order { get; set; }
}
