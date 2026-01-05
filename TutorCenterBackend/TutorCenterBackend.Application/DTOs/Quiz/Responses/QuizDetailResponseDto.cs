using TutorCenterBackend.Application.DTOs.Question.Responses;
using TutorCenterBackend.Application.DTOs.QuestionGroup.Responses;
using TutorCenterBackend.Application.DTOs.QuizSection.Responses;
using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.Quiz.Responses
{
    public class QuizDetailResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int TimeLimitSec { get; set; }
        public int MaxAttempts { get; set; }
        public bool ShuffleQuestions { get; set; }
        public bool ShuffleOptions { get; set; }
        public GradingMethodEnum GradingMethod { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public List<QuizSectionDetailResponseDto> Sections { get; set; } = new();
        public List<QGroupDetailResponseDto> Groups { get; set; } = new();
        public List<QuestionDetailResponseDto> Questions { get; set; } = new();
    }
}
