namespace api_backend.DTOs.Response
{
    public class LessonDto
    {
        public int LessonId { get; set; }
        public int ClassroomId { get; set; }
        public string Title { get; set; } = null!;
        public string? Content { get; set; }
        public string LessonType { get; set; } = null!;
        public int OrderIndex { get; set; }
        public DateTime? PublishedAt { get; set; }
    }
}
