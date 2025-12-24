namespace TutorCenterBackend.Application.DTOs.QuizAnswer.Requests
{
    public class CreateQuizAnswerRequestDto
    {
        public int AttemptId { get; set; }
        public int QuestionId { get; set; }
        public List<int> OptionIds { get; set; } = new();
    }
}
