namespace TutorCenterBackend.Application.DTOs.AIDocument;

public class ImportQuestionsToQuizRequestDto
{
    public int QuizId { get; set; }
    public List<int> GeneratedQuestionIds { get; set; } = new();
}
