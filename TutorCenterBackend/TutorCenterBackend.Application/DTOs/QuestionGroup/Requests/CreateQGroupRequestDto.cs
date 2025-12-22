namespace TutorCenterBackend.Application.DTOs.QuestionGroup.Requests
{
    public class CreateQGroupRequestDto : UpdateQGroupRequestDto
    {
        public int QuizId { get; set; }
    }
}