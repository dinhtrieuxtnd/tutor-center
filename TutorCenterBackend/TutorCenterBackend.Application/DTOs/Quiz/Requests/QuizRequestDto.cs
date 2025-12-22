using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.Quiz.Requests
{
    public class QuizRequestDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required int TimeLimitSec { get; set; }
        public int MaxAttempts { get; set; } = 1;
        public bool ShuffleQuestions { get; set; } = true;
        public bool ShuffleOptions { get; set; } = true;
        public GradingMethodEnum GradingMethod { get; set; } = GradingMethodEnum.FIRST;
    }
}