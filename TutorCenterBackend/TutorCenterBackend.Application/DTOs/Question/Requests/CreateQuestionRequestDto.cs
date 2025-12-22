namespace TutorCenterBackend.Application.DTOs.Question.Requests
{
    public class CreateQuestionRequestDto : UpdateQuestionRequestDto
    {
        public required int QuizId { get; set; }
    }
}