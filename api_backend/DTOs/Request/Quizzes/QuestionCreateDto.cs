namespace api_backend.DTOs.Request.Quizzes
{
    public class QuestionCreateDto
    {
        public int QuizId { get; set; }
        public int? SectionId { get; set; }
        public int? GroupId { get; set; }
        public string Content { get; set; } = null!;
        public string? Explanation { get; set; }
        public string QuestionType { get; set; } = "single_choice";
        public double Points { get; set; } = 1.0;
        public int OrderIndex { get; set; }
    }
}
