namespace api_backend.DTOs.Response
{
    public class StudentQuizScoreDto
    {
        public int StudentId { get; set; }
        public string StudentName { get; set; } = null!;
        public string StudentEmail { get; set; } = null!;
        public int? QuizAttemptId { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public decimal? ScoreRaw { get; set; }
        public decimal? ScoreScaled10 { get; set; }
        public string Status { get; set; } = null!;
    }
}
