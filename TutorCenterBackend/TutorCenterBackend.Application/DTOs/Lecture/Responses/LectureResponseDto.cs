namespace TutorCenterBackend.Application.DTOs.Lecture.Response
{
    public class LectureResponseDto
    {
        public int Id { get; set; }

        public int? ParentId { get; set; }

        public string Title { get; set; } = null!;

        public string? Content { get; set; }

        public int? MediaId { get; set; }

        public string? MediaUrl { get; set; }

        public DateTime UploadedAt { get; set; }

        public int UploadedBy { get; set; }

        public DateTime UpdatedAt { get; set; }

        public DateTime? DeletedAt { get; set; }
    }
}