namespace api_backend.DTOs.Request.Quizzes
{
    public class QuestionOptionUpdateDto
    {
        public string? Content { get; set; }
        public bool? IsCorrect { get; set; }
        public int? OrderIndex { get; set; }
    }
}
