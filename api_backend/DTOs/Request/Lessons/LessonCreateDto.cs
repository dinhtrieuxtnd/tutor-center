namespace api_backend.DTOs.Request.Lessons
{
    public class LessonCreateDto
    {
        public int ClassroomId { get; set; }
        public string Title { get; set; } = null!;
        public string? Content { get; set; }
        public string LessonType { get; set; } = "lesson"; // video, live, assignment...
        public int OrderIndex { get; set; } = 0;
        public bool Publish { get; set; } = false;
    }
}
