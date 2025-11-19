namespace api_backend.DTOs.Request.Quizzes
{
    public class QuestionOptionCreateDto
    {
        public string Content { get; set; } = null!;
        public bool IsCorrect { get; set; } = false;
        public int OrderIndex { get; set; }
    }
}
