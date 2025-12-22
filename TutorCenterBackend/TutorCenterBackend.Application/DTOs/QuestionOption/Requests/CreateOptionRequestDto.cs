namespace TutorCenterBackend.Application.DTOs.QuestionOption.Requests
{
    public class CreateOptionRequestDto : UpdateOptionRequestDto
    {
        public required int QuestionId { get; set; }
    }
}