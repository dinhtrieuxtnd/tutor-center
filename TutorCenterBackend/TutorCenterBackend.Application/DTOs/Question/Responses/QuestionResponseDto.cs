namespace TutorCenterBackend.Application.DTOs.Question.Responses
{
    public class QuestionResponseDto
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public int? SectionId { get; set; }
        public int? GroupId { get; set; }
        public string Content { get; set; } = null!;
        public string? Explanation { get; set; }
        public string QuestionType { get; set; } = null!;
        public double Points { get; set; }
        public int OrderIndex { get; set; }
    }
}