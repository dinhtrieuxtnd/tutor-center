namespace TutorCenterBackend.Application.DTOs.Question.Responses
{
    public class QuestionMediaResponseDto
    {
        public int QuestionMediaId { get; set; }
        public int QuestionId { get; set; }
        public int MediaId { get; set; }
        public string? MediaUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
