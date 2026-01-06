namespace TutorCenterBackend.Application.DTOs.AIDocument;

public class GenerateQuestionsRequestDto
{
    public int DocumentId { get; set; }
    public string QuestionType { get; set; } = "single_choice"; // single_choice, multiple_choice
    public int QuestionCount { get; set; } = 10;
    public string? DifficultyLevel { get; set; } // Easy, Medium, Hard
    public string Language { get; set; } = "vi"; // vi, en
}
