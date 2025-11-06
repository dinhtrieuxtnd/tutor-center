using System;

namespace api_backend.DTOs.Request.Exercises
{
    public class ExerciseCreateDto
    {
        public int LessonId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int? AttachMediaId { get; set; }
        public DateTime? DueAt { get; set; }
    }
}
