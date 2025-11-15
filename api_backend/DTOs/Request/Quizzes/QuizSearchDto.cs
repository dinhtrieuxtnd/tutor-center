namespace api_backend.DTOs.Request.Quizzes
{
    public class QuizSearchDto
    {
        public string? SearchTerm { get; set; }
        public string? GradingMethod { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
