namespace TutorCenterBackend.Application.DTOs.QuestionGroup.Responses
{
    public class QGroupResponseDto
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public int? SectionId { get; set; }
        public string? Title { get; set; }
        public string? IntroText { get; set; }
        public int OrderIndex { get; set; }
        public bool ShuffleInside { get; set; }
    }
}