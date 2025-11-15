namespace api_backend.DTOs.Request.Quizzes
{
    public class QuestionUpdateDto
    {
        public string? Content { get; set; }
        public string? Explanation { get; set; }
        public string? QuestionType { get; set; }
        public double? Points { get; set; }
        public int? OrderIndex { get; set; }
    }
}
