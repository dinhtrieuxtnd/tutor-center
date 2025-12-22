namespace TutorCenterBackend.Application.DTOs.Lecture.Requests
{
    public class LectureRequestDto
    {
        public int? ParentId { get; set; }

        public required string Title { get; set; } = null!;

        public string? Content { get; set; }

        public int? MediaId { get; set; }
    }
}