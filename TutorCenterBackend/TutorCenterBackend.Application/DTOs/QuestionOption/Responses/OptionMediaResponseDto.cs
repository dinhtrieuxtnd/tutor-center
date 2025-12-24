namespace TutorCenterBackend.Application.DTOs.QuestionOption.Responses
{
    public class OptionMediaResponseDto
    {
        public int QuestionOptionMediaId { get; set; }
        public int OptionId { get; set; }
        public int MediaId { get; set; }
        public string? MediaUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
