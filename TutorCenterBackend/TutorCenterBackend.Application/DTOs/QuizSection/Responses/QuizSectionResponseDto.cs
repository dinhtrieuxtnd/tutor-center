namespace TutorCenterBackend.Application.DTOs.QuizSection.Responses
{
    public class QuizSectionResponseDto
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int OrderIndex { get; set; }
    }
}