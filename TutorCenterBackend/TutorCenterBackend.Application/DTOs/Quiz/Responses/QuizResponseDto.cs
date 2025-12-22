namespace TutorCenterBackend.Application.DTOs.Quiz.Responses
{
    public class QuizResponseDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        public int TimeLimitSec { get; set; }

        public int MaxAttempts { get; set; }

        public bool ShuffleQuestions { get; set; }

        public bool ShuffleOptions { get; set; }

        public string GradingMethod { get; set; } = null!;

        public int CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public DateTime? DeletedAt { get; set; }
    }
}