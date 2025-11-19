namespace api_backend.DTOs.Request.Quizzes
{
    public class QuestionGroupCreateDto
    {
        public int? SectionId { get; set; }
        public string? Title { get; set; }
        public string? IntroText { get; set; }
        public int OrderIndex { get; set; }
        public bool ShuffleInside { get; set; } = false;
    }
}
