namespace TutorCenterBackend.Application.DTOs.QuestionGroup.Responses
{
    public class QGroupMediaResponseDto
    {
        public int QuestionGroupMediaId { get; set; }
        public int GroupId { get; set; }
        public int MediaId { get; set; }
        public string? MediaUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
