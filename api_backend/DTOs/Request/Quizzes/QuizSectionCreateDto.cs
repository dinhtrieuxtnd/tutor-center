namespace api_backend.DTOs.Request.Quizzes
{
    public class QuizSectionCreateDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int OrderIndex { get; set; }
    }
}
