namespace api_backend.DTOs.Request.Quizzes
{
    public class QuizSectionCreateDto
    {
        public int QuizId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int OrderIndex { get; set; }
    }
}
