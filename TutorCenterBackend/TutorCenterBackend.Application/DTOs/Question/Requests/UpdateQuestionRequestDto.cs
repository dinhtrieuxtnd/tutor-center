using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.Question.Requests
{
    public class UpdateQuestionRequestDto
    {
        public int? SectionId { get; set; }
        public int? GroupId { get; set; }
        public required string Content { get; set; }
        public string? Explanation { get; set; }
        public QuestionTypeEnum QuestionType { get; set; }
        public double Points { get; set; } = 1.0;
        public int OrderIndex { get; set; }
    }
}