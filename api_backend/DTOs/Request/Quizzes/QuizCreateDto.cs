using System;

namespace api_backend.DTOs.Request.Quizzes
{
    public class QuizCreateDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int TimeLimitSec { get; set; } = 3600;
        public int MaxAttempts { get; set; } = 1;
        public bool ShuffleQuestions { get; set; } = false;
        public bool ShuffleOptions { get; set; } = false;
        public string GradingMethod { get; set; } = "highest";
        public bool ShowAnswers { get; set; } = true;
    }
}
