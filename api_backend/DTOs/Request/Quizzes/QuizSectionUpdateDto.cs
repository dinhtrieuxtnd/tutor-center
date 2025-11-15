namespace api_backend.DTOs.Request.Quizzes
{
    public class QuizSectionUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? OrderIndex { get; set; }
    }
}
