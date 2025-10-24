namespace api_backend.DTOs.Request.Lessons
{
    public class LessonUpdateDto
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? LessonType { get; set; }
        public int? OrderIndex { get; set; }
        public bool? Publish { get; set; }
    }
}
