namespace TutorCenterBackend.Application.DTOs.QuizAnswer.Requests
{
    public class UpdateQuizAnswerRequestDto
    {
        public int AttemptId { get; set; }
        public int QuestionId { get; set; }
        public List<int> OptionIds { get; set; } = new();
    }
}
