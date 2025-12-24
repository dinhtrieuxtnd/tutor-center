namespace TutorCenterBackend.Application.DTOs.QuestionOption.Responses
{
    public class OptionDetailResponseDto
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public string Content { get; set; } = null!;
        public bool IsCorrect { get; set; }
        public int OrderIndex { get; set; }
        public List<OptionMediaResponseDto> Media { get; set; } = new();
    }
}
