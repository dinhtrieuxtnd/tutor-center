namespace TutorCenterBackend.Application.DTOs.Lesson.Responses
{
    public class QuizBasicInfoResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int TimeLimitSec { get; set; }
        public int MaxAttempts { get; set; }
        public DateTime? QuizStartAt { get; set; }
        public DateTime? QuizEndAt { get; set; }
        public bool ShowQuizAnswers { get; set; }
        public bool ShowQuizScore { get; set; }
    }
}
