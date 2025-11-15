namespace api_backend.DTOs.Response
{
    public class QuizAttemptDto
    {
        public int QuizAttemptId { get; set; }
        public int LessonId { get; set; }
        public int QuizId { get; set; }
        public int StudentId { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public string Status { get; set; } = null!;
        public decimal? ScoreRaw { get; set; }
        public decimal? ScoreScaled10 { get; set; }
    }
}
