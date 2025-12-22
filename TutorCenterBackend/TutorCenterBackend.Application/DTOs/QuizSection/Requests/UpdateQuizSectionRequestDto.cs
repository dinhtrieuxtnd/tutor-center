namespace TutorCenterBackend.Application.DTOs.QuizSection.Requests
{
    public class UpdateQuizSectionRequestDto
    {
        public required string Title { get; set; }

        public string? Description { get; set; }

        public int OrderIndex { get; set; } = 0;
    }
}