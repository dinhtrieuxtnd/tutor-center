namespace api_backend.DTOs.Request.Quizzes
{
    public class QuestionGroupUpdateDto
    {
        public string? Title { get; set; }
        public string? IntroText { get; set; }
        public int? OrderIndex { get; set; }
        public bool? ShuffleInside { get; set; }
    }
}
