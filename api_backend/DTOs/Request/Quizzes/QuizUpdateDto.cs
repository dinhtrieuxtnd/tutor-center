using System;

namespace api_backend.DTOs.Request.Quizzes
{
    public class QuizUpdateDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? TimeLimitSec { get; set; }
        public int? MaxAttempts { get; set; }
        public bool? ShuffleQuestions { get; set; }
        public bool? ShuffleOptions { get; set; }
        public string? GradingMethod { get; set; }
        public bool? ShowAnswers { get; set; }
    }
}
