using TutorCenterBackend.Application.DTOs.Question.Responses;

namespace TutorCenterBackend.Application.DTOs.QuestionGroup.Responses
{
    public class QGroupDetailResponseDto
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public int? SectionId { get; set; }
        public string? Title { get; set; }
        public string? IntroText { get; set; }
        public int OrderIndex { get; set; }
        public bool ShuffleInside { get; set; }
        public List<QGroupMediaResponseDto> Media { get; set; } = new();
        public List<QuestionDetailResponseDto> Questions { get; set; } = new();
    }
}
