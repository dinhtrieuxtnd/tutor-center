namespace TutorCenterBackend.Application.DTOs.QuestionOption.Requests
{
    public class UpdateOptionRequestDto
    {
        public required string Content { get; set; }
        public required bool IsCorrect { get; set; }
        public int OrderIndex { get; set; } = 0;
    }
}