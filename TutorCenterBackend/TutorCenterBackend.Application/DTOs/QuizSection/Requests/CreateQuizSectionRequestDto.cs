namespace TutorCenterBackend.Application.DTOs.QuizSection.Requests
{
    public class CreateQuizSectionRequestDto : UpdateQuizSectionRequestDto
    {
        public required int QuizId { get; set; }
    }
}