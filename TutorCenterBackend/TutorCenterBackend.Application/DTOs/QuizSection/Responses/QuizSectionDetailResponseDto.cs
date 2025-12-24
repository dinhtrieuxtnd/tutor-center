using TutorCenterBackend.Application.DTOs.Question.Responses;
using TutorCenterBackend.Application.DTOs.QuestionGroup.Responses;

namespace TutorCenterBackend.Application.DTOs.QuizSection.Responses
{
    public class QuizSectionDetailResponseDto
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int OrderIndex { get; set; }
        public List<QGroupDetailResponseDto> Groups { get; set; } = new();
        public List<QuestionDetailResponseDto> Questions { get; set; } = new();
    }
}
