namespace api_backend.DTOs.Response
{
    public class QuizAttemptDetailDto
    {
        public int QuizAttemptId { get; set; }
        public int LessonId { get; set; }
        public int QuizId { get; set; }
        public string QuizTitle { get; set; } = null!;
        public int StudentId { get; set; }
        public string StudentName { get; set; } = null!;
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public string Status { get; set; } = null!;
        public decimal? ScoreRaw { get; set; }
        public decimal? ScoreScaled10 { get; set; }
        public List<QuizAnswerDetailDto> Answers { get; set; } = new List<QuizAnswerDetailDto>();
    }

    public class QuizAnswerDetailDto
    {
        public int QuestionId { get; set; }
        public string QuestionContent { get; set; } = null!;
        public double QuestionPoints { get; set; }
        public int OptionId { get; set; }
        public string OptionContent { get; set; } = null!;
        public bool IsCorrect { get; set; }
    }
}
