namespace TutorCenterBackend.Application.DTOs.QuestionGroup.Requests
{
    public class UpdateQGroupRequestDto
    {
        public int? SectionId { get; set; }
        public required string Title { get; set; }
        public string? IntroText { get; set; }
        public int OrderIndex { get; set; } = 0;
        public bool ShuffleInside { get; set; } = true;
    }
}